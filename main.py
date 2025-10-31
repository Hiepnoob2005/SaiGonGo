from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from io import BytesIO
from dotenv import load_dotenv
import os
import base64
from PIL import Image # ✅ Thêm thư viện PIL (Pillow)
from google import genai # ✅ Thêm thư viện Google GenAI
import requests

# --- Khai báo API key và Khởi tạo GenAI ---
load_dotenv()
# 🔑 Gemini API Key sẽ được đọc từ biến môi trường GEMINI_API_KEY (hoặc OPENAI_API_KEY nếu bạn đã đổi tên)
try:
    # Cố gắng sử dụng GEMINI_API_KEY nếu có
    if os.getenv("GEMINI_API_KEY"):
        genai.api_key = os.getenv("GEMINI_API_KEY")
        MODEL_NAME = 'gemini-2.5-flash'
    # Nếu không, sử dụng OPENAI_API_KEY hiện có (giả định bạn đã đổi nó thành Gemini Key)
    else:
        genai.api_key = os.getenv("OPENAI_API_KEY")
        MODEL_NAME = 'gemini-2.5-flash'
    
    # Khởi tạo client Gemini
    client = genai.Client(api_key=genai.api_key)
except Exception as e:
    print(f"Lỗi khởi tạo Gemini Client: {e}")
    client = None
    

# --- KHÔNG THAY ĐỔI CÁC PHẦN KHÁC (app, CORS, Bcrypt, USER_FILE...) ---
app = Flask(__name__)
CORS(app) # Kích hoạt CORS
bcrypt = Bcrypt(app) # Kích hoạt Bcrypt
USER_FILE = "user_accounts.txt"
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

STATIC_START_LAT = 10.779544121871611
STATIC_START_LON = 106.69216069325068

DINH_DOC_LAP_LAT = 10.778217
DINH_DOC_LAP_LON = 106.696470

# ... (Phần trên của file main.py giữ nguyên) ...
USE_STATIC_START_LOCATION = True

def get_vietnamese_instruction(maneuver_type, street_name):
    """Dịch mã thao tác rẽ của OSRM sang tiếng Việt."""
    vn_type = {
        "depart": "Bắt đầu đi theo",
        "turn": "Rẽ",
        "new name": "Tiếp tục đi thẳng (đổi tên đường)",
        "continue": "Tiếp tục đi thẳng",
        "merge": "Nhập vào đường",
        "fork": "Rẽ nhánh",
        "end": "Đã đến nơi (Kết thúc lộ trình)"
    }.get(maneuver_type, "Tiếp tục đi thẳng")

    if street_name:
        if vn_type == "Rẽ":
             return f"{vn_type} vào đường {street_name}"
        return f"{vn_type} đường {street_name}"
    
    # Nếu không có tên đường, chỉ trả về thao tác
    return vn_type

@app.route("/get-dynamic-directions", methods=["POST"])
def get_dynamic_directions():
    """
    Lấy tọa độ, gọi OSRM để lấy lộ trình đi bộ, và dùng Python để dịch sang văn bản rõ ràng.
    """
    try:
        data = request.get_json()
        current_lat = data.get("current_lat")
        current_lon = data.get("current_lon")
        
        # LOGIC BẬT/TẮT ĐỊNH VỊ
        if USE_STATIC_START_LOCATION:
            start_lat = STATIC_START_LAT
            start_lon = STATIC_START_LON
            start_info = "Bảo tàng Chiến tích Chiến tranh (Vị trí tĩnh)"
        # ... (logic dynamic location giữ nguyên) ...
        else:
            if not current_lat or not current_lon:
                return jsonify({"route_text": "❌ Không nhận được tọa độ GPS từ thiết bị."}), 400
            start_lat = current_lat
            start_lon = current_lon
            start_info = f"Vị trí hiện tại ({start_lat:.4f},{current_lon:.4f})"
        
        start_coord = f"{start_lon},{start_lat}"
        end_coord = f"{DINH_DOC_LAP_LON},{DINH_DOC_LAP_LAT}"
        
        # 1. GỌI OSRM ĐỂ LẤY LỘ TRÌNH THÔ
        OSRM_URL = f"http://router.project-osrm.org/route/v1/foot/{start_coord};{end_coord}?overview=false&steps=true&alternatives=false"
        
        response = requests.get(OSRM_URL)
        response.raise_for_status()
        osrm_data = response.json()
        
        if osrm_data.get('code') != 'Ok' or not osrm_data.get('routes'):
            return jsonify({
                "route_text": f"❌ Lỗi định tuyến OSRM: Không thể tìm đường đi từ {start_info}. Mã lỗi: {osrm_data.get('code')}",
                "distance": "N/A"
            }), 500
        
        route_info = osrm_data['routes'][0]
        steps = route_info['legs'][0]['steps']
        total_distance_m = route_info['distance']
        total_distance_km = f"{total_distance_m / 1000:.2f} km"
        
        # 2. XỬ LÝ VÀ DỊCH DỮ LIỆU THÔ BẰNG PYTHON (LOẠI BỎ GEMINI)
        route_instructions = []
        for i, step in enumerate(steps):
            maneuver = step.get('maneuver', {})
            maneuver_type = maneuver.get('type')
            
            # Lấy tên đường (name) và hướng rẽ (modifier)
            street_name = step.get('name', '')
            
            # Dịch mã thao tác rẽ sang tiếng Việt
            vn_instruction = get_vietnamese_instruction(maneuver_type, street_name)
            
            distance = int(step.get('distance', 0))
            
            # Định dạng bước chỉ dẫn
            if maneuver_type == 'arrive': # Đã đến nơi
                instruction_line = f"✅ Bước {i + 1}: {vn_instruction} {street_name}."
            else:
                 instruction_line = f"Bước {i + 1}: {vn_instruction}, đi tiếp {distance} mét."

            route_instructions.append(instruction_line)
        
        route_data_string = "\n".join(route_instructions)

        # 3. Định dạng kết quả cuối cùng
        final_output = (
            f"Chào bạn!\n"
            f"Lộ trình đi bộ từ {start_info} đến Dinh Độc Lập ({total_distance_km}):\n"
            f"Tổng quãng đường: {total_distance_km}\n"
            f"\n--- CHỈ DẪN CHI TIẾT ---\n"
            f"{route_data_string}\n"
            f"--- KẾT THÚC LỘ TRÌNH ---"
        )
        
        return jsonify({
            "route_text": final_output,
            "distance": total_distance_km,
            "success": True,
            "map_url": f"https://www.google.com/maps/dir/{start_lat},{start_lon}/{DINH_DOC_LAP_LAT},{DINH_DOC_LAP_LON}"
        }), 200

    except Exception as e:
        print(f"Lỗi xử lý Định tuyến Python: {e}")
        return jsonify({"route_text": f"❌ Lỗi server khi tạo lộ trình: {str(e)}"}), 500

# --- API Routes (Chỉ hiển thị hàm thay thế) ---

# ... (Giữ nguyên hàm register_secure) ...
# ... (Giữ nguyên hàm login_secure) ...
# ... (Giữ nguyên hàm login) ...

# --- Route xác thực hình ảnh bằng GEMINI Vision (ĐÃ THAY THẾ) ---

@app.route("/verify-image", methods=["POST"])
def verify_image():
    """
    Xác thực ảnh người chơi chụp với địa điểm yêu cầu bằng Google Gemini Pro Vision.
    """
    if not client:
        return jsonify({"message": "❌ Lỗi: Gemini Client chưa được khởi tạo. Vui lòng kiểm tra API Key."}), 500

    try:
        # Lấy file ảnh và tên địa điểm
        if 'image' not in request.files or 'location' not in request.form:
            return jsonify({"message": "Thiếu dữ liệu hình ảnh hoặc tên địa điểm"}), 400

        file = request.files["image"]
        location_name = request.form["location"]
        
        # 1. Đọc file ảnh dưới dạng Bytes
        image_bytes = file.read()
        
        # 2. Chuyển đổi Bytes thành đối tượng PIL Image (bắt buộc cho GenAI)
        img = Image.open(BytesIO(image_bytes))

        # 3. Định nghĩa prompt và hình ảnh để gửi lên Gemini
        prompt = (
            f"Bạn là trợ lý giúp xác định chính xác địa điểm trong ảnh. "
            f"Hãy so sánh hình ảnh này với địa điểm '{location_name}'."
            f"Trả lời ngắn gọn **CHỈ** bằng 1 trong 2 cụm từ sau: 'Đúng địa điểm' hoặc 'Không đúng địa điểm'."
        )
        
        # 🧠 Gọi Google GenAI (Sử dụng model vision đa năng)
        response = client.models.generate_content(
            model='gemini-2.5-flash', # Model vision/text hiệu quả và nhanh chóng
            contents=[img, prompt],
        )

        # ✅ Lấy nội dung phản hồi
        result = response.text.strip()
        
        # (Tùy chọn) In kết quả ra console để debug
        print(f"🤖 Kết quả Gemini: {result}")
        
        return jsonify({"message": f"🤖 Kết quả AI: {result}"}), 200

    except Exception as e:
        print(f"Lỗi Gemini Vision: {e}")
        return jsonify({"message": f"❌ Lỗi xử lý GenAI: {str(e)}"}), 500


# --- File Serving (Phần phục vụ frontend, KHÔNG THAY ĐỔI) ---

@app.route("/")
def serve_index():
    """Phục vụ file index.html"""
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    """Phục vụ các file tĩnh (CSS, JS, images, và các file HTML khác)"""
    return send_from_directory(BASE_DIR, filename)

# --- Chạy máy chủ ---
if __name__ == '__main__':
    # Đảm bảo file user tồn tại với tiêu đề
    if not os.path.exists(USER_FILE):
        with open(USER_FILE, "w", encoding="utf-8") as f:
            f.write("username;email;password\n") # Thêm dòng tiêu đề

    app.run(port=5000, debug=True)
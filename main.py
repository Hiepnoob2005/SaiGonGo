from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from io import BytesIO
from dotenv import load_dotenv
import os
import base64
from PIL import Image 
from google import genai 
import requests

# --- Khai báo API key và Khởi tạo GenAI ---
load_dotenv()
try:
    if os.getenv("GEMINI_API_KEY"):
        genai.api_key = os.getenv("GEMINI_API_KEY")
        MODEL_NAME = 'gemini-2.5-flash'
    else:
        genai.api_key = os.getenv("OPENAI_API_KEY")
        MODEL_NAME = 'gemini-2.5-flash'
    
    client = genai.Client(api_key=genai.api_key)
except Exception as e:
    print(f"Lỗi khởi tạo Gemini Client: {e}")
    client = None

# --- KHÔNG THAY ĐỔI CÁC PHẦN KHÁC ---
app = Flask(__name__)
CORS(app) 
bcrypt = Bcrypt(app) 
USER_FILE = "user_accounts.txt"
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# ----------------------------------------------
# --- CẤU HÌNH VỊ TRÍ VÀ HÀM DỊCH OSRM ---
# ----------------------------------------------

# Tọa độ cố định (Dùng cho chế độ thử nghiệm)
STATIC_START_LAT = 10.7797839 # Bảo tàng
STATIC_START_LON = 106.6893418 # Bảo tàng
DINH_DOC_LAP_LAT = 10.779038 # Dinh Độc Lập
DINH_DOC_LAP_LON = 106.696111 # Dinh Độc Lập

# Chuyển thành True để luôn coi Bảo tàng là điểm bắt đầu (cho mục đích thử nghiệm)
USE_STATIC_START_LOCATION = True 

def get_vietnamese_instruction(maneuver_type, street_name):
    """Dịch mã thao tác rẽ của OSRM sang tiếng Việt."""
    
    # Bổ sung các loại thao tác OSRM thường gặp và cách dịch rõ ràng
    vn_type = {
        "depart": "Bắt đầu đi theo",
        "turn": "Rẽ", # Sẽ được bổ sung hướng (trái/phải)
        "new name": "Tiếp tục đi thẳng (đổi tên đường)",
        "continue": "Tiếp tục đi thẳng",
        "merge": "Nhập vào đường",
        "fork": "Chọn nhánh",
        "roundabout": "Vào vòng xuyến",
        "end": "Tới nơi",
        "uturn": "Quay đầu",
        "ramp": "Đi lên/xuống dốc",
        "rotary": "Vào bùng binh",
    }.get(maneuver_type, "Tiếp tục đi thẳng")

    if street_name:
        return f"{vn_type} {street_name}"
    
    return vn_type

def get_direction_modifier(modifier):
    """Dịch mã hướng rẽ sang tiếng Việt."""
    vn_modifier = {
        "left": "trái",
        "right": "phải",
        "sharp left": "gắt bên trái",
        "sharp right": "gắt bên phải",
        "slight left": "hơi chếch trái",
        "slight right": "hơi chếch phải",
        "uturn": "quay đầu",
    }.get(modifier, "")
    return vn_modifier

# ----------------------------------------------
# --- CÁC API CŨ (Giữ nguyên) ---
# ----------------------------------------------

# ... (Giữ nguyên các hàm register_secure, login_secure, login) ...

# ----------------------------------------------
# --- API MỚI: XỬ LÝ ĐỊNH TUYẾN CHÍNH XÁC BẰNG PYTHON ---
# ----------------------------------------------

@app.route("/get-dynamic-directions", methods=["POST"])
def get_dynamic_directions():
    """
    Lấy tọa độ, gọi OSRM để lấy lộ trình đi bộ, và dùng Python để dịch sang văn bản rõ ràng.
    """
    try:
        data = request.get_json()
        current_lat = data.get("current_lat")
        current_lon = data.get("current_lon")
        
        # <<< LOGIC BẬT/TẮT ĐỊNH VỊ VÀ SỬA LỖI >>>
        if USE_STATIC_START_LOCATION:
            start_lat = STATIC_START_LAT
            start_lon = STATIC_START_LON
            start_info = "Bảo tàng Chiến tích Chiến tranh (Vị trí tĩnh)"
        else:
            # Sửa lỗi: Nếu không dùng STATIC, phải dùng tọa độ động từ client
            if not current_lat or not current_lon:
                return jsonify({"route_text": "❌ Không nhận được tọa độ GPS từ thiết bị (Chế độ động).", "distance": "N/A"}), 400
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
        
        # 2. XỬ LÝ VÀ DỊCH DỮ LIỆU THÔ BẰNG PYTHON (Đảm bảo độ chính xác)
        route_instructions = []
        for i, step in enumerate(steps):
            maneuver = step.get('maneuver', {})
            maneuver_type = maneuver.get('type')
            modifier = maneuver.get('modifier')
            distance = int(step.get('distance', 0))
            street_name = step.get('name', 'đường không tên') # Đảm bảo luôn có tên đường

            # Dịch mã thao tác rẽ cơ bản
            base_instruction = get_vietnamese_instruction(maneuver_type, street_name)
            
            # Xử lý các thao tác rẽ chi tiết (turn)
            if maneuver_type == 'turn' and modifier:
                direction = get_direction_modifier(modifier)
                # Ghép: Rẽ [hướng] vào [tên đường]
                instruction_line = f"Rẽ {direction} vào đường {street_name}"
            elif maneuver_type == 'depart' or maneuver_type == 'continue':
                 instruction_line = f"{base_instruction}"
            else:
                 instruction_line = base_instruction

            # Định dạng bước chỉ dẫn cuối cùng
            if maneuver_type == 'arrive': # Đã đến nơi
                route_instructions.append(f"✅ Bước {i + 1}: {base_instruction}.")
            elif distance > 0:
                # Định dạng: [Hành động], đi tiếp [Khoảng cách] mét.
                route_instructions.append(f"Bước {i + 1}: {instruction_line}, đi tiếp {distance} mét.")
            else:
                 # Các bước rẽ nhỏ không có khoảng cách
                 route_instructions.append(f"Bước {i + 1}: {instruction_line}.")


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

# ----------------------------------------------
# --- API XÁC THỰC HÌNH ẢNH (Giữ nguyên) ---
# ----------------------------------------------
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
        # 1. Đọc file ảnh dưới dạng Bytes
        file = request.files["image"]
        location_name = request.form["location"]

        image_bytes = file.read()
        
        img = Image.open(BytesIO(image_bytes))

        # 3. Định nghĩa prompt và hình ảnh để gửi lên Gemini
        prompt = (
            f"Bạn là trợ lý giúp xác định chính xác địa điểm trong ảnh. "
            f"Hãy so sánh hình ảnh này với địa điểm '{location_name}'."
            f"Trả lời ngắn gọn **CHỈ** bằng 1 trong 2 cụm từ sau: 'Đúng địa điểm' hoặc 'Không đúng địa điểm'."
        )
        
        # 🧠 Gọi Google GenAI (Sử dụng model vision đa năng)
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=[img, prompt],
        )
        # ✅ Lấy nội dung phản hồi
        result = response.text.strip()
        
        print(f"🤖 Kết quả Gemini: {result}")
        return jsonify({"message": f"🤖 Kết quả AI: {result}"}), 200

    except Exception as e:
        print(f"Lỗi Gemini Vision: {e}")
        return jsonify({"message": f"❌ Lỗi xử lý GenAI: {str(e)}"}), 500

# ----------------------------------------------
# --- API ĐĂNG KÝ/ĐĂNG NHẬP VÀ FILE SERVING (Giữ nguyên) ---
# ----------------------------------------------
# ... (Giữ nguyên các hàm register_secure, login_secure, login) ...
# ... (Giữ nguyên các hàm serve_index, serve_static) ...

# ----------------------------------------------
# --- FILE SERVING (Phần phục vụ frontend) ---
# ----------------------------------------------

@app.route("/")
def serve_index():
    """Phục vụ file index.html"""
    # Đảm bảo file index.html nằm ngang hàng với main.py
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    """Phục vụ các file tĩnh (CSS, JS, images, và các file HTML khác)"""
    # Route này sẽ bắt các request tới /login.html, /assets/css/style.css, ...
    return send_from_directory(BASE_DIR, filename)

# --- Chạy máy chủ ---
if __name__ == '__main__':
    if not os.path.exists(USER_FILE):
        with open(USER_FILE, "w", encoding="utf-8") as f:
            f.write("username;email;password\n") 
    app.run(port=5000, debug=True)
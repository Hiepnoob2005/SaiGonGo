# ----------------------------------------------------
# --- I. IMPORTS VÀ KHỞI TẠO CƠ BẢN ---
# ----------------------------------------------------
from flask import Flask, request, jsonify, send_from_directory, redirect, url_for, render_template
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from flask_mail import Mail, Message
from io import BytesIO
from dotenv import load_dotenv
from PIL import Image 
import requests
# Đã sửa lỗi: Dùng import mới nhất và chính xác cho Gemini
from google import genai 

import random
import string
import json
import os
import time
import threading
import base64 # Giữ lại nếu cần cho xử lý ảnh

# --- Khai báo API key và Khởi tạo GenAI ---
load_dotenv()
api_key_value = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")

if not api_key_value:
    print("FATAL ERROR: KHÔNG TÌM THẤY API KEY TRONG MÔI TRƯỜNG! Tính năng AI sẽ không hoạt động.")
    client = None
else:
    try:
        genai.api_key = api_key_value
        client = genai.Client(api_key=api_key_value)
        MODEL_NAME = 'gemini-2.5-flash'
        print("✅ Khởi tạo Gemini Client thành công.")
    except Exception as e:
        print(f"❌ Lỗi khởi tạo Gemini Client: {e}")
        client = None

# --- KHỞI TẠO FLASK & CẤU HÌNH ---
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'mot-chuoi-bi-mat-mac-dinh-khong-an-toan')
CORS(app, supports_credentials=True) 

bcrypt = Bcrypt(app) 
USER_FILE = "user_accounts.txt"
OTP_FILE = "otp_temp.json"
OTP_EXPIRATION_SECONDS = 600
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# --- CẤU HÌNH FLASK-MAIL (OTP) ---
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail = Mail(app)

# --- CẤU HÌNH FLASK-LOGIN ---
login_manager = LoginManager()
login_manager.init_app(app)

# ----------------------------------------------------
# --- II. USER CLASS VÀ HÀM QUẢN LÝ NGƯỜI DÙNG ---
# ----------------------------------------------------

class User(UserMixin):
    def __init__(self, id, username, email, password_hash):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash

    # 1. Hàm tìm kiếm người dùng theo ID (username)
    @staticmethod
    def get_by_id(user_id):
        try:
            with open(USER_FILE, "r", encoding="utf-8") as f:
                for line in f.readlines()[1:]:
                    parts = line.strip().split(';')
                    # User ID (parts[0]) chính là username
                    if len(parts) == 3 and parts[0] == user_id: 
                        return User(parts[0], parts[0], parts[1], parts[2])
        except FileNotFoundError:
            return None
        return None

    # 2. HÀM SỬA LỖI: get_by_username
    @staticmethod
    def get_by_username(username):
        """Tìm kiếm người dùng bằng Username (mà cũng là ID)."""
        # Tránh lỗi Attribute, gọi thẳng get_by_id
        return User.get_by_id(username)

    # 3. Hàm tìm kiếm người dùng theo Email
    @staticmethod
    def get_by_email(email):
        try:
            with open(USER_FILE, "r", encoding="utf-8") as f:
                for line in f.readlines()[1:]:
                    parts = line.strip().split(';')
                    if len(parts) == 3 and parts[1].lower() == email.lower():
                        return User(parts[0], parts[0], parts[1], parts[2])
        except FileNotFoundError:
            return None
        return None
    
    # 4. Hàm cập nhật mật khẩu (Giữ nguyên logic cũ)
    @staticmethod
    def update_password(email, new_hashed_password):
        lines = []
        updated = False
        try:
            with open(USER_FILE, "r", encoding="utf-8") as f:
                lines = f.readlines()
            
            with open(USER_FILE, "w", encoding="utf-8") as f:
                f.write(lines[0])
                for line in lines[1:]:
                    parts = line.strip().split(';')
                    if len(parts) == 3 and parts[1].lower() == email.lower():
                        f.write(f"{parts[0]};{parts[1]};{new_hashed_password}\n")
                        updated = True
                    else:
                        f.write(line)
            return updated
        except Exception as e:
            print(f"Lỗi khi cập nhật file user: {e}")
            with open(USER_FILE, "w", encoding="utf-8") as f:
                f.writelines(lines)
            return False

@login_manager.user_loader
def load_user(user_id):
    return User.get_by_id(user_id)

# ----------------------------------------------------
# --- III. API QUẢN LÝ TÀI KHOẢN (Auth/OTP) ---
# ----------------------------------------------------

# Hàm hỗ trợ gửi Email
def send_email_in_thread(app_context, msg):
    with app_context:
        try:
            mail.send(msg)
            print("Email OTP đã gửi!")
        except Exception as e:
            print(f"Lỗi gửi mail: {e}")

@app.route("/api/register", methods=["POST"])
def register_secure():
    """API Đăng ký tài khoản"""
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    if not username or not email or not password:
        return jsonify({"message": "Vui lòng nhập đầy đủ thông tin!"}), 400
    
    if User.get_by_username(username) or User.get_by_email(email):
        return jsonify({"message": "Tên đăng nhập hoặc Email đã tồn tại!"}), 400
    
    # Mã hóa mật khẩu
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    
    try:
        with open(USER_FILE, "a", encoding="utf-8") as f:
            f.write(f"{username};{email};{hashed_password}\n")
        return jsonify({"message": "Tạo tài khoản thành công!"}), 201
    except Exception as e:
        return jsonify({"message": f"Lỗi khi lưu tài khoản: {e}"}), 500

@app.route("/api/login", methods=["POST"])
def login_secure():
    """API Đăng nhập"""
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"message": "Vui lòng nhập tài khoản và mật khẩu"}), 400
        
    user = User.get_by_username(username)
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user, remember=True) 
        return jsonify({"message": "Đăng nhập thành công!", "username": user.username}), 200
        
    return jsonify({"message": "Tên đăng nhập hoặc mật khẩu không đúng"}), 401

@app.route("/api/logout", methods=["POST"])
# @login_required # Đã xóa tạm thời để front-end dễ xử lý hơn
def logout():
    """API Đăng xuất"""
    logout_user()
    return jsonify({"message": "Đăng xuất thành công!"}), 200

@app.route("/api/status")
def get_status():
    """API Kiểm tra trạng thái đăng nhập"""
    if current_user.is_authenticated:
        return jsonify({"logged_in": True, "username": current_user.username})
    else:
        return jsonify({"logged_in": False})

@app.route("/api/request-otp", methods=["POST"])
def request_otp():
    """API Yêu cầu mã OTP (Quên mật khẩu)"""
    data = request.get_json()
    email = data.get("email")
    if not email: return jsonify({"message": "Vui lòng nhập email."}), 400
    user = User.get_by_email(email)
    
    # Trả về thông báo chung để tránh lộ email tồn tại
    if not user: return jsonify({"message": "Nếu email tồn tại, OTP sẽ được gửi."}), 200 
    
    otp = ''.join(random.choices(string.digits, k=6))
    expires = int(time.time()) + OTP_EXPIRATION_SECONDS
    otp_data = {}
    try:
        if os.path.exists(OTP_FILE):
            with open(OTP_FILE, "r") as f: otp_data = json.load(f)
    except Exception as e: print(f"Không thể đọc {OTP_FILE}: {e}")
        
    otp_data[email] = {"otp": otp, "expires": expires}
    
    try:
        with open(OTP_FILE, "w") as f: json.dump(otp_data, f)
    except Exception as e: return jsonify({"message": f"Lỗi server khi lưu OTP: {e}"}), 500
    
    # Gửi email trong luồng riêng để không chặn server
    msg = Message("Mã OTP Reset Mật Khẩu SaiGonGo", recipients=[email])
    msg.body = f"Mã OTP của bạn là: {otp}\n\nMã này sẽ hết hạn sau {OTP_EXPIRATION_SECONDS // 60} phút."
    threading.Thread(target=send_email_in_thread, args=(app.app_context(), msg)).start()
    
    return jsonify({"message": "OTP đã được gửi đến email của bạn."}), 200

@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    """API Thay đổi mật khẩu bằng OTP"""
    data = request.get_json()
    email = data.get("email")
    otp_code = data.get("otp")
    new_password = data.get("new_password")
    
    if not email or not otp_code or not new_password:
        return jsonify({"message": "Vui lòng nhập đầy đủ thông tin."}), 400
        
    otp_data = {}
    try:
        with open(OTP_FILE, "r") as f: otp_data = json.load(f)
    except Exception as e: return jsonify({"message": "Lỗi server khi đọc OTP."}), 500
        
    if email not in otp_data: return jsonify({"message": "Chưa yêu cầu OTP cho email này."}), 400
    
    stored_otp = otp_data[email]
    
    if stored_otp["otp"] != otp_code: return jsonify({"message": "Mã OTP không chính xác."}), 400
    if int(time.time()) > stored_otp["expires"]: return jsonify({"message": "Mã OTP đã hết hạn."}), 400
    
    hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")
    
    if not User.update_password(email, hashed_password):
        return jsonify({"message": "Lỗi khi cập nhật mật khẩu."}), 500
        
    # Xóa OTP sau khi sử dụng thành công
    del otp_data[email]
    try:
        with open(OTP_FILE, "w") as f: json.dump(otp_data, f)
    except Exception as e: print(f"Lỗi khi xoá OTP đã dùng: {e}")
        
    return jsonify({"message": "Cập nhật mật khẩu thành công!"}), 200

# ----------------------------------------------------
# --- IV. API ĐỊNH TUYẾN (OSRM) VÀ XÁC THỰC AI (VISION) ---
# ----------------------------------------------------
# Các hàm OSRM và Gemini từ bước trước được giữ nguyên và tích hợp vào đây.

USE_STATIC_START_LOCATION = True 
STATIC_START_LAT = 10.7797839 
STATIC_START_LON = 106.6893418 
DINH_DOC_LAP_LAT = 10.779038 
DINH_DOC_LAP_LON = 106.696111 

# Hàm hỗ trợ dịch OSRM (Đã lược bớt để code gọn hơn)
def get_vietnamese_instruction(maneuver_type, street_name):
    vn_type = {
        "depart": "Bắt đầu đi theo",
        "turn": "Rẽ",
        "new name": "Tiếp tục đi thẳng (đổi tên đường)",
        "continue": "Tiếp tục đi thẳng",
        "merge": "Nhập vào đường",
        "fork": "Rẽ nhánh",
        "end": "Tới nơi",
    }.get(maneuver_type, "Tiếp tục đi thẳng")

    if street_name:
        return f"{vn_type} {street_name}"
    return vn_type

def get_direction_modifier(modifier):
    return {
        "left": "trái",
        "right": "phải",
        "sharp left": "gắt bên trái",
        "sharp right": "gắt bên phải",
        "slight left": "hơi chếch trái",
        "slight right": "hơi chếch phải",
        "uturn": "quay đầu",
    }.get(modifier, "")


@app.route("/get-dynamic-directions", methods=["POST"])
def get_dynamic_directions():
    if not client:
        return jsonify({"route_text": "❌ Lỗi: Gemini Client chưa được khởi tạo. Vui lòng kiểm tra API Key."}), 500
    try:
        data = request.get_json()
        current_lat = data.get("current_lat")
        current_lon = data.get("current_lon")
        
        # ... (Toàn bộ logic OSRM/Định tuyến của bạn ở đây) ...
        # Lấy tọa độ
        start_lat = STATIC_START_LAT if USE_STATIC_START_LOCATION else current_lat
        start_lon = STATIC_START_LON if USE_STATIC_START_LOCATION else current_lon
        
        start_coord = f"{start_lon},{start_lat}"
        end_coord = f"{DINH_DOC_LAP_LON},{DINH_DOC_LAP_LAT}"
        
        OSRM_URL = f"http://router.project-osrm.org/route/v1/foot/{start_coord};{end_coord}?overview=false&steps=true&alternatives=false"
        response = requests.get(OSRM_URL)
        response.raise_for_status()
        osrm_data = response.json()
        
        if osrm_data.get('code') != 'Ok' or not osrm_data.get('routes'):
            return jsonify({
                "route_text": f"❌ Lỗi định tuyến OSRM: Không thể tìm đường đi.",
                "distance": "N/A"
            }), 500
        
        # Xử lý kết quả OSRM
        route_info = osrm_data['routes'][0]
        steps = route_info['legs'][0]['steps']
        total_distance_m = route_info['distance']
        total_distance_km = f"{total_distance_m / 1000:.2f} km"
        
        route_instructions = []
        for i, step in enumerate(steps):
            maneuver = step.get('maneuver', {})
            maneuver_type = maneuver.get('type')
            modifier = maneuver.get('modifier')
            distance = int(step.get('distance', 0))
            street_name = step.get('name', 'đường không tên')

            base_instruction = get_vietnamese_instruction(maneuver_type, street_name)
            
            if maneuver_type == 'turn' and modifier:
                direction = get_direction_modifier(modifier)
                instruction_line = f"Rẽ {direction} vào đường {street_name}"
            elif maneuver_type == 'arrive': 
                instruction_line = f"✅ Tới đích: Dinh Độc Lập"
            elif distance > 0:
                instruction_line = f"{base_instruction}, đi tiếp {distance} mét."
            else:
                 instruction_line = base_instruction

            route_instructions.append(f"Bước {i + 1}: {instruction_line}")

        final_output = (
            f"Lộ trình đi bộ đến Dinh Độc Lập ({total_distance_km}):\n"
            f"Tổng quãng đường: {total_distance_km}\n"
            f"\n--- CHỈ DẪN CHI TIẾT ---\n"
            f"{' \n'.join(route_instructions)}"
        )
        
        return jsonify({
            "route_text": final_output,
            "distance": total_distance_km,
            "success": True,
        }), 200

    except Exception as e:
        print(f"Lỗi xử lý Định tuyến Python: {e}")
        return jsonify({"route_text": f"❌ Lỗi server khi tạo lộ trình: {str(e)}"}), 500


@app.route("/verify-image", methods=["POST"])
def verify_image():
    if not client:
        return jsonify({"message": "❌ Lỗi: Gemini Client chưa được khởi tạo."}), 500
    try:
        if 'image' not in request.files or 'location' not in request.form:
            return jsonify({"message": "Thiếu dữ liệu hình ảnh hoặc tên địa điểm"}), 400
        
        file = request.files["image"]
        location_name = request.form["location"]
        image_bytes = file.read()
        img = Image.open(BytesIO(image_bytes))

        prompt = (
            f"Bạn là trợ lý giúp xác định chính xác địa điểm trong ảnh. "
            f"Hãy so sánh hình ảnh này với địa điểm '{location_name}'."
            f"Trả lời ngắn gọn **CHỈ** bằng 1 trong 2 cụm từ sau: 'Đúng địa điểm' hoặc 'Không đúng địa điểm'."
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=[img, prompt],
        )
        result = response.text.strip()
        
        print(f"🤖 Kết quả Gemini: {result}")
        return jsonify({"message": f"🤖 Kết quả AI: {result}"}), 200

    except Exception as e:
        print(f"Lỗi Gemini Vision: {e}")
        return jsonify({"message": f"❌ Lỗi xử lý GenAI: {str(e)}"}), 500

# ----------------------------------------------
# --- V. FILE SERVING (Phục vụ Frontend) ---
# ----------------------------------------------

@app.route("/")
def serve_index():
    """Phục vụ file index.html"""
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/<path:filename>")
def serve_static(filename):
    """Phục vụ các file tĩnh và HTML khác"""
    return send_from_directory(BASE_DIR, filename)

# ----------------------------------------------
# --- VI. CHẠY MÁY CHỦ ---
# ----------------------------------------------
if __name__ == '__main__':
    # Tạo file USER_FILE nếu chưa tồn tại
    if not os.path.exists(USER_FILE):
        with open(USER_FILE, "w", encoding="utf-8") as f:
            f.write("username;email;password\n")
            
    # Tạo file OTP_FILE nếu chưa tồn tại
    if not os.path.exists(OTP_FILE):
        with open(OTP_FILE, "w", encoding="utf-8") as f:
            f.write("{}")
            
    app.run(port=5000, debug=True)
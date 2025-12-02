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
import math
from math import radians, sin, cos, sqrt, atan2
# 🗺️ Danh sách toạ độ các địa điểm trong................................................................................... hành trình
LOCATIONS = {
    "bao_tang_chien_tich": {
        "name": "Bảo tàng Chiến tích Chiến tranh",
        "lat": 10.779552675731349,
        "lon": 106.69221830657582
    },
    "dinh_doc_lap": {
        "name": "Dinh Độc Lập",
        "lat": 10.778226,
        "lon": 106.696445
    },
    "nha_tho_duc_ba": {
        "name": "Nhà thờ Đức Bà Sài Gòn",
        "lat": 10.779783,
        "lon": 106.699018
    },
    "buu_dien_thanh_pho": {
        "name": "Bưu điện Thành Phố",
        "lat": 10.779839286053278,
        "lon": 106.70002391994127
    },
    "ho_con_rua": {
        "name": "Hồ Con Rùa",
        "lat": 10.782615630794004,
        "lon": 106.69595372983176
    },
}

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

# --- CẤU HÌNH DATABASE GAME (Thêm mới) ---
DB_FILE = "database.txt"

# --- HÀM HỖ TRỢ XỬ LÝ DATABASE GAME ---
def load_db():
    if not os.path.exists(DB_FILE): return []
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except: return []

def save_db(data):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def sync_user_to_game_db(email, username):
    """Đảm bảo user luôn có trong database.txt để lưu điểm"""
    users = load_db()
    user_record = next((u for u in users if u['email'] == email), None)
    
    if not user_record:
        user_record = {
            "username": username,
            "email": email,
            "points": 0,
            "routes": {
                "route1": { "status": "locked", "reward_claimed": False }
            }
        }
        users.append(user_record)
        save_db(users)
    return user_record

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

# --- API GAME LOGIC (Thêm mới) ---

@app.route('/api/user', methods=['GET'])
def get_user_info_game():
    """API lấy thông tin User bao gồm cả Điểm và Status Lộ trình"""
    if not current_user.is_authenticated:
        return jsonify({"logged_in": False})
    
    # Đồng bộ user hiện tại vào database game nếu chưa có
    game_data = sync_user_to_game_db(current_user.email, current_user.username)
    
    return jsonify({
        "logged_in": True,
        "username": current_user.username,
        "email": current_user.email,
        "points": game_data.get('points', 0),
        "routes": game_data.get('routes', {})
    })

@app.route('/api/complete-route', methods=['POST'])
def complete_route():
    """API xác nhận hoàn thành lộ trình"""
    if not current_user.is_authenticated:
        return jsonify({"message": "Chưa đăng nhập"}), 401
    
    data = request.json
    route_id = data.get('routeId')
    users = load_db()
    
    for user in users:
        if user['email'] == current_user.email:
            # Khởi tạo object route nếu chưa có
            if 'routes' not in user: user['routes'] = {}
            if route_id not in user['routes']: user['routes'][route_id] = {}
            
            # Cập nhật status
            user['routes'][route_id]['status'] = 'completed'
            save_db(users)
            return jsonify({"success": True, "message": "Đã hoàn thành lộ trình!"})
            
    # Nếu không tìm thấy trong DB game (trường hợp hiếm), thử sync lại
    sync_user_to_game_db(current_user.email, current_user.username)
    return jsonify({"message": "Đã đồng bộ dữ liệu, vui lòng thử lại"}), 400

@app.route('/api/claim-reward', methods=['POST'])
def claim_reward():
    """API nhận thưởng mở rương"""
    if not current_user.is_authenticated:
        return jsonify({"message": "Chưa đăng nhập"}), 401
    
    data = request.json
    route_id = data.get('routeId')
    points_to_add = data.get('points', 0)
    
    users = load_db()
    for user in users:
        if user['email'] == current_user.email:
            user_route = user.get('routes', {}).get(route_id)
            
            # Kiểm tra điều kiện: Xong route + Chưa nhận quà
            if user_route and user_route.get('status') == 'completed' and not user_route.get('reward_claimed'):
                user['points'] = user.get('points', 0) + points_to_add
                user['routes'][route_id]['reward_claimed'] = True
                
                save_db(users)
                return jsonify({"success": True, "newPoints": user['points']})
            else:
                return jsonify({"success": False, "message": "Không đủ điều kiện hoặc đã nhận rồi"}), 400

    return jsonify({"message": "Lỗi xử lý"}), 500

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
STATIC_START_LAT = 10.779544664004435
STATIC_START_LON = 106.69208222854601
DINH_DOC_LAP_LAT = 10.778226
DINH_DOC_LAP_LON = 106.696445

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
    """
    Sinh chỉ dẫn lộ trình bằng văn bản với Google Gemini.
    """
    if not client:
        return jsonify({"success": False, "message": "❌ Lỗi: Gemini Client chưa được khởi tạo."}), 500

    try:
        data = request.get_json() or {}
        start_key = data.get("start")
        end_key = data.get("end")
        is_alternative = data.get("alternative", False)

        if not start_key or not end_key:
            return jsonify({"success": False, "message": "Thiếu thông tin điểm bắt đầu hoặc kết thúc"}), 400

        if start_key not in LOCATIONS or end_key not in LOCATIONS:
            return jsonify({"success": False, "message": "Tên địa điểm không hợp lệ"}), 400

        start = LOCATIONS[start_key]
        end = LOCATIONS[end_key]

        # URL Google Map (giữ nguyên)
        map_url = (
            f"https://www.google.com/maps/dir/?api=1"
            f"&origin={start['lat']},{start['lon']}"
            f"&destination={end['lat']},{end['lon']}"
            f"&travelmode=walking"
        )

        # Tính khoảng cách Haversine (giữ nguyên)
        R = 6371.0
        dlat = radians(end["lat"] - start["lat"])
        dlon = radians(end["lon"] - start["lon"])
        a = sin(dlat / 2)**2 + cos(radians(start["lat"])) * cos(radians(end["lat"])) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance_km = R * c

        # SINH CHỈ DẪN BẰNG GEMINI (ĐÃ SỬA LỖI CÚ PHÁP)
        
        # SỬA LỖI: Gọi mô hình qua client.models.get()
        # Sử dụng model gemini-2.5-flash để đồng nhất và tối ưu tốc độ/chi phí
        model_name_for_text = "gemini-2.5-flash" 
        
        # Tạo prompt
        if is_alternative:
            prompt = (
                f"Bạn là hướng dẫn viên du lịch TP.HCM. Người dùng báo rằng CON ĐƯỜNG CHÍNH ĐANG BỊ CHẶN hoặc KHÔNG ĐI ĐƯỢC. "
                f"Hãy chỉ dẫn một LỘ TRÌNH THAY THẾ (đi đường vòng, đi qua hẻm lớn hoặc đường song song) "
                f"từ '{start['name']}' đến '{end['name']}'. "
                f"Tuyệt đối không chỉ dẫn đi lại con đường chính ngắn nhất. "
                f"Hãy liệt kê 4-6 bước đi cụ thể. Bắt đầu câu trả lời bằng: '⚠️ Vì đường chính bị chặn, hãy đi theo lối này:...'"
            )
        else:
            prompt = (
                f"Bạn là hướng dẫn viên du lịch TP.HCM. "
                f"Hãy mô tả 4–6 bước chỉ đường đi bộ ngắn nhất, dễ hiểu bằng tiếng Việt, "
                f"từ '{start['name']}' đến '{end['name']}'. "
                f"Tổng khoảng cách khoảng {round(distance_km, 2)} km. "
                f"Không kèm liên kết hoặc ký hiệu đặc biệt."
            )
        
        # Gọi generate_content bằng client.models
        response = client.models.generate_content(
            model=model_name_for_text,
            contents=[prompt]
        )

        route_text = response.text.strip() if response.text else "Không tạo được lộ trình."

        return jsonify({
            "success": True,
            "route_text": route_text,
            "total_distance_km": round(distance_km, 2),
            "map_url": map_url
        }), 200

    except Exception as e:
        print("❌ Lỗi Gemini:", e)
        return jsonify({"success": False, "message": str(e)}), 500


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
    
# --- CẤU HÌNH DANH SÁCH CHI TIẾT ---
DETAILS_INFO = {
    # --- Bảo tàng Chiến tích ---
    "uh1": "Trực thăng UH-1 Huey quân sự",
    "m48": "Xe tăng M48 Patton",
    "f5": "Máy bay tiêm kích F-5",
    "guillotine": "Máy chém thời Pháp thuộc",
    "tiger_cage": "Mô hình chuồng cọp kẽm gai",
    "m107": "Pháo tự hành M107 nòng dài",
    "cbu55": "Quả bom CBU-55 lớn",
    "chinook": "Trực thăng vận tải CH-47 Chinook",
    "bulldozer": "Xe ủi đất quân sự",
    "peace_art": "Tranh vẽ hòa bình hoặc chim bồ câu",

    # --- Dinh Độc Lập ---
    "tank_390": "Xe tăng số hiệu 390 hoặc 843",
    "fountain_dinh": "Đài phun nước lớn trước Dinh Độc Lập",
    "cabinet_room": "Phòng họp nội các ghế xanh hoặc bàn bầu dục",
    "mercedes_car": "Xe ô tô Mercedes cổ màu vàng hoặc đen",
    "helicopter_roof": "Trực thăng đậu trên nóc nhà",
    "stone_curtain": "Rèm hoa đá (cấu trúc bê tông hình rèm tre)",
    "banquet_hall": "Phòng khánh tiết thảm đỏ vàng sang trọng",

    # --- Bưu điện Thành phố ---
    "clock_facade": "Đồng hồ lớn trên mặt tiền tòa nhà",
    "map_left": "Bản đồ cổ vẽ tay khu vực Sài Gòn trên tường",
    "map_right": "Bản đồ đường dây điện báo cổ trên tường",
    "phone_booth": "Buồng điện thoại công cộng bằng gỗ cổ kính",
    "uncle_ho_pic": "Hình ảnh Bác Hồ lớn ở cuối sảnh",
    "arch_ceiling": "Vòm trần nhà khung sắt màu xanh",
    "souvenir_shop": "Quầy bán hàng lưu niệm ở trung tâm",

    # --- Nhà thờ Đức Bà ---
    "mary_statue": "Tượng Đức Mẹ Hòa Bình bằng đá trắng",
    "rose_window": "Cửa sổ hoa hồng kính màu (hình tròn)",
    "bell_towers": "Hai tháp chuông nhọn cao vút",
    "red_brick": "Tường gạch trần màu đỏ cam đặc trưng",
    "main_gate": "Cổng vòm chính của nhà thờ",
    "scaffolding": "Giàn giáo xây dựng (do đang trùng tu)" # Thêm cái này để AI nhận diện nếu đang sửa chữa
}

@app.route("/api/verify-detail", methods=["POST"])
def verify_detail():
    if not client:
        return jsonify({"success": False, "message": "Lỗi: AI chưa khởi tạo."}), 500
        
    try:
        if 'image' not in request.files or 'detail_id' not in request.form:
            return jsonify({"success": False, "message": "Thiếu dữ liệu"}), 400
            
        file = request.files["image"]
        detail_id = request.form["detail_id"]
        report_missing = request.form.get("report_missing", "false") == "true"
        
        target_object = DETAILS_INFO.get(detail_id, "vật thể quân sự")
        image_bytes = file.read()
        img = Image.open(BytesIO(image_bytes))

        # Trường hợp 1: Người dùng báo cáo không tìm thấy -> AI kiểm tra xem chỗ đó CÓ TRỐNG KHÔNG
        if report_missing:
            prompt = (
                f"Người dùng đang tìm '{target_object}' nhưng báo cáo là nó đã bị di dời hoặc sửa chữa. "
                f"Hãy nhìn ảnh chụp hiện trường này. Nếu bạn thấy '{target_object}' vẫn còn đó rõ ràng, hãy trả lời 'STILL_THERE'. "
                f"Nếu không thấy vật thể đó (chỉ thấy tường, sàn, giàn giáo, hoặc vật khác), hãy trả lời 'MISSING_CONFIRMED'. "
                f"Chỉ trả lời đúng keyword."
            )
        # Trường hợp 2: Người dùng nộp ảnh vật thể -> AI kiểm tra đúng sai và cung cấp thông tin
        else:
            prompt = (
                f"Bạn là trọng tài trò chơi truy tìm kho báu tại bảo tàng. "
                f"Người chơi cần tìm: '{target_object}'. "
                f"Hãy xem ảnh. Nếu trong ảnh CHÍNH XÁC là '{target_object}', hãy trả lời theo định dạng JSON: "
                f"{{ \"valid\": true, \"fact\": \"[Một sự thật lịch sử thú vị ngắn gọn 1 câu về vật này bằng tiếng Việt]\" }}. "
                f"Nếu hoàn toàn sai, trả lời: {{ \"valid\": false, \"reason\": \"[Lý do ngắn gọn]\" }}."
            )

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[img, prompt]
        )
        
        result_text = response.text.strip()
        
        # Xử lý kết quả trả về
        if report_missing:
            if "MISSING_CONFIRMED" in result_text:
                return jsonify({"success": True, "status": "skipped", "message": "Đã xác nhận vật thể bị thiếu. Bạn được tính hoàn thành chi tiết này!"})
            else:
                return jsonify({"success": False, "status": "rejected", "message": "AI vẫn nhìn thấy vật thể trong ảnh của bạn. Hãy tìm kỹ lại!"})
        else:
            # Xử lý JSON từ AI (cần dọn dẹp chuỗi nếu AI trả về markdown)
            clean_json = result_text.replace('```json', '').replace('```', '').strip()
            try:
                data = json.loads(clean_json)
                return jsonify({"success": True, "data": data})
            except:
                # Fallback nếu AI không trả JSON chuẩn
                return jsonify({"success": False, "message": "Lỗi phân tích AI, vui lòng thử lại chụp rõ hơn."})

    except Exception as e:
        print(f"Lỗi verify detail: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

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

# ----------------------------------------------------
# --- API MỚI: CẬP NHẬT ĐIỂM (Cộng/Trừ) ---
# ----------------------------------------------------
@app.route('/api/update-score', methods=['POST'])
def update_score():
    if not current_user.is_authenticated:
        return jsonify({"success": False, "message": "Chưa đăng nhập"}), 401
    
    data = request.json
    points_to_change = data.get('points', 0)
    route_id = data.get('routeId', 'route1') # Mặc định là route1
    
    users = load_db()
    user_record = None
    
    # Tìm user trong list
    for u in users:
        if u['email'] == current_user.email:
            user_record = u
            break
            
    if not user_record:
        # Nếu chưa có trong DB game thì tạo mới
        user_record = sync_user_to_game_db(current_user.email, current_user.username)
        # Reload lại database sau khi sync
        users = load_db()
        for u in users:
            if u['email'] == current_user.email:
                user_record = u
                break

    # --- LOGIC CHỐNG GIAN LẬN ---
    # Kiểm tra xem route này đã hoàn thành chưa
    user_routes = user_record.get('routes', {})
    this_route = user_routes.get(route_id, {})
    
    if this_route.get('status') == 'completed':
        # Nếu đã hoàn thành -> Không trừ/cộng điểm nữa
        return jsonify({
            "success": False, 
            "message": "Lộ trình đã hoàn thành, không tính điểm.",
            "current_points": user_record.get('points', 0)
        })

    # Cập nhật điểm
    current_points = user_record.get('points', 0)
    new_points = current_points + points_to_change
    user_record['points'] = new_points
    
    # Lưu lại vào file
    save_db(users)
    
    return jsonify({
        "success": True, 
        "new_points": new_points,
        "added": points_to_change
    })

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
    # --- CODE THÊM MỚI: Tạo file database.txt ---
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w", encoding="utf-8") as f:
            f.write("[]") # Khởi tạo mảng JSON rỗng        
    app.run(port=5000, debug=True)
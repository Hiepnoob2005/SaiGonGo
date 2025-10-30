from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from io import BytesIO
from dotenv import load_dotenv
import os
import base64
import openai  # ✅ Thêm dòng này

# 🔑 Khai báo API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# --- Khởi tạo ứng dụng ---
app = Flask(__name__)
CORS(app) # Kích hoạt CORS
bcrypt = Bcrypt(app) # Kích hoạt Bcrypt

# Tên file để lưu trữ
USER_FILE = "user_accounts.txt"
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# --- API Routes (Phần xử lý backend) ---

@app.route('/api/register', methods=['POST'])
def register_secure():

        
    """Tuyến đường để xử lý đăng ký tài khoản."""
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Thiếu username, email, hoặc password"}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password') # Lấy mật khẩu gốc


        # --- KIỂM TRA TRÙNG LẶP ---
        if os.path.exists(USER_FILE):
            with open(USER_FILE, "r", encoding="utf-8") as f:
                for line in f:
                    parts = line.strip().split(';')
                    if len(parts) >= 2:
                        if parts[0] == username:
                            return jsonify({"message": "Username đã tồn tại"}), 409
                        if parts[1] == email:
                            return jsonify({"message": "Email đã tồn tại"}), 409

        # --- PHẦN BẢO MẬT QUAN TRỌNG ---
        # 1. Băm mật khẩu bằng bcrypt (An toàn)
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # 2. CHỈ LƯU MẬT KHẨU ĐÃ BĂM
        user_line = f"{username};{email};{hashed_password}\n"

        # 3. Ghi vào file
        # --- Kiểm tra email tồn tại ---
        if os.path.exists(USER_FILE):
            with open(USER_FILE, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        parts = line.strip().split(';')
                        if len(parts) >= 2 and parts[1] == email:
                            return jsonify({"message": "Email đã tồn tại"}), 409 # 409 Conflict

        # Lưu mật khẩu dưới dạng VĂN BẢN GỐC (giống logic file register.html)
        # LƯU Ý: Đây là cách làm KHÔNG AN TOÀN cho sản phẩm thực tế.
        # Bạn nên dùng bcrypt.generate_password_hash(password).decode('utf-8')
        user_line = f"{username};{email};{password}\n"
        with open(USER_FILE, "a", encoding="utf-8") as f:
            f.write(user_line)

        return jsonify({"message": "Tài khoản đã được tạo thành công!"}), 201

    except Exception as e:
        print(f"Lỗi máy chủ khi đăng ký: {e}")
        return jsonify({"message": "Đã xảy ra lỗi nội bộ máy chủ"}), 500

@app.route('/api/login', methods=['POST'])
def login_secure():
    """
    Tuyến đường (route) để xử lý đăng nhập MỘT CÁCH AN TOÀN.
    """
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Thiếu email hoặc password"}), 400

        # JavaScript gửi trường 'email' nhưng có thể chứa username
        email_or_username = data.get('email')
        password = data.get('password')

        # Kiểm tra file có tồn tại không
        if not os.path.exists(USER_FILE):
             return jsonify({"message": "Sai email hoặc mật khẩu"}), 401

        user_found = False
        with open(USER_FILE, "r", encoding="utf-8") as f:
            for line in f:
                # Tách dòng: username;email;hashed_password
                parts = line.strip().split(';')
                if len(parts) < 3: 
                    continue # Bỏ qua dòng lỗi

                stored_username = parts[0]
                stored_email = parts[1]
                stored_hash = parts[2] # Đây là mật khẩu đã băm

                # Kiểm tra xem người dùng nhập email hay username
                if email_or_username == stored_email or email_or_username == stored_username:
                    user_found = True
                    
                    # --- PHẦN BẢO MẬT QUAN TRỌNG ---
                    # 1. Dùng bcrypt để so sánh mật khẩu
                    if bcrypt.check_password_hash(stored_hash, password):
                        # Mật khẩu khớp!
                        return jsonify({
                            "message": "Đăng nhập thành công!",
                            "username": stored_username  # Gửi username về cho JS
                        }), 200
                    else:
                        # Mật khẩu sai
                        return jsonify({"message": "Sai email hoặc mật khẩu"}), 401

        # Nếu chạy hết vòng lặp mà không tìm thấy user
        if not user_found:
            return jsonify({"message": "Sai email hoặc mật khẩu"}), 401

    except Exception as e:
        print(f"Lỗi máy chủ khi đăng nhập: {e}")
        return jsonify({"message": "Đã xảy ra lỗi nội bộ máy chủ"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """
    (MỚI) Tuyến đường để xử lý đăng nhập.
    File login.js của bạn gửi "email" (có thể là username hoặc email).
    """
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Thiếu thông tin đăng nhập"}), 400

        # login.js gửi { email: email || username, password }
        # nên chúng ta gọi nó là 'identifier'
        identifier = data.get('email') 
        password = data.get('password')

        if not os.path.exists(USER_FILE):
            return jsonify({"message": "Sai thông tin đăng nhập"}), 401

        user_found = False
        with open(USER_FILE, "r", encoding="utf-8") as f:
            next(f) # Bỏ qua dòng tiêu đề 'username;email;password'
            for line in f:
                line = line.strip()
                if not line:
                    continue
                
                parts = line.split(';')
                if len(parts) < 3:
                    continue
                
                stored_username, stored_email, stored_password = parts[0], parts[1], parts[2]

                # Kiểm tra xem identifier là username hay email
                # Và kiểm tra mật khẩu
                if (identifier == stored_username or identifier == stored_email) and password == stored_password:
                    user_found = True
                    break # Tìm thấy, thoát vòng lặp

        if user_found:
            # Gửi về username để hiển thị lời chào
            return jsonify({"message": "Đăng nhập thành công!", "username": stored_username}), 200
        else:
            return jsonify({"message": "Sai thông tin đăng nhập"}), 401 # 401 Unauthorized

    except Exception as e:
        print(f"Lỗi máy chủ khi đăng nhập: {e}")
        return jsonify({"message": "Đã xảy ra lỗi nội bộ máy chủ"}), 500

# --- Route xác thực hình ảnh bằng OpenAI Vision ---

@app.route("/verify-image", methods=["POST"])
def verify_image():
    """
    Xác thực ảnh người chơi chụp với địa điểm yêu cầu bằng OpenAI GPT-4o Vision.
    """
    try:
        # Lấy file ảnh và tên địa điểm
        if 'image' not in request.files or 'location' not in request.form:
            return jsonify({"message": "Thiếu dữ liệu hình ảnh hoặc tên địa điểm"}), 400

        file = request.files["image"]
        location_name = request.form["location"]

        # Đọc và encode base64
        image_bytes = file.read()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        # Biến bật/tắt AI (debug)
        AI_CHECK_ENABLED = True
        if not AI_CHECK_ENABLED:
            return jsonify({"message": "✅ (Demo) AI kiểm tra đã tắt, coi như hợp lệ."}), 200

        # 🧠 Gọi OpenAI GPT-4o
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Bạn là trợ lý giúp xác định xem hình người dùng chụp có đúng với địa điểm mô tả không."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"Hãy so sánh hình ảnh này với địa điểm '{location_name}'. Trả lời ngắn gọn: 'Đúng địa điểm' hoặc 'Không đúng địa điểm'."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ]
        )

        # ✅ Lấy nội dung phản hồi đúng cú pháp
        result = response.choices[0].message.content
        return jsonify({"message": f"🤖 Kết quả AI: {result}"}), 200

    except Exception as e:
        print(f"Lỗi AI Vision: {e}")
        return jsonify({"message": f"❌ Lỗi xử lý: {str(e)}"}), 500

# --- File Serving (Phần phục vụ frontend) ---

@app.route("/")
def serve_index():
    """Phục vụ file index.html (hoặc index copy.html)"""
    # Đổi 'index copy.html' thành 'index.html' nếu bạn dùng file đó
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    """Phục vụ các file tĩnh (CSS, JS, images, và các file HTML khác)"""
    # Route này sẽ bắt các request tới /login.html, /register.html, /assets/css/style.css, ...
    return send_from_directory(BASE_DIR, filename)

# --- Chạy máy chủ ---
if __name__ == '__main__':
    # Chạy máy chủ Flask ở cổng 5000
    # debug=True có nghĩa là máy chủ sẽ tự khởi động lại khi bạn thay đổi code
    # Đảm bảo file user tồn tại với tiêu đề
    if not os.path.exists(USER_FILE):
        with open(USER_FILE, "w", encoding="utf-8") as f:
            f.write("username;email;password\n") # Thêm dòng tiêu đề

    app.run(port=5000, debug=True)
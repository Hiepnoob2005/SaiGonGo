from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os

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
        print(f"Lỗi máy chủ: {e}")
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

# --- File Serving (Phần phục vụ frontend) ---

@app.route("/")
def serve_index():
    """Phục vụ file index.html (hoặc index copy.html)"""
    # Đổi 'index copy.html' thành 'index.html' nếu bạn dùng file đó
    return send_from_directory(BASE_DIR, "index copy.html")


@app.route("/<path:filename>")
def serve_static(filename):
    """Phục vụ các file tĩnh (CSS, JS, images, và các file HTML khác)"""
    # Route này sẽ bắt các request tới /login.html, /register.html, /assets/css/style.css, ...
    return send_from_directory(BASE_DIR, filename)

# --- Chạy máy chủ ---
if __name__ == '__main__':
    # Đảm bảo file user tồn tại với tiêu đề
    if not os.path.exists(USER_FILE):
        with open(USER_FILE, "w", encoding="utf-8") as f:
            f.write("username;email;password\n") # Thêm dòng tiêu đề

    app.run(port=5000, debug=True)
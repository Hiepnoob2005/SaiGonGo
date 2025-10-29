from flask import Flask, request, jsonify, render_template
from flask import send_from_directory
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os

# --- Khởi tạo ứng dụng ---
app = Flask(__name__)

# Kích hoạt CORS: Cho phép trang web (register.html)
# gửi yêu cầu đến máy chủ (app.py) này
CORS(app)

# Kích hoạt Bcrypt để băm mật khẩu
bcrypt = Bcrypt(app)

# Tên file để lưu trữ
USER_FILE = "user_accounts.txt"

@app.route('/api/register', methods=['POST'])
def register_secure():
    """
    Tuyến đường (route) để xử lý đăng ký tài khoản MỘT CÁCH AN TOÀN.
    """
    try:
        data = request.get_json()
        
        if not data or 'username' not in data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Thiếu username, email, hoặc password"}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

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
    
@app.route("/")
def serve_index():
    """Serves the main HTML file (index.html) from the current directory."""
    # We use os.path.abspath(os.path.dirname(__file__)) to ensure we're looking
    # in the directory where app.py resides.
    base_dir = os.path.abspath(os.path.dirname(__file__))
    return send_from_directory(base_dir, "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    """Serves static files (CSS, JS) from the current directory."""
    # This route handles requests for style.css and wordle.js
    base_dir = os.path.abspath(os.path.dirname(__file__))
    return send_from_directory(base_dir, filename)

@app.route('/login') # Route cho trang đăng nhập
def login_page():
    """Phục vụ file login.html khi người dùng truy cập /login"""
    # Bạn nên tạo file login.html và để trong thư mục 'templates'
    return render_template('login.html') 

@app.route('/register') # Route cho trang đăng ký
def register_page():
    """Phục vụ file register.html khi người dùng truy cập /register"""
    # Bạn nên tạo file register.html và để trong thư mục 'templates'
    return render_template('register.html')

# --- Chạy máy chủ ---
if __name__ == '__main__':
    # Chạy máy chủ Flask ở cổng 5000
    # debug=True có nghĩa là máy chủ sẽ tự khởi động lại khi bạn thay đổi code
    app.run(port=5000, debug=True)
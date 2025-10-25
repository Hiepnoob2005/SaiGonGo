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
    Nhận JSON, băm mật khẩu, và lưu vào file.
    """
    try:
        # Lấy dữ liệu JSON từ yêu cầu
        data = request.get_json()
        
        # Kiểm tra xem có đủ trường không
        if not data or 'username' not in data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Thiếu username, email, hoặc password"}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        user_line = f"{username};{email};{password}\n"

        # 3. Ghi vào file
        # 'a' nghĩa là 'append' (nối vào cuối file)
        with open(USER_FILE, "a", encoding="utf-8") as f:
            f.write(user_line)

        # 4. Trả về thông báo thành công
        # Mã 201 có nghĩa là "Created" (Đã tạo thành công)
        return jsonify({"message": "Tài khoản đã được tạo thành công!"}), 201

    except Exception as e:
        print(f"Lỗi máy chủ: {e}")
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


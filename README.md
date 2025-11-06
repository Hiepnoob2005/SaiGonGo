# SaiGonGo - Website Du lịch Sài Gòn 🏙️

Chào mừng bạn đến với SaiGonGo! Đây là một dự án website được xây dựng bằng **Flask** (Python) với mục đích giới thiệu các địa điểm du lịch, văn hóa tại Thành phố Hồ Chí Minh (Sài Gòn). Dự án cũng tích hợp các tính năng hiện đại như đăng ký/đăng nhập người dùng và tương tác với AI (Google Gemini).

## 🌟 Tính năng chính

* **Trang chủ:** Giao diện giới thiệu chung về website.
* **Quản lý Người dùng:**
    * Đăng ký tài khoản mới.
    * Đăng nhập/Đăng xuất.
    * Quên mật khẩu (sử dụng `flask_mail` để gửi email).
* **Giới thiệu Địa điểm:** Các trang chi tiết về những địa danh nổi tiếng (Dinh Độc Lập, Nhà thờ Lớn, Bưu điện Thành phố, v.v.).
* **Cửa hàng:** Một trang `shop.html` (có thể đang phát triển) để bán đồ lưu niệm hoặc vé.
* **Tích hợp AI:** Sử dụng API của **Google Gemini** (`google.genai`) cho một tính năng (có thể là chatbot hoặc tạo nội dung).

## 🛠️ Công nghệ sử dụng

* **Backend:**
    * [Python 3](https://www.python.org/)
    * [Flask](https://flask.palletsprojects.com/) (Framework chính)
    * [Flask-Login](https://flask-login.readthedocs.io/): Quản lý phiên đăng nhập của người dùng.
    * [Flask-Mail](https://pythonhosted.org/Flask-Mail/): Gửi email (ví dụ: khôi phục mật khẩu).
    * [google-generativeai](https://pypi.org/project/google-generativeai/): Tương tác với Google Gemini API.
* **Frontend:**
    * HTML5
    * CSS3
    * JavaScript
* **Cơ sở dữ liệu:**
    * [SQLite](https://www.sqlite.org/index.html) (dựa trên tệp `saigongo.db` có trong dự án)

## 🚀 Cài đặt và Chạy dự án

Dưới đây là các bước để cài đặt và chạy dự án này trên máy cục bộ của bạn.

### 1. Yêu cầu tiên quyết

* [Python 3.8+](https://www.python.org/downloads/)
* `pip` (Trình quản lý gói của Python)
* (Tùy chọn) [Git](https://git-scm.com/downloads)

### 2. Cài đặt

1.  **Clone repository:**
    ```bash
    git clone [https://github.com/Hiepnoob2005/SaiGonGo.git](https://github.com/Hiepnoob2005/SaiGonGo.git)
    cd SaiGonGo
    ```

2.  **(Khuyến nghị) Tạo môi trường ảo:**
    ```bash
    # Dành cho Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Dành cho macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Cài đặt các thư viện Python:**
    Dự án của bạn cần một số thư viện. Hãy cài đặt chúng bằng `pip`:
    ```bash
     pip install flask flask_bcrypt flask_cors flask_login flask_mail dotenv requests google google-genai pillow
    ```
    *(Ghi chú: Dựa trên các file lỗi, có vẻ bạn cũng dùng `psycopg2` và `beautifulsoup4`. Nếu `psycopg2` là bắt buộc, bạn cần cài đặt PostgreSQL server).*

4.  **Thiết lập Biến môi trường (nếu trong folder không có file .env):**
    Dự án sử dụng `dotenv` để quản lý các khóa API. Tạo một tệp tên là `.env` trong thư mục gốc và thêm các khóa của bạn vào đó:

    ```ini
      # API Key cho Gemini
      GEMINI_API_KEY="AIzaSyDBoWF3Ou6kq0w7igqgnp4UWK9ZNJ9m1Is"
      
      MAIL_SERVER=smtp.gmail.com
      MAIL_PORT=587
      MAIL_USE_TLS=true
      
      MAIL_USERNAME=lnphuoc1608@gmail.com
      
      MAIL_PASSWORD=ixkjazmsncnibgmg
    ```

### 3. Chạy ứng dụng

Sau khi cài đặt xong, khởi chạy máy chủ Flask:

```bash
flask run
# Hoặc
python main.py


// Nội dung cho file: assets/js/login.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username")?.value || "";
    const password = document.getElementById("password")?.value || "";

    if (!username || !password) {
      alert("Vui lòng nhập Username và Password.");
      return;
    }

    try {
      // Gửi dữ liệu đến backend API (main.py)
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            username: username, // Gửi username (vì form login.html dùng id="username")
            password: password 
        }),
        // QUAN TRỌNG: Gửi kèm cookie (để xác thực)
        credentials: 'include' 
      });

      const result = await response.json();

      if (response.ok) {
        // Đăng nhập thành công
        alert(result.message || "Đăng nhập thành công!");
        
        // Chuyển hướng về trang chủ
        // Dùng replace() để không thể nhấn "Back" quay lại trang login
        window.location.replace("index.html");

      } else {
        // Hiển thị lỗi từ server
        alert(result.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      // Lỗi này xảy ra nếu server Python (main.py) chưa chạy
      console.error("Error:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
  });
});
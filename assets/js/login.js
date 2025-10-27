// Nội dung cho file assets/js/login.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Lấy giá trị từ form đăng nhập
    const usernameOrEmail =
      document.getElementById("username")?.value || "";
    const password = document.getElementById("password")?.value || "";

    if (!usernameOrEmail || !password) {
      alert("Please enter username/email and password.");
      return;
    }

    try {
      // Gửi dữ liệu đến backend API (main.py)
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Gửi đúng định dạng { email: ..., password: ... }
        body: JSON.stringify({ email: usernameOrEmail, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // response.ok = mã trạng thái 2xx (thành công)
        alert(result.message || "Login successful!");

        // Lưu 'username' trả về từ server vào localStorage
        // để trang index.html có thể chào đúng tên.
        if (result.username) {
          localStorage.setItem("loggedInUser", result.username);
        }

        // Chuyển hướng đến trang chính
        window.location.href = "index copy.html";
      } else {
        // Hiển thị lỗi từ server (ví dụ: "Sai thông tin đăng nhập")
        alert(result.message || "Login failed!");
      }
    } catch (error) {
      // Lỗi này xảy ra nếu server Python (main.py) chưa chạy
      console.error("Error:", error);
      alert("Could not connect to the server.");
    }
  });
});
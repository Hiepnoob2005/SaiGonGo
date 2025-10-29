<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("username")?.value || "";
    const emailInput = document.getElementById("email")?.value || "";
    const password = document.getElementById("password").value;
    
    // Dùng biến này để biết người dùng nhập vào ô nào
    const loginIdentifier = emailInput || usernameInput; 

    // Local fallback
    if (
      (usernameInput === "admin" || emailInput === "admin@example.com") &&
      password === "1234"
    ) {
      alert("Login successful (local demo)!");
      // Lưu tên "admin" một cách rõ ràng
      localStorage.setItem("loggedInUser", "admin"); 
      
      // XÓA DÒNG "MediaQueryList.apply"
      
      // Dùng .replace() để không quay lại trang login được
      window.location.replace("index copy.html"); 
=======
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
>>>>>>> 4397f2b30f346d69a67ec7ec9fe445a0d3f4f317
      return;
    }

    try {
<<<<<<< HEAD
      // Send data to backend API
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Gửi chính xác cái mà người dùng đã nhập
        body: JSON.stringify({ email: loginIdentifier, password }), 
=======
      // Gửi dữ liệu đến backend API (main.py)
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Gửi đúng định dạng { email: ..., password: ... }
        body: JSON.stringify({ email: usernameOrEmail, password }),
>>>>>>> 4397f2b30f346d69a67ec7ec9fe445a0d3f4f317
      });

      const result = await response.json();

      if (response.ok) {
<<<<<<< HEAD
        alert("Login successful!");
        // QUAN TRỌNG: Lưu "username" mà API trả về
        localStorage.setItem("loggedInUser", result.username); 
        window.location.replace("index copy.html"); // Dùng .replace()
      } else {
        alert(result.message || "Login failed!");
      }
    } catch (error) {
=======
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
>>>>>>> 4397f2b30f346d69a67ec7ec9fe445a0d3f4f317
      console.error("Error:", error);
      alert("Could not connect to the server.");
    }
  });
});
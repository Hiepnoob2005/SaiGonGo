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
      return;
    }

    try {
      // Send data to backend API
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Gửi chính xác cái mà người dùng đã nhập
        body: JSON.stringify({ email: loginIdentifier, password }), 
      });

      const result = await response.json();

      if (response.ok) {
        alert("Login successful!");
        // QUAN TRỌNG: Lưu "username" mà API trả về
        localStorage.setItem("loggedInUser", result.username); 
        window.location.replace("index copy.html"); // Dùng .replace()
      } else {
        alert(result.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to the server.");
    }
  });
});
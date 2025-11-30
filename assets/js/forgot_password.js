document.addEventListener("DOMContentLoaded", () => {
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const sendOtpForm = document.getElementById("sendOtpForm");
    const resetPasswordForm = document.getElementById("resetPasswordForm");
  
    // Các trường input
    const emailInput = document.getElementById("email");
    const emailHiddenInput = document.getElementById("email_hidden");
    const userEmailDisplay = document.getElementById("userEmailDisplay");
  
    // Các thông báo
    const loadingMessage = document.getElementById("loadingMessage");
    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");
  
    // Hàm xóa toàn bộ thông báo
    function clearMessages() {
      if(loadingMessage) loadingMessage.style.display = 'none';
      if(errorMessage) errorMessage.style.display = 'none';
      if(successMessage) successMessage.style.display = 'none';
    }
  
    // Xóa thông báo khi người dùng bắt đầu gõ lại
    const inputs = [
        emailInput, 
        document.getElementById('otp'), 
        document.getElementById('new_password'), 
        document.getElementById('confirm_password')
    ];
    
    inputs.forEach(input => {
        if(input) input.addEventListener('input', clearMessages);
    });
  
    // --- Xử lý Bước 1: Gửi OTP ---
    sendOtpForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearMessages();
      const email = emailInput.value;
  
      if (!email.includes("@")) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }
  
      showMessage("Sending OTP...", "loading");
  
      try {
        // CẬP NHẬT: Thêm http://localhost:5000 để tránh lỗi 404 nếu chạy local
        const response = await fetch("http://localhost:5000/api/request-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
  
        const result = await response.json();
        clearMessages();
  
        if (response.ok) {
          showMessage(result.message || "OTP sent successfully!", "success");
          
          // Logic chuyển bước
          if(userEmailDisplay) userEmailDisplay.textContent = email;
          if(emailHiddenInput) emailHiddenInput.value = email;
  
          // Đợi 1 chút để user đọc thông báo rồi chuyển
          setTimeout(() => {
              clearMessages();
              step1.style.display = "none";
              step2.style.display = "block";
          }, 1000);
          
        } else {
          showMessage(result.message || "Failed to send OTP.", "error");
        }
      } catch (error) {
        console.error(error);
        clearMessages();
        showMessage("Cannot connect to server (Is Python running?)", "error");
      }
    });
  
    // --- Xử lý Bước 2: Reset Mật khẩu ---
    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearMessages();
  
      const email = emailHiddenInput.value; 
      const otp = document.getElementById("otp").value;
      const new_password = document.getElementById("new_password").value;
      const confirm_password = document.getElementById("confirm_password").value;
  
      if (new_password !== confirm_password) {
        showMessage("Passwords do not match.", "error");
        return;
      }
  
      if (!otp || otp.length < 4) {
          showMessage("Please enter a valid OTP.", "error");
          return;
      }
  
      showMessage("Resetting password...", "loading");
  
      try {
        const response = await fetch("http://localhost:5000/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, new_password }),
        });
  
        const result = await response.json();
        clearMessages(); 
  
        if (response.ok) {
          showMessage(result.message || "Password reset successfully!", "success");
          
          // Chuyển hướng về login sau 2 giây
          setTimeout(() => {
            window.location.href = "login.html";
          }, 2000);
        } else {
          showMessage(result.message || "Failed to reset password.", "error");
        }
      } catch (error) {
        console.error(error);
        clearMessages();
        showMessage("Cannot connect to server.", "error");
      }
    });
  
    // Hàm hiển thị thông báo
    function showMessage(message, type = "error") {
      clearMessages();
      let el;
      if (type === "error") {
        el = errorMessage;
      } else if (type === "success") {
        el = successMessage;
      } else {
        el = loadingMessage;
      }
      
      if (el) {
          el.textContent = message;
          el.style.display = "block";
      }
    }
});
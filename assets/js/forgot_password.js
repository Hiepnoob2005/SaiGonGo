// Nội dung cho file: assets/js/forgot_password.js

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

  // Xóa thông báo khi người dùng gõ
  emailInput.addEventListener('input', clearMessages);
  document.getElementById('otp')?.addEventListener('input', clearMessages);
  document.getElementById('new_password')?.addEventListener('input', clearMessages);
  document.getElementById('confirm_password')?.addEventListener('input', clearMessages);

  function clearMessages() {
    loadingMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
  }

  // Xử lý Bước 1: Gửi OTP
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
      const response = await fetch("/api/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: 'include' // Gửi cookie (nếu cần)
      });

      const result = await response.json();
      clearMessages(); // Xóa "Sending..."

      if (response.ok) {
        showMessage(result.message || "OTP sent!", "success");
        // Chuyển sang Bước 2
        step1.style.display = "none";
        step2.style.display = "block";
        userEmailDisplay.textContent = email;
        emailHiddenInput.value = email; // Lưu email vào trường ẩn
      } else {
        showMessage(result.message || "Failed to send OTP.", "error");
      }
    } catch (error) {
      console.error(error);
      clearMessages();
      showMessage("Unable to connect to the server.", "error");
    }
  });

  // Xử lý Bước 2: Reset Mật khẩu
  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessages();

    const email = emailHiddenInput.value; // Lấy email từ trường ẩn
    const otp = document.getElementById("otp").value;
    const new_password = document.getElementById("new_password").value;
    const confirm_password = document.getElementById("confirm_password").value;

    if (new_password !== confirm_password) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    if (!otp || otp.length !== 6) {
        showMessage("Please enter a valid 6-digit OTP.", "error");
        return;
    }

    showMessage("Resetting password...", "loading");

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password }),
        credentials: 'include'
      });

      const result = await response.json();
      clearMessages(); // Xóa "Resetting..."

      if (response.ok) {
        showMessage(result.message || "Password reset successfully!", "success");
        // Đợi 2 giây rồi chuyển về trang login
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        showMessage(result.message || "Failed to reset password.", "error");
      }
    } catch (error) {
      console.error(error);
      clearMessages();
      showMessage("Unable to connect to the server.", "error");
    }
  });

  // Hàm helper để hiển thị thông báo
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
    el.textContent = message;
    el.style.display = "block";
  }
});

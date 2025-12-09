'use strict';

/**
 * navbar toggle
 */

const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const header = document.querySelector("[data-header]");

navToggleBtn.addEventListener("click", function () {
  this.classList.toggle("active");
  header.classList.toggle("active");
});



/**
 * show go top btn when scroll window to 500px
 */

const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  window.scrollY >= 500 ? goTopBtn.classList.add("active")
    : goTopBtn.classList.remove("active");
});

//Login-mobile
    document.addEventListener("DOMContentLoaded", () => {
      // 1. MOBILE MENU TOGGLE LOGIC (MỚI THÊM)
      const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
      const navbar = document.querySelector(".navbar");

      if (navToggleBtn && navbar) {
        navToggleBtn.addEventListener("click", function () {
          navbar.classList.toggle("active");
          this.classList.toggle("active"); // Toggle class active cho nút để đổi icon
        });
      }

      // 2. LOGIC ĐĂNG NHẬP/ĐĂNG XUẤT (CŨ)
      const originalLoginButton = navbar.querySelector('a[href="login.html"]');

      if (originalLoginButton) {
        // Gọi API /api/status để kiểm tra xem ai đã đăng nhập
        fetch("/api/status", {
          method: "GET",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.logged_in) {
              // ----- ĐÃ ĐĂNG NHẬP -----
              const userSection = document.createElement("div");
              userSection.style.display = "flex";
              userSection.style.alignItems = "center";

              const greetingPrefix = typeof i18n !== 'undefined' ? i18n.t('greeting_prefix') : 'Chào,';
              const logoutText = typeof i18n !== 'undefined' ? i18n.t('nav_logout') : 'Logout';

              userSection.innerHTML = `
                <a href="profile.html" style="color: white; margin-right: 15px; font-weight: bold; text-decoration: underline;">
                    ${greetingPrefix} ${data.username}
                </a>
                <button class="btn btn-outline" id="logoutBtn" style="padding: 5px 15px;">${logoutText}</button>
            `;

              originalLoginButton.replaceWith(userSection);

              // Thêm sự kiện click cho nút Logout
              document.getElementById("logoutBtn").addEventListener("click", () => {
                fetch("/api/logout", {
                  method: "POST",
                  credentials: "include",
                })
                  .then(() => {
                    window.location.reload();
                  })
                  .catch((err) => console.error("Logout failed:", err));
              });

            } else {
              // ----- CHƯA ĐĂNG NHẬP -----
              // Không làm gì cả
            }
          })
          .catch((err) => {
            console.error("Không thể kiểm tra trạng thái đăng nhập:", err);
          });
      }
    });
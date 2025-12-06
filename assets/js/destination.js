
function toggleSidebar() {
   const sidebar = document.getElementById("sidebar");

   sidebar.classList.toggle("open");
}

function closeSidebar() {
   const sidebar = document.getElementById("sidebar");

   sidebar.classList.remove("open");
}

document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape') {
      closeSidebar();
   }
});

// --- 1. CẤU HÌNH TỌA ĐỘ ĐÍCH (BẢO TÀNG CHIẾN TÍCH CHIẾN TRANH) ---
// Sử dụng tọa độ từ file lthinhdoclap.html
const TARGET_LAT = 10.777182;
const TARGET_LON = 106.688514;
const MAX_DISTANCE_METERS = 100; // Khoảng cách cho phép

const gpsStatus = document.getElementById("gpsStatus");
const lockMessage = document.getElementById("lockMessage");
const uploadBtn = document.getElementById("uploadBtn");
const resultBox = document.getElementById("result");
const nextDestinationBtn = document.getElementById("nextDestinationBtn");
const preview = document.getElementById("preview");

const dropArea = document.getElementById("image-view");
const photoInput = document.getElementById("photo");
const imageView = document.getElementById("image-view");

let checkStatus = true;


// --- 2. HÀM TÍNH KHOẢNG CÁCH (Lấy từ trang lộ trình) ---
function getDistance(lat1, lon1, lat2, lon2) {
   const R = 6371e3; // Bán kính Trái Đất (m)
   const toRad = deg => deg * Math.PI / 180;
   const φ1 = toRad(lat1);
   const φ2 = toRad(lat2);
   const Δφ = toRad(lat2 - lat1);
   const Δλ = toRad(lon2 - lon1);
   const a = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return R * c;
}

// --- 3. HÀM CHECK VỊ TRÍ LIÊN TỤC ---
// --- 3. HÀM CHECK VỊ TRÍ & LOGIC DEV MODE ---
const devModeToggle = document.getElementById("devModeToggle");

function checkLocation() {
   if(!checkStatus) return;

   // 🛑 ƯU TIÊN 1: Kiểm tra xem có đang bật chế độ Dev không?
   if (devModeToggle.checked) {
      gpsStatus.innerHTML = `🛠️ <b>Chế độ Nhà phát triển:</b><br>Đã bỏ qua kiểm tra GPS. Camera đã mở!`;
      gpsStatus.style.backgroundColor = "#fff8e1"; // Màu vàng nhạt
      gpsStatus.style.color = "#b38600";
      gpsStatus.style.border = "2px solid #ffe58f";

      if (photoInput.files[0]) {
         photoInput.disabled = false;
         nextDestinationBtn.disabled = true;
         uploadBtn.disabled = false;
      }

      else {
         photoInput.disabled = false;
         nextDestinationBtn.disabled = true;
         uploadBtn.disabled = true;
      }

      lockMessage.style.display = "none";
      return; // Dừng hàm, không check GPS thật nữa
   }

   // 🛑 ƯU TIÊN 2: Nếu không bật Dev Mode, chạy GPS thật
   if ("geolocation" in navigator) {
      // Hiển thị trạng thái đang dò tìm (chỉ khi chưa có kết quả)
      if (gpsStatus.textContent.includes("Chế độ")) {
         gpsStatus.innerHTML = "📡 Đang lấy lại vị trí thực tế...";
      }

      navigator.geolocation.getCurrentPosition(
         (position) => {
            // Nếu người dùng vừa bật nút Dev Mode trong lúc GPS đang chạy, thì hủy cập nhật
            if (devModeToggle.checked) return;

            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            const distance = getDistance(userLat, userLon, TARGET_LAT, TARGET_LON);

            if (distance <= MAX_DISTANCE_METERS) {
               // ĐÃ ĐẾN NƠI
               gpsStatus.innerHTML = `✅ Bạn đang ở cách điểm đến <b>${distance.toFixed(0)}m</b>. <br>Đã mở khóa camera!`;
               gpsStatus.style.backgroundColor = "#e8ffe8";
               gpsStatus.style.color = "green";
               gpsStatus.style.border = "2px solid green";

               photoInput.disabled = false;
               nextDestinationBtn.disabled = true;
               uploadBtn.disabled = true;

               lockMessage.style.display = "none";
            } else {
               // CÒN XA
               gpsStatus.innerHTML = `⚠️ Bạn đang cách điểm đến <b>${(distance / 1000).toFixed(2)} km</b>.<br>Hãy đến gần hơn 100m.`;
               gpsStatus.style.backgroundColor = "#fff5f5";
               gpsStatus.style.color = "#d62828";
               gpsStatus.style.border = "2px solid #d62828";

               lockMessage.style.display = "block";
               photoInput.disabled = true;
               nextDestinationBtn.disabled = true;
               uploadBtn.disabled = true;
            }
         },
         (error) => {
            if (devModeToggle.checked) return;
            gpsStatus.textContent = "❌ Không thể lấy vị trí GPS.";
            gpsStatus.style.backgroundColor = "#eee";

            photoInput.disabled = true;
            nextDestinationBtn.disabled = true;
            uploadBtn.disabled = true;
         },
         { enableHighAccuracy: true, timeout: 5000 }
      );
   } else {
      gpsStatus.textContent = "Trình duyệt không hỗ trợ GPS.";
      photoInput.disabled = true;
      nextDestinationBtn.disabled = true;
      uploadBtn.disabled = true;

   }
}

devModeToggle.addEventListener("change", checkLocation);
checkLocation();
setInterval(checkLocation, 5000);

// --- 4. LOGIC XỬ LÝ ẢNH (GIỮ NGUYÊN) ---
dropArea.addEventListener("dragover", function (e) {
   e.preventDefault();
   dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", function (e) {
   dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", function (e) {
   e.preventDefault();
   dropArea.classList.remove("dragover");
   photoInput.files = e.dataTransfer.files;
   photoInput.dispatchEvent(new Event("change"));

   photoInput.disabled = false;
   nextDestinationBtn.disabled = true;
   uploadBtn.disabled = false;
});

photoInput.addEventListener("change", (e) => {
   const file = e.target.files[0];

   if (!file) {
      photoInput.disabled = true;
      nextDestinationBtn.disabled = true;
      uploadBtn.disabled = true;

      resultBox.textContent = "";
      imageView.style.backgroundImage = "";
      imageView.innerHTML = `<i class="fa-solid fa-folder-open upload-icon"></i> <p>Drag & Drop or Click here <br> to upload image</p>`;
      return;
   }

   const imageURL = URL.createObjectURL(file);
   imageView.style.backgroundImage = `url("${imageURL}")`;

   photoInput.disabled = false;
   nextDestinationBtn.disabled = true;
   uploadBtn.disabled = false;

   imageView.innerHTML = "";
   resultBox.textContent = "";
});

uploadBtn.addEventListener("click", async () => {
   const file = photoInput.files[0];
   const locationName = document.getElementById("locationName").value.trim();

   if (!file) {
      alert("Vui lòng chọn ảnh trước khi xác thực!");
      return;
   }

   resultBox.textContent = "⏳ Đang gửi hình ảnh để AI xử lý...";

   photoInput.disabled = false;
   nextDestinationBtn.disabled = true;
   uploadBtn.disabled = false;

   const formData = new FormData();
   formData.append("image", file);
   formData.append("location", locationName);

   try {
      // --- BƯỚC 1: Gửi ảnh lên Server AI (Code cũ của bạn) ---
      const res = await fetch("/verify-image", {
         method: "POST",
         body: formData,
      });
      const data = await res.json();

      resultBox.textContent = data.message;

      // --- BƯỚC 2: Kiểm tra kết quả từ AI ---
      if (data.message && (data.message.includes("Đúng địa điểm") || data.message.includes("✅"))) {
         photoInput.disabled = true;
         nextDestinationBtn.disabled = false;
         uploadBtn.disabled = true;

         checkStatus = false;
         // --- CODE CỘNG ĐIỂM (+5) ---
         try {
            const scoreRes = await fetch('/api/update-score', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ points: 5, routeId: 'route1' })
            });
            const scoreData = await scoreRes.json();

            if (scoreData.success) {
               // Cập nhật UI
               document.getElementById('user-points').textContent = scoreData.new_points;

               // Hiệu ứng +5 bay lên
               const anim = document.getElementById('point-anim');
               anim.textContent = "+5 Điểm (Xác thực)";
               anim.className = "point-animation anim-plus";
            }
         } catch (err) { console.error(err); }

         // Thay dòng thông báo kết quả bằng thông báo hoàn thành
         resultBox.innerHTML = "✅ <b style='color:green'>Xác thực thành công! Bạn đã nhận điểm.</b>";
         // ---------------------------------------------

         // B. BẮT ĐẦU QUY TRÌNH NÉN & LƯU ẢNH (Chỉ chạy khi đúng địa điểm)
         const reader = new FileReader();
         reader.readAsDataURL(file); // Đọc file ảnh gốc

         reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function () {
               // Tạo Canvas để nén ảnh (Resize về max 600px)
               const canvas = document.createElement('canvas');
               const ctx = canvas.getContext('2d');

               const maxWidth = 600;
               const scaleFactor = maxWidth / img.width;

               // Nếu ảnh nhỏ hơn 600px thì giữ nguyên, nếu to hơn thì resize
               if (img.width > maxWidth) {
                  canvas.width = maxWidth;
                  canvas.height = img.height * scaleFactor;
               } else {
                  canvas.width = img.width;
                  canvas.height = img.height;
               }

               // Vẽ ảnh lên canvas
               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

               // Xuất ảnh nén dạng JPEG chất lượng 70%
               const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

               // Lưu vào LocalStorage
               let myTripAlbum = JSON.parse(localStorage.getItem("SaiGonGo_Album")) || [];

               myTripAlbum.push({
                  location: locationName,
                  image: compressedBase64,
                  time: new Date().toLocaleString("vi-VN")
               });

               try {
                  localStorage.setItem("SaiGonGo_Album", JSON.stringify(myTripAlbum));
                  console.log("✅ Đã xác thực đúng và lưu ảnh vào nhật ký!");
               } catch (e) {
                  console.error("Lỗi lưu ảnh:", e);
                  // Không alert lỗi bộ nhớ đầy để tránh làm phiền người dùng lúc đang vui
               }
            };
         };
         // --- KẾT THÚC QUY TRÌNH LƯU ẢNH ---
      } else {
         // --- TRƯỜNG HỢP SAI ---
         resultBox.textContent = data.message; // Hiện thông báo sai
         resultBox.style.color = "red";

         photoInput.disabled = false;
         nextDestinationBtn.disabled = true;
         uploadBtn.disabled = true;

         nextDestinationBtn.style.display = "none";
      }

   } catch (err) {
      console.error(err);
      resultBox.innerHTML = `❌ Lỗi: ${err.message}`;
      photoInput.disabled = false;
      nextDestinationBtn.disabled = true;
      uploadBtn.disabled = true;
   }
});
// Load điểm khi vào trang
async function loadUserScore() {
   try {
      const res = await fetch('/api/user');
      const data = await res.json();
      if (data.logged_in) document.getElementById('user-points').textContent = data.points;
   } catch (e) { }
}
window.addEventListener('load', loadUserScore);

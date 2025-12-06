
// --- CẤU HÌNH ĐỊA ĐIỂM ---
const START_KEY = "nha_tho_duc_ba";
const END_KEY = "buu_dien_thanh_pho";
// -------------------------

const getDirectionsBtn = document.getElementById("getDirectionsBtn");
const directionsBox = document.getElementById("directionsBox");
const loadingStatus = document.getElementById("loadingStatus");
const mapLink = document.getElementById("mapLink");
const photoChallenge = document.getElementById("photoChallenge");
const locationToggle = document.getElementById("dynamicLocationToggle");
const locationModeLabel = document.getElementById("locationModeLabel");
const DESTINATION_NAME = document.getElementById("locationName").value;

let useDynamicLocation = false;

locationToggle.checked = !useDynamicLocation;
locationModeLabel.textContent = locationToggle.checked ? "Chế độ Thử nghiệm (Nhà thờ Đức Bà)" : "Sử dụng vị trí thực tế";


locationToggle.addEventListener('change', () => {
   useDynamicLocation = !locationToggle.checked;
   locationModeLabel.textContent = locationToggle.checked ? "Chế độ Thử nghiệm (Nhà thờ Đức Bà)" : "Sử dụng vị trí thực tế";
});


// --- HÀM 1: XỬ LÝ NÚT BẤM & LẤY VỊ TRÍ ---
function getAndSendLocation(isAlternative = false) {
   // 1. Cập nhật giao diện (Loading)
   if (isAlternative) {
      loadingStatus.textContent = "🔄 Đang tìm đường vòng tránh khu vực bị chặn...";
      altRouteBtn.disabled = true;
   } else {
      loadingStatus.textContent = "⏳ Chuẩn bị yêu cầu lộ trình...";
      getDirectionsBtn.disabled = true;
   }

   // 2. Kiểm tra chế độ (Tĩnh hay Động)
   if (!useDynamicLocation) {
      // Chế độ tĩnh: Gửi null để server tự lấy tọa độ mẫu
      fetchDirectionsFromServer(null, null, isAlternative);
      return;
   }

   // 3. Chế độ Động (GPS thực tế)
   if ("geolocation" in navigator) {
      if (!isAlternative) loadingStatus.textContent = "⏳ Đang lấy vị trí GPS hiện tại...";

      navigator.geolocation.getCurrentPosition(
         (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // Gửi yêu cầu với toạ độ thực tế
            fetchDirectionsFromServer(lat, lon, isAlternative);
         },
         (error) => {
            console.error(error);
            loadingStatus.textContent = "❌ Lỗi: Không thể lấy vị trí. Vui lòng bật GPS.";
            getDirectionsBtn.disabled = false;
            altRouteBtn.disabled = false;
         },
         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
   } else {
      directionsBox.textContent = "Trình duyệt của bạn không hỗ trợ định vị GPS.";
      getDirectionsBtn.disabled = false;
      altRouteBtn.disabled = false;
   }
}

// --- HÀM 2: GỬI API LÊN SERVER ---
async function fetchDirectionsFromServer(lat, lon, isAlternative) {
   if (!isAlternative) loadingStatus.textContent = "⏳ Đang gửi tọa độ và yêu cầu AI tạo lộ trình...";

   try {
      const res = await fetch("/get-dynamic-directions", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            current_lat: lat,
            current_lon: lon,
            start: START_KEY,
            end: END_KEY,
            alternative: isAlternative // Quan trọng: Gửi cờ tìm đường khác
         }),
      });

      const data = await res.json();

      if (data.success) {
         directionsBox.innerHTML = data.route_text.replace(/\n/g, '<br>');
         directionsBox.classList.add("show");

         if (isAlternative) {
            loadingStatus.textContent = `✅ Đã tìm thấy lộ trình thay thế!`;
         } else {
            loadingStatus.textContent = `🎉 Lộ trình đến ${DESTINATION_NAME} (${data.total_distance_km} km) đã sẵn sàng!`;
            // Chỉ hiện nút "Tìm đường khác" sau khi đã có lộ trình đầu tiên
            altRouteBtn.style.display = "inline-block";
         }

         mapLink.href = data.map_url;
         mapLink.style.display = 'inline-block';
         photoChallenge.style.display = 'block';

      } else {
         directionsBox.innerHTML = data.route_text;
         loadingStatus.textContent = "❌ Lỗi tạo lộ trình: " + data.message;
         // Nếu lỗi do địa điểm không hợp lệ, vẫn cho mở map
         mapLink.style.display = 'inline-block';
         mapLink.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DESTINATION_NAME)}`;
      }

   } catch (error) {
      console.error("Lỗi Fetch:", error);
      directionsBox.textContent = "❌ Lỗi kết nối Server. Vui lòng thử lại.";
      loadingStatus.textContent = "❌ Lỗi kết nối.";
   } finally {
      // Mở khóa nút bấm
      getDirectionsBtn.disabled = false;
      altRouteBtn.disabled = false;
   }
}

// --- GÁN SỰ KIỆN CHO NÚT BẤM ---
getDirectionsBtn.addEventListener("click", () => getAndSendLocation(false)); // Lộ trình thường
altRouteBtn.addEventListener("click", () => getAndSendLocation(true));       // Lộ trình thay thế

// --- 1. HÀM LOAD ĐIỂM KHI VÀO TRANG ---
async function loadUserScore() {
   try {
      const res = await fetch('/api/user');
      const data = await res.json();
      if (data.logged_in) {
         document.getElementById('user-points').textContent = data.points;
      } else {
         document.getElementById('score-display').style.display = 'none';
      }
   } catch (e) { console.error(e); }
}
window.addEventListener('load', loadUserScore);
async function openGoogleMap() {
   // ⚙️ Điểm bắt đầu và đích (bạn có thể đổi tuỳ nơi)
   const start = "Nhà thờ Đức Bà, 1 Công xã Paris, Quận 1, TP.HCM";
   const destination = "Bưu điện TP, 2 Công xã Paris, Quận 1, TP.HCM";

   // 🗺️ Tạo link Google Maps với mode = walking
   const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
   // Gọi API trừ điểm (-2 điểm)
   try {
      const res = await fetch('/api/update-score', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            points: -2,
            routeId: 'route1' // ID của lộ trình hiện tại
         })
      });
      const data = await res.json();

      if (data.success) {
         // Cập nhật điểm trên màn hình
         document.getElementById('user-points').textContent = data.new_points;

         // Hiệu ứng -2 bay xuống
         const anim = document.getElementById('point-anim');
         anim.textContent = "-2 Điểm (Xem Map)";
         anim.className = "point-animation anim-minus";

         // Reset animation để có thể chạy lại lần sau
         setTimeout(() => { anim.className = "point-animation"; }, 2000);
      } else {
         console.log(data.message); // "Lộ trình đã hoàn thành..."
      }
   } catch (e) {
      console.error("Lỗi cập nhật điểm:", e);
   } finally {
      // LUÔN LUÔN mở map dù trừ điểm thành công hay thất bại (để không chặn người dùng)
      window.open(url, "_blank");
   }
}
// 🎯 Tọa độ của điểm đến (ví dụ: Bưu điện Thành Phố)
const DEST_LAT = 10.779902;
const DEST_LON = 106.699156;

const distanceBox = document.getElementById("distanceProgress");

// Hàm tính khoảng cách giữa 2 tọa độ (mét)
function getDistance(lat1, lon1, lat2, lon2) {
   const R = 6371e3; // bán kính Trái Đất (m)
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

// 🔄 Hàm cập nhật tiến độ
function updateDistance() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
         (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const distance = getDistance(userLat, userLon, DEST_LAT, DEST_LON);
            const km = (distance / 1000).toFixed(2);

            if (distance < 50) {
               distanceBox.textContent = "🎉 Bạn đã đến điểm đến rồi!";
            } else {
               distanceBox.textContent = `📍 Cách điểm đến: ${km} km`;
            }
         },
         (error) => {
            distanceBox.textContent = "⚠️ Không thể xác định vị trí. Hãy bật GPS.";
         }
      );
   } else {
      distanceBox.textContent = "❌ Trình duyệt không hỗ trợ GPS.";
   }
}

// Gọi ngay và cập nhật mỗi 2 phút
updateDistance();
setInterval(updateDistance, 120000);

import express from "express";
import cors from "cors";
import session from "express-session";
import fs from "fs";

const app = express();
const PORT = 5000;
const DB_FILE = "database.txt"; // Dùng file text theo yêu cầu

// Cấu hình cơ bản
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.static(".")); // Cho phép load file html, css, ảnh

// Cấu hình Session (để nhớ ai đang đăng nhập)
app.use(
  session({
    secret: "bi_mat_khong_bat_mi",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, // Lưu đăng nhập 1 tiếng
  })
);

// --- HÀM XỬ LÝ DATABASE (FILE TXT) ---
// Đọc file text
const getDatabase = () => {
  if (!fs.existsSync(DB_FILE)) {
    // Nếu chưa có file thì tạo file rỗng có dấu []
    fs.writeFileSync(DB_FILE, "[]", "utf-8");
    return [];
  }
  const fileContent = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(fileContent || "[]"); // Chuyển chữ trong file text thành biến để xử lý
};

// Ghi đè vào file text
const saveDatabase = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
};

// --- CÁC CHỨC NĂNG (API) ---

// 1. Đăng nhập
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const users = getDatabase();
  
  // Tìm user trong danh sách
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    req.session.userEmail = user.email; // Chỉ lưu email vào session cho nhẹ
    res.json({ message: "Login OK", username: user.username });
  } else {
    res.status(401).json({ message: "Sai email hoặc mật khẩu!" });
  }
});

// 2. Đăng xuất
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Đã đăng xuất" });
});

// 3. Lấy thông tin User (để hiển thị lên Profile và check rương)
app.get("/api/user", (req, res) => {
  if (!req.session.userEmail) return res.json({ logged_in: false });

  const users = getDatabase();
  const currentUser = users.find((u) => u.email === req.session.userEmail);
  
  if (currentUser) {
      res.json({ logged_in: true, ...currentUser });
  } else {
      res.json({ logged_in: false });
  }
});

// 4. Xác nhận hoàn thành lộ trình (Gửi từ file ketthuclt1.html)
app.post("/api/complete-route", (req, res) => {
  if (!req.session.userEmail) return res.status(401).json({ message: "Chưa đăng nhập" });
  
  const { routeId } = req.body; // Ví dụ: route1
  const users = getDatabase();
  const index = users.findIndex(u => u.email === req.session.userEmail);

  if (index !== -1) {
    // Đánh dấu đã hoàn thành vào file txt
    if (!users[index].routes) users[index].routes = {};
    if (!users[index].routes[routeId]) users[index].routes[routeId] = {};
    
    users[index].routes[routeId].status = "completed";
    
    saveDatabase(users); // Lưu lại file
    res.json({ success: true });
  } else {
    res.status(404).json({ message: "Lỗi user" });
  }
});

// 5. Nhận thưởng mở rương (Gửi từ file lotrinh1.html)
app.post("/api/claim-reward", (req, res) => {
    if (!req.session.userEmail) return res.status(401).json({ message: "Chưa đăng nhập" });
    
    const { routeId, points } = req.body;
    const users = getDatabase();
    const index = users.findIndex(u => u.email === req.session.userEmail);
  
    if (index !== -1) {
      const userRoute = users[index].routes[routeId];
      
      // Logic: Phải xong lộ trình VÀ chưa nhận thưởng bao giờ
      if (userRoute && userRoute.status === "completed" && !userRoute.reward_claimed) {
          users[index].points += points; // Cộng điểm
          users[index].routes[routeId].reward_claimed = true; // Đánh dấu đã nhận
          
          saveDatabase(users); // Lưu file
          res.json({ success: true, newPoints: users[index].points });
      } else {
          res.status(400).json({ success: false, message: "Bạn đã nhận rồi hoặc chưa hoàn thành!" });
      }
    }
});

app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
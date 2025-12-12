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


// --- DỮ LIỆU ĐA NGÔN NGỮ (MOCK DATA) ---
// 1. Dữ liệu Fun Fact cho các hiện vật (Quiz)
const ARTIFACT_DATA = {
    // === BẢO TÀNG CHIẾN TÍCH (quiz_baotang.html) ===
    "uh1": {
        vi: "Trực thăng UH-1 Iroquois được mệnh danh là 'Huey', biểu tượng của kỵ binh bay Mỹ.",
        en: "The UH-1 Iroquois helicopter, nicknamed 'Huey', is an icon of US air cavalry."
    },
    "m48": {
        vi: "Xe tăng M48 Patton nặng 49 tấn, là xe tăng chiến đấu chủ lực của Mỹ trong chiến tranh.",
        en: "The 49-ton M48 Patton was the main battle tank of the US during the war."
    },
    "f5": {
        vi: "Máy bay tiêm kích F-5 Freedom Fighter có thể đạt tốc độ siêu âm Mach 1.6.",
        en: "The F-5 Freedom Fighter jet could reach a supersonic speed of Mach 1.6."
    },
    "guillotine": {
        vi: "Máy chém này từng được chính quyền Ngô Đình Diệm sử dụng khắp miền Nam.",
        en: "This guillotine was once used by the Ngo Dinh Diem administration throughout the South."
    },
    "tiger_cage": {
        vi: "Chuồng cọp là nơi giam giữ và tra tấn tù nhân chính trị tại Côn Đảo.",
        en: "Tiger Cages were used to detain and torture political prisoners in Con Dao."
    },
    "m107": {
        vi: "Pháo tự hành M107 175mm được mệnh danh là 'Vua chiến trường'.",
        en: "The M107 175mm self-propelled gun was nicknamed the 'King of Battle'."
    },
    "cbu55": {
        vi: "Bom CBU-55 là loại bom phát quang, hủy diệt sự sống bằng cách đốt cháy oxy.",
        en: "The CBU-55 is a fuel-air explosive bomb that destroys life by consuming oxygen."
    },
    "chinook": {
        vi: "CH-47 Chinook là trực thăng vận tải hạng nặng với hai cánh quạt nâng.",
        en: "The CH-47 Chinook is a heavy-lift transport helicopter with twin rotors."
    },
    "bulldozer": {
        vi: "Xe ủi đất quân sự dùng để san phẳng rừng và phá hủy làng mạc.",
        en: "Military bulldozers were used to flatten forests and destroy villages."
    },
    "peace_art": {
        vi: "Bức tranh 'Bồ câu trắng' thể hiện khát vọng hòa bình của trẻ em Việt Nam.",
        en: "The 'White Dove' painting represents the aspiration for peace of Vietnamese children."
    },

    // === DINH ĐỘC LẬP (quiz_dinhdoclap.html) ===
    "tank_390": {
        vi: "Xe tăng 390 là chiếc đầu tiên húc đổ cổng Dinh trưa ngày 30/4/1975.",
        en: "Tank 390 was the first to crash through the Palace gates at noon on April 30, 1975."
    },
    "fountain_dinh": {
        vi: "Đài phun nước giúp điều hòa không khí và tạo phong thủy tốt cho Dinh.",
        en: "The fountain helps condition the air and creates good Feng Shui for the Palace."
    },
    "stone_curtain": {
        vi: "Rèm hoa đá hình đốt trúc giúp lấy sáng và đón gió nhưng vẫn che chắn kín đáo.",
        en: "The bamboo-shaped stone curtain allows light and wind while ensuring privacy."
    },
    "cabinet_room": {
        vi: "Phòng họp nội các là nơi diễn ra các cuộc họp quan trọng của chính quyền cũ.",
        en: "The Cabinet Room was where important meetings of the former administration took place."
    },
    "banquet_hall": {
        vi: "Phòng khánh tiết có sức chứa 500 người, dùng để tổ chức các buổi chiêu đãi.",
        en: "The Banquet Hall has a capacity of 500 people, used for hosting receptions."
    },
    "mercedes_car": {
        vi: "Chiếc Mercedes 200 W110 này từng được Tổng thống Nguyễn Văn Thiệu sử dụng.",
        en: "This Mercedes 200 W110 was once used by President Nguyen Van Thieu."
    },
    "helicopter_roof": {
        vi: "Vị trí này lưu dấu vụ ném bom của phi công Nguyễn Thành Trung năm 1975.",
        en: "This spot marks the bombing by pilot Nguyen Thanh Trung in 1975."
    },

    // === NHÀ THỜ ĐỨC BÀ (quiz_nhathoducba.html) ===
    "mary_statue": {
        vi: "Tượng Đức Mẹ Hòa Bình được làm bằng đá cẩm thạch trắng từ Ý.",
        en: "The Statue of Our Lady of Peace is made of white marble from Italy."
    },
    "bell_towers": {
        vi: "Hai tháp chuông cao 57m, từng là công trình cao nhất Sài Gòn thế kỷ 19.",
        en: "The two 57m bell towers were once the tallest structures in 19th-century Saigon."
    },
    "rose_window": {
        vi: "Cửa sổ hoa hồng ở mặt tiền được ghép từ kính màu rực rỡ.",
        en: "The rose window on the facade is assembled from vibrant stained glass."
    },
    "red_brick": {
        vi: "Toàn bộ gạch đỏ xây nhà thờ được nhập khẩu trực tiếp từ Marseille, Pháp.",
        en: "All red bricks used for the cathedral were imported directly from Marseille, France."
    },
    "main_gate": {
        vi: "Cổng chính hướng về phía Công trường Công xã Paris.",
        en: "The main gate faces Paris Commune Square."
    },
    "scaffolding": {
        vi: "Dự án trùng tu Nhà thờ Đức Bà dự kiến hoàn thành vào năm 2027.",
        en: "The Notre-Dame Cathedral restoration project is expected to be completed in 2027."
    },

    // === BƯU ĐIỆN THÀNH PHỐ (quiz_buudientp.html) ===
    "clock_facade": {
        vi: "Chiếc đồng hồ lớn trên cổng chính đã hoạt động bền bỉ hơn 130 năm.",
        en: "The large clock above the main entrance has been ticking for over 130 years."
    },
    "arch_ceiling": {
        vi: "Hệ thống vòm sắt được thiết kế bởi Gustave Eiffel, cha đẻ tháp Eiffel.",
        en: "The iron arch system was designed by Gustave Eiffel, creator of the Eiffel Tower."
    },
    "uncle_ho_pic": {
        vi: "Bức chân dung Chủ tịch Hồ Chí Minh lớn được treo trang trọng ở cuối sảnh.",
        en: "A large portrait of President Ho Chi Minh hangs solemnly at the end of the hall."
    },
    "map_left": {
        vi: "Bản đồ 'Sài Gòn và vùng phụ cận năm 1892' vẽ tay tỉ mỉ.",
        en: "The hand-painted map 'Saigon and its surroundings in 1892'."
    },
    "map_right": {
        vi: "Bản đồ 'Đường dây điện báo Nam Kỳ và Campuchia năm 1936'.",
        en: "The map 'Telegraph lines of Southern Vietnam and Cambodia in 1936'."
    },
    "phone_booth": {
        vi: "Các buồng điện thoại gỗ chạm khắc tinh xảo mang phong cách cổ điển.",
        en: "Exquisitely carved wooden phone booths in classic style."
    },
    "souvenir_shop": {
        vi: "Nơi bày bán tem, bưu ảnh và quà lưu niệm đặc trưng của Việt Nam.",
        en: "Where stamps, postcards, and typical Vietnamese souvenirs are sold."
    },

    // === HỒ CON RÙA (quiz_hoconrua.html) ===
    "lotus_tower": {
        vi: "Tháp chính được thiết kế cách điệu hình bông hoa sen đang nở.",
        en: "The main tower is designed to resemble a blooming lotus flower."
    },
    "spiral_bridge": {
        vi: "Hệ thống cầu đi bộ xoắn ốc dẫn vào trung tâm hồ.",
        en: "Spiral pedestrian bridges leading to the center of the lake."
    },
    "fountain_pool": {
        vi: "Hồ nước hình bát giác, nơi người dân thường ngồi hóng mát.",
        en: "Octagonal water pool where locals often sit to enjoy the breeze."
    },
    "stone_bench": {
        vi: "Các ghế đá bao quanh hồ là điểm tụ tập nổi tiếng của giới trẻ Sài Gòn.",
        en: "Stone benches around the lake are a famous gathering spot for Saigon youth."
    },
    "top_symbol": {
        vi: "Trên đỉnh tháp từng có dự định đặt tượng nhưng chưa bao giờ thực hiện.",
        en: "There was a plan to place a statue on top, but it was never realized."
    },

    // === CHỢ BẾN THÀNH (quiz_chobenthanh.html) ===
    "clock_tower_bt": {
        vi: "Tháp đồng hồ 3 mặt ở Cửa Nam là biểu tượng không thể nhầm lẫn của Sài Gòn.",
        en: "The 3-faced clock tower at the South Gate is an unmistakable symbol of Saigon."
    },
    "ceramic_relief": {
        vi: "Các bức phù điêu gốm Biên Hòa mô tả đặc sản miền Nam như bò, cá, trái cây.",
        en: "Bien Hoa ceramic reliefs depicting Southern specialties like cows, fish, and fruits."
    },
    "south_gate_sign": {
        vi: "Cổng chính nhìn ra quảng trường Quách Thị Trang.",
        en: "The main gate overlooks Quach Thi Trang Square."
    },
    "north_gate_fruit": {
        vi: "Cửa Bắc chuyên bán các loại hoa quả tươi và thực phẩm.",
        en: "The North Gate specializes in fresh fruits and food."
    },
    "west_gate_shoes": {
        vi: "Cửa Tây là thiên đường của giày dép, đồ mỹ nghệ và áo dài.",
        en: "The West Gate is a paradise for shoes, handicrafts, and Ao Dai."
    },

    "default": {
        vi: "Bạn đã tìm đúng vị trí! Một khám phá tuyệt vời.",
        en: "You found the right spot! A great discovery."
    }
};

// 2. Dữ liệu Lộ trình (Directions)
const ROUTE_DATA = {
    // Từ Bảo tàng -> Dinh
    "bao_tang_chien_tich": {
        "dinh_doc_lap": {
            vi: "1. Rời bảo tàng, rẽ trái vào Võ Văn Tần.\n2. Đi thẳng đến ngã tư Nam Kỳ Khởi Nghĩa.\n3. Rẽ trái và đi khoảng 400m, Dinh Độc Lập nằm bên trái.",
            en: "1. Leave the museum, turn left onto Vo Van Tan.\n2. Go straight to Nam Ky Khoi Nghia intersection.\n3. Turn left and go 400m, Independence Palace is on the left."
        }
    },
    // Từ Dinh -> Nhà thờ
    "dinh_doc_lap": {
        "nha_tho_duc_ba": {
            vi: "1. Đi ra cổng chính Dinh, đi thẳng đại lộ Lê Duẩn.\n2. Băng qua công viên 30/4.\n3. Nhà thờ Đức Bà nằm ngay phía trước mặt bạn.",
            en: "1. Exit the Palace main gate, go straight on Le Duan Blvd.\n2. Cross April 30th Park.\n3. Notre-Dame Cathedral is right in front of you."
        }
    },
    // Từ Nhà thờ -> Bưu điện (Rất gần)
    "nha_tho_duc_ba": {
        "buu_dien_thanh_pho": {
            vi: "1. Từ tượng Đức Mẹ, nhìn sang bên tay phải.\n2. Tòa nhà màu vàng lớn chính là Bưu điện Thành phố.\n3. Chỉ mất 1 phút đi bộ.",
            en: "1. From the Virgin Mary statue, look to your right.\n2. The large yellow building is the Central Post Office.\n3. Just a 1-minute walk."
        }
    },
    // Từ Bưu điện -> Hồ Con Rùa
    "buu_dien_thanh_pho": {
        "ho_con_rua": {
            vi: "1. Đi dọc theo đường Công xã Paris hướng về đường Phạm Ngọc Thạch.\n2. Đi thẳng Phạm Ngọc Thạch khoảng 300m.\n3. Bạn sẽ thấy vòng xoay Hồ Con Rùa.",
            en: "1. Walk along Paris Commune St towards Pham Ngoc Thach St.\n2. Go straight on Pham Ngoc Thach for 300m.\n3. You will see the Turtle Lake roundabout."
        }
    },
    // Từ Hồ Con Rùa -> Chợ Bến Thành
    "ho_con_rua": {
        "cho_ben_thanh": {
            vi: "1. Đi vào đường Võ Văn Tần hướng về Quận 1.\n2. Rẽ trái tại Nam Kỳ Khởi Nghĩa.\n3. Rẽ phải vào Lê Lợi, đi thẳng đến vòng xoay Quách Thị Trang.",
            en: "1. Take Vo Van Tan St towards District 1.\n2. Turn left at Nam Ky Khoi Nghia.\n3. Turn right onto Le Loi, go straight to Quach Thi Trang roundabout."
        }
    }
};


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
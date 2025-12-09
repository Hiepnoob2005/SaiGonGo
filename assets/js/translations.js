/**
 * SaiGonGo - Translations / Bản dịch đa ngôn ngữ
 * Hỗ trợ: Tiếng Việt (vi) và English (en)
 * 
 */

const translations = {
    // ===== TIẾNG VIỆT =====
    vi: {
        // === Navigation ===
        nav_home: "Trang chủ",
        nav_create_route: "Tạo lộ trình",
        nav_about: "Về chúng tôi",
        nav_tours: "Tour",
        nav_destinations: "Điểm đến",
        nav_blog: "Blog",
        nav_contact: "Liên hệ",
        nav_login: "Đăng nhập",
        nav_logout: "Đăng xuất",
        
        // === Hero Section (index.html) ===
        hero_subtitle: "Hành trình của chúng tôi đến",
        hero_title: "Khám phá TPHCM theo cách khác biệt",
        hero_text: "Tôi đi du lịch không phải để đến đâu, mà là để đi. Tôi đi du lịch vì chính việc đi - điều tuyệt vời nhất là được di chuyển.",
        btn_contact: "Liên hệ",
        btn_learn_more: "Tìm hiểu thêm",
        
        // === Destinations Section ===
        dest_subtitle: "Điểm đến",
        dest_title: "Chọn Địa Điểm Của Bạn",
        dest_6_destinations: "6 điểm đến",
        dest_route_1: "Lộ trình 1",
        dest_route_2: "Lộ trình 2",
        dest_ward: "Phường",
        dest_cho_lon: "Chợ Lớn",
        dest_xuan_hoa: "Xuân Hoà",
        dest_xom_chieu: "Xóm Chiếu",
        
        // === Popular Tours Section ===
        popular_subtitle: "Tour nổi bật",
        popular_title: "Các Tour Phổ Biến Nhất",
        popular_days: "ngày",
        popular_from: "Từ",
        popular_card_text: "Người lữ hành giỏi không có kế hoạch cố định và không cố đến đích.",
        
        // === About Section ===
        about_subtitle: "Về chúng tôi",
        about_title: "Khám phá tất cả tour trên thế giới cùng chúng tôi.",
        about_text: "Lorem Ipsum có sẵn, nhưng phần lớn đã bị thay đổi ở một số dạng, bằng cách thêm chút hài hước, hoặc những từ ngẫu nhiên trông không có vẻ đáng tin.",
        about_tour_guide: "Hướng dẫn viên",
        about_tour_guide_text: "Lorem Ipsum có sẵn, nhưng phần lớn đã bị thay đổi ở một số dạng.",
        about_friendly_price: "Giá cả hợp lý",
        about_friendly_price_text: "Lorem Ipsum có sẵn, nhưng phần lớn đã bị thay đổi ở một số dạng.",
        about_reliable_tour: "Tour đáng tin cậy",
        about_reliable_tour_text: "Lorem Ipsum có sẵn, nhưng phần lớn đã bị thay đổi ở một số dạng.",
        btn_booking: "Đặt ngay",
        
        // === Blog Section ===
        blog_subtitle: "Từ Blog",
        blog_title: "Tin tức & Bài viết mới nhất",
        blog_admin: "Quản trị viên",
        blog_read_more: "Đọc thêm",
        
        // === Footer ===
        footer_top_dest: "Điểm đến hàng đầu",
        footer_categories: "Danh mục",
        footer_quick_links: "Liên kết nhanh",
        footer_newsletter: "Nhận bản tin",
        footer_newsletter_text: "Để nhận những ưu đãi và mẹo mới nhất, hãy đăng ký ngay",
        footer_email_placeholder: "Địa chỉ email",
        footer_subscribe: "Đăng ký",
        footer_copyright: "Bảo lưu mọi quyền",
        footer_dest_jakarta: "Indonesia, Jakarta",
        footer_dest_maldives: "Maldives, Malé",
        footer_dest_australia: "Australia, Canberra",
        footer_dest_thailand: "Thailand, Bangkok",
        footer_dest_morocco: "Morocco, Rabat",
        footer_cat_travel: "Du lịch",
        footer_cat_lifestyle: "Phong cách sống",
        footer_cat_fashion: "Thời trang",
        footer_cat_education: "Giáo dục",
        footer_cat_food: "Ẩm thực",
        footer_about: "Giới thiệu",
        footer_contact: "Liên hệ",
        footer_tours: "Tour",
        footer_booking: "Đặt chỗ",
        footer_terms: "Điều khoản & Điều kiện",
        
        // === Language Selector ===
        lang_select: "Chọn ngôn ngữ",
        
        // === Common / Buttons ===
        btn_back: "← Quay lại",
        btn_back_home: "← Quay lại trang chính",
        btn_continue: "Tiếp tục",
        btn_start: "🚀 Bắt đầu",
        btn_next: "Tiếp theo →",
        btn_verify: "Xác thực hình ảnh",
        btn_request_route: "✅ Yêu cầu Lộ trình GPS",
        btn_alt_route: "⚠️ Nếu đường bị chặn. Tìm lối khác",
        btn_open_map: "🗺️ Mở Map Trợ giúp",
        btn_take_photo: "📸 Chụp ảnh ngay",
        btn_close: "Đóng",
        btn_report_missing: "⚠️ Tôi không tìm thấy (Báo cáo)",
        btn_retry: "Thử lại",
        btn_great: "Tuyệt vời!",
        btn_exchange_voucher: "🛍️ Đổi Voucher",
        
        // === Loading & Status ===
        status_loading: "Đang tải...",
        status_locating: "📡 Đang xác định vị trí...",
        status_processing: "⏳ Đang xử lý...",
        status_sending: "⏳ Đang gửi hình ảnh để AI xử lý...",
        status_success: "✅ Thành công!",
        status_error: "❌ Lỗi",
        status_gps_error: "❌ Không thể lấy vị trí GPS.",
        status_connection_error: "❌ Lỗi kết nối với server.",
        
        // === Points & Score ===
        score_current: "Điểm hiện tại",
        score_highest: "Điểm cao nhất",
        score_xp: "XP",
        score_points: "Điểm",
        score_plus_verify: "+5 Điểm (Xác thực)",
        score_minus_map: "-2 Điểm (Xem Map)",
        
        // === lotrinh1.html - Route 1 Page ===
        route1_title: "Lộ trình 1",
        route1_intro_title: "Giới thiệu sơ lược về lộ trình 1",
        route1_intro_text: "Lộ trình sẽ xuất phát từ <b>Bảo tàng Chiến tích Chiến tranh</b> tại số <b>28 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh</b>. Lần lượt đi qua các địa điểm nổi bật trong thành phố như <b>Dinh Độc Lập</b>, <b>Công viên 30/4</b>, <b>Nhà thờ Đức Bà</b>, <b>Bưu điện Thành phố</b>, <b>Đường sách Nguyễn Văn Bình</b>, <b>Hồ con rùa</b>. Từ đó, giúp du khách khám phá lịch sử, văn hóa và kiến trúc độc đáo của Sài Gòn.",
        route1_next_dest_title: "Những địa điểm tiếp theo trong lộ trình",
        route1_start_point: "Điểm xuất phát",
        route1_ranking: "Xếp hạng",
        route1_support: "📞 Hỗ trợ",
        route1_toast_default: "Đây là thông báo của bạn!",
        route1_chest_locked: "🔒 Hãy hoàn thành hết các địa điểm để mở khóa rương!",
        route1_chest_claimed: "Bạn đã nhận quà của lộ trình này rồi!",
        route1_chest_reward: "🎉 Xuất sắc! Bạn nhận được 50 XP!",
        
        // === Destination Names ===
        dest_museum: "Bảo tàng Chiến tích Chiến tranh",
        dest_museum_short: "Bảo tàng CTCT",
        dest_palace: "Dinh Độc Lập",
        dest_park: "Công viên 30/4",
        dest_cathedral: "Nhà thờ Đức Bà",
        dest_post_office: "Bưu điện Thành phố",
        dest_book_street: "Đường sách Nguyễn Văn Bình",
        dest_turtle_lake: "Hồ Con Rùa",
        
        // === Addresses ===
        addr_museum: "28 Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh",
        addr_palace: "135 Nam Kỳ Khởi Nghĩa, Quận 1, TP. Hồ Chí Minh",
        addr_cathedral: "01 Công xã Paris, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        addr_post_office: "02 Công xã Paris, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        addr_turtle_lake: "Hồ Con Rùa, Phường 6, Quận 3, TP. Hồ Chí Minh",
        
        // === batdau1.html - Starting Point Page ===
        start_title: "Điểm xuất phát",
        start_instruction: "Bạn hãy đến đây để bắt đầu hành trình.",
        start_view_map: "🗺️ Xem bản đồ",
        start_checking_location: "Đang xác định vị trí...",
        start_dev_mode: "🔧 Kiểm tra vị trí đang tắt (chế độ thử nghiệm).",
        start_arrived: "🎉 Bạn đã ở điểm xuất phát!",
        start_distance: "📍 Cách điểm xuất phát khoảng {distance} mét",
        start_gps_error: "❌ Không thể lấy vị trí. Hãy bật GPS hoặc cho phép truy cập vị trí.",
        start_browser_error: "⚠️ Trình duyệt không hỗ trợ định vị GPS.",
        
        // === baotang.html - Museum Verification Page ===
        museum_verify_title: "📍 Xác thực điểm đến",
        museum_verify_step1: "Bước 1: Hãy di chuyển đến <b>Bảo tàng chiến tích chiến tranh</b> (< 100m) để mở khóa camera.",
        museum_dev_mode: "🛠️ Chế độ Nhà phát triển",
        museum_dev_mode_desc: "Đã bỏ qua kiểm tra GPS. Camera đã mở!",
        museum_camera_unlocked: "✅ Bạn đang ở cách điểm đến <b>{distance}m</b>. Đã mở khóa camera!",
        museum_too_far: "⚠️ Bạn đang cách điểm đến <b>{distance} km</b>. Hãy đến gần hơn 100m.",
        museum_camera_locked: "🔒 Camera bị khóa. Bạn cần đến gần điểm đến.",
        museum_verify_success: "✅ <b>Xác thực thành công! Bạn đã nhận điểm.</b>",
        museum_verify_wrong: "❌ Hình ảnh không khớp. Vui lòng thử lại.",
        museum_info_title: "Thông tin địa điểm",
        museum_info_text: "Bảo tàng Chiến tích Chiến tranh nằm tại <b>28 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh</b>, là một trong những điểm đến lịch sử nổi tiếng nhất của Việt Nam. Nơi đây lưu giữ hơn <b>20.000 hiện vật và hình ảnh tư liệu quý giá</b>, phản ánh chân thực về cuộc chiến tranh, nỗi đau mất mát và khát vọng hòa bình của dân tộc.",
        museum_next_btn: "Đến địa điểm tiếp theo →",
        
        // === quiz_baotang.html - Museum Quiz Page ===
        quiz_title: "🔍 Spot the Detail",
        quiz_subtitle: "Tìm và chụp ít nhất <b>3 hiện vật</b> bên dưới để hoàn thành nhiệm vụ!",
        quiz_progress: "{count}/3 Hoàn thành",
        quiz_complete_title: "🎉 Chúc mừng! Bạn đã hoàn thành thử thách.",
        quiz_complete_text: "Bạn đã nhận được điểm thưởng cho sự quan sát tinh tế.",
        quiz_continue_btn: "Tiếp tục hành trình →",
        quiz_analyzing: "AI đang phân tích ảnh...",
        quiz_checking_scene: "AI đang kiểm tra hiện trường...",
        quiz_correct: "✅ Chính xác!",
        quiz_fun_fact: "Thông tin thú vị:",
        quiz_skipped: "⚠️ Đã xác nhận thiếu.",
        quiz_wrong: "❌ Chưa đúng.",
        quiz_connection_error: "❌ Lỗi kết nối server.",
        quiz_report_confirm: "Bạn chắc chắn hiện vật này không còn ở vị trí đó? Hãy chụp ảnh vị trí TRỐNG để AI kiểm tra.",
        
        // === Museum Artifacts (quiz_baotang.html) ===
        artifact_uh1: "Trực thăng UH-1",
        artifact_uh1_hint: "Nằm ở sân trước, bên trái cổng vào.",
        artifact_m48: "Xe tăng M48",
        artifact_m48_hint: "Xe tăng lớn nhất ở sân trưng bày.",
        artifact_f5: "Máy bay F-5",
        artifact_f5_hint: "Máy bay phản lực mũi nhọn, cánh xuôi.",
        artifact_guillotine: "Máy chém",
        artifact_guillotine_hint: "Khu trưng bày tội ác chiến tranh.",
        artifact_tiger_cage: "Chuồng cọp",
        artifact_tiger_cage_hint: "Khu mô phỏng nhà tù Côn Đảo.",
        artifact_m107: "Pháo M107",
        artifact_m107_hint: "Khẩu pháo có nòng cực dài.",
        artifact_cbu55: "Bom CBU-55",
        artifact_cbu55_hint: "Quả bom to, dựng đứng.",
        artifact_chinook: "CH-47 Chinook",
        artifact_chinook_hint: "Trực thăng 2 cánh quạt khổng lồ.",
        artifact_bulldozer: "Xe ủi đất",
        artifact_bulldozer_hint: "Xe màu vàng/xanh dùng phá rừng.",
        artifact_peace_art: "Tranh Bồ Câu",
        artifact_peace_art_hint: "Khu vực tranh thiếu nhi hoặc tường hòa bình.",
        
        // === ltdinhdoclap.html - Route to Independence Palace ===
        lt_palace_title: "Điểm đến Tiếp theo: Dinh Độc Lập",
        lt_locating: "📍 Đang xác định vị trí...",
        lt_distance: "📍 Cách điểm đến: {distance} km",
        lt_arrived: "🎉 Bạn đã đến điểm đến rồi!",
        lt_gps_error: "⚠️ Không thể xác định vị trí. Hãy bật GPS.",
        lt_browser_error: "❌ Trình duyệt không hỗ trợ GPS.",
        lt_use_real_location: "Sử dụng vị trí thực tế",
        lt_test_mode: "Chế độ Thử nghiệm (Bảo tàng)",
        lt_route_placeholder: "Lộ trình sẽ xuất hiện ở đây sau khi bạn nhấn nút Yêu cầu Lộ trình.",
        lt_getting_gps: "⏳ Đang lấy vị trí GPS hiện tại...",
        lt_creating_route: "⏳ Đang gửi tọa độ và yêu cầu AI tạo lộ trình...",
        lt_route_ready: "🎉 Lộ trình đến {destination} ({distance} km) đã sẵn sàng!",
        lt_alt_route_found: "✅ Đã tìm thấy lộ trình thay thế!",
        lt_route_error: "❌ Lỗi tạo lộ trình: ",
        lt_connection_error: "❌ Lỗi kết nối Server. Vui lòng thử lại.",
        
        // === dinhdoclap.html - Independence Palace Verification ===
        palace_verify_title: "📍 Xác thực điểm đến",
        palace_verify_step1: "Bước 1: Hãy di chuyển đến <b>Dinh Độc Lập</b> (< 100m) để mở khóa camera.",
        palace_info_text: "Dinh Độc Lập là một công trình kiến trúc nổi tiếng tại TP. Hồ Chí Minh, từng là nơi làm việc của Tổng thống Việt Nam Cộng hòa. Ngày 30/4/1975, xe tăng quân Giải phóng đã húc đổ cổng dinh, đánh dấu sự kết thúc của chiến tranh Việt Nam.",
        
        // === Bổ sung cho quiz_dinhdoclap.html ===
        quiz_palace_title: "🏰 Spot the Detail: Dinh Độc Lập",
        quiz_palace_subtitle: "Tìm và chụp ít nhất <b>3 hiện vật</b> để hoàn thành nhiệm vụ!",
        quiz_continue_cathedral: "Tiếp tục: Nhà thờ Đức Bà →",
        
        artifact_tank_390: "Xe tăng 390/843",
        artifact_tank_390_hint: "Nằm ở bãi cỏ bên trái sân trước.",
        artifact_fountain_dinh: "Đài phun nước",
        artifact_fountain_dinh_hint: "Ngay chính giữa sân trước Dinh.",
        artifact_stone_curtain: "Rèm hoa đá",
        artifact_stone_curtain_hint: "Các đốt trúc bê tông ở mặt tiền lầu 2.",
        artifact_cabinet_room: "Phòng họp nội các",
        artifact_cabinet_room_hint: "Phòng có bàn bầu dục và ghế xanh.",
        artifact_banquet_hall: "Phòng khánh tiết",
        artifact_banquet_hall_hint: "Phòng lớn nhất dùng để tiếp khách.",
        artifact_mercedes_car: "Xe Mercedes cổ",
        artifact_mercedes_car_hint: "Trưng bày dưới tầng hầm.",
        artifact_helicopter_roof: "Trực thăng",
        artifact_helicopter_roof_hint: "Trên nóc (nhìn từ xa hoặc mô hình).",

        // === nhathoducba.html - Notre-Dame Cathedral Verification ===
        cathedral_verify_title: "📍 Xác thực điểm đến",
        cathedral_verify_step1: "Bước 1: Hãy di chuyển đến <b>Nhà thờ Đức Bà</b> (< 100m) để mở khóa camera.",
        cathedral_info_text: "Nhà thờ Đức Bà Sài Gòn, hay còn gọi là Vương cung thánh đường Chính tòa Đức Mẹ Vô nhiễm Nguyên tội, được xây dựng từ năm 1863-1880 theo phong cách kiến trúc Roman và Gothic. Đây là một trong những công trình kiến trúc tiêu biểu của Sài Gòn.",
        // === Bổ sung cho nhathoducba.html & ltnhathoducba.html ===
        cathedral_intro_title: "🏛️ Giới thiệu về Nhà thờ Đức Bà",
        lt_cathedral_title: "Điểm đến Tiếp theo: Nhà thờ Đức Bà",
        lt_test_mode_cathedral: "Chế độ Thử nghiệm (Nhà thờ Đức Bà)",

        // === Quiz Nhà thờ Đức Bà ===
        quiz_cathedral_title: "⛪ Spot the Detail: Nhà thờ Đức Bà",
        quiz_cathedral_subtitle: "Tìm <b>3 chi tiết</b> kiến trúc độc đáo. Nếu đang sửa chữa, hãy dùng nút \"Báo cáo\"!",
        quiz_continue_post: "Tiếp tục: Bưu điện TP →",

        artifact_mary_statue: "Tượng Đức Mẹ",
        artifact_mary_statue_hint: "Đứng trên quả địa cầu ở công viên trước nhà thờ.",
        artifact_bell_towers: "Hai tháp chuông",
        artifact_bell_towers_hint: "Đỉnh cao nhất của nhà thờ (nhìn từ xa).",
        artifact_rose_window: "Cửa sổ hoa hồng",
        artifact_rose_window_hint: "Cửa sổ tròn lớn ở mặt tiền (giữa 2 tháp).",
        artifact_red_brick: "Tường gạch đỏ",
        artifact_red_brick_hint: "Loại gạch trần đặc trưng từ Marseille.",
        artifact_main_gate: "Cổng chính",
        artifact_main_gate_hint: "Cổng vòm lớn hướng ra công viên.",
        artifact_scaffolding: "Giàn giáo (Tu sửa)",
        artifact_scaffolding_hint: "Chụp phần công trình đang được che chắn.",

        // === buudientp.html - Central Post Office Verification ===
        post_verify_title: "📍 Xác thực điểm đến",
        post_verify_step1: "Bước 1: Hãy di chuyển đến <b>Bưu điện Thành phố</b> (< 100m) để mở khóa camera.",
        post_info_text: "Bưu điện Trung tâm Sài Gòn được xây dựng trong khoảng 1886-1891 theo thiết kế của kiến trúc sư người Pháp Gustave Eiffel. Đây là một trong những công trình kiến trúc lâu đời và đẹp nhất tại Việt Nam.",
        // === Bưu điện Thành phố ===
        lt_post_title: "Lộ trình đến Bưu điện Thành Phố",
        lt_test_mode_post: "Chế độ Thử nghiệm (Bưu điện)",
        
        post_info_title: "🏛️ Giới thiệu về Bưu điện Thành phố",
        post_info_text: "<b>Bưu điện Trung tâm Thành phố</b> nằm tại Số 2, Công xã Paris, Quận 1... là kiệt tác kết hợp kiến trúc Gothic, Phục hưng và Pháp, xây dựng từ 1886-1891.",
        
        quiz_post_title: "📮 Spot the Detail: Bưu điện TP",
        quiz_post_subtitle: "Tìm <b>3 chi tiết</b> lịch sử bên trong tòa nhà bưu điện cổ kính.",
        quiz_post_complete: "🎉 Nhiệm vụ hoàn tất!",
        quiz_post_complete_text: "Bạn đã có một đôi mắt quan sát tuyệt vời.",
        quiz_continue_turtle: "Tiếp tục: Hồ Con Rùa →",

        artifact_clock_facade: "Đồng hồ mặt tiền",
        artifact_clock_facade_hint: "Nằm ngay phía trên cổng chính.",
        artifact_arch_ceiling: "Vòm trần xanh",
        artifact_arch_ceiling_hint: "Kiến trúc vòm sắt đặc trưng bên trong.",
        artifact_uncle_ho_pic: "Ảnh Bác Hồ",
        artifact_uncle_ho_pic_hint: "Treo trang trọng ở bức tường cuối sảnh.",
        artifact_map_left: "Bản đồ Sài Gòn",
        artifact_map_left_hint: "Bản đồ cổ vẽ trên tường bên trái.",
        artifact_map_right: "Bản đồ Điện báo",
        artifact_map_right_hint: "Bản đồ cổ vẽ trên tường bên phải.",
        artifact_phone_booth: "Buồng điện thoại",
        artifact_phone_booth_hint: "Các buồng gỗ dọc hai bên lối vào.",
        artifact_souvenir_shop: "Quầy lưu niệm",
        artifact_souvenir_shop_hint: "Khu vực bán hàng ở giữa sảnh.",

        // === hoconrua.html - Turtle Lake Verification ===
        turtle_verify_title: "📍 Xác thực điểm đến",
        turtle_verify_step1: "Bước 1: Hãy di chuyển đến <b>Hồ Con Rùa</b> (< 100m) để mở khóa camera.",
        turtle_info_text: "Hồ Con Rùa là một công viên nhỏ nằm ở giao lộ Phạm Ngọc Thạch và Võ Văn Tần, Quận 3. Tên gọi xuất phát từ bức tượng rùa đội bia đá từng đặt ở đây. Ngày nay, đây là địa điểm yêu thích của giới trẻ Sài Gòn.",
        
        // === ketthuclt1.html - Route 1 Completion ===
        complete_title: "🎉 Chúc mừng!",
        complete_subtitle: "Bạn đã hoàn thành Lộ trình 1",
        complete_summary: "Bạn đã khám phá thành công các địa điểm lịch sử và văn hóa nổi tiếng của Sài Gòn.",
        complete_reward: "Phần thưởng của bạn",
        complete_total_points: "Tổng điểm đạt được:",
        complete_btn_home: "Về trang chủ",
        complete_btn_route2: "Tiếp tục Lộ trình 2",
        complete_share: "Chia sẻ thành tích",
        
        // === Dev Mode Toggle ===
        dev_mode_label: "Chế độ Nhà phát triển",
        dev_mode_on: "Bật",
        dev_mode_off: "Tắt",
        
        // === Common Phrases ===
        greeting_prefix: "Chào,",
        distance_meters: "mét",
        distance_km: "km",
        time_minutes: "phút",
        time_hours: "giờ",

        // === Quiz Pages - Other Locations ===
        quiz_palace_title: "🏰 Spot the Detail: Dinh Độc Lập",
        quiz_palace_subtitle: "Tìm và chụp ít nhất <b>3 hiện vật</b> để hoàn thành nhiệm vụ!",
        quiz_cathedral_title: "⛪ Spot the Detail: Nhà thờ Đức Bà",
        quiz_cathedral_subtitle: "Tìm <b>3 chi tiết</b> kiến trúc độc đáo. Nếu đang sửa chữa, hãy dùng nút \"Báo cáo\"!",
        quiz_post_title: "📮 Spot the Detail: Bưu điện TP",
        quiz_post_subtitle: "Tìm <b>3 chi tiết</b> lịch sử bên trong tòa nhà bưu điện cổ kính.",
        quiz_post_complete: "🎉 Nhiệm vụ hoàn tất!",
        quiz_post_complete_text: "Bạn đã có một đôi mắt quan sát tuyệt vời.",
        quiz_continue_palace: "Tiếp tục: Dinh Độc Lập →",
        quiz_continue_cathedral: "Tiếp tục: Nhà thờ Đức Bà →",
        quiz_continue_post: "Tiếp tục: Bưu điện TP →",
        quiz_continue_turtle: "Tiếp tục: Hồ Con Rùa →",
        btn_report_renovation: "⚠️ Tôi không tìm thấy (Do trùng tu)",
        
        // === Route Pages - Other Locations ===
        lt_cathedral_title: "Điểm đến Tiếp theo: Nhà thờ Đức Bà",
        lt_post_title: "Điểm đến Tiếp theo: Bưu điện Thành phố",
        lt_turtle_title: "Điểm đến Tiếp theo: Hồ Con Rùa",
        lt_test_mode_museum: "Chế độ Thử nghiệm (Bảo tàng)",
        lt_test_mode_palace: "Chế độ Thử nghiệm (Dinh Độc Lập)",
        lt_test_mode_cathedral: "Chế độ Thử nghiệm (Nhà thờ Đức Bà)",
        lt_test_mode_post: "Chế độ Thử nghiệm (Bưu điện)",
        lt_directions_placeholder: "Lộ trình sẽ xuất hiện ở đây sau khi bạn nhấn nút Yêu cầu Lộ trình.",
        lt_skip_to_next: "Bỏ qua đến điểm đến →",
        
        // === Verify page common ===
        verify_title: "📍 Xác thực điểm đến",
        
        // === Tags ===
        tag_restaurant: "Nhà hàng",
        tag_drink: "Đồ uống",
        tag_play: "Vui chơi",
        
        // === ketthuclt1.html - Additional ===
        complete_album_title: "📸 Nhật ký hành trình của bạn",
        complete_album_desc: "Những khoảnh khắc bạn đã ghi lại trên đường đi.",
        complete_album_empty: "Chưa có hình ảnh nào được lưu.",
        complete_btn_reset: "🗑️ Xóa nhật ký & Đi lại từ đầu",
        complete_btn_chest: "🔙 Quay lại mở Rương kho báu",
        complete_status_updating: "Đang cập nhật kết quả hành trình...",
        complete_status_success: "✅ Đã ghi nhận hoàn thành! Hãy quay lại để nhận quà.",
        complete_status_done: "✅ Bạn đã hoàn thành lộ trình này rồi.",
        complete_status_not_login: "⚠️ Bạn chưa đăng nhập. Kết quả không được lưu.",
        complete_status_error: "⚠️ Có lỗi kết nối server.",
        complete_suggest_title: "Gợi ý địa điểm gần đây",
        complete_reset_confirm: "Bạn có chắc muốn xóa toàn bộ ảnh và đi lại từ đầu không?",
        complete_reset_success: "Đã xóa dữ liệu thành công!",
        
        // Kho báu
        chest_closed: "Rương kho báu đang đóng",

        // === quiz_hoconrua ===
        quiz_title_hoconrua: "Truy tìm hiện vật - Hồ Con Rùa",
        tour_complete_title: "🏆 CHÚC MỪNG HOÀN THÀNH TOUR!",
        tour_complete_text: "Bạn đã chinh phục tất cả các địa điểm nổi tiếng.",
        btn_finish_tour: "Về trang chủ 🏠",
        tour_complete_alert: "Chúc mừng bạn đã hoàn thành tour Sài Gòn! Số điểm của bạn đã được lưu.",

        artifact_lotus_tower: "Tháp Hoa Sen",
        artifact_lotus_tower_hint: "Cột bê tông xòe ra như bông hoa ở chính giữa.",
        
        artifact_spiral_bridge: "Cầu xoắn ốc",
        artifact_spiral_bridge_hint: "Các lối đi cong dẫn vào trung tâm hồ.",
        
        artifact_fountain_pool: "Hồ nước trung tâm",
        artifact_fountain_pool_hint: "Khu vực chứa nước bao quanh tháp.",
        
        artifact_stone_bench: "Ghế đá vòng cung",
        artifact_stone_bench_hint: "Khu vực ngồi hóng mát xung quanh hồ.",
        
        artifact_top_symbol: "Đỉnh tháp",
        artifact_top_symbol_hint: "Phần cao nhất của bông hoa bê tông.",

        // === quiz_chobenthanh ===
        quiz_title_chobenthanh: "Truy tìm hiện vật - Chợ Bến Thành",
        
        artifact_clock_tower_bt: "Tháp Đồng Hồ",
        artifact_clock_tower_bt_hint: "Biểu tượng 3 mặt đồng hồ nổi tiếng ở cửa Nam.",
        
        artifact_ceramic_relief: "Phù điêu gốm",
        artifact_ceramic_relief_hint: "Tìm các bức tranh gốm (bò, cá, nải chuối) gắn phía trên các cửa.",
        
        artifact_south_gate_sign: "Biển hiệu Cửa Nam",
        artifact_south_gate_sign_hint: "Dòng chữ lớn 'CHỢ BẾN THÀNH' ngay dưới tháp đồng hồ.",
        
        artifact_north_gate_fruit: "Cửa Bắc (Hoa quả)",
        artifact_north_gate_fruit_hint: "Cổng đường Lê Thánh Tôn, nơi bán nhiều trái cây, hoa tươi.",
        
        artifact_west_gate_shoes: "Cửa Tây (Giày dép)",
        artifact_west_gate_shoes_hint: "Cổng đường Phan Chu Trinh, bán giày dép và đồ lưu niệm."
    },
    
    // ===== ENGLISH =====
    en: {
        // === Navigation ===
        nav_home: "Home",
        nav_create_route: "Create route",
        nav_about: "About Us",
        nav_tours: "Tours",
        nav_destinations: "Destinations",
        nav_blog: "Blog",
        nav_contact: "Contact Us",
        nav_login: "Login",
        nav_logout: "Logout",
        
        // === Hero Section (index.html) ===
        hero_subtitle: "Our journey to",
        hero_title: "Explore HCMC in a different way",
        hero_text: "I travel not to go anywhere, but to go. I travel for travel's sake the great affair is to move.",
        btn_contact: "Contact Us",
        btn_learn_more: "Learn More",
        
        // === Destinations Section ===
        dest_subtitle: "Destinations",
        dest_title: "Choose Your Place",
        dest_6_destinations: "6 destinations",
        dest_route_1: "Route 1",
        dest_route_2: "Route 2",
        dest_ward: "Ward",
        dest_cho_lon: "Cho Lon",
        dest_xuan_hoa: "Xuan Hoa",
        dest_xom_chieu: "Xom Chieu",
        
        // === Popular Tours Section ===
        popular_subtitle: "Featured Tours",
        popular_title: "Most Popular Tours",
        popular_days: "Days",
        popular_from: "From",
        popular_card_text: "A good traveler has no fixed plans and is not intent on arriving.",
        
        // === About Section ===
        about_subtitle: "About Us",
        about_title: "Explore all tour of the world with us.",
        about_text: "Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
        about_tour_guide: "Tour guide",
        about_tour_guide_text: "Lorem Ipsum available, but the majority have suffered alteration in some.",
        about_friendly_price: "Friendly price",
        about_friendly_price_text: "Lorem Ipsum available, but the majority have suffered alteration in some.",
        about_reliable_tour: "Reliable tour",
        about_reliable_tour_text: "Lorem Ipsum available, but the majority have suffered alteration in some.",
        btn_booking: "Booking Now",
        
        // === Blog Section ===
        blog_subtitle: "From The Blog Post",
        blog_title: "Latest News & Articles",
        blog_admin: "Admin",
        blog_read_more: "Read More",
        
        // === Footer ===
        footer_top_dest: "Top destination",
        footer_categories: "Categories",
        footer_quick_links: "Quick links",
        footer_newsletter: "Get a newsletter",
        footer_newsletter_text: "For the latest deals and tips, travel no further than your inbox",
        footer_email_placeholder: "Email address",
        footer_subscribe: "Subscribe",
        footer_copyright: "All Rights Reserved",
        footer_dest_jakarta: "Indonesia, Jakarta",
        footer_dest_maldives: "Maldives, Malé",
        footer_dest_australia: "Australia, Canberra",
        footer_dest_thailand: "Thailand, Bangkok",
        footer_dest_morocco: "Morocco, Rabat",
        footer_cat_travel: "Travel",
        footer_cat_lifestyle: "Lifestyle",
        footer_cat_fashion: "Fashion",
        footer_cat_education: "Education",
        footer_cat_food: "Food & Drink",
        footer_about: "About",
        footer_contact: "Contact",
        footer_tours: "Tours",
        footer_booking: "Booking",
        footer_terms: "Terms & Conditions",
        
        // === Language Selector ===
        lang_select: "Select Language",
        
        // === Common / Buttons ===
        btn_back: "← Back",
        btn_back_home: "← Back to Home",
        btn_continue: "Continue",
        btn_start: "🚀 Start",
        btn_next: "Next →",
        btn_verify: "Verify Image",
        btn_request_route: "✅ Request GPS Route",
        btn_alt_route: "⚠️ If road is blocked. Find another way",
        btn_open_map: "🗺️ Open Map Help",
        btn_take_photo: "📸 Take Photo Now",
        btn_close: "Close",
        btn_report_missing: "⚠️ I can't find it (Report)",
        btn_retry: "Retry",
        btn_great: "Great!",
        btn_exchange_voucher: "🛍️ Exchange Voucher",
        
        // === Loading & Status ===
        status_loading: "Loading...",
        status_locating: "📡 Locating...",
        status_processing: "⏳ Processing...",
        status_sending: "⏳ Sending image for AI processing...",
        status_success: "✅ Success!",
        status_error: "❌ Error",
        status_gps_error: "❌ Unable to get GPS location.",
        status_connection_error: "❌ Connection error with server.",
        
        // === Points & Score ===
        score_current: "Current Score",
        score_highest: "Highest Score",
        score_xp: "XP",
        score_points: "Points",
        score_plus_verify: "+5 Points (Verify)",
        score_minus_map: "-2 Points (View Map)",
        
        // === lotrinh1.html - Route 1 Page ===
        route1_title: "Route 1",
        route1_intro_title: "Introduction to Route 1",
        route1_intro_text: "The route starts from <b>War Remnants Museum</b> at <b>28 Vo Van Tan, District 3, Ho Chi Minh City</b>. You will visit famous landmarks including <b>Independence Palace</b>, <b>April 30th Park</b>, <b>Notre-Dame Cathedral</b>, <b>Central Post Office</b>, <b>Nguyen Van Binh Book Street</b>, and <b>Turtle Lake</b>. This route helps tourists discover the history, culture, and unique architecture of Saigon.",
        route1_next_dest_title: "Next Destinations on This Route",
        route1_start_point: "Starting Point",
        route1_ranking: "Ranking",
        route1_support: "📞 Support",
        route1_toast_default: "This is your notification!",
        route1_chest_locked: "🔒 Complete all destinations to unlock the treasure chest!",
        route1_chest_claimed: "You have already claimed the reward for this route!",
        route1_chest_reward: "🎉 Excellent! You received 50 XP!",
        
        // === Destination Names ===
        dest_museum: "War Remnants Museum",
        dest_museum_short: "War Museum",
        dest_palace: "Independence Palace",
        dest_park: "April 30th Park",
        dest_cathedral: "Notre-Dame Cathedral",
        dest_post_office: "Central Post Office",
        dest_book_street: "Nguyen Van Binh Book Street",
        dest_turtle_lake: "Turtle Lake",
        
        // === Addresses ===
        addr_museum: "28 Vo Van Tan, Ward 6, District 3, Ho Chi Minh City",
        addr_palace: "135 Nam Ky Khoi Nghia, District 1, Ho Chi Minh City",
        addr_cathedral: "01 Cong xa Paris, Ben Nghe, District 1, Ho Chi Minh City",
        addr_post_office: "02 Cong xa Paris, Ben Nghe, District 1, Ho Chi Minh City",
        addr_turtle_lake: "Turtle Lake, Ward 6, District 3, Ho Chi Minh City",
        
        // === batdau1.html - Starting Point Page ===
        start_title: "Starting Point",
        start_instruction: "Please go to this location to start your journey.",
        start_view_map: "🗺️ View Map",
        start_checking_location: "Checking your location...",
        start_dev_mode: "🔧 Location check is disabled (test mode).",
        start_arrived: "🎉 You have arrived at the starting point!",
        start_distance: "📍 Distance to starting point: {distance} meters",
        start_gps_error: "❌ Unable to get location. Please enable GPS or allow location access.",
        start_browser_error: "⚠️ Your browser does not support GPS.",
        
        // === baotang.html - Museum Verification Page ===
        museum_verify_title: "📍 Verify Destination",
        museum_verify_step1: "Step 1: Move to <b>War Remnants Museum</b> (< 100m) to unlock the camera.",
        museum_dev_mode: "🛠️ Developer Mode",
        museum_dev_mode_desc: "GPS check bypassed. Camera unlocked!",
        museum_camera_unlocked: "✅ You are <b>{distance}m</b> from the destination. Camera unlocked!",
        museum_too_far: "⚠️ You are <b>{distance} km</b> from the destination. Please get closer than 100m.",
        museum_camera_locked: "🔒 Camera locked. You need to get closer to the destination.",
        museum_verify_success: "✅ <b>Verification successful! Points added.</b>",
        museum_verify_wrong: "❌ Image does not match. Please try again.",
        museum_info_title: "Location Information",
        museum_info_text: "War Remnants Museum is located at <b>28 Vo Van Tan, District 3, Ho Chi Minh City</b>, one of Vietnam's most famous historical sites. It houses over <b>20,000 artifacts and documentary images</b>, reflecting the truth about the war, loss, and the nation's aspiration for peace.",
        museum_next_btn: "Go to next destination →",
        
        // === quiz_baotang.html - Museum Quiz Page ===
        quiz_title: "🔍 Spot the Detail",
        quiz_subtitle: "Find and photograph at least <b>3 artifacts</b> below to complete the mission!",
        quiz_progress: "{count}/3 Completed",
        quiz_complete_title: "🎉 Congratulations! You have completed the challenge.",
        quiz_complete_text: "You have received bonus points for your keen observation.",
        quiz_continue_btn: "Continue the journey →",
        quiz_analyzing: "AI is analyzing the image...",
        quiz_checking_scene: "AI is checking the scene...",
        quiz_correct: "✅ Correct!",
        quiz_fun_fact: "Fun fact:",
        quiz_skipped: "⚠️ Confirmed missing.",
        quiz_wrong: "❌ Not correct.",
        quiz_connection_error: "❌ Server connection error.",
        quiz_report_confirm: "Are you sure this artifact is not at this location? Please take a photo of the EMPTY spot for AI verification.",
        
        // === Museum Artifacts (quiz_baotang.html) ===
        artifact_uh1: "UH-1 Helicopter",
        artifact_uh1_hint: "Located in the front yard, left of the entrance.",
        artifact_m48: "M48 Tank",
        artifact_m48_hint: "The largest tank in the display yard.",
        artifact_f5: "F-5 Fighter Jet",
        artifact_f5_hint: "Pointed nose jet aircraft with swept wings.",
        artifact_guillotine: "Guillotine",
        artifact_guillotine_hint: "War crimes exhibition area.",
        artifact_tiger_cage: "Tiger Cage",
        artifact_tiger_cage_hint: "Con Dao prison simulation area.",
        artifact_m107: "M107 Artillery",
        artifact_m107_hint: "Artillery with an extremely long barrel.",
        artifact_cbu55: "CBU-55 Bomb",
        artifact_cbu55_hint: "Large bomb, standing upright.",
        artifact_chinook: "CH-47 Chinook",
        artifact_chinook_hint: "Helicopter with two giant rotors.",
        artifact_bulldozer: "Bulldozer",
        artifact_bulldozer_hint: "Yellow/green vehicle used for forest clearing.",
        artifact_peace_art: "Peace Dove Painting",
        artifact_peace_art_hint: "Children's art area or peace wall.",
        
        // === ltdinhdoclap.html - Route to Independence Palace ===
        lt_palace_title: "Next Destination: Independence Palace",
        lt_locating: "📍 Locating...",
        lt_distance: "📍 Distance to destination: {distance} km",
        lt_arrived: "🎉 You have arrived at the destination!",
        lt_gps_error: "⚠️ Unable to determine location. Please enable GPS.",
        lt_browser_error: "❌ Browser does not support GPS.",
        lt_use_real_location: "Use real location",
        lt_test_mode: "Test Mode (Museum)",
        lt_route_placeholder: "Route will appear here after you press the Request Route button.",
        lt_getting_gps: "⏳ Getting current GPS location...",
        lt_creating_route: "⏳ Sending coordinates and requesting AI to create route...",
        lt_route_ready: "🎉 Route to {destination} ({distance} km) is ready!",
        lt_alt_route_found: "✅ Found alternative route!",
        lt_route_error: "❌ Route creation error: ",
        lt_connection_error: "❌ Server connection error. Please try again.",
        
        // === dinhdoclap.html - Independence Palace Verification ===
        palace_verify_title: "📍 Verify Destination",
        palace_verify_step1: "Step 1: Move to <b>Independence Palace</b> (< 100m) to unlock the camera.",
        palace_info_text: "Independence Palace is a famous architectural landmark in Ho Chi Minh City, formerly the workplace of the President of South Vietnam. On April 30, 1975, liberation army tanks crashed through the palace gates, marking the end of the Vietnam War.",
        
        // === Supplement for quiz_dinhdoclap.html ===
        quiz_palace_title: "🏰 Spot the Detail: Independence Palace",
        quiz_palace_subtitle: "Find and photograph at least <b>3 artifacts</b> to complete the mission!",
        quiz_continue_cathedral: "Continue: Notre-Dame Cathedral →",

        artifact_tank_390: "Tank 390/843",
        artifact_tank_390_hint: "Located on the lawn to the left of the front yard.",
        artifact_fountain_dinh: "Fountain",
        artifact_fountain_dinh_hint: "Right in the middle of the Palace front yard.",
        artifact_stone_curtain: "Stone Curtain",
        artifact_stone_curtain_hint: "Concrete bamboo sections on the 2nd-floor facade.",
        artifact_cabinet_room: "Cabinet Room",
        artifact_cabinet_room_hint: "Room with oval table and green chairs.",
        artifact_banquet_hall: "Banquet Hall",
        artifact_banquet_hall_hint: "The largest room used for receptions.",
        artifact_mercedes_car: "Vintage Mercedes",
        artifact_mercedes_car_hint: "Displayed in the basement.",
        artifact_helicopter_roof: "Helicopter",
        artifact_helicopter_roof_hint: "On the roof (visible from afar or model).",

        // === nhathoducba.html - Notre-Dame Cathedral Verification ===
        cathedral_verify_title: "📍 Verify Destination",
        cathedral_verify_step1: "Step 1: Move to <b>Notre-Dame Cathedral</b> (< 100m) to unlock the camera.",
        cathedral_info_text: "Saigon Notre-Dame Cathedral, officially known as the Cathedral Basilica of Our Lady of The Immaculate Conception, was built between 1863-1880 in Roman and Gothic architectural style. It is one of the iconic architectural works of Saigon.",
        // === Supplement for nhathoducba.html & ltnhathoducba.html ===
        cathedral_intro_title: "🏛️ Introduction to Notre-Dame Cathedral",
        lt_cathedral_title: "Next Destination: Notre-Dame Cathedral",
        lt_test_mode_cathedral: "Test Mode (Notre-Dame Cathedral)",

        // === Quiz Notre-Dame Cathedral ===
        quiz_cathedral_title: "⛪ Spot the Detail: Notre-Dame Cathedral",
        quiz_cathedral_subtitle: "Find <b>3 unique</b> architectural details. If under renovation, use the \"Report\" button!",
        quiz_continue_post: "Continue: Central Post Office →",

        artifact_mary_statue: "Statue of Mary",
        artifact_mary_statue_hint: "Standing on the globe in the park in front of the cathedral.",
        artifact_bell_towers: "Two Bell Towers",
        artifact_bell_towers_hint: "The highest points of the cathedral (visible from afar).",
        artifact_rose_window: "Rose Window",
        artifact_rose_window_hint: "Large circular window on the facade (between the towers).",
        artifact_red_brick: "Red Brick Walls",
        artifact_red_brick_hint: "Distinctive bare bricks from Marseille.",
        artifact_main_gate: "Main Gate",
        artifact_main_gate_hint: "Large arched gate facing the park.",
        artifact_scaffolding: "Scaffolding (Renovation)",
        artifact_scaffolding_hint: "Take a photo of the area under construction.",

        // === buudientp.html - Central Post Office Verification ===
        post_verify_title: "📍 Verify Destination",
        post_verify_step1: "Step 1: Move to <b>Central Post Office</b> (< 100m) to unlock the camera.",
        post_info_text: "Saigon Central Post Office was built between 1886-1891 according to the design of French architect Gustave Eiffel. It is one of the oldest and most beautiful architectural works in Vietnam.",
        // === Central Post Office ===
        lt_post_title: "Route to Central Post Office",
        lt_test_mode_post: "Test Mode (Post Office)",
        
        post_info_title: "🏛️ Introduction to Central Post Office",
        post_info_text: "<b>Saigon Central Post Office</b> is located at No. 2, Paris Commune Square... a masterpiece combining Gothic, Renaissance and French architecture, built from 1886-1891.",
        
        quiz_post_title: "📮 Spot the Detail: Post Office",
        quiz_post_subtitle: "Find <b>3 historical details</b> inside the ancient post office building.",
        quiz_post_complete: "🎉 Mission Complete!",
        quiz_post_complete_text: "You have excellent observation skills.",
        quiz_continue_turtle: "Continue: Turtle Lake →",

        artifact_clock_facade: "Facade Clock",
        artifact_clock_facade_hint: "Located right above the main entrance.",
        artifact_arch_ceiling: "Green Arched Ceiling",
        artifact_arch_ceiling_hint: "Distinctive iron arch architecture inside.",
        artifact_uncle_ho_pic: "Portrait of Uncle Ho",
        artifact_uncle_ho_pic_hint: "Hanging solemnly on the wall at the end of the hall.",
        artifact_map_left: "Map of Saigon",
        artifact_map_left_hint: "Old map painted on the left wall.",
        artifact_map_right: "Telegraph Map",
        artifact_map_right_hint: "Old map painted on the right wall.",
        artifact_phone_booth: "Phone Booths",
        artifact_phone_booth_hint: "Wooden booths along both sides of the entrance.",
        artifact_souvenir_shop: "Souvenir Shop",
        artifact_souvenir_shop_hint: "Sales area in the middle of the hall.",
        
        // === hoconrua.html - Turtle Lake Verification ===
        turtle_verify_title: "📍 Verify Destination",
        turtle_verify_step1: "Step 1: Move to <b>Turtle Lake</b> (< 100m) to unlock the camera.",
        turtle_info_text: "Turtle Lake is a small park located at the intersection of Pham Ngoc Thach and Vo Van Tan streets, District 3. The name comes from a turtle statue that once stood here. Today, it is a favorite spot for young Saigonese.",
        
        // === ketthuclt1.html - Route 1 Completion ===
        complete_title: "🎉 Congratulations!",
        complete_subtitle: "You have completed Route 1",
        complete_summary: "You have successfully explored the famous historical and cultural landmarks of Saigon.",
        complete_reward: "Your Reward",
        complete_total_points: "Total points earned:",
        complete_btn_home: "Back to Home",
        complete_btn_route2: "Continue to Route 2",
        complete_share: "Share Achievement",
        
        // === Dev Mode Toggle ===
        dev_mode_label: "Developer Mode",
        dev_mode_on: "On",
        dev_mode_off: "Off",
        
        // === Common Phrases ===
        greeting_prefix: "Hello,",
        distance_meters: "meters",
        distance_km: "km",
        time_minutes: "minutes",
        time_hours: "hours",

        // === Quiz Pages - Other Locations ===
        quiz_palace_title: "🏰 Spot the Detail: Independence Palace",
        quiz_palace_subtitle: "Find and photograph at least <b>3 artifacts</b> to complete the mission!",
        quiz_cathedral_title: "⛪ Spot the Detail: Notre-Dame Cathedral",
        quiz_cathedral_subtitle: "Find <b>3 unique</b> architectural details. If under renovation, use the \"Report\" button!",
        quiz_post_title: "📮 Spot the Detail: Central Post Office",
        quiz_post_subtitle: "Find <b>3 historical details</b> inside the classic post office building.",
        quiz_post_complete: "🎉 Mission accomplished!",
        quiz_post_complete_text: "You have excellent observation skills.",
        quiz_continue_palace: "Continue: Independence Palace →",
        quiz_continue_cathedral: "Continue: Notre-Dame Cathedral →",
        quiz_continue_post: "Continue: Central Post Office →",
        quiz_continue_turtle: "Continue: Turtle Lake →",
        btn_report_renovation: "⚠️ I can't find it (Under renovation)",
        
        // === Route Pages - Other Locations ===
        lt_cathedral_title: "Next Destination: Notre-Dame Cathedral",
        lt_post_title: "Next Destination: Central Post Office",
        lt_turtle_title: "Next Destination: Turtle Lake",
        lt_test_mode_museum: "Test Mode (Museum)",
        lt_test_mode_palace: "Test Mode (Independence Palace)",
        lt_test_mode_cathedral: "Test Mode (Notre-Dame Cathedral)",
        lt_test_mode_post: "Test Mode (Post Office)",
        lt_directions_placeholder: "Directions will appear here after you press the Request Route button.",
        lt_skip_to_next: "Skip to destination →",
        
        // === Verify page common ===
        verify_title: "📍 Verify Destination",
        
        // === Tags ===
        tag_restaurant: "Restaurant",
        tag_drink: "Drinks",
        tag_play: "Entertainment",
        
        // === ketthuclt1.html - Additional ===
        complete_album_title: "📸 Your Journey Diary",
        complete_album_desc: "Moments you captured along the way.",
        complete_album_empty: "No photos saved yet.",
        complete_btn_reset: "🗑️ Delete diary & Start over",
        complete_btn_chest: "🔙 Go back to open Treasure Chest",
        complete_status_updating: "Updating journey results...",
        complete_status_success: "✅ Completion recorded! Go back to claim your reward.",
        complete_status_done: "✅ You have already completed this route.",
        complete_status_not_login: "⚠️ You are not logged in. Results are not saved.",
        complete_status_error: "⚠️ Server connection error.",
        complete_suggest_title: "Nearby Suggestions",
        complete_reset_confirm: "Are you sure you want to delete all photos and start over?",
        complete_reset_success: "Data deleted successfully!",

        // Kho báu
        chest_closed: "Treasure chest closed",

        // === quiz_hoconrua.html - Turtle Lake Quiz Page ===
        quiz_title_hoconrua: "Spot the Detail - Turtle Lake",
        tour_complete_title: "🏆 CONGRATULATIONS ON COMPLETING THE TOUR!",
        tour_complete_text: "You have conquered all the famous landmarks.",
        btn_finish_tour: "Back to Home 🏠",
        tour_complete_alert: "Congratulations on completing the Saigon tour! Your score has been saved.",

        artifact_lotus_tower: "Lotus Tower",
        artifact_lotus_tower_hint: "The concrete column spreading out like a flower in the center.",
        
        artifact_spiral_bridge: "Spiral Bridge",
        artifact_spiral_bridge_hint: "Curved walkways leading to the center of the lake.",
        
        artifact_fountain_pool: "Central Pool",
        artifact_fountain_pool_hint: "The water area surrounding the tower.",
        
        artifact_stone_bench: "Curved Stone Bench",
        artifact_stone_bench_hint: "Seating area around the lake.",
        
        artifact_top_symbol: "Tower Top",
        artifact_top_symbol_hint: "The highest part of the concrete flower.",

        // === quiz_chobenthanh ===
        quiz_title_chobenthanh: "Spot the Detail - Ben Thanh Market",
        
        artifact_clock_tower_bt: "Clock Tower",
        artifact_clock_tower_bt_hint: "The iconic 3-faced clock tower at the South Gate.",
        
        artifact_ceramic_relief: "Ceramic Relief",
        artifact_ceramic_relief_hint: "Find ceramic artworks (cows, fish, bananas) above the gates.",
        
        artifact_south_gate_sign: "South Gate Sign",
        artifact_south_gate_sign_hint: "The large text 'CHỢ BẾN THÀNH' below the clock tower.",
        
        artifact_north_gate_fruit: "North Gate (Fruits)",
        artifact_north_gate_fruit_hint: "Le Thanh Ton street gate, famous for fresh fruits and flowers.",
        
        artifact_west_gate_shoes: "West Gate (Shoes)",
        artifact_west_gate_shoes_hint: "Phan Chu Trinh street gate, selling shoes and souvenirs."
    }
};

// Export để sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}
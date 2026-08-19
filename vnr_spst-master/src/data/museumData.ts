export interface ArtifactData {
  id: string;
  roomId: string;
  title: string;
  year: string;
  description: string;
  audioUrl?: string;
  imageUrl?: string;
  position: [number, number, number];
  color: string;
  type: 'document' | 'object' | 'flag' | 'monument';
  /**
   * Gợi ý hiện trên biển đồng khi bệ còn trống, dùng cho chế độ Nghiệp vụ.
   * Phải mô tả đủ để người chơi nhận ra hiện vật nếu nắm nội dung bài, nhưng
   * không được lộ tên - tên nằm trong danh sách túi đồ, đó mới là thứ phải chọn.
   */
  hint: string;
}

export interface RoomData {
  id: string;
  /**
   * Tên hiển thị khi phòng chưa xếp xong. Cố ý không mang thông tin niên đại:
   * đoán ra phòng thuộc giai đoạn nào chính là phần chơi.
   */
  name: string;
  /**
   * ĐÁP ÁN - theme, period và description chỉ được hiển thị sau khi người chơi
   * xếp xong toàn bộ hiện vật của phòng.
   * Đừng đưa ba trường này ra giao diện ở trạng thái chưa hoàn thành.
   */
  theme: string;
  period: string;
  description: string;

  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  colorTheme: string;
}

// Ba phòng trưng bày tương ứng ba giai đoạn của cuộc kháng chiến chống thực dân
// Pháp. cameraPosition / targetPosition phải khớp với vị trí vật lý của phòng
// trong Experience.tsx (tường và cửa được dựng cứng ở đó): phòng 1 nằm bên
// trái (x ≈ -22), phòng 2 ở phía sau (z ≈ -20), phòng 3 bên phải (x ≈ 22).
export const ROOMS: RoomData[] = [
  {
    id: "main-hall",
    name: "Sảnh Chính Kim Liên",
    theme: "Không gian biểu tượng",
    period: "Tổng Quan",
    description: "Không gian biểu tượng mở đầu hành trình tìm hiểu đường lối kháng chiến chống thực dân Pháp của Đảng Cộng sản Việt Nam.",
    cameraPosition: [0, 5.5, 28],
    targetPosition: [0, 1, 12],
    colorTheme: "#ffd700",
  },
  {
    id: "room-1946",
    name: "Phòng 1",
    theme: "Toàn Quốc Kháng Chiến",
    period: "1946 - 1950",
    description: "Đường lối kháng chiến toàn dân, toàn diện, trường kỳ, tự lực cánh sinh được hình thành và hoàn chỉnh qua ba văn kiện nền tảng.",
    cameraPosition: [-22, 5.5, 28],
    targetPosition: [-22, 1, 12],
    colorTheme: "#ff4444",
  },
  {
    id: "room-1950",
    name: "Phòng 2",
    theme: "Giành Quyền Chủ Động",
    period: "1950 - 1953",
    description: "Từ Chiến dịch Biên giới, ta chuyển từ thế phòng ngự sang chủ động tiến công, đồng thời đẩy mạnh kháng chiến trên mặt trận chính trị và kinh tế.",
    cameraPosition: [0, 5.5, -6],
    targetPosition: [0, 1, -20],
    colorTheme: "#ffaa00",
  },
  {
    id: "room-1954",
    name: "Phòng 3",
    theme: "Điện Biên Phủ",
    period: "1953 - 1954",
    description: "Chiến cuộc Đông Xuân và Chiến dịch Điện Biên Phủ đưa cuộc kháng chiến đến thắng lợi quyết định, buộc Pháp ký Hiệp định Genève.",
    cameraPosition: [22, 5.5, 28],
    targetPosition: [22, 1, 12],
    colorTheme: "#e63946",
  },
];

export const ARTIFACTS: ArtifactData[] = [
  // ===== Sảnh chính =====
  {
    id: "main-symbol",
    roomId: "main-hall",
    title: "Biểu Tượng Búa Liềm Vàng",
    year: "1930",
    description: "Biểu tượng thiêng liêng đại diện cho sự đoàn kết bền chặt giữa giai cấp công nhân và nông dân Việt Nam. Chiếc búa tượng trưng cho giai cấp công nhân, chiếc liềm tượng trưng cho giai cấp nông dân. Chính khối liên minh công - nông này là nền tảng của lực lượng kháng chiến toàn dân sau ngày 19/12/1946, khi cả dân tộc nhất tề đứng lên chống thực dân Pháp xâm lược.",
    position: [0, 1.5, 0],
    color: "#ffd700",
    type: "monument",
    hint: "Biểu tượng khối liên minh công - nông, nền tảng của lực lượng kháng chiến toàn dân.",
  },
  {
    id: "tuong-dai-bac",
    roomId: "main-hall",
    title: "Tượng Đài Chủ Tịch Hồ Chí Minh",
    year: "1945",
    description: "Bức tượng tái hiện khoảnh khắc Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình ngày 2/9/1945, khai sinh nước Việt Nam Dân chủ Cộng hòa. Nền độc lập vừa giành được ấy lập tức bị thực dân Pháp đe dọa, và chính Người là tác giả của Lời kêu gọi toàn quốc kháng chiến - văn kiện mở đầu chín năm trường kỳ kháng chiến.",
    position: [0, 1.5, 18],
    color: "#e8d5b5",
    type: "monument",
    hint: "Người đọc bản Tuyên ngôn khai sinh nước Việt Nam Dân chủ Cộng hòa tại Quảng trường Ba Đình.",
  },

  // ===== Phòng 1 (1946 - 1950): hình thành đường lối =====
  {
    id: "loi-keu-goi",
    roomId: "room-1946",
    title: "Lời Kêu Gọi Toàn Quốc Kháng Chiến",
    year: "19/12/1946",
    description: "'Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ...'. Chủ tịch Hồ Chí Minh viết Lời kêu gọi tại làng Vạn Phúc (Hà Đông) ngày 19/12/1946, và văn kiện được phát đi trên Đài Tiếng nói Việt Nam sáng hôm sau. Lời hiệu triệu khẳng định tính chất chính nghĩa và tinh thần toàn dân của cuộc kháng chiến: bất kỳ đàn ông, đàn bà, người già, người trẻ, hễ là người Việt Nam thì phải đứng lên đánh giặc.",
    position: [-22, 1, 18],
    color: "#e07a5f",
    type: "document",
    hint: "Lời hiệu triệu viết tại Vạn Phúc, phát trên sóng phát thanh sáng 20/12/1946.",
    imageUrl: "/assets/images/loi_keu_goi.jpg",
  },
  {
    id: "chi-thi-toan-dan-khang-chien",
    roomId: "room-1946",
    title: "Chỉ Thị 'Toàn Dân Kháng Chiến'",
    year: "12/12/1946",
    description: "Văn kiện do Ban Thường vụ Trung ương Đảng ban hành một tuần trước ngày toàn quốc kháng chiến. Chỉ thị xác định rõ mục đích của cuộc kháng chiến là đánh đuổi thực dân Pháp xâm lược, giành độc lập và thống nhất; nêu tính chất trường kỳ và toàn diện; đồng thời vạch ra phương châm chỉ đạo xuyên suốt: toàn dân, toàn diện, trường kỳ, tự lực cánh sinh. Đây là văn kiện đặt nền móng cho toàn bộ đường lối kháng chiến của Đảng.",
    position: [-26, 1, 12],
    color: "#d4a373",
    type: "document",
    hint: "Văn kiện của Ban Thường vụ Trung ương, ra đời trước ngày toàn quốc kháng chiến một tuần.",
  },
  {
    id: "khang-chien-nhat-dinh-thang-loi",
    roomId: "room-1946",
    title: "Tác Phẩm 'Kháng Chiến Nhất Định Thắng Lợi'",
    year: "1947",
    description: "Tác phẩm của đồng chí Trường Chinh, Tổng Bí thư của Đảng, ban đầu đăng nhiều kỳ trên báo Sự Thật rồi xuất bản thành sách năm 1947. Tác phẩm giải thích cặn kẽ và hoàn chỉnh đường lối kháng chiến: vì sao phải kháng chiến trường kỳ, kháng chiến toàn diện nghĩa là đánh địch trên tất cả các mặt quân sự, chính trị, kinh tế, văn hóa, ngoại giao, và vì sao cuộc kháng chiến của ta nhất định thắng lợi.",
    position: [-18, 1, 12],
    color: "#c9ada7",
    type: "document",
    hint: "Tác phẩm lý luận của Tổng Bí thư Trường Chinh, hoàn chỉnh đường lối kháng chiến năm 1947.",
  },
  {
    id: "may-chu-bac-ho",
    roomId: "room-1946",
    title: "Máy Chữ Chiến Khu Việt Bắc",
    year: "1947 - 1954",
    description: "Chiếc máy chữ lịch sử đã đồng hành cùng Bác Hồ và Trung ương Đảng trong suốt những năm tháng gian khổ tại An Toàn Khu (ATK) Việt Bắc. Trên chiếc máy này, hàng trăm văn kiện, chỉ thị, bức thư và mệnh lệnh quan trọng đã được soạn thảo, trực tiếp chỉ đạo cuộc kháng chiến chống Pháp đi từ thắng lợi này đến thắng lợi khác. Hiện vật là minh chứng sống động cho tinh thần tự lực cánh sinh nơi căn cứ địa.",
    position: [-22, 1, 6],
    color: "#4a4e69",
    type: "object",
    hint: "Vật dụng đã soạn thảo hàng trăm chỉ thị tại An Toàn Khu Việt Bắc.",
  },

  // ===== Phòng 2 (1950 - 1953): giành quyền chủ động =====
  {
    id: "chien-dich-bien-gioi-1950",
    roomId: "room-1950",
    title: "Chiến Dịch Biên Giới Thu - Đông",
    year: "1950",
    description: "Chiến dịch lớn đầu tiên do ta chủ động mở, diễn ra từ tháng 9 đến tháng 10 năm 1950 trên tuyến biên giới Cao Bằng - Lạng Sơn. Chủ tịch Hồ Chí Minh trực tiếp ra mặt trận theo dõi và chỉ đạo. Thắng lợi của chiến dịch đã khai thông đường liên lạc với các nước xã hội chủ nghĩa, phá thế bao vây của địch, và quan trọng nhất là đánh dấu bước ngoặt: quân ta giành được quyền chủ động chiến lược trên chiến trường chính Bắc Bộ.",
    position: [-16, 1, -20],
    color: "#8d99ae",
    type: "document",
    hint: "Chiến dịch lớn đầu tiên ta chủ động mở, khai thông biên giới phía Bắc.",
  },
  {
    id: "dai-hoi-ii-1951",
    roomId: "room-1950",
    title: "Đại Hội Đại Biểu Toàn Quốc Lần Thứ II",
    year: "02/1951",
    description: "Đại hội họp tại Chiêm Hóa, Tuyên Quang, được gọi là 'Đại hội kháng chiến thắng lợi'. Đại hội quyết định đưa Đảng ra hoạt động công khai với tên gọi Đảng Lao động Việt Nam, thông qua Chính cương Đảng Lao động Việt Nam do đồng chí Trường Chinh soạn thảo. Chính cương làm rõ tính chất xã hội Việt Nam, nhiệm vụ cách mạng và con đường tiến lên chủ nghĩa xã hội, tăng cường sự lãnh đạo trực tiếp của Đảng đối với cuộc kháng chiến.",
    position: [-8, 1, -20],
    color: "#cc0000",
    type: "document",
    hint: "Đại hội đưa Đảng ra hoạt động công khai, họp tại Chiêm Hóa - Tuyên Quang.",
  },
  {
    id: "co-dang-lao-dong",
    roomId: "room-1950",
    title: "Cờ Đảng Lao Động Việt Nam",
    year: "1951",
    description: "Lá cờ búa liềm của Đảng Lao động Việt Nam, tên gọi mà Đảng chính thức mang từ Đại hội II tháng 2 năm 1951 cho đến năm 1976. Việc Đảng ra hoạt động công khai giữa lúc kháng chiến đang ở giai đoạn quyết liệt đã khẳng định vai trò lãnh đạo trực tiếp, toàn diện của Đảng, củng cố niềm tin của toàn dân vào thắng lợi cuối cùng của cuộc kháng chiến.",
    position: [0, 1, -24],
    color: "#cc0000",
    type: "flag",
    hint: "Lá cờ mang tên gọi mà Đảng chính thức dùng từ năm 1951 đến 1976.",
  },
  {
    id: "chien-dich-tay-bac-1952",
    roomId: "room-1950",
    title: "Chiến Dịch Tây Bắc",
    year: "1952",
    description: "Chiến dịch diễn ra từ tháng 10 đến tháng 12 năm 1952, giải phóng Nghĩa Lộ và phần lớn tỉnh Sơn La, mở rộng vùng tự do nối liền căn cứ địa Việt Bắc với Tây Bắc. Cùng với các chiến dịch Hòa Bình và Thượng Lào, đây là chuỗi hoạt động thể hiện rõ thế chủ động tiến công của ta, buộc thực dân Pháp phải phân tán lực lượng trên một chiến trường ngày càng rộng.",
    position: [8, 1, -20],
    color: "#a3b18a",
    type: "document",
    hint: "Chiến dịch cuối năm 1952 giải phóng Nghĩa Lộ và phần lớn tỉnh Sơn La.",
  },
  {
    id: "luat-cai-cach-ruong-dat",
    roomId: "room-1950",
    title: "Luật Cải Cách Ruộng Đất",
    year: "12/1953",
    description: "Đạo luật được Quốc hội khóa I thông qua tháng 12 năm 1953, hiện thực hóa khẩu hiệu 'người cày có ruộng'. Đây là biểu hiện tập trung của phương châm kháng chiến toàn diện trên mặt trận kinh tế - xã hội: bồi dưỡng sức dân, giải phóng sức sản xuất ở nông thôn, qua đó động viên mạnh mẽ nông dân - lực lượng đông đảo nhất - hăng hái đóng góp sức người sức của cho tiền tuyến.",
    position: [16, 1, -20],
    color: "#dda15e",
    type: "document",
    hint: "Đạo luật hiện thực hóa khẩu hiệu 'người cày có ruộng', mặt trận kinh tế của kháng chiến.",
  },

  // ===== Phòng 3 (1953 - 1954): Điện Biên Phủ và Genève =====
  {
    id: "ke-hoach-nava",
    roomId: "room-1954",
    title: "Kế Hoạch Nava",
    year: "07/1953",
    description: "Kế hoạch quân sự của tướng Henri Navarre, Tổng chỉ huy quân đội Pháp ở Đông Dương, được Chính phủ Pháp và Mỹ tán thành tháng 7 năm 1953. Kế hoạch dự tính trong vòng 18 tháng sẽ tập trung một lực lượng cơ động mạnh để giành lại quyền chủ động, tiêu diệt chủ lực của ta rồi kết thúc chiến tranh trong danh dự. Đây là nỗ lực cuối cùng và cũng là canh bạc lớn nhất của thực dân Pháp tại Đông Dương.",
    position: [22, 1, 18],
    color: "#6c757d",
    type: "document",
    hint: "Kế hoạch quân sự 18 tháng, canh bạc cuối cùng của thực dân Pháp ở Đông Dương.",
  },
  {
    id: "dong-xuan-1953-1954",
    roomId: "room-1954",
    title: "Chiến Cuộc Đông Xuân 1953 - 1954",
    year: "1953 - 1954",
    description: "Trước kế hoạch tập trung quân của Nava, Bộ Chính trị chủ trương mở các cuộc tiến công lên nhiều hướng chiến lược mà địch buộc phải đối phó. Quân ta đánh lên Tây Bắc, Trung Lào, Hạ Lào, Bắc Tây Nguyên và Thượng Lào, khiến khối cơ động của Pháp bị xé lẻ ra khắp Đông Dương. Kế hoạch Nava bị phá sản ngay từ trong trứng nước, tạo tiền đề trực tiếp cho trận quyết chiến chiến lược tại Điện Biên Phủ.",
    position: [26, 1, 12],
    color: "#bc6c25",
    type: "document",
    hint: "Đòn phản công xé lẻ khối quân cơ động của địch ra khắp Đông Dương.",
  },
  {
    id: "co-quyet-thang",
    roomId: "room-1954",
    title: "Lá Cờ 'Quyết Chiến Quyết Thắng'",
    year: "07/05/1954",
    description: "Lá cờ đỏ sao vàng đã tung bay kiêu hãnh trên nóc hầm tướng De Castries vào chiều ngày 7/5/1954, đánh dấu thời khắc kết thúc thắng lợi rực rỡ của chiến dịch Điện Biên Phủ. Sau 56 ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt, quân và dân ta đã làm nên chiến thắng 'lừng lẫy năm châu, chấn động địa cầu', đập tan tập đoàn cứ điểm mạnh nhất của thực dân Pháp ở Đông Dương.",
    position: [18, 1, 12],
    color: "#ff3300",
    type: "flag",
    hint: "Vật tung bay trên nóc hầm tướng De Castries chiều 7/5/1954.",
    imageUrl: "/assets/images/co_quyet_chien.webp",
  },
  {
    id: "but-ky-geneve",
    roomId: "room-1954",
    title: "Bút Ký Hiệp Định Genève",
    year: "21/07/1954",
    description: "Hiện vật biểu trưng cho thời khắc Hiệp định Genève về đình chỉ chiến sự ở Đông Dương được ký kết ngày 21/7/1954, chỉ hơn hai tháng sau chiến thắng Điện Biên Phủ. Bằng hiệp định này, Pháp và các nước tham dự phải công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam, Lào và Campuchia. Thắng lợi trên bàn đàm phán là kết quả trực tiếp của thắng lợi trên chiến trường, minh chứng cho mặt trận ngoại giao trong đường lối kháng chiến toàn diện.",
    position: [22, 1, 6],
    color: "#219ebc",
    type: "object",
    hint: "Hiện vật biểu trưng cho thắng lợi trên bàn đàm phán, hai tháng sau Điện Biên Phủ.",
  },
];

/**
 * Sảnh chính là không gian biểu tượng, không phải phòng trưng bày theo giai đoạn.
 * Hai hiện vật ở đây (búa liềm, tượng đài Bác) luôn được bày sẵn và đứng ngoài
 * minigame - người chơi bước vào là thấy ngay, không phải xếp.
 */
export const SHOWCASE_ROOM_ID = "main-hall";

/** Hiện vật người chơi phải tự xếp. Đây mới là mẫu số của bộ đếm tiến độ. */
export const PLACEABLE_ARTIFACTS = ARTIFACTS.filter((a) => a.roomId !== SHOWCASE_ROOM_ID);

/** Hiện vật bày sẵn từ đầu, coi như đã xếp xong ngay khi khởi động. */
export const FIXED_ARTIFACT_IDS = ARTIFACTS
  .filter((a) => a.roomId === SHOWCASE_ROOM_ID)
  .map((a) => a.id);

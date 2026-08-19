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
    theme: "Khai Sinh Nền Độc Lập",
    period: "1945 - 1946",
    description: "Đường lối kháng chiến toàn dân, toàn diện, trường kỳ, tự lực cánh sinh được hình thành và hoàn chỉnh qua ba văn kiện nền tảng.",
    cameraPosition: [-22, 5.5, 28],
    targetPosition: [-22, 1, 12],
    colorTheme: "#ff4444",
  },
  {
    id: "room-1950",
    name: "Phòng 2",
    theme: "Điện Biên Phủ & Genève",
    period: "1951 - 1954",
    description: "Từ Chiến dịch Biên giới, ta chuyển từ thế phòng ngự sang chủ động tiến công, đồng thời đẩy mạnh kháng chiến trên mặt trận chính trị và kinh tế.",
    cameraPosition: [0, 5.5, -6],
    targetPosition: [0, 1, -20],
    colorTheme: "#ffaa00",
  },
  {
    id: "room-1954",
    name: "Phòng 3",
    theme: "Trường Kỳ Kháng Chiến",
    period: "1946 - 1950",
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

  // ===== Phòng 1 =====
  {
    id: "loi-keu-goi",
    roomId: "room-1946",
    title: "Lời Kêu Gọi Toàn Quốc Kháng Chiến",
    year: "19/12/1946",
    description: "'Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ...'. Chủ tịch Hồ Chí Minh viết Lời kêu gọi tại làng Vạn Phúc (Hà Đông) ngày 19/12/1946, và văn kiện được phát đi trên Đài Tiếng nói Việt Nam sáng hôm sau. Lời hiệu triệu khẳng định tính chất chính nghĩa và tinh thần toàn dân của cuộc kháng chiến: bất kỳ đàn ông, đàn bà, người già, người trẻ, hễ là người Việt Nam thì phải đứng lên đánh giặc.",
    position: [-22, 1, 6],
    color: "#e07a5f",
    type: "document",
    hint: "Lời hiệu triệu viết tại làng Vạn Phúc, phát đi trên sóng Đài Tiếng nói Việt Nam.",
    imageUrl: "/assets/images/loi_keu_goi.jpg",
  },
  {
    id: "may-chu-bac-ho",
    roomId: "room-1954",
    title: "Máy Chữ Chiến Khu Việt Bắc",
    year: "1947 - 1950",
    description: "Chiếc máy chữ lịch sử đã đồng hành cùng Bác Hồ và Trung ương Đảng trong suốt những năm tháng gian khổ tại An Toàn Khu (ATK) Việt Bắc. Trên chiếc máy này, hàng trăm văn kiện, chỉ thị, bức thư và mệnh lệnh quan trọng đã được soạn thảo, trực tiếp chỉ đạo cuộc kháng chiến chống Pháp đi từ thắng lợi này đến thắng lợi khác. Hiện vật là minh chứng sống động cho tinh thần tự lực cánh sinh nơi căn cứ địa.",
    position: [18, 1, 15],
    color: "#4a4e69",
    type: "object",
    hint: "Vật dụng đã soạn thảo hàng trăm chỉ thị tại An Toàn Khu Việt Bắc.",
  },

  // ===== Phòng 2 =====

  // ===== Phòng 3 =====
  {
    id: "co-quyet-thang",
    roomId: "room-1950",
    title: "Lá Cờ 'Quyết Chiến Quyết Thắng'",
    year: "07/05/1954",
    description: "Lá cờ đỏ sao vàng đã tung bay kiêu hãnh trên nóc hầm tướng De Castries vào chiều ngày 7/5/1954, đánh dấu thời khắc kết thúc thắng lợi rực rỡ của chiến dịch Điện Biên Phủ. Sau 56 ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt, quân và dân ta đã làm nên chiến thắng 'lừng lẫy năm châu, chấn động địa cầu', đập tan tập đoàn cứ điểm mạnh nhất của thực dân Pháp ở Đông Dương.",
    position: [6, 1, -24],
    color: "#ff3300",
    type: "flag",
    hint: "Vật tung bay trên nóc hầm tướng De Castries khi tập đoàn cứ điểm thất thủ.",
    imageUrl: "/assets/images/co_quyet_chien.webp",
  },
  {
    id: "but-ky-geneve",
    roomId: "room-1950",
    title: "Bút Ký Hiệp Định Genève",
    year: "21/07/1954",
    description: "Hiện vật biểu trưng cho thời khắc Hiệp định Genève về đình chỉ chiến sự ở Đông Dương được ký kết ngày 21/7/1954, chỉ hơn hai tháng sau chiến thắng Điện Biên Phủ. Bằng hiệp định này, Pháp và các nước tham dự phải công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam, Lào và Campuchia. Thắng lợi trên bàn đàm phán là kết quả trực tiếp của thắng lợi trên chiến trường, minh chứng cho mặt trận ngoại giao trong đường lối kháng chiến toàn diện.",
    position: [6, 1, -18],
    color: "#219ebc",
    type: "object",
    hint: "Hiện vật biểu trưng cho thắng lợi trên bàn đàm phán, hai tháng sau Điện Biên Phủ.",
  },
  {
    id: "tuyen-ngon-doc-lap",
    roomId: "room-1946",
    title: "Bản Tuyên Ngôn Độc Lập",
    year: "02/09/1945",
    description: "Bản Tuyên ngôn do Chủ tịch Hồ Chí Minh soạn thảo và đọc trước hàng vạn đồng bào tại Quảng trường Ba Đình ngày 2/9/1945, khai sinh nước Việt Nam Dân chủ Cộng hòa. Mở đầu bằng chính lời trong Tuyên ngôn Độc lập của Hoa Kỳ và Tuyên ngôn Nhân quyền của Pháp, văn kiện dùng lý lẽ của đối phương để khẳng định quyền độc lập của dân tộc Việt Nam, đồng thời tuyên bố xoá bỏ mọi ràng buộc với thực dân Pháp. Đây là cơ sở pháp lý cho toàn bộ cuộc kháng chiến sau đó.",
    position: [-22, 1, 18],
    color: "#c9a227",
    type: "document",
    hint: "Văn kiện đọc trước hàng vạn đồng bào tại Quảng trường Ba Đình, khai sinh nhà nước.",
  },
  {
    id: "tong-tuyen-cu-1946",
    roomId: "room-1946",
    title: "Thùng Phiếu Tổng Tuyển Cử Đầu Tiên",
    year: "06/01/1946",
    description: "Chiếc thùng phiếu của cuộc Tổng tuyển cử đầu tiên trong lịch sử dân tộc, bầu ra Quốc hội khoá I của nước Việt Nam Dân chủ Cộng hòa. Hơn 89% cử tri đi bỏ phiếu giữa lúc thù trong giặc ngoài bủa vây, nhiều nơi phải bỏ phiếu dưới bom đạn. Cuộc bầu cử khẳng định tính chính danh của chính quyền cách mạng trước quốc tế, và biến lá phiếu thành một vũ khí chính trị của cuộc kháng chiến sắp tới.",
    position: [-22, 1, 12],
    color: "#8d6a3f",
    type: "object",
    hint: "Vật chứa lá phiếu của cuộc bầu cử Quốc hội đầu tiên, hơn 89% cử tri tham gia.",
  },
  {
    id: "den-dau-chien-khu",
    roomId: "room-1954",
    title: "Đèn Dầu Chiến Khu Việt Bắc",
    year: "1947 - 1950",
    description: "Ngọn đèn dầu từng thức trắng cùng cán bộ, chiến sĩ trong những lán trại giữa rừng Việt Bắc. Dưới thứ ánh sáng leo lét ấy, các văn kiện chỉ đạo kháng chiến được soạn thảo, các phương án tác chiến được bàn định suốt đêm. Hiện vật nhỏ bé này nói lên điều kiện thiếu thốn cùng cực của căn cứ địa, và cũng nói lên ý chí bám trụ để kháng chiến trường kỳ.",
    position: [26, 1, 15],
    color: "#b8860b",
    type: "object",
    hint: "Nguồn sáng duy nhất trong lán trại giữa rừng, nơi soạn thảo văn kiện suốt đêm.",
  },
  {
    id: "sung-ppsh",
    roomId: "room-1950",
    title: "Tiểu Liên PPSh-41",
    year: "1951 - 1954",
    description: "Khẩu tiểu liên do Liên Xô thiết kế, được Trung Quốc sản xuất theo giấy phép với tên Kiểu 50 và viện trợ cho Việt Nam từ sau Chiến dịch Biên giới 1950. Hoả lực gần mạnh mẽ của nó rất hợp với lối đánh gần, đánh vận động của bộ đội ta, và trở thành vũ khí tiêu chuẩn của các đại đoàn chủ lực trong chiến cuộc Đông Xuân 1953-1954 cũng như tại Điện Biên Phủ.",
    position: [-6, 1, -18],
    color: "#6b5a45",
    type: "object",
    hint: "Vũ khí viện trợ sau Chiến dịch Biên giới, hoả lực gần mạnh, hợp lối đánh vận động.",
  },
  {
    id: "xe-tang-m24",
    roomId: "room-1950",
    title: "Xe Tăng M24 Chaffee",
    year: "1953 - 1954",
    description: "Xe tăng hạng nhẹ do Mỹ chế tạo và viện trợ cho quân đội Pháp. Mười chiếc M24 đã được tháo rời, thả dù xuống lòng chảo Điện Biên rồi lắp lại tại chỗ - một nỗ lực hậu cần phi thường cho thấy Pháp đặt cược lớn đến mức nào vào tập đoàn cứ điểm này. Nhưng khi các đường băng bị pháo ta khống chế và vòng vây siết chặt, những cỗ xe ấy trở nên vô dụng, cùng cả tập đoàn cứ điểm đi đến thất bại ngày 7/5/1954.",
    position: [0, 1, -24],
    color: "#4a5240",
    type: "object",
    hint: "Mười cỗ máy được tháo rời, thả dù xuống lòng chảo rồi lắp lại tại chỗ.",
  },
  {
    id: "dien-thoai-da-chien",
    roomId: "room-1954",
    title: "Điện Thoại Dã Chiến",
    year: "1947 - 1950",
    description: "Máy điện thoại hữu tuyến nối các sở chỉ huy với đơn vị chiến đấu qua những cuộn dây kéo xuyên rừng núi. Trong điều kiện không có vô tuyến hiện đại, chính mạng dây dã chiến này giữ cho mệnh lệnh từ Bộ Tổng tư lệnh xuống được tới mặt trận. Bộ đội thông tin nhiều lần phải nối dây ngay dưới làn đạn để bảo đảm liên lạc không đứt quãng.",
    position: [18, 1, 9],
    color: "#3f4a3a",
    type: "object",
    hint: "Thiết bị giữ cho mệnh lệnh từ sở chỉ huy xuống tới mặt trận qua dây kéo xuyên rừng.",
  },
  {
    id: "bi-dong-bo-doi",
    roomId: "room-1954",
    title: "Bi Đông Của Người Lính",
    year: "1950",
    description: "Chiếc bi đông đựng nước theo chân bộ đội suốt những chặng hành quân dài trên tuyến biên giới Cao Bằng - Lạng Sơn trong Chiến dịch Biên giới Thu - Đông 1950. Chiến dịch lớn đầu tiên do ta chủ động mở đã khai thông đường liên lạc với các nước xã hội chủ nghĩa, phá thế bao vây và đánh dấu bước ngoặt: quân ta giành quyền chủ động chiến lược trên chiến trường chính Bắc Bộ.",
    position: [26, 1, 9],
    color: "#7a7f68",
    type: "object",
    hint: "Vật dụng theo chân bộ đội trên chặng hành quân khai thông biên giới phía Bắc.",
  },
  {
    id: "may-bay-c47",
    roomId: "room-1950",
    title: "Máy Bay Vận Tải C-47",
    year: "1953 - 1954",
    description: "Loại máy bay vận tải hai động cơ giữ vai trò huyết mạch của tập đoàn cứ điểm Điện Biên Phủ: toàn bộ đạn dược, lương thực và quân tăng viện đều phải đưa vào bằng đường không. Khi pháo cao xạ của ta khống chế bầu trời và hai sân bay Mường Thanh, Hồng Cúm bị vô hiệu hoá, hàng tiếp tế thả dù rơi phần lớn sang trận địa quân ta. Cứ điểm bị bóp nghẹt từ chính mạch sống của nó.",
    position: [-6, 1, -24],
    color: "#8a9099",
    type: "object",
    hint: "Phương tiện chở toàn bộ tiếp tế cho cứ điểm, bị pháo cao xạ ta khống chế.",
  },
  {
    id: "xeng-dao-hao",
    roomId: "room-1950",
    title: "Xẻng Đào Hào Điện Biên",
    year: "1954",
    description: "Chiếc xẻng bình dị làm nên phương châm 'đánh chắc, tiến chắc'. Thay vì đánh nhanh, quân ta đào hàng trăm ki-lô-mét giao thông hào siết dần quanh tập đoàn cứ điểm, cắt rời từng cứ điểm một rồi tiêu diệt. Những đường hào ấy vừa che chở bộ đội khỏi hoả lực, vừa đưa trận địa ta áp sát tới tận hàng rào địch - một cách đánh khiến ưu thế hoả lực của Pháp mất tác dụng.",
    position: [0, 1, -18],
    color: "#5c5347",
    type: "object",
    hint: "Công cụ làm nên phương châm 'đánh chắc, tiến chắc', siết vòng vây bằng giao thông hào.",
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

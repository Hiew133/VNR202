/**
 * Ghi công tác giả các mô hình 3D.
 *
 * Toàn bộ mô hình đang dùng đều mang giấy phép CC BY 4.0. Giấy phép này CHO PHÉP
 * dùng và sửa đổi thoải mái, kể cả cho mục đích thương mại, nhưng BẮT BUỘC:
 *   1. Ghi tên tác giả
 *   2. Dẫn link tới giấy phép
 *   3. Nêu rõ nếu tác phẩm đã bị sửa đổi
 * Thiếu bất kỳ điều nào là vi phạm giấy phép. Vì vậy bảng này phải luôn hiển
 * thị được trong ứng dụng, đừng gỡ đi.
 *
 * Số liệu trích từ file license.txt kèm theo mỗi bản tải về từ Sketchfab, hoặc
 * từ metadata nhúng trong chính file .glb - không phải chép tay.
 *
 * Thêm mô hình mới thì thêm một mục vào đây. Bản tải từ Sketchfab luôn kèm sẵn
 * license.txt trong thư mục giải nén.
 */
export interface ModelCredit {
  /** Tên hiện vật trong bảo tàng, để người xem đối chiếu được. */
  usedFor: string;
  /** Tên tác phẩm gốc do tác giả đặt. */
  title: string;
  author: string;
  authorUrl: string;
  sourceUrl: string;
  /** Những gì đã sửa so với bản gốc - CC BY yêu cầu nêu rõ. */
  modifications: string;
}

/** Mọi mô hình trong bảo tàng đều dùng chung giấy phép này. */
export const LICENSE_NAME = "CC BY 4.0";
export const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

/** Cách xử lý áp dụng cho hầu hết mô hình tải về. */
const STANDARD = "Giảm lưới, thu nhỏ texture và nén bằng EXT_meshopt_compression.";

export const MODEL_CREDITS: ModelCredit[] = [
  // ===== Sảnh chính =====
  {
    usedFor: "Biểu Tượng Búa Liềm Vàng",
    title: "Communist Badge",
    author: "DylanFowler",
    authorUrl: "https://sketchfab.com/DylanFowler",
    sourceUrl: "https://sketchfab.com/3d-models/communist-badge-2727f9eabceb4b97b0873c3578baf190",
    modifications: "Thu nhỏ texture về 512² và nén bằng EXT_meshopt_compression.",
  },
  {
    usedFor: "Tượng Đài Chủ Tịch Hồ Chí Minh",
    title: "TUONG+BAC+HO",
    author: "vanchonxxx13",
    authorUrl: "https://sketchfab.com/vanchonxxx13",
    sourceUrl: "https://sketchfab.com/3d-models/tuongbacho-08d6a987c39b4bc0849f3be7e274dc97",
    modifications:
      "Gỡ lớp lưới viền không dùng tới, giảm lưới còn 50% số đỉnh và nén bằng EXT_meshopt_compression.",
  },

  // ===== Phòng 1: 1945 - 1946 =====
  {
    usedFor: "Thùng Phiếu Tổng Tuyển Cử Đầu Tiên",
    title: "Snapshot Ballot Box",
    author: "m3org",
    authorUrl: "https://sketchfab.com/m3org",
    sourceUrl: "https://sketchfab.com/3d-models/snapshot-ballot-box-352c31d60333479e919b550ceac0230a",
    modifications: "Thu nhỏ texture về 512² và nén bằng EXT_meshopt_compression.",
  },

  // ===== Phòng 3: 1946 - 1950 =====
  {
    usedFor: "Máy Chữ Chiến Khu Việt Bắc",
    title: "Máy đánh chữ",
    author: "atlantictruong",
    authorUrl: "https://sketchfab.com/atlantictruong19",
    sourceUrl: "https://sketchfab.com/3d-models/may-anh-chu-72d50626ee0843fbb774ba9585e0c793",
    modifications: "Giảm lưới còn 8% số đỉnh và nén bằng EXT_meshopt_compression.",
  },
  {
    usedFor: "Đèn Dầu Chiến Khu Việt Bắc",
    title: "Old kerosene / oil lamp - free for download",
    author: "Scritta",
    authorUrl: "https://sketchfab.com/scritta",
    sourceUrl:
      "https://sketchfab.com/3d-models/old-kerosene-oil-lamp-free-for-download-ed58301fd5854d9ab6341f9c86c97008",
    modifications: STANDARD,
  },
  {
    usedFor: "Điện Thoại Dã Chiến",
    title: "Field Telephone WW2 - Free download",
    author: "Andy Woodhead",
    authorUrl: "https://sketchfab.com/Andywoodhead",
    sourceUrl:
      "https://sketchfab.com/3d-models/field-telephone-ww2-free-download-1af50b06e6ce4e099286bff451d4b17e",
    modifications: STANDARD,
  },
  {
    usedFor: "Bi Đông Của Người Lính",
    title: "Military Canteen",
    author: "FrieDev",
    authorUrl: "https://sketchfab.com/FrieDev",
    sourceUrl: "https://sketchfab.com/3d-models/military-canteen-a657cba8121c4da0a529f54ecbec10ef",
    modifications: STANDARD,
  },

  // ===== Phòng 2: 1951 - 1954 =====
  {
    usedFor: "Xe Tăng M24 Chaffee",
    title: "M24_Chaffee light tank",
    author: "李延权",
    authorUrl: "https://sketchfab.com/liyanquan6",
    sourceUrl: "https://sketchfab.com/3d-models/m24-chaffee-light-tank-aa10214b1ba14921b13685272415f676",
    modifications: STANDARD,
  },
  {
    usedFor: "Máy Bay Vận Tải C-47",
    title: "C47",
    author: "manilov.ap",
    authorUrl: "https://sketchfab.com/manilov.ap",
    sourceUrl: "https://sketchfab.com/3d-models/c47-c4fb0f24d55f4866a9669aa952dceaf3",
    modifications: STANDARD,
  },
  {
    usedFor: "Tiểu Liên PPSh-41",
    title: "PPSh-41",
    author: "Kelisei Ventura",
    authorUrl: "https://sketchfab.com/frankestudios71",
    sourceUrl: "https://sketchfab.com/3d-models/ppsh-41-56d47c5e159442adac0cacd3130e192f",
    modifications: STANDARD,
  },
  {
    usedFor: "Xẻng Đào Hào Điện Biên",
    title: "shovel",
    author: "Sergi Ezquerra",
    authorUrl: "https://sketchfab.com/Sergi.Ezquerra",
    sourceUrl: "https://sketchfab.com/3d-models/shovel-6ad1e14ecb254d1581848e69901f38d4",
    modifications: STANDARD,
  },
];

/**
 * Ảnh tư liệu lịch sử đang dùng trong bảo tàng.
 *
 * CHƯA XÁC ĐỊNH ĐƯỢC NGUỒN. File này có sẵn trong project từ trước, không kèm
 * thông tin xuất xứ, nên chưa thể ghi công chính xác. Trước khi công bố rộng rãi
 * cần tra lại nguồn gốc và điền vào đây, hoặc thay bằng ảnh có nguồn rõ ràng.
 */
export const IMAGE_CREDITS_TODO = [
  "loi_keu_goi.jpg - Lời Kêu Gọi Toàn Quốc Kháng Chiến",
  "co_quyet_chien.webp - Lá Cờ 'Quyết Chiến Quyết Thắng'",
];

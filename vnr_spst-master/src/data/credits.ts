/**
 * Ghi công tác giả các mô hình 3D.
 *
 * Cả ba mô hình đang dùng đều mang giấy phép CC BY 4.0. Giấy phép này CHO PHÉP
 * dùng và sửa đổi thoải mái, kể cả cho mục đích thương mại, nhưng BẮT BUỘC:
 *   1. Ghi tên tác giả
 *   2. Dẫn link tới giấy phép
 *   3. Nêu rõ nếu tác phẩm đã bị sửa đổi
 * Thiếu bất kỳ điều nào là vi phạm giấy phép. Vì vậy bảng này phải luôn hiển
 * thị được trong ứng dụng, đừng gỡ đi.
 *
 * Số liệu dưới đây trích từ chính metadata nhúng trong file .glb
 * (asset.extras do Sketchfab ghi khi xuất), không phải chép tay.
 *
 * Thêm mô hình mới thì thêm một mục vào đây. Lấy thông tin bằng:
 *   node -e "const b=require('fs').readFileSync('duong/dan.glb');
 *   console.log(JSON.parse(b.slice(20,20+b.readUInt32LE(12))).asset.extras)"
 */
export interface ModelCredit {
  /** Tên hiện vật trong bảo tàng, để người xem đối chiếu được. */
  usedFor: string;
  /** Tên tác phẩm gốc do tác giả đặt. */
  title: string;
  author: string;
  authorUrl: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  /** Những gì đã sửa so với bản gốc - CC BY yêu cầu nêu rõ. */
  modifications: string;
}

export const MODEL_CREDITS: ModelCredit[] = [
  {
    usedFor: "Máy Chữ Chiến Khu Việt Bắc",
    title: "Máy đánh chữ",
    author: "atlantictruong",
    authorUrl: "https://sketchfab.com/atlantictruong19",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://sketchfab.com/3d-models/may-anh-chu-72d50626ee0843fbb774ba9585e0c793",
    modifications: "Giảm lưới còn 8% số đỉnh và nén bằng EXT_meshopt_compression.",
  },
  {
    usedFor: "Biểu Tượng Búa Liềm Vàng",
    title: "Communist Badge",
    author: "DylanFowler",
    authorUrl: "https://sketchfab.com/DylanFowler",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://sketchfab.com/3d-models/communist-badge-2727f9eabceb4b97b0873c3578baf190",
    modifications: "Thu nhỏ texture về 512² và nén bằng EXT_meshopt_compression.",
  },
  {
    usedFor: "Tượng Đài Chủ Tịch Hồ Chí Minh",
    title: "TUONG+BAC+HO",
    author: "vanchonxxx13",
    authorUrl: "https://sketchfab.com/vanchonxxx13",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://sketchfab.com/3d-models/tuongbacho-08d6a987c39b4bc0849f3be7e274dc97",
    modifications:
      "Gỡ lớp lưới viền không dùng tới, giảm lưới còn 50% số đỉnh và nén bằng EXT_meshopt_compression.",
  },
];

/**
 * Ảnh tư liệu lịch sử đang dùng trong bảo tàng.
 *
 * CHƯA XÁC ĐỊNH ĐƯỢC NGUỒN. Hai file này có sẵn trong project từ trước, không
 * kèm thông tin xuất xứ, nên chưa thể ghi công chính xác. Trước khi công bố
 * rộng rãi cần tra lại nguồn gốc và điền vào đây, hoặc thay bằng ảnh có nguồn rõ.
 */
export const IMAGE_CREDITS_TODO = [
  "loi_keu_goi.jpg - Lời Kêu Gọi Toàn Quốc Kháng Chiến",
  "co_quyet_chien.webp - Lá Cờ 'Quyết Chiến Quyết Thắng'",
];

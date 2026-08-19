"use client";

import { useEffect } from "react";

/**
 * Chặn các lối tắt mở công cụ nhà phát triển và menu chuột phải.
 *
 * ĐỌC KỸ TRƯỚC KHI TIN VÀO THỨ NÀY:
 *
 * Đây chỉ là RÀO CẢN GÂY PHIỀN, không phải cơ chế bảo mật. Không có cách nào
 * chặn được devtools từ phía trình duyệt, vì:
 *
 *   - Devtools mở được từ menu trình duyệt, không cần phím tắt nào
 *   - Tắt JavaScript là vô hiệu hoá luôn đoạn chặn này
 *   - Xem nguồn trang, tải thẳng file .js, hoặc dùng proxy đều không đụng tới bàn phím
 *   - Trình duyệt trên điện thoại và trình duyệt khác có lối tắt khác
 *
 * Quan trọng hơn: TOÀN BỘ ĐÁP ÁN NẰM TRONG GÓI JAVASCRIPT GỬI VỀ MÁY NGƯỜI CHƠI.
 * museumData.ts chứa roomId và position của từng hiện vật, tức là bản đồ đáp án
 * đầy đủ. Ai chịu khó đọc file bundle là biết hết, dù có chặn phím hay không.
 *
 * Muốn thực sự giấu đáp án thì phải chuyển việc kiểm tra lên máy chủ: client chỉ
 * nhận gợi ý, mỗi lần đặt hiện vật thì gửi lên server đối chiếu. Đó là thay đổi
 * kiến trúc, không phải vài dòng chặn phím.
 *
 * Giữ đoạn này ở mức nhẹ nhất có thể để không cản trở người dùng bình thường.
 */
export default function DevtoolsGuard() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();

      // F12
      if (k === "F12") {
        e.preventDefault();
        return;
      }
      // Ctrl/Cmd + Shift + I / J / C  (Inspector, Console, Chọn phần tử)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "J", "C"].includes(k)) {
        e.preventDefault();
        return;
      }
      // Ctrl/Cmd + U  (xem mã nguồn trang)
      if ((e.ctrlKey || e.metaKey) && k === "U") {
        e.preventDefault();
      }
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("contextmenu", onContextMenu);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  return null;
}

<h1 align="center">Bảo Tàng Lịch Sử Đảng 3D</h1>

<p align="center">
  Một bảo tàng ảo chạy thẳng trong trình duyệt, kể lại đường lối kháng chiến<br/>
  chống thực dân Pháp của Đảng Cộng sản Việt Nam (1945 – 1954).
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="Three.js" src="https://img.shields.io/badge/three.js-r185-000000?logo=threedotjs&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <b>🏛️ Vào bảo tàng: <a href="https://vnr-202-coral.vercel.app/">vnr-202-coral.vercel.app</a></b><br/>
  <sub>Mở trình duyệt là vào thẳng, không cần cài gì.</sub>
</p>

---

## Đây là gì

Thay vì một bài thuyết trình trượt qua từng slide, đây là **một không gian ba
chiều bạn tự đi vào**: sảnh chính Kim Liên mở ra ba phòng trưng bày, mỗi phòng
là một giai đoạn của cuộc kháng chiến. 15 hiện vật — từ bản *Lời kêu gọi toàn
quốc kháng chiến*, thùng phiếu Tổng tuyển cử đầu tiên, cho tới xe tăng M24
Chaffee và chiếc xẻng đào hào Điện Biên — đứng trên bệ, có biển đồng, có ánh
sáng riêng, bấm vào là mở ra câu chuyện của nó.

Toàn bộ dựng bằng React Three Fiber, không cần cài gì, không cần Unity, không
cần plugin. Mở link là vào bảo tàng.

## Điểm thú vị: học bằng cách xếp hiện vật

Bảo tàng **không mở sẵn**. Vào lần đầu, các bệ trong ba phòng đều trống — hiện
vật nằm trong túi đồ, và trên mỗi bệ chỉ có một tấm biển đồng ghi gợi ý.

Muốn xem bảo tàng, bạn phải xếp đúng 13 hiện vật vào đúng bệ của chúng. Gợi ý
mô tả đủ để người nắm nội dung bài nhận ra, nhưng **không gọi tên** — tên nằm
trong túi đồ, đó mới là thứ phải chọn. Tên phòng cũng cố tình không mang niên
đại: đoán ra phòng nào thuộc giai đoạn nào chính là một phần của trò chơi.

Đặt sai thì **màn hình khoá 10 giây** — đủ lâu để người chơi phải suy nghĩ thay
vì thử vét cạn. Xếp xong toàn bộ một phòng, niên đại và diễn giải của phòng đó
mới hiện ra, và chế độ **Tham quan** (camera tự bay qua từng hiện vật) mới được
mở khoá.

Nói cách khác: đây vừa là bảo tàng, vừa là bài kiểm tra tự giác về nội dung môn học.

## Có gì bên trong

| | |
|---|---|
| **4 không gian** | Sảnh Chính Kim Liên + 3 phòng theo giai đoạn 1945–1946, 1946–1950, 1951–1954 |
| **15 hiện vật 3D** | Model `.glb` thật, đã giảm lưới và nén bằng `EXT_meshopt_compression` để tải nhanh |
| **Shader viết tay** | Sàn đá hoa, quầng sáng vàng quanh hiện vật, cột sáng thể tích, mặt nạ lấy nét hướng tâm |
| **Chế độ Ngày / Đêm** | Đổi toàn bộ hệ ánh sáng của bảo tàng |
| **Chế độ Tham quan** | Camera tự động dẫn khách đi qua từng hiện vật, kèm thuyết minh |
| **Pháo hoa & hiệu ứng** | Post-processing pipeline riêng, phần thưởng khi hoàn thành |
| **Bảng ghi công** | Mọi model đều CC BY 4.0 và được ghi tên tác giả, link giấy phép, nêu rõ phần đã sửa |

## Công nghệ

**Next.js 16** (App Router) · **React 19** · **React Three Fiber** + **drei** +
**postprocessing** · **Three.js** · **Zustand** cho state · **Tailwind CSS 4** ·
**TypeScript** · **framer-motion** · pipeline nén model bằng `@gltf-transform`.

## Chạy thử

```bash
cd vnr_spst-master
npm install
npm run dev
```

Mở http://localhost:3000.

```bash
npm run optimize:models   # nén lại các file .glb trong public/assets/models
npm run build             # bản production
```

## Giấy phép hiện vật

Tất cả mô hình 3D dùng trong bảo tàng mang giấy phép
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Bảng ghi công tác giả
luôn truy cập được ngay trong ứng dụng — đúng yêu cầu của giấy phép.

> Đồ án môn **VNR202 – Lịch sử Đảng Cộng sản Việt Nam**.

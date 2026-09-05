# Bảo Tàng Lịch Sử Đảng 3D — mã nguồn

Giới thiệu đầy đủ về dự án: [README ở gốc repo](../README.md).

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # bản production
npm run lint
npm run optimize:models  # nén lại .glb trong public/assets/models
```

Cấu trúc `src/`:

| Thư mục | Nội dung |
| --- | --- |
| `app/` | App Router: `layout.tsx`, `page.tsx`, `globals.css` |
| `components/` | `Experience.tsx` (cảnh 3D), `OverlayUI.tsx` (giao diện 2D), model hiện vật, hiệu ứng |
| `components/shaders/` | Shader viết tay: sàn đá hoa, quầng sáng vàng, cột sáng thể tích, mặt nạ lấy nét |
| `data/` | `museumData.ts` — phòng, hiện vật, gợi ý · `credits.ts` — ghi công tác giả model |
| `store/` | `useStore.ts` — Zustand: phòng đang xem, hiện vật đã xếp, khoá khi đặt sai |
| `utils/` | Che niên đại (`maskDates.ts`), âm thanh (`soundEffects.ts`) |

# CLAUDE.md — Prototype UI · App Ăn Chay (SWP391)

@design/DESIGN.md
@design/ANTI-SLOP.md
@design/DECISIONS.md

## Bối cảnh

- Môn SWP391, Đại học FPT. Đề tài: "Ứng dụng hỗ trợ người ăn chay" (web app có AI, trợ lý AI tên **Mầm**).
- Khôi: phụ trách UI/UX của nhóm + trang **User Post Page** (Bảng tin). Mọi quyết định thiết kế do Khôi chốt.
- Thư mục này là **prototype**, nằm NGOÀI repo nhóm. Không chép file của thư mục này hay công cụ bên thứ ba vào repo nhóm.
- Repo nhóm (client thật): `C:\FPTU\Ki_5\SWP391\vegetarians_social_web_app_SWP\client` — React 19 + Vite, Bootstrap 5 + SCSS, token `$ac-*`.
  Chỉ ĐỌC repo nhóm để tham khảo; không sửa trừ khi Khôi yêu cầu rõ.
- Quy trình: làm & chốt giao diện ở prototype → port sang client (dùng bảng ánh xạ ở DESIGN.md §9).

## Prototype có gì

- Stack: React 19 + Vite 7, CSS Modules, bootstrap-icons, `@fontsource/be-vietnam-pro`, `motion`, `gsap`.
- Chạy: `npm run dev` → `http://localhost:5173/` (v2.1), `/v3.html` (v3), `/v1.html` (v1).
- **v2.1 (`src/v2/`) là bản chính đang phát triển** — đã áp 6 màu, sidebar theo Sketch, nút sáng/tối theo client.
  v1, v3 là bản thử nghiệm cũ; không sửa nếu không được yêu cầu (v3 còn dùng font Fraunces, lệch DESIGN.md).
- Bộ kit dùng chung: `src/components/` (Button, Menu, Toast, Skeleton, EmptyState, Notice, PostComposer…),
  `src/styles/` (`_tokens.scss`, `theme.scss`), `src/utils/theme.js` (`useTheme`, key `anchay-theme`).
  **Dùng lại component kit trước khi viết component mới.**
- Dữ liệu giả: `src/shared/mockData.js` (Bảng tin v1/v2/v3) và `src/kit/mock.js`, `src/kit/sampleData.js` (trang trưng bày kit) — tên field giống API thật.
- `src/shared/`: thứ dùng chung cho nhiều bản (`ProtoAvatar`, `mockData`). Không import chéo giữa `v2/` và `prototype/` (v1).
- **Màu chỉ định nghĩa ở `src/styles/theme.scss`** (Sáng ở `:root`, Tối ở `:root[data-theme="dark"]`). `v2.css` chỉ còn bố cục.
- Tài liệu nghiệp vụ (BR, ERD, trạng thái bài viết) nằm trong Project trên claude.ai, không có ở thư mục này.
  Gặp câu hỏi nghiệp vụ (ai được sửa/xóa bài, bài có những trạng thái gì) → hỏi Khôi, không tự đoán.

## Cách làm việc với Khôi

- Trả lời bằng **tiếng Việt**, văn bản thường, không dùng bảng/thẻ rườm rà khi không cần.
- Khi sửa code: chỉ đưa **đoạn thay đổi (diff)**, không dán lại cả file.
- Việc lớn (nhiều file, đổi bố cục, đổi token): **hỏi trước, nêu kế hoạch ngắn**, chờ Khôi đồng ý.
- Giải thích kèm **ví dụ số cụ thể** (vd "cỡ chữ 0.76rem ≈ 12.2px, gần 0.78rem ≈ 12.5px → mắt không phân biệt được").
- Khi Khôi muốn học (hỏi "tại sao"): gợi mở, đặt câu hỏi dẫn dắt. Khi Khôi gấp: đưa lời giải đầy đủ.

## Quy trình mỗi lần làm UI

1. Đọc yêu cầu → xác định màn hình/component nào bị ảnh hưởng.
2. Kiểm tra DESIGN.md (token) và ANTI-SLOP.md (luật) — đã nạp sẵn ở trên.
3. Điều chưa có luật → hỏi Khôi; khi Khôi chốt, thêm 1 dòng vào `design/DECISIONS.md`.
4. Làm xong: `npm run build` phải qua; chụp màn hình Sáng + Tối (Playwright, `npm run preview` cổng 4173);
   chạy checklist cuối ANTI-SLOP.md; báo kết quả kèm điểm chưa đạt (nếu có).

## Lưu ý kỹ thuật

- Windows + VS Code: nếu Khôi đang mở file trong editor, lưu đè có thể làm mất thay đổi của agent
  → nhắc Khôi đóng tab / tải lại file sau khi agent sửa.
- Không đổi tên/xóa file của kit trong `src/components`, `src/styles` nếu không được yêu cầu.

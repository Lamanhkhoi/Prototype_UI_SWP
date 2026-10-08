# DECISIONS.md — Nhật ký quyết định thiết kế

> Mỗi dòng: ngày · quyết định · lý do · người chốt.
> Agent: đọc file này đầu phiên. Khi Khôi chốt điều mới, thêm 1 dòng vào "Đã chốt".
> Mục "Đang mở" = chưa có luật → hỏi, không tự quyết.

## Đã chốt

- 08/10/2026 · Bảng 6 màu: Nền kem `#FBF7EE` (60%), Bề mặt ngà `#FFFDF8` (30%), Chữ nâu đen `#2A2620`, Xanh rêu `#3D5A3D` (hành động chính), Vàng cúc `#F9A620` (AI/MỚI), Đất nung `#B7472A` (cảnh báo/xóa) · Giới hạn 5–6 màu theo góp ý anh Thuần; bộ "Vườn v2.1" cũ trên Bảng tin bị thay thế · Khôi (UI/UX của nhóm)
- 08/10/2026 · Nút sáng/tối = icon + nhãn của chế độ sẽ chuyển sang, không dùng công tắc gạt · Đồng bộ với `FeedSidebar` của client · Khôi
- 08/10/2026 · Prototype nằm ngoài repo nhóm; không đẩy file công cụ bên thứ ba vào repo · Giữ repo sạch · Khôi
- 08/10/2026 · Thang chữ 12/14/16/20/24/32px, độ đậm chỉ 400/600/700 · Prototype có 46 cỡ chữ và 5 độ đậm gây nhiễu · Khôi
- 08/10/2026 · Lưới 8pt (4 là nửa bước); bỏ `--ac-space-5: 20px` · 105/204 khoảng cách đang lệch lưới · Khôi
- 08/10/2026 · Thêm `--v-field-line` (#958B78 / #7E7563) cho viền ô nhập · Viền cũ 1.62:1, WCAG 1.4.11 cần ≥ 3:1 · Khôi
- 08/10/2026 · Màu dinh dưỡng: Sáng giữ bộ gốc client (đạm #1D7A4A…), Tối dùng bộ prototype · Giữ nhận diện cũ · Khôi

## Đang mở

- Giới hạn hiệu ứng trang trí: tối đa 1 / khu vực (ANTI-SLOP §1) — v2 đang dùng nhiều hiệu ứng React Bits cùng lúc
- v3 dùng font Fraunces + bảng màu ô liu, lệch DESIGN.md → giữ v3 làm tham khảo hay bỏ?
- Chữ trắng trên đất nung ở chế độ Tối (`#FFFFFF` / `#E07A5F`) chỉ đạt 2.95:1 (cần 4.5 cho chữ nhỏ như số trên chuông thông báo). Đề xuất: Tối dùng chữ `#1C1A16` (5.89:1)
- Persona, IA, responsive — cần cả nhóm thống nhất

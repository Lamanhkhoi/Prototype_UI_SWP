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
- 09/10/2026 · Gộp 2 bộ kit thành 1: bộ duy nhất là `src/components` + `src/styles`; component của v2 sẽ được đưa dần vào kit · Tránh 4 bản PostCard / 4 bản thanh điều hướng / 4 bộ màu song song · Khôi
- 09/10/2026 · 6 màu áp cho TOÀN app (cả Đăng nhập, Admin, Hồ sơ), không chỉ Bảng tin; chế độ Tối toàn app đổi từ "Vườn đêm" xanh rừng sang nâu đen · Khôi sẽ làm UI các trang đó · Khôi
- 09/10/2026 · Màu định nghĩa 1 chỗ ở `src/styles/theme.scss`; `--ac-*` là tên chính thức, `--v-*` chỉ là bí danh và sẽ đổi dần sang `--ac-*` khi gộp từng component · Một nguồn sự thật · Khôi
- 09/10/2026 · Thứ dùng chung nhiều bản đặt ở `src/shared/` (`ProtoAvatar`, `mockData`); v2 không còn import từ `src/prototype/` (v1) · Để xóa v1 không làm hỏng v2 · Khôi
- 09/10/2026 · Gộp ProtoAvatar vào `components/Avatar`: mỗi người 1 tông theo tên (6 tông, ngoại lệ bảng màu như màu dinh dưỡng — DESIGN.md §1.3); chữ pha 64% để đạt ≥ 4.5:1 cả 2 chế độ · Khôi chọn phương án 2 vì đẹp; avatar 1 màu matcha cũ chỉ đạt 3.06:1 · Khôi
- 09/10/2026 · Nền chế độ Tối đổi từ nâu đen (#1C1A16) sang đúng bộ nền tối của client (nền #0A0E0B, thẻ #111713, bề mặt 2 #172019, bề mặt 3 #1D2820, viền #1F2A22 / #2E3C32); chữ + rêu + vàng cúc + đất nung giữ theo 6 màu · Đồng bộ với giao diện client đang chạy; mọi cặp chữ/nền vẫn ≥ 5.17:1 · Khôi
- 11/10/2026 · Trang Tạo công thức chốt bố cục B: khung 976 = form 608 + gap 32 + cột phụ 336; khối padding 24, bo 20, khối ↔ khối 24; cột phụ (Xem trước + Gửi) cố định khi cuộn; bỏ thẻ Tiến độ; Xem trước là thẻ luôn hiện, không phải popup; thẻ xem trước dùng bo góc lá · B to rõ nhất; dòng "Còn thiếu: …" dưới nút Gửi đã báo thiếu gì · Khôi
- 11/10/2026 · Thanh bên v2 về đúng 4 mục thật của client (Bảng tin, Món chay, Thực đơn, Quán chay), không tô sáng mục nào khi ở trang Tạo công thức; lối vào Tạo công thức là 1 mục trong hộp tài khoản · Theo thảo luận nghiệp vụ 11/10 · Khôi
- 15/10/2026 · Công thức Bị từ chối có nút "Sửa và gửi lại" ngay trên thẻ → mở lại form bố cục B điền sẵn, lý do từ chối ở đầu form, nút "Gửi lại công thức" (khóa khi chưa sửa gì); gửi lại = cập nhật CÙNG `recipe_id`, `status` về `pending`, xóa lý do cũ · Không sinh bản trùng trong danh sách · Khôi
- 15/10/2026 · Bỏ tính năng Rút lại / Xóa công thức đã gửi · Chưa cần, chưa có trạng thái nháp · Khôi
- 15/10/2026 · Trang xem công thức đã duyệt (khối "Công thức cho món này" trong chi tiết món, trang chi tiết công thức 2A/2B) chưa làm UI; bảng box model để sẵn trên canvas "Công thức – phần User còn thiếu" · Khôi
- 16/10/2026 · Khối "Hôm nay ăn gì?" ở cột trái Bảng tin: phong cách Organic, bố cục A (câu hỏi 24px màu rêu làm tiêu đề cạnh đĩa món 88px, tên món bên dưới cả bề ngang thẻ); thẻ bo 24, 1 trang trí là nhành lá · Khôi chọn A trong 3 bố cục A/B/C; giữ font Be Vietnam Pro + 6 màu, không dùng Nunito · Khôi
- 16/10/2026 · Món gợi ý lấy từ bảng dish (chỉ `active`), không có danh sách viết cứng; tự đổi 4 giây/lần, rê chuột thì dừng, không có nút "Gợi ý món khác"; lỗi hoặc chưa có món → ẩn thẻ · Khôi
- 16/10/2026 · Hình món trong thẻ luôn là hình bát minh hoạ, không dùng `dish.image_url` · Ảnh thật lúc có lúc không làm thẻ không đồng nhất · Khôi
- 16/10/2026 · Tên món co theo độ dài: ≤ 10 ký tự 32px · ≤ 18: 24px · ≤ 40: 20px · dài hơn 16px (tối đa 3 dòng); khung tên cao cố định 64px nên đổi món thẻ không cao thấp · Thử với tên 3 → 80 ký tự · Khôi
- 18/10/2026 · Trang xem công thức đã duyệt (#/cong-thuc/:id) dùng bố cục 2B: đầu trang ảnh 448 + thông tin 496; bên dưới Cách làm 608 | Nguyên liệu 336 cố định khi cuộn (cùng khung với trang Tạo công thức); màn < 1100px Nguyên liệu lên trước Cách làm · Đang nấu ở bước nào cũng thấy số lượng · Khôi
- 18/10/2026 · Cảnh báo dị ứng trên trang xem công thức: khung đỏ đầu thẻ Nguyên liệu + dòng trùng tô đỏ kèm chữ "Bạn dị ứng" (so khớp bỏ dấu với danh sách dị ứng trong hồ sơ); chỉ cảnh báo, không ẩn công thức · Khôi
- 18/10/2026 · Công thức chưa có ảnh bìa → hình bát minh hoạ trên nền vàng mơ (cùng kiểu thẻ "Hôm nay ăn gì?") · Khôi
- 18/10/2026 · Thanh bên: mục "Món chay" đổi thành "Công thức" (#/cong-thuc) cho giống dự án; thay quyết định 11/10 "không thêm mục Công thức" · Khôi
- 18/10/2026 · Trang Công thức dùng bố cục C: ô tìm + "Ẩn món tôi dị ứng"; khối "Nổi bật tuần này" (thẻ to 608 + 3 thẻ ngang 336); mỗi danh mục món (Món chính, Món nước…, thứ tự Admin sắp, danh mục rỗng thì ẩn) 1 hàng 3 công thức mới nhất + "Xem tất cả"; có từ khoá hoặc chọn danh mục → lưới kết quả phẳng có chip danh mục và sắp xếp · Món cụ thể chỉ hiện khi tìm/lọc · Khôi
- 18/10/2026 · "Nổi bật tuần này" = nhiều lượt thích nhất 7 ngày, bằng nhau thì mới duyệt trước; thiếu thì lấy thêm công thức mới duyệt; tuần chưa ai thích → tiêu đề đổi thành "Mới duyệt tuần này" · Không ghi "nổi bật" sai sự thật · Khôi
- 18/10/2026 · Thêm nút Thích cho công thức (trang xem công thức) và số lượt thích trên thẻ · Cần cho xếp hạng nổi bật · Khôi

## Đang mở

- Giới hạn hiệu ứng trang trí: tối đa 1 / khu vực (ANTI-SLOP §1) — v2 đang dùng nhiều hiệu ứng React Bits cùng lúc
- v3 dùng font Fraunces + bảng màu ô liu, lệch DESIGN.md → giữ v3 làm tham khảo hay bỏ?
- Chữ trắng trên đất nung ở chế độ Tối (`#FFFFFF` / `#E07A5F`) chỉ đạt 2.95:1 (cần 4.5 cho chữ nhỏ như số trên chuông thông báo). Đề xuất: Tối dùng chữ `#1C1A16` (5.89:1)
- Một số biến Tối của kit vẫn còn tông xanh rừng cũ (nền trạng thái ok/warn/bad, Toast, logo, nút Bootstrap `.btn-primary`/`.btn-outline-primary`, link Bootstrap `#8DB580`). v2 chưa dùng nên chưa đổi → rà lại khi gộp các component đó
- Persona, IA, responsive — cần cả nhóm thống nhất
- Trang Tạo công thức: bố cục khi màn hình hẹp đang để tạm (< 1100px cột phụ xuống dưới form, hết cố định) → chốt cùng mục responsive
- Ô nhập của kit (Bootstrap `form-control`) chưa dùng `--v-field-line` như DESIGN.md §1.1 → viền ô vẫn mờ; nên sửa 1 lần cho cả kit
- Dữ liệu Recipe cần sửa ERD (Tùng): `recipe.dish_id` cho phép null, thêm `status`, `proposed_dish_name`, `rejection_reason`
- Gửi lại công thức cần API `PUT /api/recipes/:id` (chỉ tác giả, chỉ khi `rejected`) và cột `recipe.updated_at` → báo backend / Tùng
- Trang xem công thức: chưa có nút Báo cáo (chờ nhóm chốt ai xử lý)
- Trang Công thức cần dữ liệu mới (Tùng/backend): bảng lượt thích công thức (likeCount, likesThisWeek, likedByMe), `recipe.moderated_at`, danh mục của công thức (qua dish ↔ dish_category), API GET /recipes (công khai, có q, category, sort) và POST/DELETE /recipes/:id/like; báo Lâm, Duy, Tùng việc đổi tên mục thanh bên

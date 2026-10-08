# ANTI-SLOP.md — Luật DÙNG (hành vi, chữ, trạng thái) + Checklist

> v1.0 · 08/10/2026 · Người chốt: Khôi
> DESIGN.md = trông thế nào (màu, chữ, khoảng cách). File này = hoạt động thế nào.
> Mỗi luật: **Luật** → Lý do (nguồn) → Trong app → Kiểm tra.

---

## 1. Danh sách CẤM (dấu hiệu "AI slop")

| ❌ Cấm | ✅ Thay bằng | Lý do |
|-------|-------------|-------|
| Gradient tím/xanh, màu tím của template Vite (`#aa3bff`) | 6 màu ở DESIGN.md §1 | Ngoài bảng màu đã chốt |
| Chữ màu vàng cúc; chữ trắng trên nền vàng | Vàng chỉ làm nền, chữ `#2A2620` | Tương phản 1.87 / 2.00 < 4.5 |
| Emoji làm icon (🌱 🔥 ❤️) | bootstrap-icons (`bi-heart`, `bi-fire`…) | Emoji hiển thị khác nhau mỗi máy, không đổi màu theo theme |
| Công tắc gạt cho Sáng/Tối | Icon + nhãn chế độ sẽ chuyển sang | Đồng bộ client (DECISIONS) |
| Font Inter/Roboto/Fraunces, font thứ 2 | Chỉ Be Vietnam Pro | Đủ dấu tiếng Việt, 1 font cho nhất quán |
| Cỡ chữ, khoảng cách, bo góc "tùy hứng" (0.78rem, 14px, 22px…) | Thang trong DESIGN.md §2–§4 | Nhất quán (Figma: Consistency) |
| 3 thẻ giống hệt nhau + icon tròn + tiêu đề chung chung | Bố cục theo nội dung thật | Mẫu landing page sáo rỗng |
| Câu chung chung: "Chào mừng đến với tương lai của…", "Lorem ipsum" | Chữ thật, nói đúng việc người dùng làm | UX writing (§4) |
| Mã hex viết thẳng trong component | `var(--v-*)` / `var(--ac-*)` | 1 nguồn sự thật |
| Xóa `outline` khi focus | Giữ outline rêu 2px | Người dùng bàn phím mất dấu (WCAG 2.4.7) |
| Hiệu ứng trang trí chồng nhau (chữ ánh kim + chữ xoay + đếm số + tia lá cùng 1 màn) | Tối đa 1 hiệu ứng trang trí / khu vực **(đề xuất – chờ Khôi duyệt)** | Gây nhiễu, phân tán chú ý (Nielsen #8) |
| Màu là dấu hiệu DUY NHẤT (chỉ đỏ = lỗi) | Màu + icon + chữ | Người mù màu không nhận ra |

---

## 2. Nielsen 10 — áp vào App Ăn Chay

### #1 Hiển thị trạng thái hệ thống
- **Luật:** Mọi thao tác mất > 300ms phải có phản hồi; > 1s có Skeleton hoặc Spinner.
- **Lý do:** Không thấy phản hồi, người dùng bấm lặp hoặc tưởng app treo.
- **Trong app:** Bấm "Đăng" → nút hiện spinner + chặn bấm lặp → Toast "Đã đăng bài". Bảng tin đang tải → `Skeleton` của kit (không để màn trắng). Thích → icon đổi `bi-heart-fill` ngay lập tức (cập nhật lạc quan), lỗi mới hoàn tác.
- **Kiểm tra:** Có thao tác nào bấm xong không thấy gì thay đổi không?

### #2 Khớp với thế giới thật
- **Luật:** Dùng từ người ăn chay dùng hằng ngày; không dùng thuật ngữ kỹ thuật.
- **Trong app:** "Đăng bài", "Lưu món", "Thực đơn hôm nay" — không "Submit", "Entity", "Post ID", "Lỗi 500".
- **Kiểm tra:** Có chữ tiếng Anh hoặc từ kỹ thuật nào lọt ra giao diện không?

### #3 Người dùng kiểm soát & tự do (User control and freedom)
- **Luật:**
  1. Hành động phá hủy (xóa bài, xóa bình luận) → Toast "Đã xóa bài" + nút **Hoàn tác** trong 5 giây, HOẶC hộp xác nhận nếu không hoàn tác được (client có `ConfirmDialog`; prototype chưa có → chép từ client khi cần).
  2. Đang soạn bài dở mà đóng/rời trang → ConfirmDialog "Bỏ bản nháp?" với 2 nút "Tiếp tục viết" / "Bỏ nháp".
  3. Mọi hộp thoại, menu, popup đóng được bằng **Esc**, bấm ra ngoài, và nút X.
  4. Luôn có lối thoát: nút Quay lại, Hủy đặt cạnh nút chính.
- **Lý do:** Người dùng hay bấm nhầm; cần "lối thoát khẩn cấp" (Nielsen #3, IxDF).
- **Kiểm tra:** Có hành động phá hủy nào không có xác nhận HOẶC hoàn tác? Có popup nào không đóng được bằng Esc?

### #4 Nhất quán & theo chuẩn
- **Luật:** Cùng một việc → cùng chữ, cùng icon, cùng vị trí ở mọi màn. Theo mẫu quen thuộc của mạng xã hội (Jakob's Law).
- **Trong app:** Thẻ bài: avatar → tên → thời gian → nội dung → ảnh → hàng Thích/Bình luận/Lưu. Menu ••• luôn ở góc phải trên thẻ. "Xóa" luôn màu đất nung, luôn ở cuối menu, tách bằng đường kẻ.
- **Kiểm tra:** Cùng một hành động có bị gọi 2 tên khác nhau ("Xóa" / "Gỡ bài") không?

### #5 Phòng lỗi
- **Luật:** Chặn lỗi trước khi xảy ra: nút "Đăng" bị vô hiệu khi bài trống; đếm ký tự khi gần giới hạn; kiểm tra định dạng/dung lượng ảnh ngay khi chọn.
- **Kiểm tra:** Có cách nào gửi đi một bài sai/trống không?

### #6 Nhận ra hơn là nhớ
- **Luật:** Hiện lựa chọn thay vì bắt người dùng nhớ. Icon quan trọng kèm nhãn chữ.
- **Trong app:** Gợi ý hashtag/danh mục khi gõ; sidebar thu gọn → tooltip hiện tên mục khi rê chuột.
- **Kiểm tra:** Có icon đứng một mình mà không có nhãn hoặc tooltip không?

### #7 Linh hoạt & hiệu quả
- **Luật:** Phím tắt cho người dùng quen, không bắt buộc với người mới.
- **Trong app:** `Ctrl K` nhảy vào ô tìm; `Enter` gửi bình luận, `Shift+Enter` xuống dòng.

### #8 Thẩm mỹ & tối giản (gộp Progressive Disclosure)
- **Luật:** Mỗi màn có **1 hành động chính** (màu rêu). Thông tin phụ ẩn sau "Xem thêm", menu •••, hoặc bước sau.
- **Trong app:** Thẻ bài dài > 5 dòng → cắt + "Xem thêm". Tùy chọn nâng cao khi đăng bài (đối tượng xem, danh mục) gập lại.
- **Kiểm tra:** Màn hình có hơn 1 nút màu rêu nổi bật cạnh nhau không?

### #9 Giúp nhận ra, chẩn đoán, khắc phục lỗi
- **Luật:** Báo lỗi = **chuyện gì xảy ra + cách sửa**, đặt ngay cạnh chỗ lỗi, kèm nút "Thử lại" nếu có thể.
- **Trong app:** "Ảnh lớn hơn 5 MB. Hãy chọn ảnh nhỏ hơn." (dưới ô chọn ảnh) — không "Upload failed".
  *(5 MB chỉ là ví dụ — giới hạn thật lấy theo BR của nhóm.)*

### #10 Trợ giúp & tài liệu
- **Luật:** Gợi ý ngắn ngay tại chỗ (placeholder, chú thích dưới ô), không bắt đọc trang hướng dẫn.
- **Trong app:** Ô đăng bài: "Hôm nay bạn nấu món chay gì?". Thẻ Mầm lần đầu: 1 dòng giải thích Mầm làm được gì.

---

## 3. 5 trạng thái màn hình (bắt buộc cho mọi màn có dữ liệu)

| Trạng thái | Khi nào | Hiển thị | Component kit |
|-----------|---------|---------|---------------|
| Đang tải | Lần đầu lấy dữ liệu | Skeleton đúng hình dạng thẻ thật (không spinner giữa màn trắng) | `Skeleton` |
| Rỗng | Chưa có dữ liệu | Icon + 1 câu nói rõ tình trạng + 1 nút hành động. Vd "Bạn chưa có bài nào." [Đăng bài đầu tiên] | `EmptyState` |
| Lỗi | Gọi API thất bại | Câu dễ hiểu + nút "Thử lại"; giữ lại dữ liệu cũ nếu có | `Notice` |
| Một phần | Có ít dữ liệu / đang tải thêm | Hiện phần đã có + spinner nhỏ cuối danh sách | `Spinner` |
| Đầy đủ | Bình thường | Bố cục chuẩn | — |

Thêm 2 trường hợp hay quên: **Khách chưa đăng nhập** (bấm Thích → mời đăng nhập, không báo lỗi) và **Mất mạng** (Notice ở đầu trang).

**Kiểm tra:** Màn này đã có đủ 5 trạng thái chưa? Tắt mạng thử thì thấy gì?

---

## 4. UX writing (chữ trên giao diện)

1. **Nút = động từ + đối tượng:** "Đăng bài", "Lưu món", "Xóa bình luận". ❌ "OK", "Xác nhận", "Submit".
2. **Hộp xác nhận:** tiêu đề là câu hỏi cụ thể, nút ghi đúng hành động.
   ✅ "Xóa bài viết này?" · [Hủy] [Xóa bài] — ❌ "Bạn có chắc không?" · [Không] [Có]
3. **Báo lỗi:** chuyện gì + cách sửa, không đổ lỗi người dùng, không mã lỗi.
   ✅ "Chưa kết nối được. Kiểm tra mạng rồi thử lại." — ❌ "Error 500", "Bạn đã nhập sai!"
4. **Báo thành công:** ngắn, thì quá khứ: "Đã lưu món", "Đã đăng bài".
5. **Giọng văn:** thân thiện, xưng "bạn", câu ngắn (≤ 15 từ), không dùng "!!!", không viết HOA cả câu (trừ nhãn "MỚI", "AI").
6. **Mầm (AI):** luôn ghi rõ là gợi ý của AI ("Mầm gợi ý"), không khẳng định như chuyên gia dinh dưỡng.
7. **Thống nhất từ:** Bài viết (không "post"), Bình luận, Thích, Lưu, Thực đơn, Quán chay.

---

## 5. Kích thước & thao tác (Laws of UX)

- **Fitts:** nút chính cao ≥ 40px (desktop); vùng chạm ≥ 44×44px (mobile); nút hay dùng đặt gần nơi mắt/tay đang ở.
- **Hick:** menu ••• tối đa ~5 mục, mục hay dùng ở trên, mục nguy hiểm ở cuối.
- **Jakob:** bố cục bảng tin theo mẫu mạng xã hội quen thuộc, không tự phát minh.
- **Proximity (Gestalt):** khoảng cách trong nhóm < giữa nhóm (DESIGN.md §3).

---

## 6. Việc để sau (chưa có luật — KHÔNG tự đặt)

- **User flow** "Khách → Đăng nhập → Đăng bài": vẽ khi có bản chạy được, tìm chỗ gãy.
- **Usability testing**: 3–5 người thử, ghi chỗ vấp. Làm sau khi có bản chạy được.
- **Persona, IA, responsive**: cần cả nhóm thống nhất (xem DECISIONS.md "Đang mở").

---

## 7. CHECKLIST trước khi báo "xong" (trả lời có/không)

Chấm mức nghiêm trọng cho mỗi "không": 0 = không phải lỗi · 1 = thẩm mỹ · 2 = nhỏ · 3 = lớn · 4 = chặn dùng (Nielsen severity).

**Nhìn (DESIGN.md)**
- [ ] Chỉ dùng biến màu, không có mã hex mới trong component?
- [ ] Cỡ chữ ∈ {12,14,16,20,24,32}, độ đậm ∈ {400,600,700}?
- [ ] Khoảng cách ∈ {4,8,12,16,24,32,48,64}; bo góc ∈ 7 giá trị ở §4?
- [ ] Đúng ở cả Sáng và Tối (đã chụp màn hình cả 2)?
- [ ] Chữ trên nền vàng là `#2A2620`; không có chữ màu vàng?

**Dùng (file này)**
- [ ] Mỗi màn chỉ 1 hành động chính màu rêu?
- [ ] Hành động phá hủy có xác nhận HOẶC hoàn tác?
- [ ] Popup/menu đóng được bằng Esc + bấm ra ngoài?
- [ ] Có đủ 5 trạng thái (tải, rỗng, lỗi, một phần, đầy đủ)?
- [ ] Mọi thao tác có phản hồi (spinner, Toast, đổi icon)?

**Chữ**
- [ ] Nút ghi động từ + đối tượng? Lỗi ghi chuyện gì + cách sửa?
- [ ] Không có chữ tiếng Anh, mã lỗi, Lorem ipsum?

**Tiếp cận (Accessibility)**
- [ ] Dùng Tab đi hết được mọi nút, thấy rõ viền focus?
- [ ] Icon đứng một mình có `aria-label`; ảnh có `alt`?
- [ ] Không dùng màu làm dấu hiệu duy nhất?
- [ ] Có tôn trọng `prefers-reduced-motion`?

**Kỹ thuật**
- [ ] `npm run build` chạy qua, console không có lỗi đỏ?

Báo cáo cuối: liệt kê mục "không" kèm mức 0–4 và vị trí (file:dòng).

---

## Nguồn

- Nielsen Norman Group — "10 Usability Heuristics for User Interface Design"; thang mức nghiêm trọng 0–4.
- Interaction Design Foundation — "User Control and Freedom".
- Figma — "UI design principles" (Hierarchy, Progressive Disclosure, Consistency, Contrast, Accessibility, Proximity, Alignment).
- Laws of UX (lawsofux.com) — Fitts, Hick, Jakob.
- Refactoring UI (Wathan & Schoger) — Hierarchy, Spacing (tóm ý, không trích nguyên văn).
- WCAG 2.2 — 1.4.3, 1.4.11, 2.4.7.

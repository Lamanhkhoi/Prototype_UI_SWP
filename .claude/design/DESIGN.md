# DESIGN.md — App Ăn Chay (lớp NHÌN)

> Trạng thái: v1.0 · 08/10/2026 · Người chốt: Khôi (UI/UX của nhóm)
> Đây là nguồn sự thật DUY NHẤT cho màu, chữ, khoảng cách, bo góc, bóng, icon.
> File khác chỉ trỏ tới đây, không định nghĩa lại giá trị.
> Điều chưa có trong file này = chưa chốt → hỏi Khôi, KHÔNG tự quyết (xem `DECISIONS.md` mục "Đang mở").

## 0. Luật cho agent (đọc trước khi viết bất kỳ dòng UI nào)

1. Chỉ dùng biến CSS (`var(--ac-*)`; `var(--v-*)` là tên cũ của v2, chỉ là bí danh). Không viết mã hex trực tiếp trong component.
   Mọi biến màu được định nghĩa ở **một chỗ duy nhất: `src/styles/theme.scss`** — không khai báo lại ở file khác.
2. Không thêm màu, cỡ chữ, khoảng cách, bo góc nào ngoài các bảng dưới đây.
   Cần giá trị mới → dừng lại, đề xuất cho Khôi, ghi vào `DECISIONS.md` mục "đang mở".
3. Mỗi thay đổi UI phải chạy được ở cả Sáng và Tối.
4. Làm xong: chụp màn hình (Playwright) Sáng + Tối, đối chiếu checklist cuối `ANTI-SLOP.md`.
5. **Chữ đặt TRÊN nền màu không bao giờ dùng `--v-text`** (vì `--v-text` đảo màu theo Sáng/Tối). Dùng biến "on-":
   - Trên nền xanh rêu → `--v-on-accent` (Sáng `#FFFFFF`, Tối `#1C1A16`)
   - Trên nền vàng cúc → `--ac-on-highlight` (`#2A2620` ở CẢ HAI chế độ)
   - Trên nền đất nung → `--ac-on-alert` (xem lưu ý chế độ Tối ở DECISIONS.md "Đang mở")
   `--v-text` chỉ dùng cho chữ đặt trên nền kem / ngà (`--v-bg`, `--v-surface`).

---

## 1. Màu — 6 màu thương hiệu (ĐÃ CHỐT 08/10/2026)

Tỉ lệ 60-30-10: nền chiếm ~60%, bề mặt ~30%, màu nhấn ≤10%.

| # | Tên | Hex (Sáng) | Hex (Tối) | Biến | Dùng cho | Cấm |
|---|-----|-----------|-----------|------|----------|-----|
| 1 | Nền kem | `#FBF7EE` | `#1C1A16` | `--v-bg` | Nền trang (~60%) | — |
| 2 | Bề mặt ngà | `#FFFDF8` | `#24211C` | `--v-surface` | Thẻ, sidebar, hộp thoại (~30%) | — |
| 3 | Chữ nâu đen | `#2A2620` | `#FBF7EE` | `--v-text` | Chữ chính, icon | Không dùng đen thuần `#000` |
| 4 | Xanh rêu | `#3D5A3D` | `#8FB083` | `--v-accent` | 1 hành động chính / khu vực, tab đang chọn, link | Không dùng làm nền diện rộng |
| 5 | Vàng cúc | `#F9A620` | `#F9A620` | `--v-marigold` | Nhãn AI, "MỚI", điểm nhấn hiếm | **Không bao giờ làm màu chữ**; chữ trên nó luôn `#2A2620` qua biến `--ac-on-highlight` (KHÔNG dùng `--v-text`) |
| 6 | Đất nung | `#B7472A` | `#E07A5F` | `--ac-alert` | Xóa, cảnh báo, lỗi, số thông báo | Không dùng để trang trí |

Lý do các cấm (đã đo tỉ lệ tương phản, chuẩn WCAG AA: chữ thường ≥ 4.5, chữ lớn/thành phần UI ≥ 3):

| Cặp | Tỉ lệ | Kết quả |
|-----|-------|---------|
| Chữ nâu đen / Nền kem | 14.06 | ✅ |
| Chữ phụ `#6F675A` / Nền kem | 5.22 | ✅ |
| Trắng / Xanh rêu (chữ trên nút chính) | 7.70 | ✅ |
| Xanh rêu / Nền kem (link) | 7.20 | ✅ |
| Nâu đen / Vàng cúc | 7.52 | ✅ |
| **Vàng cúc / Nền kem (chữ vàng)** | **1.87** | ❌ → lý do cấm chữ vàng |
| **Trắng / Vàng cúc** | **2.00** | ❌ → lý do chữ trên vàng phải là nâu đen |
| **(Tối) Kem `#FBF7EE` / Vàng cúc** | **1.87** | ❌ → vì sao KHÔNG dùng `--v-text` cho chữ trên vàng: ở chế độ Tối `--v-text` đổi thành kem |
| Trắng / Đất nung | 5.32 | ✅ |
| Đất nung / Nền kem | 4.97 | ✅ |
| (Tối) Chữ phụ `#A69E8F` / Thẻ `#24211C` | 6.04 | ✅ |
| (Tối) Nền `#1C1A16` / Rêu sáng `#8FB083` | 7.20 | ✅ |

### 1.1 Màu phái sinh (không phải màu mới)

Viền, hover, nền nhạt được phép, NHƯNG chỉ là sắc độ đậm/nhạt của 6 màu trên.
Tất cả đã có biến trong `src/v2/v2.css` — dùng biến, không tự pha thêm.

| Vai trò | Sáng | Tối | Biến |
|---------|------|-----|------|
| Bề mặt 2 (hover, ô nhập) | `#F5F0E4` | `#2C2923` | `--v-surface-2` |
| Bề mặt 3 (mục đang chọn) | `#E7EEDF` | `#2F362B` | `--v-surface-3` |
| Chữ phụ 2 | `#4A443B` | `#DCD5C6` | `--v-text-2` |
| Chữ mờ | `#6F675A` | `#A69E8F` | `--v-muted` |
| Viền mảnh (trang trí) | `#E8E0D0` | `#36322B` | `--v-line` |
| Viền đậm | `#CFC4AE` | `#4A453C` | `--v-line-2` |
| Rêu hover | `#324B32` | `#A3C197` | `--v-accent-hover` |
| Rêu nền nhạt | `#E7EEDF` | rêu 14% | `--v-accent-soft` |
| Chữ trên nền rêu | `#FFFFFF` | `#1C1A16` | `--v-on-accent` |
| Chữ trên nền vàng cúc | `#2A2620` | `#2A2620` (giữ nguyên) | `--ac-on-highlight` |

| Viền ô nhập | `#958B78` | `#7E7563` | `--v-field-line` (MỚI) |

**Viền ô nhập (ĐÃ CHỐT 08/10):** ô nhập, ô chọn, checkbox dùng `--v-field-line`, KHÔNG dùng `--v-line-2`.
Lý do: `#CFC4AE` chỉ đạt 1.62 trên nền kem; WCAG 1.4.11 yêu cầu viền thành phần UI ≥ 3:1.
`#958B78` đạt 3.15 (nền kem) / 3.31 (ngà); `#7E7563` đạt 3.52 trên thẻ tối. Biến mới — cần thêm vào `v2.css`.

### 1.2 Ngoại lệ: màu dữ liệu dinh dưỡng

Chỉ dùng trong biểu đồ/thanh dinh dưỡng, luôn kèm chữ hoặc icon (không dựa vào màu).

**ĐÃ CHỐT 08/10 · đã áp vào code 09/10:** Sáng giữ bộ gốc của client (`_tokens.scss`). Tối dùng bộ của prototype (client chưa có bộ Tối).

| Nhóm chất | Sáng | Tối | Biến |
|-----------|------|-----|------|
| Đạm | `#1D7A4A` | `#6CC58A` | `--ac-protein` |
| Carb | `#D4900A` | `#E9B44C` | `--ac-carb` |
| Béo | `#B7472A` | `#E98A76` | `--ac-fat` |
| Xơ | `#7B4B94` | `#A993D8` | `--ac-fiber` |

(Bộ cũ `#2F8A4E / #C98A12 / #C9563B / #7B5DB8` của v2 đã bỏ ngày 09/10.)

### 1.3 Ngoại lệ: tông màu avatar chữ cái (ĐÃ CHỐT 09/10/2026)

Avatar chưa có ảnh → nền + chữ pha từ 1 trong 6 tông, chọn theo tên (mỗi người một màu, cố định).
Chỉ dùng trong `components/Avatar`. Không dùng các tông này ở chỗ khác.

| Tông | `#3D7A3D` | `#A0582A` | `#2F7E8E` | `#8B55A8` | `#A87A00` | `#C0502F` |
|------|-----------|-----------|-----------|-----------|-----------|-----------|

- Nền: `color-mix(tông 20%, --ac-card)` · Chữ: `color-mix(tông 64%, --ac-ink)`.
- Tương phản chữ thấp nhất: Sáng **4.87** · Tối **4.79** (≥ 4.5). Đừng tăng 64% lên — ở 72% chữ Tối chỉ còn 4.18.

---

## 2. Chữ (type scale)

Font duy nhất: **Be Vietnam Pro** (có đủ dấu tiếng Việt). Không dùng Inter, Roboto hay font thứ hai.

**Hiện trạng prototype:** 46 cỡ chữ khác nhau (0.66rem, 0.7rem, 0.72rem, 0.74rem, 0.76rem, 0.78rem…).
Mắt người không phân biệt được 0.76rem với 0.78rem → đó là "nhiễu", không phải phân cấp.

**Thang chữ (ĐÃ CHỐT 08/10):** 6 cỡ, mỗi bậc cách nhau đủ xa để thấy khác biệt.

| Token | px | rem | Dùng cho |
|-------|----|-----|----------|
| `--fs-xs` | 12 | 0.75 | Nhãn phụ, thời gian đăng, chú thích |
| `--fs-sm` | 14 | 0.875 | Menu sidebar, nút, meta, bình luận |
| `--fs-md` | 16 | 1 | Nội dung bài viết, ô nhập (≥16px để iPhone không tự phóng to) |
| `--fs-lg` | 20 | 1.25 | Tiêu đề thẻ, tiêu đề hộp thoại |
| `--fs-xl` | 24 | 1.5 | Tiêu đề khu vực |
| `--fs-2xl` | 32 | 2 | Tiêu đề trang (tối đa 1 lần / trang) |

Độ đậm: chỉ **400** (thường), **600** (nhấn), **700** (tiêu đề).
Hiện trạng có cả 500 và 800 (15 chỗ dùng 800) → quy về 600/700.

Luật phân cấp: tách cấp bằng **độ đậm và màu chữ trước** (`--v-text` → `--v-text-2` → `--v-muted`),
chỉ tăng cỡ chữ khi hai cách trên chưa đủ. (Nguồn: Refactoring UI — phần Hierarchy)

Chiều cao dòng: nội dung 1.6 · tiêu đề 1.25 · nút/nhãn 1.

---

## 3. Khoảng cách — lưới 8pt

**Hiện trạng prototype:** 105/204 giá trị padding/margin/gap nằm ngoài lưới (3, 5, 6, 7, 10, 14, 18, 22px…).

Thang cho phép (4 là nửa bước, dùng cho chi tiết nhỏ như icon cạnh chữ):

| Token | px | Dùng cho |
|-------|----|----------|
| `--ac-space-1` | 4 | Icon ↔ chữ, badge |
| `--ac-space-2` | 8 | Trong nút, giữa các mục nhỏ |
| `--ac-space-3` | 12 | Padding mục menu, khoảng giữa các dòng meta |
| `--ac-space-4` | 16 | Padding thẻ (mobile), gap giữa các thẻ |
| `--ac-space-6` | 24 | Padding thẻ (desktop), giữa các nhóm |
| `--ac-space-8` | 32 | Giữa các khu vực |
| `--ac-space-12` | 48 | Khoảng lớn đầu trang |
| `--ac-space-16` | 64 | Khoảng trống trạng thái rỗng |

**ĐÃ CHỐT 08/10:** bỏ `--ac-space-5: 20px` (lệch lưới 8pt). Chỗ đang dùng 20 → đổi sang 16 hoặc 24.
Kit hiện chỉ có `--ac-space-1` → `-6`; các biến `-8`, `-12`, `-16` (và `--fs-*` ở mục 2) là biến MỚI, cần thêm vào `theme.scss` khi duyệt.

Luật gần nhau (Proximity): khoảng cách BÊN TRONG một nhóm < khoảng cách GIỮA các nhóm.
Ví dụ trong thẻ bài: avatar ↔ tên = 8 · khối đầu ↔ nội dung = 12 · nội dung ↔ hàng tương tác = 16 · thẻ ↔ thẻ = 16.

---

## 4. Bo góc

**Hiện trạng:** 32 kiểu bo góc khác nhau. Còn lại 7:

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `--ac-radius-sm` | 6px | Badge, chip nhỏ, tag |
| `--ac-radius` | 8px | Nút, ô nhập |
| `--ac-radius-lg` | 14px | Thẻ thường, menu thả xuống, hộp thoại |
| `--ac-radius-surface` | 20px | Bề mặt lớn: thẻ bài viết, khối cột phải |
| `--ac-radius-leaf` | 18px 6px 18px 6px | **Chỉ** thẻ món ăn (nét nhận diện riêng của app) |
| `--ac-radius-full` | 999px | Pill: nút "Thông báo", chip lọc |
| `50%` | — | Avatar, nút icon tròn |

---

## 5. Bóng đổ & lớp nổi

Dùng tối đa 3 mức, không dùng bóng màu, không dùng glow phát sáng (ngoại lệ: chấm AI `--v-ai-glow`).

| Biến | Dùng cho |
|------|----------|
| `--v-shadow` | Thẻ trên nền |
| `--ac-shadow-md` | Menu thả xuống |
| `--v-shadow-pop` / `--ac-shadow-lg` | Hộp thoại, popup |

Ở chế độ Tối, ưu tiên phân lớp bằng màu bề mặt (`--v-surface` → `-2` → `-3`) thay vì bóng.

---

## 6. Icon

- Bộ duy nhất: **bootstrap-icons** (`<i className="bi bi-...">`). ❌ Không dùng emoji làm icon.
- Cỡ: 16 (trong chữ/nút nhỏ) · 20 (sidebar, hàng tương tác) · 24 (nút icon lớn).
- Icon đứng một mình (không có chữ) PHẢI có `aria-label`.
- Trạng thái bật/tắt dùng cặp icon thường ↔ `-fill` (vd `bi-heart` ↔ `bi-heart-fill`).

---

## 7. Trạng thái component (mọi thành phần bấm được)

| Trạng thái | Cách thể hiện |
|------------|---------------|
| Mặc định | Theo token |
| Hover | Nền `--v-surface-2` (nút phụ) hoặc `--v-accent-hover` (nút chính) |
| Nhấn (active) | `transform: scale(.98)` |
| Focus bàn phím | `outline: 2px solid var(--v-accent); outline-offset: 2px` — KHÔNG được xóa outline |
| Đang chọn | Nền `--v-surface-3`, chữ `--v-accent-text`, đậm 600 |
| Vô hiệu | `opacity: .5; cursor: not-allowed` + lý do (tooltip/chữ) nếu không hiển nhiên |
| Đang xử lý | Spinner trong nút + giữ nguyên độ rộng + chặn bấm lặp |
| Lỗi (ô nhập) | Viền `--ac-alert` + dòng chữ lỗi bên dưới + icon `bi-exclamation-circle` |

Kích thước vùng bấm: nút ≥ 40px cao (desktop), vùng chạm ≥ 44×44px (mobile). (Nguồn: Fitts's Law)

Chuyển động: 150ms (hover) · 250ms (mở menu/hộp thoại) · easing `--ac-ease-out`.
Luôn tôn trọng `prefers-reduced-motion: reduce`.

---

## 8. Sáng / Tối

- Gắn bằng `<html data-theme="light|dark">`, lưu key `anchay-theme` (`utils/theme.js`).
- Nút chuyển: **icon + nhãn của chế độ SẼ chuyển sang** (đang Sáng → hiện `bi-moon-stars` "Chế độ tối";
  đang Tối → hiện `bi-sun` "Chế độ sáng"). ❌ Không dùng công tắc gạt (switch).
  Mẫu chuẩn: `client/src/components/FeedSidebar/FeedSidebar.jsx`.
- Vàng cúc giữ nguyên ở cả 2 chế độ; xanh rêu và đất nung sáng lên ở chế độ Tối (bảng mục 1).

---

## 9. Bảng ánh xạ prototype ↔ client (dùng khi port)

| Prototype (`--v-*`, CSS Modules) | Client (`$ac-*`, SCSS) | Ghi chú |
|----------------------------------|------------------------|---------|
| `--v-bg` | `$ac-cream` | ✅ khớp `#FBF7EE` |
| `--v-surface` | `$ac-card` | ✅ khớp `#FFFDF8` |
| `--v-text` | `$ac-ink` | ✅ khớp `#2A2620` |
| `--v-muted` | `$ac-muted` | ✅ khớp `#6F675A` |
| `--v-accent` | `$ac-moss` | ✅ khớp `#3D5A3D` |
| `--v-marigold` | `$ac-highlight` | ✅ khớp `#F9A620` |
| `--ac-alert` | `$ac-alert` | ✅ khớp `#B7472A` |
| `--v-line` / `--v-line-2` | `$ac-border` / `$ac-border-strong` | ✅ khớp |

⚠️ **Cần sửa ở client** khi port: `client/src/styles/feed-theme.css` (trang Bảng tin) vẫn dùng bộ "Vườn v2.1" cũ,
lệch khỏi 6 màu: nền `#F5F4EE`, chữ `#17201A`, rêu `#3E7A47` (Sáng) và nền `#0A0E0B`, rêu `#9CCB86` (Tối).
→ Thay bằng giá trị ở mục 1 (đã chốt 08/10/2026).

⚠️ **Rác còn sót ở prototype:** `src/index.css` vẫn chứa màu tím của template Vite (`#aa3bff`, `#c084fc`).
→ Xóa khi dọn dẹp.

---

## Nguồn

- Code: `src/v2/v2.css`, `src/styles/_tokens.scss`, `src/styles/theme.scss` (prototype); `client/src/styles/_tokens.scss`, `client/src/styles/feed-theme.css`.
- Tỉ lệ tương phản: tính theo công thức WCAG 2.x (relative luminance), 08/10/2026.
- Figma: "App Ăn Chay – Bảng tin: Sketch → Hi-fi", khung "Bảng 6 màu".
- Lý thuyết: WCAG 2.2 (1.4.3, 1.4.11), Refactoring UI (Hierarchy, Spacing), Laws of UX (Fitts).

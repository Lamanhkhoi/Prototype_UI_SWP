# Prototype UI — Bảng tin Ăn Chay

- **http://localhost:5173/v3.html**: **v3** (mới nhất)
- **http://localhost:5173/**: v2.1
- **http://localhost:5173/v1.html**: v1

Ở v2 và v3 có nút **So sánh v2 | v3** nổi giữa đáy màn hình để chuyển qua lại. Chế độ Sáng / Tối được giữ khi chuyển bản.

```bash
npm install
npm run dev
```

## v3: "Bếp nhà" (làm theo gợi ý của skill ui-ux-pro-max)

Hướng thiết kế lấy từ `--design-system` của ui-ux-pro-max: kiểu **Nature Distilled + Flat**, màu ô liu + đất nung.
Font gợi ý là Karla, nhưng font này không có dấu tiếng Việt nên đổi sang **Fraunces** (tiêu đề, tải từ Google Fonts) + **Be Vietnam Pro** (nội dung).

| Chỗ | v2.1 | v3 |
|---|---|---|
| Điều hướng | Thanh bên trái, thu gọn được | Thanh ngang trên đầu. Nội dung được trọn bề ngang |
| Bố cục | 3 cột: lời chào · bảng tin · hoạt động | 2 cột: bảng tin rộng · cột phải. Lời chào trải ngang phía trên |
| Màu | Tối xanh rêu là chính | Sáng kem là chính. Tối dùng nâu than ấm. Ô liu cho mục đang chọn, đất nung cho nút Đăng bài |
| Chữ tiêu đề | Be Vietnam Pro đậm | Fraunces (có chân, kiểu tạp chí ẩm thực) |
| Thẻ bài | Tác giả ở trên, ảnh ở dưới, có bóng đổ | Ảnh 16:9 lên đầu, tràn viền. Phẳng, chỉ có viền mảnh |
| Hiệu ứng | 8 hiệu ứng React Bits (BlurText, RotatingText, CountUp, GlareHover, ClickSpark…) | Gần như không có. Thẻ hiện dần khi vào trang, tim nảy khi Thích. Tắt hết khi máy bật "giảm chuyển động" |
| Mầm (AI) | Biểu tượng neon phát sáng, chữ ánh kim, 4 vòng tròn | Ô ô liu phẳng, 1 thanh ngang chia phần dinh dưỡng |
| Cột phải | Đang diễn ra · Quán · Chủ đề | Mầm gợi ý · Quán (có giờ mở cửa) · Top chủ đề đánh số. Bỏ "Đang diễn ra" |
| Màn < 1024px | Lời chào lên trên | Thẻ Mầm lên trên bảng tin, ẩn quán + chủ đề |

Mọi cặp chữ/nền đạt WCAG AA ở cả Sáng lẫn Tối (thấp nhất 4.74:1).

```
src/v3/
├── main.jsx, App.jsx, App.module.css, v3.css (token Sáng + Tối)
└── components/  TopNav · PostCard · Side (MamPlan, Shops, Trending)
src/VersionSwitch.*   nút chuyển v2 ↔ v3 (dùng chung)
```
Dùng lại: khung "Hỏi nhanh Mầm" của v2 (`AskMam`), dữ liệu giả `src/prototype/data.js`, các component của kit.

## v2.1: "Vườn" hiện đại, không ánh neon

Mã nguồn một số component copy từ github.com/DavidHDev/react-bits (bản JS + CSS) vào `src/v2/reactbits/`,
kèm file giấy phép `LICENSE-react-bits.md` (MIT + Commons Clause: được dùng trong app,
không được bán lại chính các component). Thư viện chạy kèm: `motion`, `gsap`.

**Bố cục**
- **Thanh bên trái** gồm Đăng bài, menu, "Của bạn", công tắc **Sáng / Tối** và tài khoản.
  - Nút ở cạnh logo: **thu gọn / mở rộng**. Lựa chọn được nhớ; màn hình dưới 1200px tự thu gọn ở lần đầu.
  - Điện thoại: thanh bên thành ngăn kéo, mở bằng nút ☰ trên thanh trên.
- **Thanh trên**: chỉ có ô tìm (Ctrl K để nhảy vào, Enter để lọc theo tiêu đề) và chuông.
- **Neon**: đã bỏ hết, chỉ còn ở **biểu tượng AI của Mầm** (mục "Hỏi Mầm", thẻ Mầm gợi ý, dòng tin "Mầm vừa lên…").

**Component React Bits đang dùng**

| Chỗ | Component |
|---|---|
| "Chào buổi sáng, Khôi." hiện dần từ mờ | BlurText |
| "Hôm nay ăn [món]?" chữ đổi liên tục | RotatingText |
| Số thành viên / món / quán đếm lên | CountUp |
| Tiêu đề thẻ Mầm ánh kim | ShinyText |
| Rê chuột qua ảnh: vệt loé nhẹ | GlareHover |
| Bấm Thích: bắn tia lá | ClickSpark |
| Thẻ bài hiện dần khi cuộn tới | FadeContent |
| "Đang diễn ra": từng dòng trượt vào | AnimatedList |

Đã gỡ khỏi v2.1: Aurora, GooeyNav, StarBorder, BorderGlow, SpotlightCard. Nếu thư mục của bạn còn các file
`src/v2/components/Header.*` và `src/v2/reactbits/{Aurora,GooeyNav,StarBorder,BorderGlow,SpotlightCard}.*`
thì đó là file cũ không còn dùng, xoá được.

### Cấu trúc v2.1

```
src/v2/
├── main.jsx, App.jsx, App.module.css, v2.css (token màu Sáng + Tối)
├── components/  Sidebar · Topbar · Hero · AiPlanCard · PostCard · Rail
└── reactbits/   component gốc của React Bits
```

---

# (Cũ) Prototype UI v1

Thư mục thử nghiệm giao diện, **tách khỏi repo nhóm**. Bộ kit trong `src/components`, `src/styles`, `src/utils` giữ nguyên, không sửa dòng nào.
Mọi thứ mới nằm trong `src/prototype/`.

## Chạy

```bash
npm install
npm run dev
```

Mở http://localhost:5173/v1.html (cần Node 20.19+ hoặc 22+).

## Góc phải dưới có thanh điều khiển

- **Vườn / Than chì**: đổi bảng màu
- **☀ / ☾**: đổi Sáng / Tối

Có 4 tổ hợp. Hãy xem cả 4 trước khi chấm.

## v1 đổi những gì so với bản đang chạy

| Chỗ | Bản cũ | v1 |
|---|---|---|
| Nền | Nền và thẻ cùng một tông, trông phẳng | 3 lớp: nền → thẻ → mục nổi. Viền 1px có ánh sáng mảnh ở mép trên |
| Thanh bên | Dock icon + chữ nhỏ bên dưới | ≥1200px: thanh rộng có chữ, nút **Đăng bài** to, nhóm "Của bạn". 768–1199px: tự thu về icon |
| Menu tài khoản | Đăng xuất nằm sát nút đổi giao diện | Đăng xuất ở **cuối**, tách bằng đường kẻ |
| Đầu bảng tin | Chỉ có ô tìm | Ô "Hôm nay bạn nấu món chay gì?" + lọc theo danh mục (chip đảo màu khi chọn) |
| Thẻ bài | Ảnh to gần nửa màn hình, like/comment chỉ là icon nhỏ | Ảnh khung cố định **16:10**. 3 nút hành động có chữ, cao 40px, chia đều. Bài hỏi nhanh (không ảnh) hiện chữ lớn như status |
| Cột phải | Không có | **Mầm gợi ý hôm nay** (viền sáng chạy chậm, là chỗ chuyển động duy nhất) · Quán gần bạn · Danh mục sôi nổi |
| Avatar | Mọi người cùng màu matcha | Mỗi người một màu đất/lá theo tên |
| Màu | — | Mọi cặp chữ/nền đạt WCAG AA (chữ phụ ≥ 5.7:1) |

Bảng **Than chì**: nền trung tính kiểu Linear, nút chính màu mực, xanh lá chỉ còn ở chỗ nhấn (mục đang chọn, đã thích, link).
Bảng **Vườn**: giữ màu rêu + kem của app, nút chính màu xanh.

## Cấu trúc

```
src/prototype/
├── main.jsx            điểm vào (index.html trỏ tới đây)
├── ProtoApp.jsx        ráp màn Bảng tin
├── tokens.css          2 bảng màu × Sáng/Tối, phủ lên theme.scss của kit
├── palette.js          lưu lựa chọn bảng màu
├── data.js             dữ liệu giả (tên field giống API thật)
└── components/
    ├── Shell.*         thanh bên + thanh trên + tab dưới (điện thoại)
    ├── FeedCard.*      thẻ bài v1 (cùng props với PostCard)
    ├── FeedTop.*       ô đăng bài nhanh + lọc danh mục
    ├── Rail.*          cột phải
    ├── ProtoAvatar.jsx avatar nhiều màu
    └── ProtoControls.* thanh điều khiển (chỉ có trong prototype)
```

Component của kit được dùng lại: `Menu`, `IconButton`, `Photo`, `SearchInput`, `Logo`, `Toast`, `useTheme`.

## Ảnh

Ảnh mẫu lấy từ Unsplash (cần mạng), **chưa chắc khớp tên món**. Muốn thấy đúng hiệu ứng:
bỏ 4–5 ảnh món chay thật vào `public/img/`, rồi trong `src/prototype/data.js` đổi `thumbnailUrl` thành `'/img/ten-anh.jpg'`.

## Chấm v1 — gợi ý câu hỏi

1. Bảng màu nào hợp hơn: **Vườn** hay **Than chì**? Sáng hay Tối làm mặc định?
2. Thanh bên rộng có chữ có chiếm chỗ quá không?
3. Cột phải: giữ cả 3 khối, hay bớt?
4. Thẻ bài: ảnh 16:10 vừa chưa? 3 nút có chữ có rối không?
5. Viền chạy của thẻ Mầm: thích / quá lố / bỏ?
6. Điều gì vẫn làm bạn thấy "chưa đẹp"? (ghi cụ thể chỗ nào càng tốt)

## Chưa làm trong v1

Modal chi tiết bài, bình luận, hộp đăng bài thật, trạng thái đang tải / trống / lỗi, giao diện khách.
Các nút này hiện Toast "Prototype: ... sẽ nối với trang thật".

// Dữ liệu GIẢ chỉ để xem giao diện. Tên field đặt giống API thật của PostFeedPage
// (title, content, thumbnailUrl, categories, voteCount, commentCount, isVoted, hasReported...)
// để sau này mang component sang dự án chỉ cần đổi nguồn dữ liệu.
//
// Ảnh: ảnh stock từ Unsplash (cần mạng). Muốn dùng ảnh món thật của nhóm:
// bỏ file vào public/img/ rồi đổi thumbnailUrl thành '/img/ten-anh.jpg'.
// Ảnh lỗi / không có mạng → Photo của kit tự thay bằng nền lá xanh.

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
const ago = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();

export const CURRENT_USER = { id: 1, name: 'Lâm Anh Khôi', role: 'Thành viên' };

export const NAV = [
  { key: 'feed', label: 'Bảng tin', icon: 'house', iconActive: 'house-fill', href: '#' },
  { key: 'dishes', label: 'Món chay', icon: 'egg-fried', href: '#' },
  { key: 'meal-plan', label: 'Thực đơn', icon: 'calendar-week', iconActive: 'calendar-week-fill', href: '#' },
  { key: 'shops', label: 'Quán chay', icon: 'shop', href: '#' },
  { key: 'ask', label: 'Hỏi Mầm', icon: 'stars', href: '#', tag: 'AI' },
];

export const SHORTCUTS = [
  { key: 'mine', label: 'Bài của tôi', icon: 'journal-text', href: '#' },
  { key: 'notifications', label: 'Thông báo', icon: 'bell', href: '#', count: 3 },
];

export const CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 1, name: 'Ăn sáng' },
  { id: 2, name: 'Món nước' },
  { id: 3, name: 'Món khô' },
  { id: 4, name: 'Mẹo bếp' },
  { id: 5, name: 'Tráng miệng' },
  { id: 6, name: 'Đồ uống' },
];
// Bữa trưa / tối: chỉ v2 lọc theo (v1, v3 giữ danh mục cũ)
export const MEAL_TIMES = [{ id: 7, name: 'Ăn trưa' }, { id: 8, name: 'Ăn tối' }];
const cat = (id) => [...CATEGORIES, ...MEAL_TIMES].find((c) => c.id === id);

export const POSTS = [
  {
    id: 101,
    type: 'blog',
    author: { id: 7, fullName: 'Nguyễn Anh Tuấn' },
    createdAt: ago(2),
    title: 'Bữa trưa 15 phút: bowl rau củ và đậu gà nướng',
    content: 'Đậu gà trộn chút dầu ô liu, bột ớt paprika rồi nướng 12 phút là giòn. Ăn kèm cơm gạo lứt, dưa leo, bơ và sốt mè rang. Đủ đạm, no lâu mà không ngán.',
    thumbnailUrl: unsplash('1546069901-ba9599a7e63c'),
    categories: [cat(3), cat(7)],
    voteCount: 48,
    commentCount: 12,
    isVoted: true,
  },
  {
    id: 102,
    type: 'blog',
    author: { id: 8, fullName: 'Trần Hải Yến' },
    createdAt: ago(5),
    title: 'Mọi người có mẹo nào để đậu hũ chiên giòn lâu không? Mình chiên xong 10 phút là mềm lại rồi.',
    content: '',
    categories: [cat(4)],
    voteCount: 9,
    commentCount: 21,
    isVoted: false,
  },
  {
    id: 103,
    type: 'video',
    author: { id: 9, fullName: 'Lê Minh Thắng' },
    createdAt: ago(20),
    title: 'Salad cầu vồng sốt chanh dây cho ngày nắng',
    content: 'Video 6 phút: cách cắt rau cho đẹp, trộn sốt chanh dây không cần máy xay và bảo quản salad trong hộp để mang đi làm.',
    thumbnailUrl: unsplash('1512621776951-a57141f2eefd'),
    duration: '6:12',
    categories: [cat(3), cat(1)],
    voteCount: 132,
    commentCount: 34,
    isVoted: false,
  },
  {
    id: 104,
    type: 'blog',
    author: { id: 10, fullName: 'Phạm Thu Hà' },
    createdAt: ago(30),
    title: 'Canh rau củ ấm bụng cho tối mưa',
    content: 'Nước dùng ninh từ củ cải, bắp và nấm hương khô trong 40 phút. Bí quyết là nướng sơ hành tây trước khi thả vào nồi để nước ngọt và thơm hơn.',
    thumbnailUrl: unsplash('1547592180-85f173990554'),
    categories: [cat(2), cat(8)],
    voteCount: 27,
    commentCount: 6,
    isVoted: false,
    hasReported: true,
  },
  {
    id: 105,
    type: 'blog',
    author: { id: 11, fullName: 'Đỗ Gia Bảo' },
    createdAt: ago(52),
    title: 'Đĩa salad xanh "dọn tủ lạnh" cuối tuần',
    content: 'Còn gì dùng nấy: xà lách, cà chua bi, hạt hướng dương rang và vài lát táo. Sốt dầu giấm mù tạt pha 3:1 là hợp với gần như mọi loại rau.',
    thumbnailUrl: unsplash('1540189549336-e6e99c3679fe'),
    categories: [cat(3), cat(5)],
    voteCount: 15,
    commentCount: 3,
    isVoted: false,
  },
];

/** Thực đơn hôm nay Mầm gợi ý (meal_plan_item). kcal chỉ là số mẫu. */
export const TODAY_PLAN = {
  goal: 'Giữ cân',
  target: 1850,
  meals: [
    { slot: 'breakfast', label: 'Sáng', icon: 'sunrise', dish: 'Cháo yến mạch hạt chia', kcal: 360 },
    { slot: 'lunch', label: 'Trưa', icon: 'sun', dish: 'Cơm gạo lứt, đậu hũ sốt nấm', kcal: 620 },
    { slot: 'dinner', label: 'Tối', icon: 'moon-stars', dish: 'Canh bí đỏ và đậu gà', kcal: 480 },
  ],
  // phần trăm năng lượng theo nhóm chất (tổng 100)
  macros: [
    { key: 'protein', label: 'Đạm', pct: 22 },
    { key: 'carb', label: 'Tinh bột', pct: 50 },
    { key: 'fat', label: 'Béo', pct: 20 },
    { key: 'fiber', label: 'Xơ', pct: 8 },
  ],
};

export const SHOPS = [
  { id: 1, name: 'Quán chay Hoa Sen', area: 'Quận 3', distance: '1,2 km', open: true, until: '21:30', photo: unsplash('1512621776951-a57141f2eefd') },
  { id: 2, name: 'Bếp Lá', area: 'Quận 1', distance: '2,4 km', open: true, until: '22:00', photo: unsplash('1546069901-ba9599a7e63c') },
  { id: 3, name: 'An Nhiên Vegan', area: 'Bình Thạnh', distance: '3,1 km', open: false, until: '10:00', photo: unsplash('1540189549336-e6e99c3679fe') },
];

export const TRENDING = [
  { id: 2, name: 'Món nước', count: 128 },
  { id: 4, name: 'Mẹo bếp', count: 94 },
  { id: 1, name: 'Ăn sáng', count: 76 },
  { id: 6, name: 'Đồ uống', count: 41 },
];

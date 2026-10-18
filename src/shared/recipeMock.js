// =====================================================================
//  DỮ LIỆU GIẢ — trang Tạo công thức (Recipe) + "Công thức đã gửi"
//  Tên field theo ERD v4.1 (bảng dish, recipe, recipe_ingredient).
//
//  ⚠ Các field ĐỀ XUẤT, CHƯA CÓ trong ERD (cần nhóm chốt, Tùng sửa ERD):
//    recipe.status              'pending' | 'approved' | 'rejected'   (GAP-01)
//    recipe.proposed_dish_name  tên món User đề xuất, khi dish_id = null
//    recipe.rejection_reason    lý do Admin từ chối
//    recipe.dish_id             hiện NOT NULL → cần cho phép null
//    recipe.updated_at          lúc gửi lại (Sửa và gửi lại: cùng recipe_id, status về 'pending')
// =====================================================================

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=320&q=70`;

/** dish: chỉ status 'active' mới hiện trong ô chọn món. 'pending' có trong DB nhưng User không thấy. */
export const DISHES = [
  { dish_id: 1, name: 'Đậu hũ sốt cà chua', status: 'active' },
  { dish_id: 2, name: 'Đậu hũ chiên sả', status: 'active' },
  { dish_id: 3, name: 'Đậu hũ non hấp nấm', status: 'active' },
  { dish_id: 4, name: 'Canh rau củ', status: 'active' },
  { dish_id: 5, name: 'Canh chua chay', status: 'active' },
  { dish_id: 6, name: 'Phở chay', status: 'active' },
  { dish_id: 7, name: 'Bún riêu chay', status: 'active' },
  { dish_id: 8, name: 'Cơm chiên dương châu chay', status: 'active' },
  { dish_id: 9, name: 'Gỏi cuốn chay', status: 'active' },
  { dish_id: 10, name: 'Nấm kho tiêu', status: 'active' },
  { dish_id: 11, name: 'Mì xào rau củ', status: 'active' },
  { dish_id: 12, name: 'Chè đậu xanh', status: 'active' },
  { dish_id: 13, name: 'Buddha bowl đậu hũ', status: 'active', image_url: photo('1540189549336-e6e99c3679fe') },
  { dish_id: 14, name: 'Bánh xèo chay', status: 'pending' },
  // Dữ liệu thử độ co giãn của thẻ "Hôm nay ăn gì?": tên rất ngắn, rất dài, có ảnh / không ảnh
  { dish_id: 15, name: 'Bún', status: 'active' },
  { dish_id: 16, name: 'Xôi', status: 'active' },
  { dish_id: 17, name: 'Chè', status: 'active', image_url: photo('1546069901-ba9599a7e63c') },
  { dish_id: 18, name: 'Bún đậu mắm tôm chay kiểu Hà Nội', status: 'active' },
  { dish_id: 19, name: 'Lẩu nấm thập cẩm chay ăn kèm rau rừng và bún tươi', status: 'active' },
  { dish_id: 20, name: 'Cơm gạo lứt trộn rau củ nướng sốt mè rang với đậu hũ non chiên giòn và rong biển', status: 'active' },
  { dish_id: 21, name: 'Salad', status: 'active', image_url: photo('1512621776951-a57141f2eefd') },
  { dish_id: 22, name: 'Phở cuốn chay', status: 'active' },
  { dish_id: 23, name: 'Bánh mì chay xíu mại nấm sốt cà chua', status: 'pending' }, // pending → không được hiện
];

/**
 * Giả lập API công khai GET /recipes/dishes của client (recipeService.getActiveDishes):
 * trả { items } chỉ gồm món đang active. Sang dự án thật chỉ cần thay hàm này.
 */
export const fetchActiveDishes = () => new Promise((resolve) => {
  setTimeout(() => resolve({ items: DISHES.filter((d) => d.status === 'active') }), 400);
});

/** Gợi ý tên nguyên liệu (ingredient.name) cho IngredientEditor. */
export const INGREDIENT_NAMES = [
  'Đậu hũ', 'Cà chua', 'Nấm rơm', 'Nấm đông cô', 'Hành lá', 'Sả', 'Ớt', 'Tiêu',
  'Nước tương', 'Dầu ăn', 'Đường', 'Muối', 'Rau mùi', 'Cà rốt', 'Bắp cải', 'Giá đỗ',
];

/** Công thức của người đang đăng nhập (tab "Công thức đã gửi"), mới nhất trước. */
export const MY_RECIPES = [
  {
    recipe_id: 31,
    title: 'Đậu hũ sốt cà kiểu nhà làm',
    dish_id: 1,
    dish_name: 'Đậu hũ sốt cà chua',
    proposed_dish_name: null,
    thumbnail_url: null,
    servings: 2,
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    ingredient_count: 6,
    status: 'pending',
    rejection_reason: null,
    created_at: '2026-10-11T07:40:00+07:00',
  },
  {
    recipe_id: 27,
    title: 'Bánh xèo chay giòn rụm',
    dish_id: null,
    dish_name: null,
    proposed_dish_name: 'Bánh xèo chay',
    thumbnail_url: null,
    servings: 4,
    prep_time_minutes: 30,
    cook_time_minutes: 20,
    ingredient_count: 9,
    status: 'pending',
    rejection_reason: null,
    created_at: '2026-10-09T19:12:00+07:00',
  },
  {
    recipe_id: 22,
    title: 'Canh chua chay miền Tây',
    dish_id: 5,
    dish_name: 'Canh chua chay',
    proposed_dish_name: null,
    thumbnail_url: null,
    servings: 4,
    prep_time_minutes: 15,
    cook_time_minutes: 25,
    ingredient_count: 11,
    status: 'approved',
    rejection_reason: null,
    created_at: '2026-10-02T11:05:00+07:00',
  },
  {
    recipe_id: 40,
    title: 'Cơm gạo lứt trộn rau củ nướng sốt mè rang với đậu hũ non chiên giòn',
    dish_id: 13,
    dish_name: 'Buddha bowl đậu hũ',
    proposed_dish_name: null,
    thumbnail_url: null,
    servings: 2,
    prep_time_minutes: 20,
    cook_time_minutes: 35,
    ingredient_count: 15,
    status: 'approved',
    rejection_reason: null,
    created_at: '2026-10-14T19:20:00+07:00',
  },
  {
    recipe_id: 18,
    title: 'Nấm kho',
    dish_id: 10,
    dish_name: 'Nấm kho tiêu',
    proposed_dish_name: null,
    thumbnail_url: null,
    servings: null,
    prep_time_minutes: null,
    cook_time_minutes: null,
    ingredient_count: 2,
    // Nội dung đầy đủ để mở lại form "Sửa và gửi lại" (API thật: GET /api/recipes/:id)
    ingredients: [
      { name: 'Nấm rơm', amount: 300, unit: 'g' },
      { name: 'Nước tương', amount: 3, unit: 'muỗng canh' },
    ],
    steps: ['Cho nấm vào nồi, thêm nước tương.', 'Kho cho thấm.'],
    status: 'rejected',
    rejection_reason: 'Các bước nấu quá ngắn, chưa ghi thời gian kho và lượng nước. Bạn bổ sung rồi gửi lại nhé.',
    created_at: '2026-09-28T20:30:00+07:00',
  },
];

// =====================================================================
//  Trang xem công thức đã duyệt (#/cong-thuc/:id) — giả lập GET /api/recipes/:id của client
//  (recipeService.getRecipe). Tên field đúng như API thật trả về (camelCase).
//  Server chỉ trả công thức 'approved' của món đang 'active', còn lại 404.
// =====================================================================

/** Dị ứng / món kiêng người đang xem đã khai trong hồ sơ (bảng allergy). Dự án thật lấy từ hồ sơ. */
export const MY_ALLERGIES = ['Đậu phộng'];

const RECIPE_DETAILS = {
  22: {
    id: 22,
    title: 'Canh chua chay miền Tây',
    description: 'Vị chua thanh của me, ngọt của thơm, thêm đậu hũ chiên và nhiều rau thơm. Nấu nhanh cho bữa tối.',
    dishId: 5,
    dishName: 'Canh chua chay',
    authorName: 'Lâm Anh Khôi',
    authorAvatarUrl: null,
    createdAt: '2026-10-02T11:05:00+07:00',
    thumbnailUrl: null,
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    caloriesKcal: 210,
    proteinG: 9, carbG: 28, fatG: 7, fiberG: 5.5, sugarG: 11, sodiumMg: 640,
    youtubeUrl: null,
    ingredients: [
      { name: 'Đậu hũ', amount: 300, unit: 'g' },
      { name: 'Thơm (dứa)', amount: 0.5, unit: 'quả' },
      { name: 'Cà chua', amount: 2, unit: 'quả' },
      { name: 'Bạc hà (dọc mùng)', amount: 2, unit: 'cây' },
      { name: 'Giá đỗ', amount: 100, unit: 'g' },
      { name: 'Me chua', amount: 30, unit: 'g' },
      { name: 'Rau ngổ, ngò gai', amount: null, unit: 'vừa đủ' },
      { name: 'Nước tương', amount: 2, unit: 'muỗng canh' },
    ],
    instructions: [
      'Ngâm me với 1 chén nước ấm, dằm lấy nước cốt, bỏ hạt.',
      'Đậu hũ cắt miếng vừa ăn, chiên vàng hai mặt rồi vớt ra để ráo dầu.',
      'Phi thơm chút dầu, cho thơm và cà chua vào xào sơ 2 phút cho ra màu.',
      'Đổ 1,2 lít nước, đun sôi rồi thêm nước me, nêm nước tương và chút đường cho vừa chua ngọt.',
      'Cho bạc hà, giá và đậu hũ vào, đun sôi lại 1 phút rồi tắt bếp. Rắc rau ngổ, ngò gai và dùng nóng.',
    ],
  },
  40: {
    id: 40,
    title: 'Cơm gạo lứt trộn rau củ nướng sốt mè rang với đậu hũ non chiên giòn',
    description: 'Phần ăn đủ chất cho người tập luyện: rau củ nướng, đậu hũ giòn và sốt mè béo bùi. Có thể làm sẵn mang đi làm.',
    dishId: 13,
    dishName: 'Buddha bowl đậu hũ',
    authorName: 'Trần Hải Yến',
    authorAvatarUrl: null,
    createdAt: '2026-10-14T19:20:00+07:00',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    servings: 2,
    prepTimeMinutes: 20,
    cookTimeMinutes: 35,
    caloriesKcal: 640,
    proteinG: 24, carbG: 78, fatG: 26, fiberG: 12,
    youtubeUrl: null, // có link thì trang hiện thêm khối "Video hướng dẫn"
    ingredients: [
      { name: 'Gạo lứt', amount: 150, unit: 'g' },
      { name: 'Đậu hũ non', amount: 300, unit: 'g' },
      { name: 'Bột năng', amount: 2, unit: 'muỗng canh' },
      { name: 'Bí đỏ', amount: 200, unit: 'g' },
      { name: 'Bông cải xanh', amount: 150, unit: 'g' },
      { name: 'Cà rốt', amount: 1, unit: 'củ' },
      { name: 'Hành tây tím', amount: 0.5, unit: 'củ' },
      { name: 'Rong biển sấy', amount: 1, unit: 'gói' },
      { name: 'Đậu phộng rang', amount: 30, unit: 'g' },
      { name: 'Mè rang', amount: 3, unit: 'muỗng canh' },
      { name: 'Nước tương', amount: 2, unit: 'muỗng canh' },
      { name: 'Giấm gạo', amount: 1, unit: 'muỗng canh' },
      { name: 'Đường', amount: 1, unit: 'muỗng cà phê' },
      { name: 'Dầu ô liu', amount: 2, unit: 'muỗng canh' },
      { name: 'Muối, tiêu', amount: null, unit: 'ít' },
    ],
    instructions: [
      'Vo gạo lứt, ngâm 30 phút rồi nấu với tỉ lệ 1 gạo : 1,5 nước.',
      'Bí đỏ, cà rốt cắt khối; bông cải tách nhánh. Trộn với dầu ô liu, muối, tiêu rồi nướng 200°C trong 20 phút.',
      'Đậu hũ non cắt khối, lăn qua bột năng, chiên ngập dầu đến khi vàng giòn.',
      'Sốt mè: giã mè rang, trộn nước tương, giấm gạo, đường và 3 muỗng nước ấm cho sệt.',
      'Xếp cơm, rau củ nướng, đậu hũ, hành tím và rong biển vào tô. Rưới sốt mè, rắc đậu phộng rang giã dập.',
    ],
  },
};

/** Giả lập GET /recipes/:id → công thức, hoặc lỗi { status: 404 } / { status: 500 } */
export const fetchRecipe = (id) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (id === 'loi') reject(Object.assign(new Error('Lỗi máy chủ'), { status: 500 })); // thử trạng thái lỗi
    else if (RECIPE_DETAILS[id]) resolve(RECIPE_DETAILS[id]);
    else reject(Object.assign(new Error('Không tìm thấy'), { status: 404 }));
  }, 500);
});

// =====================================================================
//  DỮ LIỆU GIẢ — trang Tạo công thức (Recipe) + "Công thức đã gửi"
//  Tên field theo ERD v4.1 (bảng dish, recipe, recipe_ingredient).
//
//  ⚠ Các field ĐỀ XUẤT, CHƯA CÓ trong ERD (cần nhóm chốt, Tùng sửa ERD):
//    recipe.status              'pending' | 'approved' | 'rejected'   (GAP-01)
//    recipe.proposed_dish_name  tên món User đề xuất, khi dish_id = null
//    recipe.rejection_reason    lý do Admin từ chối
//    recipe.dish_id             hiện NOT NULL → cần cho phép null
// =====================================================================

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
  { dish_id: 13, name: 'Buddha bowl đậu hũ', status: 'active' },
  { dish_id: 14, name: 'Bánh xèo chay', status: 'pending' },
];

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
    status: 'rejected',
    rejection_reason: 'Các bước nấu quá ngắn, chưa ghi thời gian kho và lượng nước. Bạn bổ sung rồi gửi lại nhé.',
    created_at: '2026-09-28T20:30:00+07:00',
  },
];

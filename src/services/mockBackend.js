// =====================================================================
//  BACKEND GIẢ cho prototype (27/10/2026) — thay cho server thật của dự án.
//  services/api.js gọi handle(path, options) thay vì fetch → mọi service khác
//  (recipe.service, user.service, post.service, notification.service) copy NGUYÊN từ
//  vegetarians_social_web_app_SWP/client/src, không phải sửa.
//  Dữ liệu lấy từ shared/recipeMock.js (đổi sang camelCase đúng dạng API thật trả về).
//  Thay đổi (thích, gửi công thức, đọc thông báo) chỉ giữ trong bộ nhớ — tải lại trang là về như cũ.
//  Thử trạng thái: /recipes/999 = không tìm thấy · /recipes/500 = lỗi máy chủ.
// =====================================================================
import {
  DISHES, DISH_CATEGORIES, INGREDIENT_NAMES, MY_ALLERGIES, MY_RECIPES, PUBLIC_RECIPES, fetchRecipe,
} from '../shared/recipeMock';
import { findAnimalWord } from '../utils/animalWords';
import { plain } from '../utils/dishMatch';

const DELAY = 350; // đủ thấy khung chờ (skeleton), không quá chậm

/** Từ chỉ đồ động vật (bảng banned_keyword, category 'animal') */
const ANIMAL_WORDS = ['thịt', 'bò', 'heo', 'lợn', 'gà', 'vịt', 'cá', 'tôm', 'cua', 'mực', 'trứng', 'sữa bò', 'mắm tôm', 'nước mắm', 'mỡ heo', 'tiết', 'chả lụa'];

const dishIdOf = (name) => DISHES.find((d) => d.name === name)?.dish_id ?? null;

// ---- Trạng thái trong bộ nhớ ----
const likes = new Map(PUBLIC_RECIPES.map((r) => [String(r.id), { count: r.likeCount, mine: !!r.likedByMe }]));
const likeOf = (id) => likes.get(String(id)) ?? { count: 0, mine: false };

const myRecipe = (r) => ({
  id: r.recipe_id,
  title: r.title,
  dishId: r.dish_id,
  dishName: r.dish_name,
  proposedDishName: r.proposed_dish_name,
  thumbnailUrl: r.thumbnail_url,
  servings: r.servings,
  prepTimeMinutes: r.prep_time_minutes,
  cookTimeMinutes: r.cook_time_minutes,
  status: r.status,
  moderationNote: r.rejection_reason,
  createdAt: r.created_at,
  ingredientCount: r.ingredient_count,
  proposedIngredientCount: 0,
  // Đủ nội dung cho "Sửa và gửi lại" (GET /recipes/mine/:id)
  instructions: (r.steps ?? []).join('\n'),
  ingredients: r.ingredients ?? [],
});
let mine = MY_RECIPES.map(myRecipe);
let nextId = 900;

let notifications = [
  { id: 3, type: 'post_approved', title: 'Bài viết đã được duyệt', content: '“Bowl đậu gà nướng” đã hiện trên Bảng tin.', createdAt: '2026-10-27T08:10:00+07:00', isRead: false, refType: 'post', refId: 12 },
  { id: 2, type: 'dish_approved', title: 'Món bạn đề xuất đã được duyệt', content: 'Món “Bánh xèo chay” đã có trong danh sách món.', createdAt: '2026-10-26T20:30:00+07:00', isRead: false, refType: 'dish', refId: 14 },
  { id: 1, type: 'report_result', title: 'Đã xử lý báo cáo của bạn', content: 'Cảm ơn bạn đã giúp cộng đồng sạch hơn.', createdAt: '2026-10-25T09:00:00+07:00', isRead: false, refType: 'report', refId: 4 },
];

const checkName = (name) => {
  const key = plain(name);
  const keyword = findAnimalWord(name, ANIMAL_WORDS);
  return { name, known: INGREDIENT_NAMES.some((n) => plain(n) === key), isAnimalDerived: !!keyword, keyword };
};
const uniqueNames = (names = []) => {
  const seen = new Set();
  return names.map((n) => String(n ?? '').trim()).filter((n) => n && !seen.has(plain(n)) && seen.add(plain(n)));
};

/** Body form → MyRecipe (giống server: luôn về 'pending', xoá lý do từ chối) */
const fromBody = (body, base = {}) => {
  const dish = body.dishId ? DISHES.find((d) => d.dish_id === Number(body.dishId)) : null;
  const ingredients = (body.ingredients ?? []).map((i) => ({ ...i, proposed: !checkName(i.name).known }));
  return {
    ...base,
    ...body,
    dishId: dish?.dish_id ?? null,
    dishName: dish?.name ?? null,
    proposedDishName: dish ? null : body.proposedDishName ?? null,
    status: 'pending',
    moderationNote: null,
    createdAt: base.createdAt ?? new Date().toISOString(),
    ingredients,
    ingredientCount: ingredients.length,
    proposedIngredientCount: ingredients.filter((i) => i.proposed).length,
  };
};

const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };

// ---- Bảng định tuyến: [METHOD, /regex/, handler(match, body, query)] ----
const ROUTES = [
  ['GET', /^\/recipes$/, () => ({
    items: PUBLIC_RECIPES.map((r) => ({
      ...r,
      dishId: dishIdOf(r.dishName),
      categoryIds: r.categoryIds.map(String),
      likeCount: likeOf(r.id).count,
      likedByMe: likeOf(r.id).mine,
    })),
    categories: DISH_CATEGORIES.map((c) => ({ id: String(c.id), name: c.name })),
  })],
  ['GET', /^\/recipes\/dishes$/, () => ({
    items: DISHES.filter((d) => d.status === 'active').map((d) => ({ id: d.dish_id, name: d.name })),
  })],
  ['GET', /^\/recipes\/ingredients$/, (_, __, q) => ({
    items: q.get('q') ? INGREDIENT_NAMES.filter((n) => plain(n).includes(plain(q.get('q')))) : INGREDIENT_NAMES,
  })],
  ['GET', /^\/recipes\/animal-words$/, () => ({ items: ANIMAL_WORDS })],
  ['POST', /^\/recipes\/ingredients\/check$/, (_, body) => ({ items: uniqueNames(body?.names).map(checkName) })],
  ['GET', /^\/recipes\/mine$/, () => ({ items: mine })],
  ['GET', /^\/recipes\/mine\/(\d+)$/, ([, id]) => mine.find((r) => String(r.id) === id) ?? fail(404, 'Không tìm thấy công thức.')],
  ['POST', /^\/recipes$/, (_, body) => {
    const recipe = fromBody(body, { id: (nextId += 1) });
    mine = [recipe, ...mine];
    return { message: 'Đã gửi công thức.', recipe, ingredients: uniqueNames(body.ingredients?.map((i) => i.name)).map(checkName) };
  }],
  ['PUT', /^\/recipes\/(\d+)$/, ([, id], body) => {
    const old = mine.find((r) => String(r.id) === id) ?? fail(404, 'Không tìm thấy công thức.');
    if (old.status !== 'rejected') fail(409, 'Công thức không còn ở trạng thái Bị từ chối.');
    const recipe = fromBody(body, { id: old.id, createdAt: old.createdAt });
    mine = mine.map((r) => (r.id === old.id ? recipe : r));
    return { message: 'Đã gửi lại.', recipe, ingredients: uniqueNames(body.ingredients?.map((i) => i.name)).map(checkName) };
  }],
  ['POST', /^\/recipes\/(\d+)\/like$/, ([, id]) => {
    const l = likeOf(id);
    if (!l.mine) likes.set(id, { count: l.count + 1, mine: true });
    return { liked: true, likeCount: likeOf(id).count };
  }],
  ['DELETE', /^\/recipes\/(\d+)\/like$/, ([, id]) => {
    const l = likeOf(id);
    if (l.mine) likes.set(id, { count: l.count - 1, mine: false });
    return { liked: false, likeCount: likeOf(id).count };
  }],
  ['GET', /^\/recipes\/(\d+)$/, async ([, id]) => {
    if (id === '500') fail(500, 'Lỗi máy chủ (thử trạng thái lỗi).');
    const r = await fetchRecipe(id).catch((e) => fail(e.status ?? 500, e.message));
    return { ...r, dishId: r.dishId ?? dishIdOf(r.dishName), likeCount: likeOf(id).count, likedByMe: likeOf(id).mine };
  }],
  ['GET', /^\/users\/me\/health-profile$/, () => ({ profile: { allergies: MY_ALLERGIES.map((name, i) => ({ id: i + 1, name })) } })],
  ['GET', /^\/notifications$/, () => ({ items: notifications, unreadCount: notifications.filter((n) => !n.isRead).length })],
  ['POST', /^\/notifications\/read-all$/, () => {
    notifications = notifications.map((n) => ({ ...n, isRead: true }));
    return { ok: true };
  }],
  ['POST', /^\/notifications\/(\d+)\/read$/, ([, id]) => {
    notifications = notifications.map((n) => (String(n.id) === id ? { ...n, isRead: true } : n));
    return { ok: true };
  }],
  ['POST', /^\/posts\/youtube-check$/, () => ({ status: 'ok', title: 'Video mẫu (prototype)', author: 'Green Bowl' })],
  ['POST', /^\/uploads\/image$/, (_, body) => {
    const file = body instanceof FormData ? body.get('image') : null;
    return { url: file instanceof Blob ? URL.createObjectURL(file) : '' };
  }],
];

const wait = (ms, signal) => new Promise((resolve, reject) => {
  const abort = () => { clearTimeout(t); reject(new DOMException('Đã huỷ', 'AbortError')); };
  const t = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, ms);
  if (signal?.aborted) abort();
  else signal?.addEventListener('abort', abort, { once: true });
});

/**
 * Giả lập 1 lời gọi API. Trả payload, hoặc ném { status, message } (api.js đổi thành ApiError).
 * @param {string} path   vd '/recipes/40/like?x=1' (không có tiền tố /api)
 */
export async function handle(path, { method = 'GET', body, signal } = {}) {
  await wait(DELAY, signal);
  const url = new URL(path, 'http://mock.local');
  const parsed = typeof body === 'string' ? JSON.parse(body) : body;
  for (const [m, rx, fn] of ROUTES) {
    const match = m === method.toUpperCase() && rx.exec(url.pathname);
    if (match) return structuredClone(await fn(match, parsed, url.searchParams));
  }
  return fail(404, `Prototype chưa giả lập API ${method} ${url.pathname}`);
}

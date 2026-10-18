import { useEffect, useMemo, useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import Notice from '../../components/Notice/Notice';
import NumberStepper from '../../components/NumberStepper/NumberStepper';
import Photo from '../../components/Photo/Photo';
import Skeleton from '../../components/Skeleton/Skeleton';
import YouTubeEmbed from '../../components/YouTubeEmbed/YouTubeEmbed';
import { IngredientList, RecipeFacts, RecipeSteps } from '../../components/RecipeView/RecipeView';
import { formatNumber, timeAgo } from '../../utils/format';
import { fetchRecipe, MY_ALLERGIES } from '../../shared/recipeMock';
import { Bowl, toneOf } from '../components/TodayDish';
import { plain } from './dishMatch';
import s from './RecipeDetailPage.module.css';

/**
 * Trang xem công thức đã duyệt (#/cong-thuc/:id) — bố cục 2B (chốt 18/10/2026):
 *  đầu trang = ảnh 448 + thông tin 496 · bên dưới = Cách làm 608 | Nguyên liệu 336 (cố định khi cuộn).
 *  Cùng khung 976 = 608 + 32 + 336 với trang Tạo công thức.
 * Dữ liệu đúng dạng GET /api/recipes/:id của client (recipeService.getRecipe); prototype dùng fetchRecipe.
 * Thử trạng thái: #/cong-thuc/22 (đủ) · /40 (tên dài, nhiều nguyên liệu, có dị ứng) · /999 (không thấy) · /loi (lỗi).
 */

// Chỉ số dinh dưỡng tuỳ chọn (1 người); tone = màu dinh dưỡng có sẵn trong theme (--ac-protein…)
const NUTRIENTS = [
  { api: 'proteinG', label: 'Đạm', unit: 'g', tone: 'protein' },
  { api: 'carbG', label: 'Tinh bột', unit: 'g', tone: 'carb' },
  { api: 'fatG', label: 'Chất béo', unit: 'g', tone: 'fat' },
  { api: 'fiberG', label: 'Chất xơ', unit: 'g', tone: 'fiber' },
  { api: 'sugarG', label: 'Đường', unit: 'g' },
  { api: 'sodiumMg', label: 'Natri', unit: 'mg' },
];
const fmt = (n) => (Number.isInteger(n) ? formatNumber(n) : n.toLocaleString('vi-VN', { maximumFractionDigits: 1 }));

export default function RecipeDetailPage({ recipeId, load = fetchRecipe, allergies = MY_ALLERGIES }) {
  const [state, setState] = useState({ status: 'loading', recipe: null }); // loading | ready | notFound | error
  const [servings, setServings] = useState(null); // khẩu phần đang xem → số lượng tự nhân

  const fetchIt = () => {
    setState({ status: 'loading', recipe: null });
    load(recipeId)
      .then((recipe) => { setState({ status: 'ready', recipe }); setServings(recipe.servings ?? null); })
      .catch((err) => setState({ status: err.status === 404 || err.status === 400 ? 'notFound' : 'error', recipe: null }));
  };
  useEffect(fetchIt, [recipeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const r = state.recipe;
  useEffect(() => { if (r) document.title = `${r.title} · Công thức`; }, [r]);

  // Nguyên liệu trùng dị ứng của người xem (so khớp bỏ dấu, chứa nhau)
  const allergyKeys = useMemo(() => allergies.map(plain).filter(Boolean), [allergies]);
  const isAllergen = (it) => allergyKeys.some((a) => plain(it.name).includes(a));
  const hits = r ? [...new Set(r.ingredients.filter(isAllergen).map((it) => it.name))] : [];

  if (state.status === 'loading') {
    return (
      <div className={s.page} role="status" aria-label="Đang tải công thức">
        <div className={s.hero}>
          <Skeleton shape="block" height={336} className={s.cover} />
          <div className={s.info}><Skeleton lines={4} /></div>
        </div>
      </div>
    );
  }
  if (state.status === 'notFound') {
    return (
      <div className={s.page}>
        <EmptyState icon="journal-x" title="Không tìm thấy công thức" action={<Button as="a" href="#/" icon="house">Về Bảng tin</Button>}>
          Công thức không tồn tại, chưa được duyệt hoặc đã bị ẩn.
        </EmptyState>
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <div className={s.page}>
        <Notice tone="alert" title="Chưa tải được công thức" action={{ label: 'Tải lại', onClick: fetchIt }}>
          Kiểm tra kết nối mạng rồi thử lại nhé.
        </Notice>
      </div>
    );
  }

  const totalTime = (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0);
  const timeParts = [
    r.prepTimeMinutes ? `Chuẩn bị ${r.prepTimeMinutes} phút` : null,
    r.cookTimeMinutes ? `Nấu ${r.cookTimeMinutes} phút` : null,
  ].filter(Boolean);
  const nutrition = NUTRIENTS.filter((n) => r[n.api] != null);

  return (
    <article className={s.page}>
      <nav className={s.crumbs} aria-label="Đường dẫn">
        <a href="#/">Bảng tin</a>
        <i className="bi bi-chevron-right" aria-hidden="true" />
        <span aria-current="page">Công thức</span>
      </nav>

      {/* Đầu trang: ảnh bìa | tên, món, tác giả, thông số */}
      <header className={s.hero}>
        <div className={s.cover}>
          {r.thumbnailUrl
            ? <Photo src={r.thumbnailUrl} alt={r.title} ratio="4/3" shape="rounded" className={s.photo} />
            : <div className={s.noPhoto} aria-hidden="true"><div className={s.plate}><Bowl tone={toneOf(r.dishName ?? r.title)} /></div></div>}
        </div>
        <div className={s.info}>
          <span className={s.dish}><i className="bi bi-bookmark" aria-hidden="true" />{r.dishName}</span>
          <h1 className={s.title}>{r.title}</h1>
          {r.description && <p className={s.desc}>{r.description}</p>}
          <div className={s.by}>
            <Avatar name={r.authorName} src={r.authorAvatarUrl ?? undefined} size={32} />
            <span className={s.author}>{r.authorName}</span>
            <time className={s.when} dateTime={r.createdAt}>{timeAgo(r.createdAt)}</time>
          </div>
          <div className={s.factsBox}>
            <RecipeFacts cookTimeMinutes={totalTime || undefined} servings={r.servings} calories={r.caloriesKcal} />
            {timeParts.length > 0 && <p className={s.hint}>{timeParts.join(', ')}</p>}
          </div>
        </div>
      </header>

      <div className={s.grid}>
        {/* Cột phải: Nguyên liệu cố định khi cuộn (đặt trước trong HTML để màn hẹp hiện trước Cách làm) */}
        <aside className={s.aside} aria-labelledby="rd-ing">
          <section className={`${s.card} ${s.ingCard}`}>
            <div className={s.head}>
              <h2 id="rd-ing" className={s.h2}>Nguyên liệu</h2>
              <p className={s.hint}>Bấm để gạch những thứ đã chuẩn bị.</p>
            </div>
            {r.servings ? (
              <NumberStepper label="Khẩu phần" value={servings} onChange={setServings} min={1} max={20} unit="người" />
            ) : null}
            {hits.length > 0 && (
              <Notice tone="alert" title="Có nguyên liệu bạn đã khai dị ứng">
                {hits.join(', ')}. Kiểm tra kỹ hoặc thay nguyên liệu trước khi nấu.
              </Notice>
            )}
            <IngredientList
              items={r.ingredients}
              baseServings={r.servings ?? undefined}
              servings={servings ?? undefined}
              checkable
              isFlagged={allergyKeys.length ? isAllergen : undefined}
            />
          </section>
        </aside>

        <div className={s.main}>
          <section className={s.card} aria-labelledby="rd-steps">
            <h2 id="rd-steps" className={s.h2}>Cách làm</h2>
            <RecipeSteps steps={r.instructions} />
          </section>

          {nutrition.length > 0 && (
            <section className={s.card} aria-labelledby="rd-nutri">
              <div className={s.head}>
                <h2 id="rd-nutri" className={s.h2}>Dinh dưỡng</h2>
                <p className={s.hint}>Cho 1 người, ước tính theo nguyên liệu.</p>
              </div>
              <ul className={s.nutri}>
                {nutrition.map((n) => (
                  <li key={n.api} className={s.nutriItem} data-tone={n.tone}>
                    <span>{n.label}</span><b>{fmt(r[n.api])} {n.unit}</b>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {r.youtubeUrl && (
            <section className={s.card} aria-labelledby="rd-video">
              <h2 id="rd-video" className={s.h2}>Video hướng dẫn</h2>
              <YouTubeEmbed url={r.youtubeUrl} title={`Video: ${r.title}`} />
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

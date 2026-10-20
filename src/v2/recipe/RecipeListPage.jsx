import { useEffect, useMemo, useState } from 'react';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import EmptyState from '../../components/EmptyState/EmptyState';
import FeaturedCarousel from './FeaturedCarousel';
import Notice from '../../components/Notice/Notice';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import SearchInput from '../../components/SearchInput/SearchInput';
import Select from '../../components/Select/Select';
import Skeleton from '../../components/Skeleton/Skeleton';
import { DISH_CATEGORIES, fetchPublicRecipes, MY_ALLERGIES } from '../../shared/recipeMock';
import { Bowl, toneOf } from '../components/TodayDish';
import { plain } from './dishMatch';
import s from './RecipeListPage.module.css';

/**
 * Trang Công thức (#/cong-thuc) — bố cục C, chốt 18/10/2026.
 *  Không tìm/lọc: "Nổi bật tuần này" (nhiều lượt thích nhất 7 ngày; bằng nhau → mới duyệt trước;
 *    tuần chưa ai thích → đổi tiêu đề thành "Mới duyệt tuần này") + mỗi danh mục 1 hàng 3 công thức mới nhất.
 *  Có từ khoá hoặc chọn danh mục (#/cong-thuc?q=…&dm=…): kết quả phẳng dạng lưới.
 *  Mọi chế độ: thẻ có món trùng dị ứng → nhãn đỏ; công tắc "Ẩn món tôi dị ứng".
 * Dữ liệu đúng dạng GET /api/recipes (cần thêm likeCount, likesThisWeek, moderatedAt, categoryIds — xem recipeMock).
 */

const FEATURED = 5;
const PER_ROW = 3;
const PAGE = 9;
const byNewest = (a, b) => new Date(b.moderatedAt) - new Date(a.moderatedAt);
const SORTS = [
  { value: 'new', label: 'Mới nhất' },
  { value: 'likes', label: 'Nhiều lượt thích' },
];

/** '#/cong-thuc?q=canh&dm=2' → { q: 'canh', dm: 2 } */
const readQuery = (route) => {
  const p = new URLSearchParams(route.split('?')[1] ?? '');
  return { q: p.get('q') ?? '', dm: p.get('dm') ? Number(p.get('dm')) : null };
};
const go = ({ q = '', dm = null } = {}) => {
  const p = new URLSearchParams();
  if (q.trim()) p.set('q', q.trim());
  if (dm) p.set('dm', dm);
  const qs = p.toString();
  window.location.hash = qs ? `#/cong-thuc?${qs}` : '#/cong-thuc';
};
const href = (id) => `#/cong-thuc/${id}`;

export default function RecipeListPage({ route = '#/cong-thuc', load = fetchPublicRecipes, allergies = MY_ALLERGIES }) {
  const { q, dm } = readQuery(route);
  const [state, setState] = useState({ status: 'loading', items: [] });
  const [text, setText] = useState(q);
  const [hideAllergen, setHideAllergen] = useState(false);
  const [sort, setSort] = useState('new');
  const [shown, setShown] = useState(PAGE);

  const fetchIt = () => {
    setState({ status: 'loading', items: [] });
    load().then(({ items }) => setState({ status: 'ready', items })).catch(() => setState({ status: 'error', items: [] }));
  };
  useEffect(fetchIt, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setText(q); setShown(PAGE); }, [q, dm]);

  // Dị ứng của người xem → nhãn đỏ trên thẻ ("Có Đậu phộng")
  const allergyKeys = useMemo(() => allergies.map((a) => [a, plain(a)]).filter(([, k]) => k), [allergies]);
  const allergenOf = (it) => {
    const hit = allergyKeys.find(([, k]) => it.ingredientNames.some((n) => plain(n).includes(k)));
    return hit ? `Có ${hit[0]}` : undefined;
  };

  const all = state.items.filter((it) => !(hideAllergen && allergenOf(it)));
  const browsing = !q && !dm;

  const card = (it, layout = 'card', className) => (
    <RecipeCard
      key={it.id}
      layout={layout}
      className={className}
      href={href(it.id)}
      title={it.title}
      dishName={it.dishName}
      imageUrl={it.thumbnailUrl ?? undefined}
      fallback={<div className={s.plate}><Bowl tone={toneOf(it.dishName)} /></div>}
      author={{ name: it.authorName, avatarUrl: it.authorAvatarUrl ?? undefined }}
      createdAt={it.moderatedAt}
      cookTimeMinutes={(it.prepTimeMinutes ?? 0) + (it.cookTimeMinutes ?? 0) || undefined}
      servings={it.servings}
      calories={it.caloriesKcal ?? undefined}
      likeCount={it.likeCount}
      flag={allergenOf(it)}
    />
  );

  // ---------- Chế độ duyệt: nổi bật + các hàng danh mục ----------
  const liked = all.filter((it) => it.likesThisWeek > 0).sort((a, b) => b.likesThisWeek - a.likesThisWeek || byNewest(a, b));
  const featuredTitle = liked.length ? 'Nổi bật tuần này' : 'Mới duyệt tuần này';
  const featuredHint = liked.length ? 'Nhiều lượt thích nhất trong 7 ngày' : 'Công thức vừa được Admin duyệt';
  const featured = [...liked, ...[...all].sort(byNewest).filter((it) => !liked.includes(it))].slice(0, FEATURED);
  const sections = [...DISH_CATEGORIES]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({ ...c, items: all.filter((it) => it.categoryIds.includes(c.id)).sort(byNewest) }))
    .filter((c) => c.items.length > 0);

  // ---------- Chế độ kết quả: tìm và/hoặc lọc danh mục ----------
  const cat = DISH_CATEGORIES.find((c) => c.id === dm);
  const key = plain(q);
  const results = all
    .filter((it) => !dm || it.categoryIds.includes(dm))
    .filter((it) => !key || plain(`${it.title} ${it.dishName}`).includes(key))
    .sort(sort === 'likes' ? (a, b) => b.likeCount - a.likeCount || byNewest(a, b) : byNewest);

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div className={s.headText}>
          <h1 className={s.title}>Công thức</h1>
          <p className={s.desc}>Cách nấu món chay do cộng đồng chia sẻ, đã được Admin duyệt.</p>
        </div>
        <Button as="a" href="#/tao-cong-thuc" icon="plus-lg">Tạo công thức</Button>
      </header>

      <div className={s.tools}>
        <div className={s.search} role="search">
          <SearchInput
            value={text}
            onChange={setText}
            onSearch={(v) => go({ q: v, dm })}
            size="lg"
            label="Tìm công thức"
            placeholder="Tìm theo tên món hoặc công thức, ví dụ: canh chua"
          />
        </div>
        <Checkbox switch checked={hideAllergen} onChange={setHideAllergen}>Ẩn món tôi dị ứng</Checkbox>
      </div>

      {state.status === 'loading' && (
        <div className={s.grid} role="status" aria-label="Đang tải công thức">
          {[0, 1, 2].map((k) => <div key={k} className={s.skCard}><Skeleton shape="block" height={160} /><Skeleton lines={2} /></div>)}
        </div>
      )}

      {state.status === 'error' && (
        <Notice tone="alert" title="Chưa tải được công thức" action={{ label: 'Tải lại', onClick: fetchIt }}>
          Kiểm tra kết nối mạng rồi thử lại nhé.
        </Notice>
      )}

      {state.status === 'ready' && browsing && (
        all.length === 0 ? (
          <EmptyState icon="journal-plus" title="Chưa có công thức nào" action={<Button as="a" href="#/tao-cong-thuc" icon="plus-lg">Tạo công thức đầu tiên</Button>}>
            {hideAllergen ? 'Mọi công thức hiện có đều có món bạn dị ứng.' : 'Bạn biết cách nấu món chay nào? Chia sẻ để mọi người cùng làm.'}
          </EmptyState>
        ) : (
          <>
            <section className={s.section} aria-labelledby="rl-featured">
              <div className={s.secHead}>
                <h2 id="rl-featured" className={s.h2}>{featuredTitle}</h2>
                <span className={s.secHint}>{featuredHint}</span>
              </div>
              <FeaturedCarousel items={featured} hrefOf={href} flagOf={allergenOf} />
            </section>

            {sections.map((c) => (
              <section key={c.id} className={s.section} aria-labelledby={`rl-cat-${c.id}`}>
                <div className={s.secHead}>
                  <div className={s.secTitle}>
                    <h2 id={`rl-cat-${c.id}`} className={s.h2}>{c.name}</h2>
                    <span className={s.secHint}>{c.items.length} công thức</span>
                  </div>
                  {c.items.length > PER_ROW && (
                    <a className={s.more} href={`#/cong-thuc?dm=${c.id}`}>Xem tất cả {c.name.toLowerCase()}</a>
                  )}
                </div>
                <div className={s.grid}>{c.items.slice(0, PER_ROW).map((it) => card(it))}</div>
              </section>
            ))}
          </>
        )
      )}

      {state.status === 'ready' && !browsing && (
        <section className={s.section} aria-labelledby="rl-results">
          <nav className={s.crumbs} aria-label="Đường dẫn">
            <a href="#/cong-thuc">Công thức</a>
            <i className="bi bi-chevron-right" aria-hidden="true" />
            <span aria-current="page">{cat ? cat.name : 'Kết quả tìm kiếm'}</span>
          </nav>
          <div className={s.chips} role="group" aria-label="Lọc theo danh mục">
            <button type="button" className={`${s.chip} ${!dm ? s.chipOn : ''}`} aria-pressed={!dm} onClick={() => go({ q })}>Tất cả</button>
            {DISH_CATEGORIES.map((c) => (
              <button key={c.id} type="button" className={`${s.chip} ${dm === c.id ? s.chipOn : ''}`} aria-pressed={dm === c.id} onClick={() => go({ q, dm: c.id })}>{c.name}</button>
            ))}
          </div>
          <div className={s.resultBar}>
            <h2 id="rl-results" className={s.count}>
              {results.length} công thức{q ? <> cho “<b>{q}</b>”</> : null}{cat ? ` trong ${cat.name.toLowerCase()}` : ''}
            </h2>
            <div className={s.sort}><Select label="Sắp xếp" options={SORTS} value={sort} onChange={setSort} size="sm" /></div>
          </div>

          {results.length === 0 ? (
            <EmptyState icon="search" title={q ? `Không có công thức khớp “${q}”` : 'Danh mục này chưa có công thức'}
              action={<Button variant="outline" onClick={() => { setHideAllergen(false); go(); }}>Xoá bộ lọc</Button>}>
              Thử từ khoá khác, chọn danh mục khác hoặc tắt “Ẩn món tôi dị ứng”.
            </EmptyState>
          ) : (
            <>
              <div className={s.grid}>{results.slice(0, shown).map((it) => card(it))}</div>
              {results.length > shown && (
                <Button variant="outline" className={s.loadMore} onClick={() => setShown((n) => n + PAGE)}>
                  Xem thêm ({shown}/{results.length})
                </Button>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}

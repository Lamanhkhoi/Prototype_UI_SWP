import { useMemo, useState } from 'react';
import FadeContent from './reactbits/FadeContent';
import { useToast } from '../components/Toast/Toast';
import FeedTopbar from '../components/FeedTopbar/FeedTopbar';
import MemberLayout from '../components/MemberLayout/MemberLayout';
import Hero, { QuickComposer } from './components/Hero';
import AskMam from './components/AskMam';
import PostCard from './components/PostCard';
import { ActivityCard, RailFooter, ShopsCard, TrendingCard } from './components/Rail';
import { CATEGORIES, CURRENT_USER, MEAL_TIMES, POSTS, SHOPS, TODAY_PLAN, TRENDING } from '../shared/mockData';
import VersionSwitch from '../VersionSwitch';
// 27/10/2026: 3 trang Công thức copy NGUYÊN từ dự án (client/src/pages), dữ liệu qua backend giả (services/mockBackend.js)
import RecipeCreatePage from '../pages/RecipeCreatePage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import RecipeListPage from '../pages/RecipeListPage';
import s from './App.module.css';

// Lọc nhanh: gọn 6 nút, vừa 1 hàng (không cuộn ngang)
const byId = (id) => [...CATEGORIES, ...MEAL_TIMES].find((c) => c.id === id);
const FILTERS = ['all', 1, 7, 8, 2, 3].map(byId);

const STATS = [
  { value: 1284, label: 'thành viên' },
  { value: 356, label: 'món chay' },
  { value: 48, label: 'quán đã xác minh' },
];

const ACTIVITY = [
  { id: 1, who: 'Trần Hải Yến', what: 'đã thích', target: 'Bowl đậu gà nướng', when: '2 phút trước' },
  { id: 2, who: 'Lê Minh Thắng', what: 'đăng video', target: 'Salad cầu vồng', when: '18 phút trước' },
  { id: 3, who: 'Phạm Thu Hà', what: 'bình luận ở', target: 'Canh rau củ ấm bụng', when: '32 phút trước' },
  { id: 4, who: 'Đỗ Gia Bảo', what: 'thêm quán', target: 'An Nhiên Vegan', when: '1 giờ trước' },
  { id: 5, who: 'Nguyễn Anh Tuấn', what: 'lưu thực đơn', target: 'Tuần giữ cân', when: '2 giờ trước' },
];

/** Người đang đăng nhập, đúng dạng user của dự án ({ id, fullName, role, avatarUrl }) */
const MEMBER = { id: CURRENT_USER.id, fullName: CURRENT_USER.name, role: 'member', avatarUrl: null };

/**
 * Đường dẫn giống dự án (27/10/2026): / = Bảng tin · /recipes (?q=…&dm=…) = Công thức
 * /recipes/:id = Xem công thức · /recipes/new = Tạo công thức. Vite dev tự trả index.html cho mọi đường dẫn.
 * Link cũ kiểu hash (#/cong-thuc/40, #/tao-cong-thuc) tự chuyển sang đường dẫn mới.
 */
export const legacyTarget = (hash) => {
  if (hash === '#/tao-cong-thuc') return '/recipes/new';
  const m = /^#\/cong-thuc(\/[^/?]+)?(\?.*)?$/.exec(hash);
  return m ? `/recipes${m[1] ?? ''}${m[2] ?? ''}` : null;
};

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const recipeViewId = /^\/recipes\/(\d+)$/.exec(path)?.[1];

  const toast = useToast();
  const later = (what) => toast(`Prototype: ${what} sẽ nối với trang thật`, { tone: 'info' });
  // Menu tài khoản giống dự án (context/ShopNavigationContext.jsx): Tạo công thức · Hồ sơ cá nhân · Đăng xuất
  const accountMenu = [
    { icon: 'journal-plus', label: 'Tạo công thức', onClick: () => window.location.assign('/recipes/new') },
    { icon: 'person', label: 'Hồ sơ cá nhân', onClick: () => later('Hồ sơ cá nhân') },
    { icon: 'box-arrow-right', label: 'Đăng xuất', tone: 'alert', onClick: () => later('Đăng xuất') },
  ];

  let page;
  if (path === '/recipes/new') page = <RecipeCreatePage user={MEMBER} accountMenu={accountMenu} />;
  else if (recipeViewId) page = <RecipeDetailPage recipeId={recipeViewId} user={MEMBER} accountMenu={accountMenu} />;
  else if (path === '/recipes') page = <RecipeListPage user={MEMBER} accountMenu={accountMenu} />;
  else page = <FeedHome accountMenu={accountMenu} later={later} />;

  return (
    <>
      {page}
      <AskMam onOpenFull={(e) => { e.preventDefault(); later('Trang trò chuyện với Mầm'); }} />
      <VersionSwitch current="v2" />
    </>
  );
}

/** Bảng tin của prototype (nội dung giữ như v2.1), đặt trong khung chung MemberLayout của dự án */
function FeedHome({ accountMenu, later }) {
  const toast = useToast();
  const [posts, setPosts] = useState(POSTS);
  const [category, setCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => posts.filter((p) => (
    (category === 'all' || p.categories.some((c) => c.id === category))
    && (!query || p.title.toLowerCase().includes(query.toLowerCase()))
  )), [posts, category, query]);

  const vote = (id) => setPosts((list) => list.map((p) => (
    p.id === id ? { ...p, isVoted: !p.isVoted, voteCount: p.voteCount + (p.isVoted ? -1 : 1) } : p
  )));

  return (
    <MemberLayout
      activeKey="feed"
      user={MEMBER}
      accountMenu={accountMenu}
      onCreate={() => later('Hộp đăng bài')}
      renderTopbar={({ openMenu }) => (
        <FeedTopbar value={searchText} onChange={setSearchText} onSearch={setQuery} onOpenMenu={openMenu} />
      )}
    >
      {/* 3 cột: lời chào + Mầm gợi ý | bảng tin (giữa) | hoạt động, quán, chủ đề */}
      <main className={s.layout}>
        <aside className={s.left} aria-label="Lời chào và gợi ý của Mầm">
          <Hero user={CURRENT_USER} stats={STATS} plan={TODAY_PLAN} onOpenPlan={() => later('Thực đơn tuần')} />
        </aside>

        <section className={s.feed} aria-labelledby="feed-title">
          {!query && <QuickComposer user={CURRENT_USER} onCompose={() => later('Hộp đăng bài')} />}
          <div className={s.feedHead}>
            <h2 id="feed-title" className={s.feedTitle}>{query ? 'Kết quả tìm kiếm' : 'Bảng tin'}</h2>
            <div className={s.tabs} role="group" aria-label="Lọc theo danh mục">
              {FILTERS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${s.tab} ${category === c.id ? s.tabOn : ''}`}
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {query && (
            <p className={s.resultNote}>
              {visible.length} bài có tiêu đề chứa <b>“{query}”</b>
            </p>
          )}

          {visible.map((post, i) => (
            <FadeContent key={post.id} blur duration={800} delay={i < 2 ? i * 120 : 0} threshold={0.12}>
              <PostCard
                postType={post.type}
                title={post.title}
                excerpt={post.content}
                thumbnailUrl={post.thumbnailUrl}
                duration={post.duration}
                author={{ name: post.author.fullName }}
                createdAt={post.createdAt}
                categories={post.categories}
                voteCount={post.voteCount}
                commentCount={post.commentCount}
                voted={post.isVoted}
                reported={post.hasReported}
                onVote={() => vote(post.id)}
                onOpen={() => later('Chi tiết bài')}
                onComment={() => later('Bình luận')}
                onShare={() => toast('Đã sao chép link bài viết')}
                onReport={() => later('Báo cáo bài')}
              />
            </FadeContent>
          ))}
          {visible.length === 0 && <p className={s.empty}>Không có bài nào khớp. Thử từ khoá hoặc danh mục khác.</p>}
        </section>

        <aside className={s.rail} aria-label="Gợi ý bên lề">
          <ActivityCard items={ACTIVITY} />
          <ShopsCard shops={SHOPS} />
          <TrendingCard topics={TRENDING} onPick={setCategory} />
          <RailFooter />
        </aside>
      </main>
    </MemberLayout>
  );
}

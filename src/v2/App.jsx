import { useEffect, useMemo, useState } from 'react';
import FadeContent from './reactbits/FadeContent';
import { useToast } from '../components/Toast/Toast';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Hero, { QuickComposer } from './components/Hero';
import AskMam from './components/AskMam';
import PostCard from './components/PostCard';
import { ActivityCard, RailFooter, ShopsCard, TrendingCard } from './components/Rail';
import { CATEGORIES, CURRENT_USER, MEAL_TIMES, NAV, POSTS, SHOPS, TODAY_PLAN, TRENDING } from '../prototype/data';
import VersionSwitch from '../VersionSwitch';
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

// Thanh bên theo wireframe Figma: 4 mục (Hỏi Mầm vẫn ở nút nổi góc phải dưới)
const SIDE_NAV = [
  { key: 'feed', label: 'Bảng tin', icon: 'house', iconActive: 'house-fill', href: '#' },
  { key: 'recipes', label: 'Công thức', icon: 'journal-richtext', href: '#' },
  { key: 'meal-plan', label: 'Thực đơn AI', icon: 'calendar-week', iconActive: 'calendar-week-fill', href: '#', tag: 'AI' },
  { key: 'shops', label: 'Quán chay', icon: 'shop', href: '#' },
];

/** Thanh bên thu gọn: nhớ lựa chọn; lần đầu thì màn < 1200px tự thu gọn cho rộng chỗ */
const COLLAPSE_KEY = 'anchay-v2-sidebar-collapsed';
const readCollapsed = () => {
  try {
    const v = localStorage.getItem(COLLAPSE_KEY);
    if (v !== null) return v === '1';
  } catch { /* bỏ qua */ }
  return window.innerWidth < 1200;
};

const useIsMobile = () => {
  const query = '(max-width: 767.98px)';
  const [mobile, setMobile] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mobile;
};

export default function App() {
  const toast = useToast();
  const isMobile = useIsMobile();
  const [posts, setPosts] = useState(POSTS);
  const [category, setCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed((c) => {
    try { localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1'); } catch { /* bỏ qua */ }
    return !c;
  });

  const visible = useMemo(() => posts.filter((p) => (
    (category === 'all' || p.categories.some((c) => c.id === category))
    && (!query || p.title.toLowerCase().includes(query.toLowerCase()))
  )), [posts, category, query]);

  const vote = (id) => setPosts((list) => list.map((p) => (
    p.id === id ? { ...p, isVoted: !p.isVoted, voteCount: p.voteCount + (p.isVoted ? -1 : 1) } : p
  )));
  const later = (what) => toast(`Prototype: ${what} sẽ nối với trang thật`, { tone: 'info' });

  // Lối tắt luôn hiện trong hộp tài khoản (thu gọn thì nằm trong popup avatar)
  const accountLinks = [
    { icon: 'person', label: 'Hồ sơ cá nhân', onClick: () => later('Hồ sơ cá nhân') },
    { icon: 'journal-text', label: 'Bài của tôi', onClick: () => later('Bài của tôi') },
  ];
  // Nút ••• : việc ít dùng + Đăng xuất (màu Đất nung)
  const accountMenu = [
    { icon: 'box-arrow-right', label: 'Đăng xuất', tone: 'alert', onClick: () => later('Đăng xuất') },
  ];

  return (
    <div className={`v2-page ${s.shell}`}>
      <Sidebar
        nav={SIDE_NAV}
        accountLinks={accountLinks}
        activeKey="feed"
        user={CURRENT_USER}
        accountMenu={accountMenu}
        collapsed={!isMobile && collapsed}
        onToggle={toggleCollapsed}
        mobileOpen={isMobile && drawerOpen}
        onCloseMobile={() => setDrawerOpen(false)}
        onCreate={() => later('Hộp đăng bài')}
      />

      <div className={s.main}>
        <Topbar
          value={searchText}
          onChange={setSearchText}
          onSearch={setQuery}
          notificationCount={3}
          onOpenMenu={() => setDrawerOpen(true)}
        />

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
      </div>

      <AskMam onOpenFull={(e) => { e.preventDefault(); later('Trang trò chuyện với Mầm'); }} />
      <VersionSwitch current="v2" />

      {/* Điện thoại: thanh điều hướng dưới đáy */}
      <nav className={s.mobileNav} aria-label="Điều hướng nhanh">
        {NAV.slice(0, 2).map((n, i) => (
          <a key={n.key} href="#" className={`${s.mItem} ${i === 0 ? s.mOn : ''}`}>
            <i className={`bi bi-${i === 0 ? n.iconActive : n.icon}`} aria-hidden="true" /><span>{n.label}</span>
          </a>
        ))}
        <button type="button" className={s.mCreate} onClick={() => later('Hộp đăng bài')} aria-label="Đăng bài">
          <i className="bi bi-plus-lg" aria-hidden="true" />
        </button>
        {NAV.slice(2, 4).map((n) => (
          <a key={n.key} href="#" className={s.mItem}>
            <i className={`bi bi-${n.icon}`} aria-hidden="true" /><span>{n.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

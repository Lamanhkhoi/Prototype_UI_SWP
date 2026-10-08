import { useMemo, useState } from 'react';
import { useToast } from '../components/Toast/Toast';
import Avatar from '../components/Avatar/Avatar';
import AskMam from '../v2/components/AskMam';
import VersionSwitch from '../VersionSwitch';
import TopNav from './components/TopNav';
import PostCard from './components/PostCard';
import { MamPlan, Shops, SideFooter, Trending } from './components/Side';
import { CATEGORIES, CURRENT_USER, NAV, POSTS, SHOPS, TODAY_PLAN, TRENDING } from '../shared/mockData';
import s from './App.module.css';

const greet = () => {
  const h = new Date().getHours();
  if (h < 11) return 'Chào buổi sáng';
  if (h < 14) return 'Chào buổi trưa';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};
const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });

export default function App() {
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
  const later = (what) => toast(`Prototype: ${what} sẽ nối với trang thật`, { tone: 'info' });
  const firstName = CURRENT_USER.name.trim().split(/\s+/).pop();

  const accountMenu = [
    { icon: 'person', label: 'Hồ sơ cá nhân', onClick: () => later('Hồ sơ cá nhân') },
    { icon: 'journal-text', label: 'Bài của tôi', onClick: () => later('Bài của tôi') },
    { icon: 'gear', label: 'Cài đặt', onClick: () => later('Cài đặt') },
    { divider: true },
    { icon: 'box-arrow-right', label: 'Đăng xuất', tone: 'alert', onClick: () => later('Đăng xuất') },
  ];

  return (
    <div className={s.page}>
      <TopNav
        nav={NAV}
        activeKey="feed"
        user={CURRENT_USER}
        accountMenu={accountMenu}
        search={searchText}
        onSearchChange={setSearchText}
        onSearch={setQuery}
        notificationCount={3}
        onCreate={() => later('Hộp đăng bài')}
      />

      <main className={s.layout}>
        {/* Lời chào kiểu tạp chí: chữ có chân, không hiệu ứng chữ chạy như v2 */}
        <header className={s.intro}>
          <p className={s.date}>{today}</p>
          <h1 className={`v3-serif ${s.hello}`}>
            {greet()}, {firstName}. <em>Hôm nay nấu gì?</em>
          </h1>
          <p className={s.stats}>
            <b>1.284</b> thành viên <span aria-hidden="true">·</span> <b>356</b> món chay <span aria-hidden="true">·</span> <b>48</b> quán đã xác minh
          </p>
        </header>

        <section className={s.feed} aria-labelledby="feed-title">
          <h2 id="feed-title" className="visually-hidden">{query ? 'Kết quả tìm kiếm' : 'Bảng tin'}</h2>

          {/* Điện thoại: ô tìm nằm ở đây vì thanh trên đã ẩn nó */}
          <form role="search" className={s.mSearch} onSubmit={(e) => { e.preventDefault(); setQuery(searchText.trim()); }}>
            <i className="bi bi-search" aria-hidden="true" />
            <input type="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Tìm bài viết…" aria-label="Tìm bài viết theo tiêu đề" enterKeyHint="search" />
          </form>

          <div className={s.chips} role="group" aria-label="Lọc theo danh mục">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${s.chip} ${category === c.id ? s.chipOn : ''}`}
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {!query && (
            <button type="button" className={s.composer} onClick={() => later('Hộp đăng bài')}>
              <Avatar name={CURRENT_USER.name} size={40} />
              <span>Chia sẻ món chay hôm nay của bạn…</span>
              <i className="bi bi-image" aria-hidden="true" />
            </button>
          )}

          {query && (
            <p className={s.note}>
              {visible.length} bài có tiêu đề chứa <b>“{query}”</b>
              <button type="button" onClick={() => { setQuery(''); setSearchText(''); }}>Xoá tìm kiếm</button>
            </p>
          )}

          {visible.map((post, i) => (
            <div key={post.id} className={s.rise} style={{ '--i': Math.min(i, 4) }}>
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
            </div>
          ))}
          {visible.length === 0 && <p className={s.empty}>Không có bài nào khớp. Thử từ khoá hoặc danh mục khác.</p>}
        </section>

        <aside className={s.side} aria-label="Gợi ý bên lề">
          <MamPlan plan={TODAY_PLAN} onOpen={() => later('Thực đơn tuần')} />
          <div className={s.extra}>
            <Shops shops={SHOPS} />
            <Trending topics={TRENDING} onPick={setCategory} />
            <SideFooter />
          </div>
        </aside>
      </main>

      <AskMam onOpenFull={(e) => { e.preventDefault(); later('Trang trò chuyện với Mầm'); }} />
      <VersionSwitch current="v3" />

      {/* Điện thoại: thanh điều hướng dưới đáy, nút Đăng bài ở giữa */}
      <nav className={s.mobileNav} aria-label="Điều hướng nhanh">
        {NAV.slice(0, 2).map((n, i) => (
          <a key={n.key} href="#" className={`${s.mItem} ${i === 0 ? s.mOn : ''}`} aria-current={i === 0 ? 'page' : undefined}>
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

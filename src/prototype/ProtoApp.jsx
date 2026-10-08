import { useMemo, useState } from 'react';
import SearchInput from '../components/SearchInput/SearchInput';
import { useToast } from '../components/Toast/Toast';
import Shell from './components/Shell';
import FeedCard from './components/FeedCard';
import { Composer, CategoryFilter } from './components/FeedTop';
import { AiPlanCard, ShopsCard, TrendingCard, RailFooter } from './components/Rail';
import ProtoControls from './components/ProtoControls';
import { CATEGORIES, CURRENT_USER, NAV, POSTS, SHOPS, SHORTCUTS, TODAY_PLAN, TRENDING } from './data';

/**
 * Màn Bảng tin – Prototype UI v1.
 * Chỉ có dữ liệu giả + tương tác phía giao diện (thích, lọc, tìm theo tiêu đề).
 * Mọi chỗ "gọi API" đều hiện Toast để biết nút đã nối đúng chỗ.
 */
export default function ProtoApp() {
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

  const accountMenu = [
    { icon: 'person', label: 'Hồ sơ cá nhân', onClick: () => later('Hồ sơ cá nhân') },
    { icon: 'box-arrow-right', label: 'Đăng xuất', tone: 'alert', onClick: () => later('Đăng xuất') },
  ];

  return (
    <>
      <Shell
        nav={NAV}
        shortcuts={SHORTCUTS}
        activeKey="feed"
        user={CURRENT_USER}
        accountMenu={accountMenu}
        notificationCount={3}
        onCreate={() => later('Hộp đăng bài (PostComposer)')}
        search={(
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            onSearch={setQuery}
            placeholder="Tìm bài viết theo tiêu đề..."
          />
        )}
        aside={(
          <>
            <AiPlanCard plan={TODAY_PLAN} onOpen={() => later('Thực đơn tuần')} />
            <ShopsCard shops={SHOPS} />
            <TrendingCard topics={TRENDING} onPick={setCategory} />
            <RailFooter />
          </>
        )}
      >
        <h1 className="visually-hidden">Bảng tin</h1>
        <div style={{ display: 'grid', gap: 14 }}>
          <Composer user={CURRENT_USER} onOpen={(kind) => later(kind === 'ask' ? 'Khung chat với Mầm' : 'Hộp đăng bài')} />
          <CategoryFilter categories={CATEGORIES} value={category} onChange={setCategory} />

          {query && (
            <p style={{ margin: 0, color: 'var(--ac-muted)', fontSize: '0.88rem' }}>
              {visible.length} kết quả cho <b style={{ color: 'var(--ac-ink)' }}>“{query}”</b>
            </p>
          )}

          {visible.map((post) => (
            <FeedCard
              key={post.id}
              postType={post.type}
              title={post.title}
              excerpt={post.content}
              thumbnailUrl={post.thumbnailUrl}
              duration={post.duration}
              author={{ name: post.author.fullName, avatarUrl: post.author.avatarUrl }}
              createdAt={post.createdAt}
              categories={post.categories}
              voteCount={post.voteCount}
              commentCount={post.commentCount}
              voted={post.isVoted}
              reported={post.hasReported}
              onVote={() => vote(post.id)}
              onOpen={() => later('Chi tiết bài (Modal)')}
              onComment={() => later('Khu bình luận')}
              onShare={() => toast('Đã sao chép link bài viết')}
              onReport={() => later('Hộp báo cáo (ReportDialog)')}
            />
          ))}

          {visible.length === 0 && (
            <p style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ac-muted)' }}>
              Chưa có bài nào trong mục này.
            </p>
          )}
        </div>
      </Shell>
      <ProtoControls />
    </>
  );
}

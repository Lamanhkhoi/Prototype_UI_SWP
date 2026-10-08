import Menu from '../../components/Menu/Menu';
import IconButton from '../../components/IconButton/IconButton';
import Photo from '../../components/Photo/Photo';
import cx from '../../components/cx';
import { POST_TYPE } from '../../constants/domain';
import { formatCount, timeAgo } from '../../utils/format';
import ProtoAvatar from './ProtoAvatar';
import s from './FeedCard.module.css';

/**
 * Thẻ bài trên Bảng tin — bản v1 thay cho PostCard layout="card".
 * Giữ nguyên props của PostCard (title, excerpt, thumbnailUrl, author, categories, voteCount...)
 * để khi nhóm chốt thì chỉ cần thay phần hiển thị, không đổi PostFeedPage.
 *
 * Khác bản cũ:
 *  - Ảnh giới hạn khung 16:10, có viền mảnh → ảnh dọc/ngang cỡ nào cũng không phá nhịp bảng tin
 *  - Thanh hành động có CHỮ + số, vùng bấm cao 40px chia đều 3 nút
 *  - Bài hỏi nhanh (không ảnh, không trích đoạn) hiện như một "status" chữ lớn
 *  - Danh mục thành nhãn mềm, nằm cùng dòng thời gian → bớt 1 hàng
 */
export default function FeedCard({
  postType = 'blog', title, excerpt, href = '#', thumbnailUrl, duration,
  author = {}, createdAt, categories = [], voteCount = 0, commentCount = 0, voted = false,
  reported = false, isOwner = false, onVote, onOpen, onComment, onShare, onReport,
}) {
  const type = POST_TYPE[postType] ?? POST_TYPE.blog;
  const isQuick = !excerpt && !thumbnailUrl;
  const open = onOpen && ((e) => { e.preventDefault(); onOpen(); });

  const menuItems = isOwner ? [] : [reported
    ? { icon: 'flag-fill', label: 'Đã báo cáo', hint: 'Admin đang xem xét', disabled: true }
    : { icon: 'flag', label: 'Báo cáo bài viết', hint: 'Gửi cho Admin xem xét', onClick: onReport }];

  return (
    <article className={cx(s.card, isQuick && s.quick)}>
      <header className={s.head}>
        <ProtoAvatar name={author.name} src={author.avatarUrl} size={40} />
        <div className={s.who}>
          <a href="#" className={s.name} onClick={(e) => e.preventDefault()}>{author.name}</a>
          <div className={s.meta}>
            <time dateTime={createdAt}>{timeAgo(createdAt)}</time>
            <span className={s.sep} aria-hidden="true" />
            <span className={s.type}><i className={`bi bi-${type.icon}`} aria-hidden="true" />{type.label}</span>
            {categories.slice(0, 2).map((c) => (
              <span key={c.id} className={s.cat}>{c.name}</span>
            ))}
          </div>
        </div>
        {menuItems.length > 0 && (
          <Menu
            items={menuItems}
            renderTrigger={(p) => <IconButton icon="three-dots" label="Tuỳ chọn bài viết" variant="ghost" size="sm" {...p} />}
          />
        )}
      </header>

      <h2 className={s.title}><a href={href} onClick={open}>{title}</a></h2>
      {excerpt && <p className={s.excerpt}>{excerpt}</p>}

      {thumbnailUrl && (
        <a href={href} onClick={open} className={s.media} tabIndex={-1} aria-hidden="true">
          <Photo src={thumbnailUrl} ratio="16/10" className={s.img} />
          {postType === 'video' && (
            <>
              <span className={s.play}><i className="bi bi-play-fill" /></span>
              <span className={s.videoTag}><i className="bi bi-youtube" />{duration ?? 'Video'}</span>
            </>
          )}
        </a>
      )}

      <footer className={s.actions}>
        <button type="button" className={cx(s.act, voted && s.on)} aria-pressed={voted} onClick={onVote}>
          <i className={`bi bi-${voted ? 'heart-fill' : 'heart'}`} aria-hidden="true" />
          <span>Thích</span>
          <span className={s.n}>{formatCount(voteCount)}</span>
        </button>
        <button type="button" className={s.act} onClick={onComment}>
          <i className="bi bi-chat" aria-hidden="true" />
          <span>Bình luận</span>
          <span className={s.n}>{formatCount(commentCount)}</span>
        </button>
        <button type="button" className={s.act} onClick={onShare}>
          <i className="bi bi-link-45deg" aria-hidden="true" />
          <span>Sao chép link</span>
        </button>
      </footer>
    </article>
  );
}

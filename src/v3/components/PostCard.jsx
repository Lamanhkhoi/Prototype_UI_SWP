import Photo from '../../components/Photo/Photo';
import Menu from '../../components/Menu/Menu';
import Avatar from '../../components/Avatar/Avatar';
import { POST_TYPE } from '../../constants/domain';
import { formatCount, timeAgo } from '../../utils/format';
import s from './PostCard.module.css';

/**
 * Thẻ bài v3 (cùng props với PostCard của kit / v2), "ảnh món lên trước":
 *  - Ảnh nằm đầu thẻ, tràn viền, khung 16:9 → bảng tin giống tạp chí ẩm thực
 *  - Tiêu đề chữ có chân (Fraunces), tác giả nhỏ phía dưới
 *  - Bài hỏi nhanh (không ảnh): nhãn "Hỏi cộng đồng" + chữ lớn
 *  - Phẳng: không bóng đổ, không hiệu ứng loé / bắn tia như v2
 */
export default function PostCard({
  postType = 'blog', title, excerpt, thumbnailUrl, duration, author = {}, createdAt, categories = [],
  voteCount = 0, commentCount = 0, voted = false, reported = false,
  onVote, onOpen, onComment, onShare, onReport,
}) {
  const type = POST_TYPE[postType] ?? POST_TYPE.blog;
  const isQuick = !excerpt && !thumbnailUrl;
  const open = (e) => { e.preventDefault(); onOpen?.(); };

  return (
    <article className={`${s.card} ${isQuick ? s.quick : ''}`}>
      {thumbnailUrl && (
        <a href="#" onClick={open} className={s.media} tabIndex={-1} aria-hidden="true">
          <Photo src={thumbnailUrl} ratio="16/9" />
          {postType === 'video' && (
            <>
              <span className={s.play}><i className="bi bi-play-fill" /></span>
              <span className={s.duration}>{duration ?? 'Video'}</span>
            </>
          )}
        </a>
      )}

      <div className={s.body}>
        {isQuick && <span className={s.kicker}><i className="bi bi-question-circle" aria-hidden="true" /> Hỏi cộng đồng</span>}
        {!isQuick && categories.length > 0 && (
          <p className={s.cats}>{categories.slice(0, 3).map((c) => c.name).join(' · ')}</p>
        )}

        <h2 className={`v3-serif ${s.title}`}><a href="#" onClick={open}>{title}</a></h2>
        {excerpt && <p className={s.excerpt}>{excerpt}</p>}

        <div className={s.meta}>
          <Avatar name={author.name} size={28} />
          <span className={s.who}>
            <b>{author.name}</b>
            <span>
              <time dateTime={createdAt}>{timeAgo(createdAt)}</time> · {type.label}
            </span>
          </span>
        </div>
      </div>

      <footer className={s.actions}>
        <button type="button" className={`${s.act} ${voted ? s.on : ''}`} aria-pressed={voted} onClick={onVote}>
          <i className={`bi bi-${voted ? 'heart-fill' : 'heart'}`} aria-hidden="true" />
          {formatCount(voteCount)}<span className="visually-hidden"> lượt thích</span>
        </button>
        <button type="button" className={s.act} onClick={onComment}>
          <i className="bi bi-chat" aria-hidden="true" />
          {formatCount(commentCount)}<span className="visually-hidden"> bình luận</span>
        </button>
        <span className={s.spacer} />
        <button type="button" className={s.icon} onClick={onShare} aria-label="Sao chép link bài viết" title="Sao chép link">
          <i className="bi bi-link-45deg" aria-hidden="true" />
        </button>
        <Menu
          items={[reported
            ? { icon: 'flag-fill', label: 'Đã báo cáo', hint: 'Admin đang xem xét', disabled: true }
            : { icon: 'flag', label: 'Báo cáo bài viết', hint: 'Gửi cho Admin xem xét', onClick: onReport }]}
          renderTrigger={(p) => (
            <button type="button" className={s.icon} aria-label="Tuỳ chọn bài viết" {...p}>
              <i className="bi bi-three-dots" aria-hidden="true" />
            </button>
          )}
        />
      </footer>
    </article>
  );
}

import GlareHover from '../reactbits/GlareHover';
import ClickSpark from '../reactbits/ClickSpark';
import Photo from '../../components/Photo/Photo';
import Menu from '../../components/Menu/Menu';
import ProtoAvatar from '../../shared/ProtoAvatar';
import { POST_TYPE } from '../../constants/domain';
import { formatCount, timeAgo } from '../../utils/format';
import { useTheme } from '../../utils/theme';
import s from './PostCard.module.css';

/**
 * Thẻ bài v2 (cùng props với PostCard của kit):
 *  - GlareHover: vệt loé chéo rất nhẹ qua ảnh khi rê chuột
 *  - ClickSpark: bấm Thích → bắn tia lá (màu theo Sáng/Tối)
 */
export default function PostCard({
  postType = 'blog', title, excerpt, thumbnailUrl, duration, author = {}, createdAt, categories = [],
  voteCount = 0, commentCount = 0, voted = false, reported = false,
  onVote, onOpen, onComment, onShare, onReport,
}) {
  const type = POST_TYPE[postType] ?? POST_TYPE.blog;
  const isQuick = !excerpt && !thumbnailUrl;
  const open = (e) => { e.preventDefault(); onOpen?.(); };
  const [theme] = useTheme();

  return (
    <article className={`${s.card} ${isQuick ? s.quick : ''}`}>
      <header className={s.head}>
        <ProtoAvatar name={author.name} size={40} />
        <div className={s.who}>
          <b>{author.name}</b>
          <span>
            <time dateTime={createdAt}>{timeAgo(createdAt)}</time>
            <i className={s.dot} aria-hidden="true" />
            <i className={`bi bi-${type.icon}`} aria-hidden="true" /> {type.label}
          </span>
        </div>
        <Menu
          items={[reported
            ? { icon: 'flag-fill', label: 'Đã báo cáo', hint: 'Admin đang xem xét', disabled: true }
            : { icon: 'flag', label: 'Báo cáo bài viết', hint: 'Gửi cho Admin xem xét', onClick: onReport }]}
          renderTrigger={(p) => (
            <button type="button" className={s.more} aria-label="Tuỳ chọn bài viết" {...p}>
              <i className="bi bi-three-dots" aria-hidden="true" />
            </button>
          )}
        />
      </header>

      <h2 className={s.title}><a href="#" onClick={open}>{title}</a></h2>
      {excerpt && <p className={s.excerpt}>{excerpt}</p>}

      {categories.length > 0 && (
        <div className={s.tags}>
          {categories.slice(0, 3).map((c) => <span key={c.id} className={s.tag}>#{c.name}</span>)}
        </div>
      )}

      {thumbnailUrl && (
        <a href="#" onClick={open} className={s.media} tabIndex={-1} aria-hidden="true">
          <GlareHover
            width="100%"
            height="auto"
            background="transparent"
            borderRadius="18px"
            borderColor="var(--v-line)"
            glareColor="#ffffff"
            glareOpacity={0.14}
            glareAngle={-35}
            glareSize={260}
            transitionDuration={800}
            className={s.glare}
          >
            <Photo src={thumbnailUrl} ratio="16/10" className={s.img} />
            {postType === 'video' && (
              <>
                <span className={s.play}><i className="bi bi-play-fill" /></span>
                <span className={s.duration}><i className="bi bi-youtube" /> {duration ?? 'Video'}</span>
              </>
            )}
          </GlareHover>
        </a>
      )}

      <footer className={s.actions}>
        <span className={s.sparkWrap}>
          <ClickSpark sparkColor={theme === 'dark' ? '#8FB083' : '#3D5A3D'} sparkSize={9} sparkRadius={22} sparkCount={10} duration={450}>
            <button type="button" className={`${s.act} ${voted ? s.on : ''}`} aria-pressed={voted} onClick={onVote}>
              <i className={`bi bi-${voted ? 'heart-fill' : 'heart'}`} aria-hidden="true" />
              <span className={s.label}>Thích</span>
              <span className={s.n}>{formatCount(voteCount)}</span>
            </button>
          </ClickSpark>
        </span>
        <button type="button" className={s.act} onClick={onComment}>
          <i className="bi bi-chat" aria-hidden="true" />
          <span className={s.label}>Bình luận</span>
          <span className={s.n}>{formatCount(commentCount)}</span>
        </button>
        <span className={s.spacer} />
        <button type="button" className={s.iconAct} onClick={onShare} aria-label="Sao chép link bài viết" title="Sao chép link">
          <i className="bi bi-link-45deg" aria-hidden="true" />
        </button>
      </footer>
    </article>
  );
}

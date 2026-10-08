import cx from '../../components/cx';
import ProtoAvatar from '../../shared/ProtoAvatar';
import s from './FeedTop.module.css';

/** Ô "Hôm nay bạn nấu món chay gì?" — lối tắt vào PostComposer, thay cho việc chỉ có nút + ở thanh bên. */
export function Composer({ user, onOpen }) {
  const firstName = user?.name?.trim().split(/\s+/).pop();
  return (
    <section className={s.composer} aria-label="Đăng bài mới">
      <div className={s.row}>
        <ProtoAvatar name={user?.name} src={user?.avatarUrl} size={40} />
        <button type="button" className={s.fake} onClick={() => onOpen('blog')}>
          Hôm nay bạn nấu món chay gì{firstName ? `, ${firstName}` : ''}?
        </button>
      </div>
      <div className={s.tools}>
        <button type="button" className={s.tool} onClick={() => onOpen('photo')}>
          <i className={cx('bi bi-image', s.iPhoto)} aria-hidden="true" />Ảnh món
        </button>
        <button type="button" className={s.tool} onClick={() => onOpen('video')}>
          <i className={cx('bi bi-youtube', s.iVideo)} aria-hidden="true" />Video
        </button>
        <button type="button" className={s.tool} onClick={() => onOpen('ask')}>
          <i className={cx('bi bi-stars', s.iAi)} aria-hidden="true" />Hỏi Mầm
        </button>
      </div>
    </section>
  );
}

/** Lọc bảng tin theo Category. Mục đang chọn tô đậm màu chữ (đảo màu) — rõ hơn viền xanh. */
export function CategoryFilter({ categories, value, onChange }) {
  return (
    <div className={s.filters} role="group" aria-label="Lọc theo danh mục">
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          className={cx(s.pill, value === c.id && s.pillOn)}
          aria-pressed={value === c.id}
          onClick={() => onChange(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

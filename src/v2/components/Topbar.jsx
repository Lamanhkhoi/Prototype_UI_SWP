import s from './Topbar.module.css';

/** Thanh trên: ô tìm kiếm + nút "Thông báo" bên phải. Điện thoại có thêm nút mở menu bên trái. */
export default function Topbar({ value, onChange, onSearch, notificationCount = 0, onOpenMenu }) {
  return (
    <header className={s.bar}>
      <div className={s.inner}>
        <button type="button" className={s.menuBtn} onClick={onOpenMenu} aria-label="Mở menu">
          <i className="bi bi-list" aria-hidden="true" />
        </button>

        <form
          role="search"
          className={s.search}
          onSubmit={(e) => { e.preventDefault(); onSearch(value.trim()); }}
        >
          <i className="bi bi-search" aria-hidden="true" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tìm bài viết theo tiêu đề…"
            aria-label="Tìm bài viết"
            enterKeyHint="search"
          />
          {value && (
            <button type="button" className={s.clear} onClick={() => { onChange(''); onSearch(''); }} aria-label="Xoá tìm kiếm">
              <i className="bi bi-x-circle-fill" aria-hidden="true" />
            </button>
          )}
        </form>

        <button type="button" className={s.notify} aria-label={`Thông báo (${notificationCount} chưa đọc)`}>
          <i className="bi bi-bell" aria-hidden="true" />
          <span className={s.notifyLabel}>Thông báo</span>
          {notificationCount > 0 && <span className={s.badge}>{notificationCount}</span>}
        </button>
      </div>
    </header>
  );
}

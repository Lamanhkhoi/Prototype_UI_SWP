import Menu from '../../components/Menu/Menu';
import ProtoAvatar from '../../shared/ProtoAvatar';
import { useTheme } from '../../utils/theme';
import s from './TopNav.module.css';

/**
 * v3 bỏ thanh bên trái của v2 → điều hướng nằm ngang trên đầu, trả toàn bộ bề ngang cho nội dung.
 * ≥1100px: icon + chữ · 768–1099px: chỉ icon · <768px: ẩn, dùng thanh dưới đáy.
 */
export default function TopNav({
  nav, activeKey, user, accountMenu, search, onSearchChange, onSearch, notificationCount = 0, onCreate,
}) {
  const [theme, toggleTheme] = useTheme();

  return (
    <header className={s.bar}>
      <div className={s.inner}>
        <a href="#" className={s.brand} aria-label="Ăn Chay, về trang chủ">
          <span className={s.mark} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M5 19c0-8 5-13.5 14-14-.3 8.6-5.6 14-14 14Z" fill="currentColor" />
              <path d="M5 19c3-4.2 6-7 9.5-9" stroke="var(--t-bg)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
          </span>
          <span className="v3-serif">Ăn Chay</span>
        </a>

        <nav className={s.nav} aria-label="Điều hướng chính">
          {nav.map((n) => {
            const on = n.key === activeKey;
            return (
              <a key={n.key} href={n.href} className={`${s.link} ${on ? s.on : ''}`} aria-current={on ? 'page' : undefined} title={n.label}>
                <i className={`bi bi-${on && n.iconActive ? n.iconActive : n.icon}`} aria-hidden="true" />
                <span className={s.linkText}>{n.label}</span>
              </a>
            );
          })}
        </nav>

        <form role="search" className={s.search} onSubmit={(e) => { e.preventDefault(); onSearch(search.trim()); }}>
          <i className="bi bi-search" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bài viết…"
            aria-label="Tìm bài viết theo tiêu đề"
            enterKeyHint="search"
          />
        </form>

        <div className={s.tools}>
          <button
            type="button"
            className={s.icon}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
          >
            <i className={`bi bi-${theme === 'dark' ? 'sun' : 'moon'}`} aria-hidden="true" />
          </button>
          <button type="button" className={s.icon} aria-label={`Thông báo (${notificationCount} chưa đọc)`}>
            <i className="bi bi-bell" aria-hidden="true" />
            {notificationCount > 0 && <span className={s.badge}>{notificationCount}</span>}
          </button>
          <button type="button" className={s.create} onClick={onCreate}>
            <i className="bi bi-plus-lg" aria-hidden="true" /><span>Đăng bài</span>
          </button>
          <Menu
            width={240}
            items={accountMenu}
            renderTrigger={(p) => (
              <button type="button" className={s.account} aria-label={`Tài khoản: ${user.name}`} {...p}>
                <ProtoAvatar name={user.name} size={36} />
              </button>
            )}
          />
        </div>
      </div>
    </header>
  );
}

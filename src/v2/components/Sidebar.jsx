import Menu from '../../components/Menu/Menu';
import ProtoAvatar from '../../shared/ProtoAvatar';
import { useTheme, setTheme } from '../../utils/theme';
import s from './Sidebar.module.css';

/**
 * Thanh điều hướng bên trái — theo wireframe Figma "1 · Sketch".
 *  Trên:  logo Green Bowl + nút thu gọn · nút "+ Đăng bài" · 4 mục điều hướng
 *  Đáy:   nút Sáng/Tối (giống client) · hộp tài khoản (Hồ sơ cá nhân, Bài của tôi, người dùng + •••)
 *  collapsed=true → chỉ còn icon; bấm avatar mở popup gồm cả lối tắt tài khoản lẫn Đăng xuất
 *  Điện thoại: thành ngăn kéo trượt ra từ trái (mobileOpen), bấm nền tối để đóng
 */
export default function Sidebar({
  nav, accountLinks = [], activeKey, user, accountMenu, collapsed, onToggle, mobileOpen, onCloseMobile, onCreate,
}) {
  const [theme] = useTheme();
  const dark = theme === 'dark';

  const item = (n) => {
    const on = n.key === activeKey;
    return (
      <a key={n.key} href={n.href} className={`${s.item} ${on ? s.on : ''}`} aria-current={on ? 'page' : undefined} title={collapsed ? n.label : undefined}>
        <i className={`bi bi-${on && n.iconActive ? n.iconActive : n.icon} ${s.icon}`} aria-hidden="true" />
        <span className={s.label}>{n.label}</span>
        {n.tag && <span className={s.tag}>{n.tag}</span>}
      </a>
    );
  };

  // Thu gọn: không còn chỗ cho hộp tài khoản → gộp lối tắt vào popup của avatar
  const collapsedMenu = [...accountLinks, { divider: true }, ...accountMenu];

  return (
    <>
      <div className={`${s.scrim} ${mobileOpen ? s.scrimOn : ''}`} onClick={onCloseMobile} aria-hidden="true" />
      <aside className={`${s.side} ${collapsed ? s.collapsed : ''} ${mobileOpen ? s.open : ''}`} aria-label="Điều hướng chính">
        <div className={s.top}>
          <a href="#" className={s.brand} aria-label="Green Bowl, về trang chủ">
            <span className={s.mark} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M5 19c0-8 5-13.5 14-14-.3 8.6-5.6 14-14 14Z" fill="currentColor" />
                <path d="M5 19c3-4.2 6-7 9.5-9" stroke="var(--v-accent)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </span>
            <span className={s.name}>Green Bowl</span>
          </a>
          <button
            type="button"
            className={s.toggle}
            onClick={onToggle}
            aria-label={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
            aria-expanded={!collapsed}
            title={collapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            <i className={`bi bi-${collapsed ? 'layout-sidebar-inset' : 'layout-sidebar'}`} aria-hidden="true" />
          </button>
          <button type="button" className={s.closeMobile} onClick={onCloseMobile} aria-label="Đóng menu">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <button type="button" className={s.create} onClick={onCreate} title={collapsed ? 'Đăng bài' : undefined}>
          <i className="bi bi-plus-lg" aria-hidden="true" />
          <span className={s.label}>Đăng bài</span>
        </button>

        <nav className={s.nav}>{nav.map(item)}</nav>

        <div className={s.bottom}>
          {/* Sáng / Tối — giống FeedSidebar của client: icon + chữ của chế độ SẼ chuyển sang */}
          <button
            type="button"
            className={s.theme}
            onClick={() => setTheme(dark ? 'light' : 'dark')}
            aria-label={dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            title={collapsed ? (dark ? 'Chế độ sáng' : 'Chế độ tối') : undefined}
          >
            <i className={`bi bi-${dark ? 'sun' : 'moon-stars'} ${s.icon}`} aria-hidden="true" />
            <span className={s.label}>{dark ? 'Chế độ sáng' : 'Chế độ tối'}</span>
          </button>

          {collapsed ? (
            <Menu
              side="right"
              width={240}
              className={s.accountWrap}
              items={collapsedMenu}
              renderTrigger={(p) => (
                <button type="button" className={s.avatarBtn} aria-label={`Tài khoản: ${user.name}`} {...p}>
                  <ProtoAvatar name={user.name} size={34} />
                </button>
              )}
            />
          ) : (
            <div className={s.accountBox}>
              {accountLinks.map((l) => (
                <a key={l.label} href={l.href || '#'} className={s.link} onClick={(e) => { e.preventDefault(); l.onClick?.(); }}>
                  <i className={`bi bi-${l.icon} ${s.icon}`} aria-hidden="true" />
                  <span>{l.label}</span>
                </a>
              ))}
              <div className={s.userRow}>
                <ProtoAvatar name={user.name} size={34} />
                <span className={s.accountText}>
                  <b>{user.name}</b>
                  <small>{user.role}</small>
                </span>
                <Menu
                  side="right"
                  width={200}
                  items={accountMenu}
                  renderTrigger={(p) => (
                    <button type="button" className={s.more} aria-label="Tuỳ chọn tài khoản" {...p}>
                      <i className="bi bi-three-dots" aria-hidden="true" />
                    </button>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

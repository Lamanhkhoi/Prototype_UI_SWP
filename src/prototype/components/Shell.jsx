import Menu from '../../components/Menu/Menu';
import IconButton from '../../components/IconButton/IconButton';
import Logo from '../../components/AppShell/Logo';
import cx from '../../components/cx';
import { APP_NAME } from '../../constants/domain';
import { useTheme } from '../../utils/theme';
import ProtoAvatar from './ProtoAvatar';
import s from './Shell.module.css';

/**
 * Khung trang v1.
 *  - ≥ 1200px: thanh bên rộng có chữ (kiểu Linear) + cột phải
 *  - 768–1199px: thanh bên thu gọn chỉ còn icon, ẩn cột phải
 *  - < 768px: thanh trên + thanh tab dưới đáy
 * Thanh trên dùng CHUNG lưới cột với nội dung → ô tìm luôn thẳng mép với bảng tin.
 */
export default function Shell({
  nav, shortcuts = [], activeKey, user, accountMenu = [], notificationCount = 0,
  onCreate, search, aside, children,
}) {
  const [theme, toggleTheme] = useTheme();

  const menuItems = [
    ...accountMenu.filter((i) => i.tone !== 'alert'),
    { icon: theme === 'dark' ? 'sun' : 'moon-stars', label: theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối', onClick: toggleTheme },
    { divider: true },
    // Đăng xuất luôn nằm cuối, tách riêng → không bấm nhầm khi đổi giao diện
    ...accountMenu.filter((i) => i.tone === 'alert'),
  ];

  const bell = (
    <IconButton
      variant="ghost"
      icon={notificationCount ? 'bell-fill' : 'bell'}
      badge={notificationCount}
      label={`Thông báo${notificationCount ? ` (${notificationCount} chưa đọc)` : ''}`}
    />
  );

  const navItem = (item) => {
    const on = item.key === activeKey;
    return (
      <a
        key={item.key}
        href={item.href}
        className={cx(s.item, on && s.itemOn)}
        aria-current={on ? 'page' : undefined}
        title={item.label}
      >
        <i className={`bi bi-${on && item.iconActive ? item.iconActive : item.icon}`} aria-hidden="true" />
        <span className={s.label}>{item.label}</span>
        {item.tag && <span className={s.tag}>{item.tag}</span>}
        {item.count > 0 && <span className={s.count}>{item.count}</span>}
      </a>
    );
  };

  return (
    <div className={s.shell}>
      {/* ================= Thanh bên ================= */}
      <nav className={s.side} aria-label="Điều hướng chính">
        <div className={s.brand}>
          <Logo size={34} />
          <span className={s.brandName}>{APP_NAME}</span>
        </div>

        {onCreate && (
          <button type="button" className={s.create} onClick={onCreate} title="Đăng bài mới">
            <i className="bi bi-plus-lg" aria-hidden="true" />
            <span className={s.label}>Đăng bài</span>
          </button>
        )}

        <div className={s.nav}>{nav.map(navItem)}</div>

        {shortcuts.length > 0 && (
          <>
            <p className={s.section}>Của bạn</p>
            <div className={s.nav}>{shortcuts.map(navItem)}</div>
          </>
        )}

        {user && (
          <div className={s.bottom}>
            <Menu
              side="right"
              width={250}
              className={s.accountWrap}
              items={menuItems}
              renderTrigger={(p) => (
                <button type="button" className={s.account} aria-label="Tài khoản của bạn" {...p}>
                  <ProtoAvatar name={user.name} src={user.avatarUrl} size={34} />
                  <span className={s.accountText}>
                    <b>{user.name}</b>
                    <span>{user.role}</span>
                  </span>
                  <i className={cx('bi bi-three-dots', s.accountMore)} aria-hidden="true" />
                </button>
              )}
            />
          </div>
        )}
      </nav>

      {/* ================= Vùng chính ================= */}
      <div className={s.main}>
        <header className={s.topbar}>
          <div className={cx(s.cols, aside && s.withAside)}>
            <div className={s.barFeed}>
              <span className={s.mobileLogo}><Logo size={32} /></span>
              <div className={s.search}>{search}</div>
              <span className={s.barCompact}>{bell}</span>
              {user && (
                <span className={s.mobileOnly}>
                  <ProtoAvatar name={user.name} src={user.avatarUrl} size={32} />
                </span>
              )}
            </div>
            {aside && <div className={s.barRail}>{bell}</div>}
          </div>
        </header>

        <main className={cx(s.cols, s.content, aside && s.withAside)}>
          <div className={s.page}>{children}</div>
          {aside && <aside className={s.aside} aria-label="Gợi ý bên lề">{aside}</aside>}
        </main>
      </div>

      {/* ================= Tab dưới (điện thoại) ================= */}
      <nav className={s.tabbar} aria-label="Điều hướng nhanh">
        {nav.slice(0, 2).map((item) => (
          <a key={item.key} href={item.href} className={cx(s.tab, item.key === activeKey && s.tabOn)} aria-current={item.key === activeKey ? 'page' : undefined}>
            <i className={`bi bi-${item.key === activeKey && item.iconActive ? item.iconActive : item.icon}`} aria-hidden="true" />
            {item.label}
          </a>
        ))}
        {onCreate && (
          <button type="button" className={s.tabCreate} onClick={onCreate} aria-label="Đăng bài mới">
            <i className="bi bi-plus-lg" aria-hidden="true" />
          </button>
        )}
        {nav.slice(2, 4).map((item) => (
          <a key={item.key} href={item.href} className={s.tab}>
            <i className={`bi bi-${item.icon}`} aria-hidden="true" />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

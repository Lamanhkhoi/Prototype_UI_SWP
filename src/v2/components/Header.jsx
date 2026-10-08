import GooeyNav from '../reactbits/GooeyNav';
import StarBorder from '../reactbits/StarBorder';
import Menu from '../../components/Menu/Menu';
import ProtoAvatar from '../../shared/ProtoAvatar';
import s from './Header.module.css';

/**
 * Thanh trên dạng kính mờ, dính đầu trang.
 *  - Giữa: GooeyNav (React Bits) — bấm mục nào thì "giọt nước" chạy sang mục đó + bắn hạt
 *  - Phải: tìm nhanh (Ctrl K), chuông, avatar, nút Đăng bài viền sao chạy (StarBorder)
 */
export default function Header({ nav, user, notificationCount = 0, accountMenu, onCreate, onSearch }) {
  return (
    <header className={s.header}>
      <div className={`v2-container ${s.inner}`}>
        <a href="#" className={s.brand} aria-label="Ăn Chay, về trang chủ">
          <span className={s.mark} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M5 19c0-8 5-13.5 14-14-.3 8.6-5.6 14-14 14Z" fill="currentColor" />
              <path d="M5 19c3-4.2 6-7 9.5-9" stroke="#07100A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
          </span>
          <span className={s.name}>Ăn Chay</span>
        </a>

        <nav className={s.nav} aria-label="Điều hướng chính">
          <GooeyNav
            items={nav.map((n) => ({ label: n.label, href: n.href }))}
            particleCount={12}
            particleDistances={[70, 8]}
            particleR={90}
            animationTime={550}
            timeVariance={250}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            initialActiveIndex={0}
          />
        </nav>

        <div className={s.actions}>
          <button type="button" className={s.search} onClick={onSearch}>
            <i className="bi bi-search" aria-hidden="true" />
            <span className={s.searchText}>Tìm món, bài viết…</span>
            <kbd className={s.kbd}>Ctrl K</kbd>
          </button>

          <button type="button" className={s.icon} aria-label={`Thông báo (${notificationCount} chưa đọc)`}>
            <i className="bi bi-bell" aria-hidden="true" />
            {notificationCount > 0 && <span className={s.badge}>{notificationCount}</span>}
          </button>

          <Menu
            width={240}
            items={accountMenu}
            renderTrigger={(p) => (
              <button type="button" className={s.avatarBtn} aria-label="Tài khoản của bạn" {...p}>
                <ProtoAvatar name={user.name} size={34} />
              </button>
            )}
          />

          <StarBorder
            as="button"
            type="button"
            className={s.create}
            color="#BEF264"
            speed="5s"
            backgroundColor="#0B110D"
            textColor="#EEF3EC"
            borderColor="rgba(255,255,255,.12)"
            onClick={onCreate}
          >
            <i className="bi bi-plus-lg" aria-hidden="true" /> <span className={s.createText}>Đăng bài</span>
          </StarBorder>
        </div>
      </div>
    </header>
  );
}

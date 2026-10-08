import s from './VersionSwitch.module.css';

const VERSIONS = [
  { key: 'v2', label: 'v2', href: '/' },
  { key: 'v3', label: 'v3', href: '/v3.html' },
];

/**
 * Nút nổi ở giữa đáy màn hình để chuyển qua lại v2 ↔ v3 khi so sánh.
 * Chỉ có trong prototype. Màu cố định (không theo theme) để nhìn thấy như nhau ở cả 2 bản.
 */
export default function VersionSwitch({ current }) {
  return (
    <nav className={s.wrap} aria-label="Chuyển bản giao diện để so sánh">
      <span className={s.caption}>So sánh</span>
      {VERSIONS.map((v) => (
        <a
          key={v.key}
          href={v.href}
          className={`${s.opt} ${v.key === current ? s.on : ''}`}
          aria-current={v.key === current ? 'page' : undefined}
        >
          {v.label}
        </a>
      ))}
    </nav>
  );
}

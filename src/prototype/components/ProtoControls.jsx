import cx from '../../components/cx';
import { useTheme } from '../../utils/theme';
import { PALETTES, setPalette, usePalette } from '../palette';
import s from './ProtoControls.module.css';

/** Bảng điều khiển nổi CHỈ có trong prototype: đổi bảng màu + Sáng/Tối để so sánh nhanh. */
export default function ProtoControls() {
  const palette = usePalette();
  const [theme, toggleTheme] = useTheme();
  return (
    <div className={s.bar} role="group" aria-label="Điều khiển prototype">
      <span className={s.badge}>UI v1</span>
      <div className={s.seg} role="radiogroup" aria-label="Bảng màu">
        {PALETTES.map((p) => (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={palette === p.value}
            aria-label={p.label}
            className={cx(s.opt, palette === p.value && s.on)}
            onClick={() => setPalette(p.value)}
          >
            <span className={cx(s.swatch, s[p.value])} aria-hidden="true" />
            <span className={s.optText}>{p.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className={s.mode}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
        title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
      >
        <i className={`bi bi-${theme === 'dark' ? 'sun' : 'moon-stars'}`} aria-hidden="true" />
      </button>
    </div>
  );
}

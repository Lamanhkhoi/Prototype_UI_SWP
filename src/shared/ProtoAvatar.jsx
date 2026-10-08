// Avatar có màu nền riêng theo tên (Avatar của kit đang tô cùng 1 màu matcha cho mọi người,
// nên bảng tin nhìn đều đều). Màu lấy trong họ đất – lá để vẫn hợp theme.
// Pha với màu thẻ/màu chữ bằng color-mix → tự hợp cả nền sáng lẫn nền tối.
const TONES = ['#3D7A3D', '#A0582A', '#2F7E8E', '#8B55A8', '#A87A00', '#C0502F'];

const initialOf = (name = '') => name.trim().split(/\s+/).pop()?.charAt(0).toUpperCase() ?? '?';
const hash = (s = '') => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export default function ProtoAvatar({ name, src, size = 40, ring = false }) {
  const tone = TONES[hash(name) % TONES.length];
  const bg = `color-mix(in srgb, ${tone} 20%, var(--ac-card))`;
  const fg = `color-mix(in srgb, ${tone} 72%, var(--ac-ink))`;
  const style = {
    width: size,
    height: size,
    flex: 'none',
    borderRadius: '50%',
    fontSize: size * 0.4,
    boxShadow: ring ? '0 0 0 2px var(--ac-card), 0 0 0 3px var(--ac-border-strong)' : undefined,
  };
  if (src) return <img src={src} alt={name ?? ''} style={{ ...style, objectFit: 'cover' }} />;
  return (
    <span
      role="img"
      aria-label={name}
      style={{ ...style, display: 'inline-grid', placeItems: 'center', background: bg, color: fg, fontWeight: 700, lineHeight: 1 }}
    >
      {initialOf(name)}
    </span>
  );
}

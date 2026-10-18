import { useEffect, useState } from 'react';
import { fetchActiveDishes } from '../../shared/recipeMock';
import s from './TodayDish.module.css';

// Thẻ "Hôm nay ăn gì?" (phong cách Organic, 16/10/2026).
//  - Món lấy từ bảng dish (chỉ status 'active'), KHÔNG có danh sách viết cứng.
//  - Luôn dùng hình bát minh hoạ, KHÔNG dùng dish.image_url (Khôi chốt 16/10: đồng nhất 1 kiểu hình).
//  - Tự đổi món theo chu kỳ, không có nút. Rê chuột vào thẻ → dừng để đọc.
//  - Người dùng tắt hiệu ứng trong hệ điều hành → đứng yên ở món đầu.
//  - Đang tải → khung xám; lỗi hoặc chưa có món → ẩn cả thẻ.
//  - Bố cục A (chốt 16/10): câu hỏi 24px làm tiêu đề cạnh đĩa, tên món bên dưới cả bề ngang thẻ.
//  Props: load = () => Promise<{items}> (dự án thật: recipeService.getActiveDishes) · interval (ms, mặc định 4000)

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const shuffle = (list) => {
  const a = [...list];
  for (let k = a.length - 1; k > 0; k -= 1) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
};
// Tên ngắn → chữ to (điểm nhấn), tên dài → chữ nhỏ dần để luôn vừa khung cố định
const sizeOf = (name) => {
  const n = name.length;
  if (n <= 10) return 'xl';
  if (n <= 18) return 'lg';
  return n <= 40 ? 'md' : 'sm';
};
// Mỗi món 1 màu nước sốt cố định theo tên
const TONES = ['tone1', 'tone2', 'tone3'];
export const toneOf = (name) => TONES[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % TONES.length];

/** Hình bát món nhìn từ trên xuống */
export function Bowl({ tone }) {
  return (
    <svg className={`${s.bowl} ${s[tone]}`} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="94" className={s.dish} />
      <circle cx="100" cy="100" r="72" className={s.sauce} />
      <rect x="62" y="66" width="30" height="30" rx="8" className={s.tofu} />
      <rect x="104" y="78" width="30" height="30" rx="8" className={s.tofu} />
      <rect x="74" y="108" width="30" height="30" rx="8" className={s.tofu} />
      <circle cx="128" cy="126" r="7" className={s.herb} />
      <circle cx="132" cy="62" r="6" className={s.herb} />
      <path d="M112 120c10-14 26-14 30-10-6 10-18 16-30 10z" className={s.herb} />
    </svg>
  );
}

export default function TodayDish({ load = fetchActiveDishes, interval = 4000 }) {
  const [dishes, setDishes] = useState(null); // null = đang tải
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let alive = true;
    load()
      .then(({ items = [] }) => {
        if (!alive) return;
        const list = items
          .map((d) => ({ id: d.dish_id ?? d.id, name: (d.name ?? '').trim() }))
          .filter((d) => d.name);
        setDishes(shuffle(list));
        setI(0);
      })
      .catch(() => alive && setDishes([]));
    return () => { alive = false; };
  }, [load]);

  useEffect(() => {
    if (!dishes || dishes.length < 2 || paused || reduceMotion()) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % dishes.length), interval);
    return () => clearInterval(t);
  }, [dishes, paused, interval]);

  if (dishes && dishes.length === 0) return null;
  const dish = dishes?.[i];

  return (
    <section
      className={s.card}
      aria-label="Hôm nay ăn gì?"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <svg className={s.leaf} viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <path d="M110 10C80 30 50 60 24 110" />
        <path d="M84 30c-20-4-34 6-38 22 18 4 32-4 38-22z" />
        <path d="M66 54c-18 2-28 16-26 32 16-2 26-14 26-32z" />
      </svg>

      <p className={s.ask}>Hôm nay ăn gì?</p>

      {dish ? (
        <>
          <div key={`p-${dish.id}-${i}`} className={s.plate}><Bowl tone={toneOf(dish.name)} /></div>
          <p className={`${s.name} ${s[sizeOf(dish.name)]}`} aria-live={paused ? 'polite' : 'off'}>
            <span key={`n-${dish.id}-${i}`} className={s.swap}>{dish.name}</span>
          </p>
        </>
      ) : (
        <>
          <div className={`${s.plate} ${s.sk}`} aria-busy="true" />
          <div className={`${s.name} ${s.skLines}`}><span className={s.sk} /><span className={s.sk} /></div>
        </>
      )}
    </section>
  );
}

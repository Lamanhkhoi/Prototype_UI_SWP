import BlurText from '../reactbits/BlurText';
import TodayDish from './TodayDish';
import CountUp from '../reactbits/CountUp';
import Avatar from '../../components/Avatar/Avatar';
import AiPlanCard from './AiPlanCard';
import s from './Hero.module.css';

const greet = () => {
  const h = new Date().getHours();
  if (h < 11) return 'Chào buổi sáng';
  if (h < 14) return 'Chào buổi trưa';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};

/**
 * Cột trái của Bảng tin:
 *  - Lời chào BlurText + thẻ "Hôm nay ăn gì?" (TodayDish, tự đổi món từ bảng dish)
 *  - Số liệu cộng đồng đếm lên (CountUp)
 *  - Thẻ Mầm gợi ý hôm nay
 */
export default function Hero({ user, stats, plan, onOpenPlan }) {
  const firstName = user.name.trim().split(/\s+/).pop();
  return (
    <div className={s.hero}>
      <h1 className="visually-hidden">{greet()}, {firstName}. Bảng tin Ăn Chay</h1>
      <div className={s.title} aria-hidden="true">
        <BlurText text={`${greet()}, ${firstName}.`} delay={90} animateBy="words" direction="top" className={s.blur} />
      </div>

      {/* 16/10/2026: thay dòng "Hôm nay ăn [từ xoay]?" bằng thẻ Organic, món lấy từ bảng dish */}
      <TodayDish />

      <p className={s.lead}>Công thức, mẹo bếp và quán chay ngon quanh bạn.</p>

      <ul className={s.stats}>
        {stats.map((st) => (
          <li key={st.label}>
            <b><CountUp to={st.value} separator="." duration={1.6} /></b>
            <span>{st.label}</span>
          </li>
        ))}
      </ul>

      <div className={s.plan}>
        <AiPlanCard plan={plan} onOpen={onOpenPlan} />
      </div>
    </div>
  );
}

/** Ô đăng bài ở đầu Bảng tin (giữa trang, kiểu Facebook). */
export function QuickComposer({ user, onCompose }) {
  return (
    <button type="button" className={s.composer} onClick={onCompose}>
      <Avatar name={user.name} size={36} />
      <span className={s.placeholder}>Chia sẻ món chay hôm nay của bạn…</span>
      <span className={s.tools} aria-hidden="true">
        <i className="bi bi-image" />
        <i className="bi bi-youtube" />
      </span>
      <span className={s.post}>Đăng <i className="bi bi-arrow-up-right" aria-hidden="true" /></span>
    </button>
  );
}

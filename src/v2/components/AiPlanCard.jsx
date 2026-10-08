import ShinyText from '../reactbits/ShinyText';
import { AI_DISCLAIMER } from '../../constants/domain';
import s from './AiPlanCard.module.css';

const SIZE = 132;
const STROKE = 8;
const STEP = 13; // khoảng cách giữa 2 vòng

/** Vòng tròn đồng tâm: mỗi vòng là % năng lượng của 1 nhóm chất, bắt đầu từ 12 giờ, chạy theo chiều kim đồng hồ. */
function MacroRings({ macros }) {
  const c = SIZE / 2;
  const rings = [...macros].sort((a, b) => b.pct - a.pct); // nhiều nhất nằm ngoài cùng
  return (
    <svg
      className={s.rings}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      role="img"
      aria-label={macros.map((x) => `${x.label} ${x.pct}%`).join(', ')}
    >
      {rings.map((x, i) => {
        const r = c - STROKE / 2 - i * STEP;
        const len = 2 * Math.PI * r;
        return (
          <g key={x.key}>
            <circle
              className={s.arc}
              cx={c}
              cy={c}
              r={r}
              transform={`rotate(-90 ${c} ${c})`}
              style={{ stroke: `var(--ac-${x.key})`, '--len': `${(len * x.pct) / 100}px`, '--full': `${len}px`, '--i': i }}
            />
            <text className={s.arcLabel} x={c - 6} y={c - r + 3.5} textAnchor="end">{x.pct}%</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Thẻ "Mầm gợi ý hôm nay" — biểu tượng AI phát sáng (neon duy nhất của trang) + chữ ánh kim (ShinyText). */
export default function AiPlanCard({ plan, onOpen }) {
  const total = plan.meals.reduce((sum, m) => sum + m.kcal, 0);
  const pct = Math.round((total / plan.target) * 100);
  return (
      <section className={s.card} aria-labelledby="v2-ai-title">
        <header className={s.head}>
          <span className={`v2-ai-orb ${s.orb}`} aria-hidden="true"><i className="bi bi-stars" /></span>
          <div>
            <h2 id="v2-ai-title" className={s.title}>
              <ShinyText text="Mầm gợi ý hôm nay" speed={3} color="var(--v-text-2)" shineColor="var(--v-text)" spread={100} />
            </h2>
            <p className={s.sub}>{plan.goal} · mục tiêu {plan.target.toLocaleString('vi-VN')} kcal</p>
          </div>
        </header>

        <ol className={s.meals}>
          {plan.meals.map((m, i) => (
            <li key={m.slot} className={s.meal} style={{ '--i': i }}>
              <span className={s.slot}><i className={`bi bi-${m.icon}`} aria-hidden="true" />{m.label}</span>
              <b className={s.dish}>{m.dish}</b>
              <span className={s.kcal}>{m.kcal}<small>kcal</small></span>
            </li>
          ))}
        </ol>

        <div className={s.ring}>
          <div className={s.ringRow}>
            <MacroRings macros={plan.macros} />
            <ul className={s.legend} aria-hidden="true">
              {plan.macros.map((x) => <li key={x.key}><i style={{ background: `var(--ac-${x.key})` }} />{x.label}</li>)}
            </ul>
          </div>
          <div className={s.barMeta}>
            <span>{total.toLocaleString('vi-VN')} / {plan.target.toLocaleString('vi-VN')} kcal</span>
            <b>{pct}%</b>
          </div>
        </div>

        <button type="button" className={s.cta} onClick={onOpen}>
          Mở thực đơn cả tuần <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
        <p className={s.note}>{AI_DISCLAIMER}</p>
      </section>
  );
}

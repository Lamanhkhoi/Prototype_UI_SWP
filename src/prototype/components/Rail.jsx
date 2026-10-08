import Photo from '../../components/Photo/Photo';
import cx from '../../components/cx';
import { AI_DISCLAIMER, AI_NAME } from '../../constants/domain';
import { formatNumber } from '../../utils/format';
import s from './Rail.module.css';

/** Thẻ "Mầm gợi ý hôm nay" — điểm nhấn duy nhất có chuyển động (viền sáng chạy chậm). */
export function AiPlanCard({ plan, onOpen }) {
  const total = plan.meals.reduce((sum, m) => sum + m.kcal, 0);
  const pct = Math.min(100, Math.round((total / plan.target) * 100));
  return (
    <section className={cx(s.panel, s.ai)} aria-labelledby="ai-plan-title">
      <div className={s.aiHead}>
        <span className={s.spark} aria-hidden="true"><i className="bi bi-stars" /></span>
        <div>
          <h2 id="ai-plan-title" className={s.h}>{AI_NAME} gợi ý hôm nay</h2>
          <p className={s.sub}>Mục tiêu: {plan.goal} · {formatNumber(plan.target)} kcal</p>
        </div>
      </div>

      <ul className={s.meals}>
        {plan.meals.map((m) => (
          <li key={m.slot} className={s.meal}>
            <span className={s.slotIcon} aria-hidden="true"><i className={`bi bi-${m.icon}`} /></span>
            <span className={s.mealText}>
              <small>{m.label}</small>
              <b>{m.dish}</b>
            </span>
            <span className={s.kcal}>{m.kcal}<small> kcal</small></span>
          </li>
        ))}
      </ul>

      <div className={s.budget}>
        <div className={s.budgetRow}>
          <span>Đã lên {formatNumber(total)} / {formatNumber(plan.target)} kcal</span>
          <b>{pct}%</b>
        </div>
        <div className={s.macroBar} role="img" aria-label={plan.macros.map((x) => `${x.label} ${x.pct}%`).join(', ')}>
          {plan.macros.map((x) => (
            <span key={x.key} style={{ width: `${x.pct}%`, background: `var(--ac-${x.key})` }} />
          ))}
        </div>
        <ul className={s.legend} aria-hidden="true">
          {plan.macros.map((x) => (
            <li key={x.key}><span style={{ background: `var(--ac-${x.key})` }} />{x.label} {x.pct}%</li>
          ))}
        </ul>
      </div>

      <button type="button" className={s.aiBtn} onClick={onOpen}>
        Xem thực đơn cả tuần <i className="bi bi-arrow-right" aria-hidden="true" />
      </button>
      <p className={s.disclaimer}>{AI_DISCLAIMER}</p>
    </section>
  );
}

export function ShopsCard({ shops }) {
  return (
    <section className={s.panel} aria-labelledby="shops-title">
      <div className={s.panelHead}>
        <h2 id="shops-title" className={s.h}>Quán chay gần bạn</h2>
        <a href="#" className={s.more}>Xem bản đồ</a>
      </div>
      <ul className={s.list}>
        {shops.map((shop) => (
          <li key={shop.id}>
            <a href="#" className={s.shop}>
              <span className={s.thumb}><Photo src={shop.photo} ratio="1/1" /></span>
              <span className={s.shopText}>
                <b>{shop.name}</b>
                <small>{shop.area} · {shop.distance}</small>
              </span>
              <span className={cx(s.open, !shop.open && s.closed)}>
                <span className={s.dot} aria-hidden="true" />
                {shop.open ? `Mở đến ${shop.until}` : `Mở lúc ${shop.until}`}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TrendingCard({ topics, onPick }) {
  const max = Math.max(...topics.map((t) => t.count));
  return (
    <section className={s.panel} aria-labelledby="trend-title">
      <div className={s.panelHead}>
        <h2 id="trend-title" className={s.h}>Danh mục sôi nổi tuần này</h2>
      </div>
      <ol className={s.trend}>
        {topics.map((t, i) => (
          <li key={t.id}>
            <button type="button" className={s.trendRow} onClick={() => onPick(t.id)}>
              <span className={s.rank}>{i + 1}</span>
              <span className={s.trendName}>{t.name}</span>
              <span className={s.trendBar} aria-hidden="true"><span style={{ width: `${(t.count / max) * 100}%` }} /></span>
              <span className={s.trendCount}>{t.count} bài</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RailFooter() {
  return (
    <footer className={s.footer}>
      <a href="#">Giới thiệu</a>
      <a href="#">Quy tắc cộng đồng</a>
      <a href="#">Góp ý</a>
      <span>Ăn Chay · SWP391 · 2026</span>
    </footer>
  );
}

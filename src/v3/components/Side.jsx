import Photo from '../../components/Photo/Photo';
import { AI_DISCLAIMER } from '../../constants/domain';
import s from './Side.module.css';

const n = (x) => x.toLocaleString('vi-VN');

/**
 * Thẻ Mầm gợi ý (v3): phẳng, không neon, không chữ ánh kim.
 * Thay 4 vòng tròn đồng tâm của v2 bằng 1 thanh ngang chia phần → đọc tỉ lệ nhanh hơn.
 */
export function MamPlan({ plan, onOpen }) {
  const total = plan.meals.reduce((sum, m) => sum + m.kcal, 0);
  const pct = Math.round((total / plan.target) * 100);
  return (
    <section className={`${s.panel} ${s.plan}`} aria-labelledby="v3-plan-title">
      <header className={s.planHead}>
        <span className="v2-ai-orb" style={{ width: 36, height: 36 }} aria-hidden="true"><i className="bi bi-stars" /></span>
        <div>
          <h2 id="v3-plan-title" className={`v3-serif ${s.planTitle}`}>Mầm gợi ý hôm nay</h2>
          <p className={s.sub}>{plan.goal} · mục tiêu {n(plan.target)} kcal</p>
        </div>
      </header>

      <ol className={s.meals}>
        {plan.meals.map((m) => (
          <li key={m.slot}>
            <span className={s.slot}>{m.label}</span>
            <b>{m.dish}</b>
            <span className={s.kcal}>{m.kcal}</span>
          </li>
        ))}
      </ol>

      <div className={s.total}>
        <span>{n(total)} / {n(plan.target)} kcal</span><b>{pct}%</b>
      </div>
      <div className={s.bar} role="img" aria-label={plan.macros.map((x) => `${x.label} ${x.pct}%`).join(', ')}>
        {plan.macros.map((x) => <span key={x.key} style={{ flexGrow: x.pct, background: `var(--ac-${x.key})` }} />)}
      </div>
      <ul className={s.legend} aria-hidden="true">
        {plan.macros.map((x) => <li key={x.key}><i style={{ background: `var(--ac-${x.key})` }} />{x.label} {x.pct}%</li>)}
      </ul>

      <button type="button" className={s.cta} onClick={onOpen}>
        Mở thực đơn cả tuần <i className="bi bi-arrow-right" aria-hidden="true" />
      </button>
      <p className={s.note}>{AI_DISCLAIMER}</p>
    </section>
  );
}

export function Shops({ shops }) {
  return (
    <section className={s.panel} aria-labelledby="v3-shops">
      <div className={s.head}>
        <h2 id="v3-shops" className={`v3-serif ${s.h}`}>Quán chay gần bạn</h2>
        <a href="#" className={s.link}>Bản đồ</a>
      </div>
      <ul className={s.shops}>
        {shops.map((shop) => (
          <li key={shop.id}>
            <a href="#" className={s.shop}>
              <span className={s.thumb}><Photo src={shop.photo} ratio="1/1" /></span>
              <span className={s.shopText}>
                <b>{shop.name}</b>
                <small>{shop.area} · {shop.distance}</small>
              </span>
              <span className={`${s.status} ${shop.open ? s.open : ''}`}>
                {shop.open ? `Mở đến ${shop.until}` : 'Đã đóng'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Trending({ topics, onPick }) {
  return (
    <section className={s.panel} aria-labelledby="v3-trend">
      <div className={s.head}><h2 id="v3-trend" className={`v3-serif ${s.h}`}>Sôi nổi tuần này</h2></div>
      <ol className={s.trend}>
        {topics.map((t, i) => (
          <li key={t.id}>
            <button type="button" onClick={() => onPick(t.id)}>
              <span className={s.rank}>{i + 1}</span>
              <b>#{t.name}</b>
              <small>{t.count} bài</small>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function SideFooter() {
  return (
    <footer className={s.footer}>
      <a href="#">Giới thiệu</a><a href="#">Quy tắc cộng đồng</a><a href="#">Góp ý</a>
      <span>© 2026 Ăn Chay · SWP391</span>
    </footer>
  );
}

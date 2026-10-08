import AnimatedList from '../reactbits/AnimatedList';
import Photo from '../../components/Photo/Photo';
import Avatar from '../../components/Avatar/Avatar';
import s from './Rail.module.css';

export function ShopsCard({ shops }) {
  return (
    <section className={s.panel}>
      <div className={s.head}>
        <h2 className={s.h}><i className="bi bi-geo-alt" aria-hidden="true" /> Quán chay gần bạn</h2>
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
                {shop.open ? 'Đang mở' : 'Đã đóng'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** "Đang diễn ra" — AnimatedList của React Bits: từng dòng trượt vào khi cuộn tới. */
export function ActivityCard({ items }) {
  return (
    <section className={s.panel}>
      <div className={s.head}>
        <h2 className={s.h}><span className={s.live} aria-hidden="true" /> Đang diễn ra</h2>
      </div>
      <AnimatedList
        className={s.list}
        itemClassName={s.item}
        showGradients
        displayScrollbar={false}
        enableArrowNavigation={false}
        items={items.map((a) => (
          <span key={a.id} className={s.activity}>
            <Avatar name={a.who} size={28} />
            <span className={s.activityText}>
              <b>{a.who}</b> {a.what} <em>{a.target}</em>
              <small>{a.when}</small>
            </span>
          </span>
        ))}
      />
    </section>
  );
}

export function TrendingCard({ topics, onPick }) {
  return (
    <section className={s.panel}>
      <div className={s.head}>
        <h2 className={s.h}><i className="bi bi-fire" aria-hidden="true" /> Sôi nổi tuần này</h2>
      </div>
      <div className={s.chips}>
        {topics.map((t) => (
          <button key={t.id} type="button" className={s.chip} onClick={() => onPick(t.id)}>
            #{t.name}<span>{t.count}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function RailFooter() {
  return (
    <footer className={s.footer}>
      <a href="#">Giới thiệu</a><a href="#">Quy tắc cộng đồng</a><a href="#">Góp ý</a>
      <span>© 2026 Ăn Chay · SWP391 · Một số hiệu ứng từ React Bits</span>
    </footer>
  );
}

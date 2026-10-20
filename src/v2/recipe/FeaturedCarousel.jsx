import { useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import Photo from '../../components/Photo/Photo';
import { RecipeFacts } from '../../components/RecipeView/RecipeView';
import { Bowl, toneOf } from '../components/TodayDish';
import s from './FeaturedCarousel.module.css';

/**
 * Khung chiếu "Nổi bật tuần này" kiểu trang chủ Epic Games Store (chốt 20/10/2026):
 * khung lớn chia đôi (chữ trái, ảnh phải) + danh sách 5 công thức bên phải.
 *
 * Tự chuyển bài sau 7 giây. Thời gian do CSS animation của thanh tiến độ đếm
 * (hết animation → sang bài kế), nên tạm dừng chỉ là `animation-play-state: paused`.
 * Dừng khi: rê chuột vào, Tab vào bên trong, bấm nút Tạm dừng (WCAG 2.2.2).
 * prefers-reduced-motion: thanh không chạy → không tự chuyển, ẩn nút Tạm dừng.
 *
 * @param {object[]} items       công thức (dạng GET /api/recipes)
 * @param {(id) => string} hrefOf
 * @param {(item) => string|undefined} [flagOf]  nhãn dị ứng, vd "Có Đậu phộng"
 */
export const SLIDE_MS = 7000;

const Cover = ({ it, thumb }) => (it.thumbnailUrl
  ? <Photo src={it.thumbnailUrl} className={s.photo} />
  : <div className={s.fallback}><div className={thumb ? s.plateSm : s.plate}><Bowl tone={toneOf(it.dishName)} /></div></div>);

export default function FeaturedCarousel({ items, hrefOf, flagOf = () => undefined }) {
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false); // người dùng bấm Tạm dừng
  const [hold, setHold] = useState(false);       // đang rê chuột / đang focus bên trong
  const paused = stopped || hold;
  const it = items[active];
  const flag = flagOf(it);
  const time = (it.prepTimeMinutes ?? 0) + (it.cookTimeMinutes ?? 0) || undefined;

  return (
    <div
      className={s.wrap}
      aria-roledescription="băng chuyền"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHold(false)}
    >
      <article
        key={it.id}
        className={s.slide}
        aria-roledescription="trang chiếu"
        aria-label={`${active + 1} trên ${items.length}`}
        aria-live={paused ? 'polite' : 'off'}
      >
        {/* Ảnh đứng trước chữ trong DOM: cùng là phần tử định vị, cái sau nằm trên → chữ luôn nằm trên ảnh */}
        <a href={hrefOf(it.id)} className={s.media} tabIndex={-1} aria-hidden="true"><Cover it={it} /></a>
        <div className={s.text}>
          <div className={s.top}>
            <span className={s.dish}><i className="bi bi-bookmark" aria-hidden="true" /> {it.dishName}</span>
            {flag && <span className={s.flag}><i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /> {flag}</span>}
          </div>
          <div className={s.mid}>
            <h3 className={s.title}><a href={hrefOf(it.id)}>{it.title}</a></h3>
            {it.description && <p className={s.desc}>{it.description}</p>}
            <div className={s.actions}>
              <Button as="a" href={hrefOf(it.id)} icon="arrow-right" iconPosition="end">Xem công thức</Button>
              <IconButton
                className={s.pause}
                icon={stopped ? 'play-fill' : 'pause-fill'}
                label={stopped ? 'Tiếp tục tự chuyển' : 'Tạm dừng tự chuyển'}
                variant="ghost"
                onClick={() => setStopped(!stopped)}
              />
            </div>
          </div>
          <div className={s.foot}>
            <div className={s.by}>
              <Avatar src={it.authorAvatarUrl ?? undefined} name={it.authorName} size={24} />
              <span className={s.author}>{it.authorName}</span>
              <span><i className="bi bi-hand-thumbs-up" aria-hidden="true" /> {it.likeCount}<span className="visually-hidden"> lượt thích</span></span>
            </div>
            <RecipeFacts cookTimeMinutes={time} servings={it.servings} calories={it.caloriesKcal ?? undefined} size="sm" />
          </div>
        </div>
      </article>

      <ul className={s.list} aria-label="Chọn công thức nổi bật">
        {items.map((x, i) => (
          <li key={x.id}>
            <button
              type="button"
              className={s.item}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => setActive(i)}
            >
              {i === active && (
                <span
                  key={x.id}
                  className={s.progress}
                  style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                  onAnimationEnd={() => setActive((active + 1) % items.length)}
                  aria-hidden="true"
                />
              )}
              <span className={s.thumb}><Cover it={x} thumb /></span>
              <span className={s.name}>{x.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import ChatThread from '../../components/ChatThread/ChatThread';
import ChatBubble from '../../components/ChatBubble/ChatBubble';
import ChatComposer from '../../components/ChatComposer/ChatComposer';
import PromptChip from '../../components/PromptChip/PromptChip';
import { AI_NAME } from '../../constants/domain';
import s from './AskMam.module.css';

const PROMPTS = [
  { icon: 'egg-fried', text: 'Làm bánh chay thì thay trứng bằng gì?' },
  { icon: 'lightning-charge', text: 'Bữa sáng chay nào nhiều đạm?' },
  { icon: 'fire', text: 'Một tô bún Huế chay khoảng bao nhiêu kcal?' },
];

// ponytail: câu trả lời giả cố định, nối API chat thật khi có backend
const REPLY = 'Câu hỏi hay! Gợi ý nhanh:\n- **Đậu hũ non** hoặc **hạt chia ngâm nước** thay được trứng trong nhiều món\n- Muốn so sánh kỹ hơn, mở trang trò chuyện để mình phân tích chi tiết nhé.';

/**
 * Nút Mầm nổi ở góc dưới phải → bấm mở khung hỏi nhanh.
 * Hỏi sâu hơn thì sang trang trò chuyện đầy đủ (fullHref).
 */
export default function AskMam({ fullHref = '#', onOpenFull }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const fabRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector('textarea')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); fabRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const ask = async (text) => {
    setMsgs((l) => [...l, { id: l.length, sender: 'user', content: text, time: new Date().toISOString() }]);
    setBusy(true);
    await new Promise((r) => { setTimeout(r, 900); });
    setMsgs((l) => [...l, { id: l.length, sender: 'bot', content: REPLY, time: new Date().toISOString() }]);
    setBusy(false);
  };

  return (
    <div className={s.wrap}>
      {open && (
        <section ref={panelRef} id="ask-mam" className={s.panel} role="dialog" aria-labelledby="ask-mam-title">
          <header className={s.head}>
            <span className={`v2-ai-orb ${s.orb}`} aria-hidden="true"><i className="bi bi-stars" /></span>
            <div className={s.headText}>
              <h2 id="ask-mam-title" className={s.title}>Hỏi nhanh {AI_NAME}</h2>
              <p className={s.sub}>Trả lời ngắn, ngay tại đây</p>
            </div>
            <a href={fullHref} className={s.full} onClick={onOpenFull}>
              Hỏi sâu hơn <i className="bi bi-arrow-up-right" aria-hidden="true" />
            </a>
          </header>

          <ChatThread
            className={s.thread}
            empty={(
              <div className={s.empty}>
                <p>Hỏi {AI_NAME} về món chay, thay nguyên liệu hay calo.</p>
                <div className={s.prompts}>
                  {PROMPTS.map((p) => (
                    <PromptChip key={p.text} icon={p.icon} block disabled={busy} onClick={() => ask(p.text)}>{p.text}</PromptChip>
                  ))}
                </div>
              </div>
            )}
          >
            {msgs.map((m) => <ChatBubble key={m.id} {...m} />)}
            {busy && <ChatBubble typing />}
          </ChatThread>

          <div className={s.foot}>
            <ChatComposer onSend={ask} busy={busy} placeholder={`Hỏi ${AI_NAME} một câu ngắn...`} />
          </div>
        </section>
      )}

      <button
        ref={fabRef}
        type="button"
        className={`v2-ai-orb ${s.fab}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ask-mam"
        aria-label={open ? `Đóng khung hỏi ${AI_NAME}` : `Hỏi nhanh ${AI_NAME}`}
        title={open ? 'Đóng' : `Hỏi nhanh ${AI_NAME}`}
      >
        <i className={`bi bi-${open ? 'x-lg' : 'stars'}`} aria-hidden="true" />
      </button>
    </div>
  );
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/theme.scss';
import './v2.css';

import { ToastProvider } from '../components/Toast/Toast';
import { initTheme } from '../utils/theme';
import App, { legacyTarget } from './App';

// Link cũ kiểu hash (#/cong-thuc/40…) → đường dẫn giống dự án (/recipes/40), trước khi vẽ trang
const legacy = legacyTarget(window.location.hash);
if (legacy) window.location.replace(legacy);

// Sáng / Tối dùng chung cơ chế của bộ kit (lưu localStorage, mặc định theo máy)
initTheme();
document.documentElement.dataset.v2 = '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
);

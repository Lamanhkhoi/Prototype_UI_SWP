import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/theme.scss';
import './v3.css';

import { ToastProvider } from '../components/Toast/Toast';
import { initTheme } from '../utils/theme';
import App from './App';

// Sáng / Tối dùng chung với v1, v2 (cùng khoá localStorage) → chuyển bản vẫn giữ chế độ
initTheme();
document.documentElement.dataset.v3 = '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/theme.scss'; // theme gốc của bộ kit (Bootstrap + biến --ac-*)
import './tokens.css';          // lớp phủ của prototype

import { initTheme } from '../utils/theme';
import { initPalette } from './palette';
import { ToastProvider } from '../components/Toast/Toast';
import ProtoApp from './ProtoApp';

initTheme();
initPalette();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ProtoApp />
    </ToastProvider>
  </StrictMode>,
);

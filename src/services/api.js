// Prototype (27/10/2026): KHÔNG gọi server. Giữ đúng chữ ký của client/src/services/api.js trong dự án,
// nhưng apiFetch lấy dữ liệu từ backend giả (./mockBackend.js) → các service khác copy nguyên từ dự án.
import { handle } from './mockBackend';

export const AUTH_TOKEN_KEY = 'auth_token';

let unauthorizedHandler = null;

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function apiFetch(path, options = {}) {
  try {
    return await handle(path, options);
  } catch (err) {
    if (err?.name === 'AbortError') throw err; // huỷ giữa chừng: để nơi gọi tự bỏ qua như khi dùng fetch
    if (err?.status === 401) unauthorizedHandler?.();
    throw new ApiError(err?.message || `Yêu cầu không thành công (mã ${err?.status}).`, err?.status ?? 0, err);
  }
}

export function apiRequest(path, options = {}) {
  return apiFetch(path.replace(/^\/api(?=\/|$)/, ''), options);
}

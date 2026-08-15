/**
 * Amwal API Client with Automatic Silent Refresh
 *
 * Wrapper di sekitar `fetch()` yang otomatis menangani 401 Unauthorized
 * dengan memanggil `/api/auth/refresh` (HttpOnly cookie), me-rotate token,
 * dan mengulang request asli secara transparan tanpa mengganggu sesi pengguna.
 */

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiClient(
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> {
  const options: RequestInit = {
    ...init,
    credentials: init?.credentials || 'include',
  };

  const urlString =
    typeof input === 'string'
      ? input
      : input instanceof URL
      ? input.toString()
      : input.url;

  // Lakukan request pertama
  const response = await fetch(input, options);

  // Jangan lakukan refresh otomatis jika request ke endpoint auth itu sendiri
  const isAuthEndpoint =
    urlString.includes('/api/auth/login') ||
    urlString.includes('/api/auth/register') ||
    urlString.includes('/api/auth/refresh') ||
    urlString.includes('/api/auth/logout');

  // Jika menerima 401 dan bukan endpoint auth, lakukan silent refresh
  if (response.status === 401 && !isAuthEndpoint) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = doRefresh().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const refreshSuccess = await (refreshPromise ?? Promise.resolve(false));

    if (refreshSuccess) {
      // Retry request asli sekali setelah token baru terpasang di cookie
      return fetch(input, options);
    } else {
      // Refresh gagal (misal: refresh token expired atau di-revoke) -> redirect ke login
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
  }

  return response;
}

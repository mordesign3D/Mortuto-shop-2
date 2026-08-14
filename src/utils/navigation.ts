// Lightweight URL router supporting both HTML5 pathname (/admin) and hash (/#admin)

export type AppRoute = 'store' | 'admin';

export function getAppRoute(): AppRoute {
  if (typeof window === 'undefined') return 'store';
  
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (
    path.startsWith('/admin') ||
    path === '/login' ||
    hash.startsWith('#/admin') ||
    hash === '#admin'
  ) {
    return 'admin';
  }

  return 'store';
}

export function navigateTo(route: AppRoute | string) {
  if (typeof window === 'undefined') return;

  const targetPath = route === 'admin' ? '/admin' : route === 'store' ? '/' : route;
  
  try {
    window.history.pushState({}, '', targetPath);
  } catch {
    // Fallback to hash if pushState is restricted
    window.location.hash = route === 'admin' ? '#/admin' : '#/';
  }

  // Dispatch popstate so components listening can re-render immediately
  window.dispatchEvent(new PopStateEvent('popstate'));
}

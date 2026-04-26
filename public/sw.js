// v7 — 2026-04-26
const CACHE_NAME = 'fabricant-v7';

self.addEventListener('install', e => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Говорим всем открытым вкладкам/PWA перезагрузиться
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = e.request.url;

  // Внешние сервисы — не трогаем
  if (url.includes('functions.poehali.dev')) return;
  if (url.includes('api.telegram.org')) return;
  if (url.includes('mc.yandex.ru')) return;
  if (url.includes('fonts.googleapis.com')) return;
  if (url.includes('fonts.gstatic.com')) return;

  // JS и CSS — у Vite есть хеши в именах, всегда свежие из сети
  if (url.includes('/assets/')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Всё остальное (HTML, иконки) — сеть с фоновым обновлением кеша
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('/')))
  );
});
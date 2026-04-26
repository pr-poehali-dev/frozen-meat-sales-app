// Меняй версию при каждом деплое — браузер увидит изменение и обновится
const CACHE_NAME = 'fabricant-yurko-2026-04-26-v3';

self.addEventListener('install', e => {
  // Сразу активируемся, не ждём закрытия вкладок
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('functions.poehali.dev')) return;
  if (e.request.url.includes('api.telegram.org')) return;
  if (e.request.url.includes('mc.yandex.ru')) return;
  if (e.request.url.includes('fonts.googleapis.com')) return;
  if (e.request.url.includes('fonts.gstatic.com')) return;

  // Всё всегда из сети, кеш только как запасной вариант
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

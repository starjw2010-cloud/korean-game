const CACHE = 'korean-game-v2';
const STATIC_FILES = [
  '/korean-game/',
  '/korean-game/index.html',
  '/korean-game/style.css',
  '/korean-game/utils.js',
  '/korean-game/storage.js',
  '/korean-game/data.js',
  '/korean-game/main.js',
  '/korean-game/games/word-cards.js',
  '/korean-game/games/fill-blank.js',
  '/korean-game/games/pronunciation.js',
  '/korean-game/games/word-rain.js',
  '/korean-game/games/sentence-puzzle.js',
  '/korean-game/games/matching.js',
  '/korean-game/games/ox-quiz.js',
  '/korean-game/games/korean-typing.js',
  '/korean-game/icons/icon-192.png',
  '/korean-game/icons/icon-512.png',
  '/korean-game/manifest.json'
];

// 설치: 모든 정적 파일 캐시
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC_FILES))
  );
  self.skipWaiting();
});

// 활성화: 구버전 캐시 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 요청 처리
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // 외부 API (방문자 카운터 등): 네트워크 우선, 실패 시 무시
  if (!url.pathname.startsWith('/korean-game')) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('', { status: 503 }))
    );
    return;
  }

  // 정적 자원: 캐시 우선 (stale-while-revalidate)
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      const networkFetch = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          cache.put(e.request, res.clone());
        }
        return res;
      }).catch(() => null);

      // 캐시가 있으면 즉시 반환하고 백그라운드에서 업데이트
      return cached || networkFetch;
    })
  );
});

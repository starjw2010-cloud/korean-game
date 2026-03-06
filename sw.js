const CACHE = 'korean-game-v1';
const FILES = [
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
  '/korean-game/games/ox-quiz.js'
];

// 설치: 모든 파일을 캐시에 저장
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

// 활성화: 오래된 캐시 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 요청: 캐시 우선, 없으면 네트워크
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

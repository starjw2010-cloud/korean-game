/* =============================================
   utils.js - 공통 유틸리티 함수들
   모든 게임에서 공통으로 사용
   ============================================= */

// 배열을 무작위 순서로 섞기 (Fisher-Yates)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 4개 보기 만들기 (정답 1개 + 오답 3개)
function makeOptions(correctWord, allWords, field) {
  const correct = correctWord[field];
  const others = allWords
    .filter(w => w[field] !== correct)
    .map(w => w[field]);
  const wrong = shuffle(others).slice(0, 3);
  return shuffle([correct, ...wrong]);
}

// HTML 특수문자 이스케이프 (XSS 방지)
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

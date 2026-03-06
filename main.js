/* =============================================
   main.js - 메인 허브 화면 로직
   난이도 선택, 게임 실행, 점수판 업데이트
   ============================================= */
let currentLevel = 'beginner';
let currentGame  = null;
// 페이지가 로드되면 자동 실행
window.addEventListener('DOMContentLoaded', () => {
  const saved = Storage.load();
  // 저장된 난이도 복원
  currentLevel = saved.selectedLevel || 'beginner';
  setActiveLevel(currentLevel);
  // 총 점수 / 게임 횟수 표시
  updateScoreBoard();
  // 최고 점수 카드에 표시
  updateBestScoreDisplays();
  // 난이도 버튼 이벤트 연결
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLevel = btn.dataset.level;
      setActiveLevel(currentLevel);
      Storage.saveLevel(currentLevel);
    });
  });
});
// 난이도 버튼 활성화 표시
function setActiveLevel(level) {
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === level);
  });
}
// 점수판 숫자 업데이트
function updateScoreBoard() {
  const data = Storage.load();
  document.getElementById('total-score').textContent = data.totalScore.toLocaleString();
  document.getElementById('games-played').textContent = data.gamesPlayed;
}
// 각 게임 카드의 최고 점수 표시
function updateBestScoreDisplays() {
  const data = Storage.load();
  const map = {
    'word-cards':      'best-word-cards',
    'fill-blank':      'best-fill-blank',
    'pronunciation':   'best-pronunciation',
    'word-rain':       'best-word-rain',
    'sentence-puzzle': 'best-sentence-puzzle',
    'matching':        'best-matching',
    'ox-quiz':         'best-ox-quiz',
    'category-sort':   'best-category-sort',
    'speed-quiz':      'best-speed-quiz',
    'korean-typing':   'best-korean-typing'
  };
  for (const [gameId, elemId] of Object.entries(map)) {
    const el = document.getElementById(elemId);
    if (el) {
      const best = data.bestScores[gameId];
      el.textContent = best !== null ? best : '--';
    }
  }
}
// 게임 시작 (각 게임 카드의 PLAY 버튼에서 호출)
function startGame(gameId) {
  currentGame = gameId;
  // 홈 화면 숨기고 게임 화면 보여주기
  document.querySelector('.main-content').style.display = 'none';
  const screen = document.getElementById('game-screen');
  screen.style.display = 'flex';
  screen.style.flexDirection = 'column';
  // 난이도 뱃지 업데이트
  const badge = document.getElementById('current-level-badge');
  const levelNames = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  badge.textContent = levelNames[currentLevel];
  badge.className = 'current-level-badge ' + (currentLevel !== 'beginner' ? currentLevel : '');
  // 게임 컨테이너 비우기
  const container = document.getElementById('game-container');
  container.innerHTML = '';
  // 해당 게임 함수 호출 (각 게임 파일에서 정의됨)
  const gameLoaders = {
    'word-cards':      loadWordCards,
    'fill-blank':      loadFillBlank,
    'pronunciation':   loadPronunciation,
    'word-rain':       loadWordRain,
    'sentence-puzzle': loadSentencePuzzle,
    'matching':        loadMatching,
    'ox-quiz':         loadOxQuiz,
    'category-sort':   loadCategorySort,
    'speed-quiz':      loadSpeedQuiz,
    'korean-typing':   loadKoreanTyping
  };
  if (gameLoaders[gameId]) {
    gameLoaders[gameId](container, currentLevel);
  }
}
// 홈으로 돌아가기
function goHome() {
  // 단어비 게임이라면 타이머 정지
  if (typeof stopWordRain === 'function') stopWordRain();
  if (typeof stopSpeedQuiz === 'function') stopSpeedQuiz();
  document.getElementById('game-screen').style.display = 'none';
  document.querySelector('.main-content').style.display = 'block';
  currentGame = null;
  // 점수판 & 최고 점수 새로 고침
  updateScoreBoard();
  updateBestScoreDisplays();
}
// 게임 종료 후 공통 처리 (점수 저장)
function onGameEnd(gameId, score) {
  Storage.addScore(score);
  const isNewRecord = Storage.updateBestScore(gameId, score);
  return isNewRecord;
}
// 리셋 확인
function confirmReset() {
  if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
    Storage.reset();
    updateScoreBoard();
    updateBestScoreDisplays();
    alert('Progress has been reset!');
  }
}


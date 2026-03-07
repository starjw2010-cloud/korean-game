/* =============================================
   main.js - 메인 허브 화면 로직
   ============================================= */

let currentLevel = 'beginner';
let currentGame  = null;

// 레벨 잠금 기준 점수
const LEVEL_UNLOCK = { beginner: 0, intermediate: 100, advanced: 300 };

// 게임 ID → 짧은 이름 (그래프 레이블용)
const GAME_SHORT = {
  'word-cards': '카드', 'fill-blank': '빈칸', 'pronunciation': '발음',
  'word-rain': '단어비', 'sentence-puzzle': '퍼즐', 'matching': '짝꿍',
  'ox-quiz': 'OX', 'korean-typing': '타이핑'
};

// 그래프 바 색상
const BAR_COLORS = ['#e63946','#457b9d','#52b788','#f4a261','#9b5de5','#00b4d8','#fb8500','#2ec4b6'];

window.addEventListener('DOMContentLoaded', () => {
  const saved = Storage.load();

  currentLevel = saved.selectedLevel || 'beginner';
  setActiveLevel(currentLevel);
  updateScoreBoard();
  updateBestScoreDisplays();
  updateLevelLocks();
  renderDailyChallenge();
  renderStatsPanel();

  // 방문자 카운터
  fetch('https://api.counterapi.dev/v1/koreanlearningarcade/visits/up')
    .then(r => r.json())
    .then(data => {
      const el = document.getElementById('visitor-count');
      if (el) el.textContent = (data.count || data.value || 0).toLocaleString();
    })
    .catch(() => {
      const el = document.getElementById('visitor-count');
      if (el) el.textContent = '--';
    });

  // 난이도 버튼 이벤트
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lvl = btn.dataset.level;
      const data = Storage.load();
      if (isLevelLocked(lvl, data.totalScore)) {
        const needed = LEVEL_UNLOCK[lvl] - data.totalScore;
        alert(`이 난이도는 아직 잠겨 있어요!\n${needed}점 더 모으면 해제됩니다 🔒`);
        return;
      }
      currentLevel = lvl;
      setActiveLevel(currentLevel);
      Storage.saveLevel(currentLevel);
    });
  });
});

function isLevelLocked(level, totalScore) {
  return (totalScore || 0) < LEVEL_UNLOCK[level];
}

function updateLevelLocks() {
  const data = Storage.load();
  document.querySelectorAll('.diff-btn').forEach(btn => {
    const lvl = btn.dataset.level;
    const locked = isLevelLocked(lvl, data.totalScore);
    btn.classList.toggle('locked', locked);
    // 잠금 힌트 표시
    let hint = btn.querySelector('.level-unlock-hint');
    if (locked) {
      if (!hint) {
        hint = document.createElement('span');
        hint.className = 'level-unlock-hint';
        btn.appendChild(hint);
      }
      hint.textContent = `${LEVEL_UNLOCK[lvl]}점 달성 시 해제`;
    } else if (hint) {
      hint.remove();
    }
  });
}

function setActiveLevel(level) {
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === level);
  });
}

function updateScoreBoard() {
  const data = Storage.load();
  document.getElementById('total-score').textContent = data.totalScore.toLocaleString();
  document.getElementById('games-played').textContent = data.gamesPlayed;
  // 스트릭
  const streakEl = document.getElementById('best-streak');
  if (streakEl && data.streak) {
    streakEl.textContent = data.streak.best || 0;
  }
}

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
    'korean-typing':   'best-korean-typing'
  };
  for (const [gameId, elemId] of Object.entries(map)) {
    const el = document.getElementById(elemId);
    if (el) {
      const best = data.bestScores[gameId];
      el.textContent = best !== null && best !== undefined ? best : '--';
    }
  }
}

// ===== 일일 도전 과제 렌더링 =====
function renderDailyChallenge() {
  const dc = Storage.getDailyChallenge();
  const container = document.getElementById('daily-challenges');
  if (!container) return;

  container.innerHTML = dc.challenges.map(c => {
    const pct = Math.min(100, Math.round((c.current / c.goal) * 100));
    return `
      <div class="challenge-card ${c.completed ? 'done' : ''}">
        <div class="challenge-header">
          <span class="challenge-icon">${c.icon}</span>
          <span class="challenge-label">${c.label}</span>
          <span class="challenge-check">${c.completed ? '✅' : ''}</span>
        </div>
        <div class="challenge-progress-bar">
          <div class="challenge-progress-fill ${c.completed ? 'done' : ''}"
               style="width:${pct}%"></div>
        </div>
        <div class="challenge-count">${c.current} / ${c.goal}</div>
      </div>
    `;
  }).join('');
}

// ===== 진행 그래프 + 오답 노트 렌더링 =====
function renderStatsPanel() {
  renderProgressGraph();
  renderWrongAnswers();
}

function renderProgressGraph() {
  const container = document.getElementById('score-graph');
  if (!container) return;
  const data = Storage.load();
  const history = (data.scoreHistory || []).slice(0, 10).reverse(); // 오래된 것 → 최근 순

  if (history.length === 0) {
    container.innerHTML = '<div class="graph-empty">아직 플레이 기록이 없어요<br>게임을 시작해 보세요!</div>';
    return;
  }

  const maxScore = Math.max(...history.map(h => h.score), 1);
  container.innerHTML = `
    <div class="score-graph">
      ${history.map((h, i) => {
        const heightPx = Math.max(4, Math.round((h.score / maxScore) * 80));
        const color = BAR_COLORS[i % BAR_COLORS.length];
        const label = GAME_SHORT[h.gameId] || h.gameId;
        return `
          <div class="score-bar-wrap">
            <div class="score-bar" style="height:${heightPx}px;background:${color};"
                 data-label="${label}: ${h.score}pt"></div>
            <div class="score-bar-label">${label}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderWrongAnswers() {
  const container = document.getElementById('wrong-answers-list');
  if (!container) return;
  const data = Storage.load();
  const wrongs = (data.wrongAnswers || []).slice(0, 10);

  if (wrongs.length === 0) {
    container.innerHTML = '<div class="wrong-empty">오답이 없어요! 훌륭해요 🎉</div>';
    return;
  }

  const gameLabel = { 'word-cards':'카드', 'fill-blank':'빈칸', 'pronunciation':'발음',
                      'word-rain':'단어비', 'sentence-puzzle':'퍼즐', 'matching':'짝꿍',
                      'ox-quiz':'OX', 'korean-typing':'타이핑' };

  container.innerHTML = `
    <div class="wrong-list">
      ${wrongs.map(w => `
        <div class="wrong-item">
          <div>
            <div class="wrong-item-primary">${escHtml(w.primary)}</div>
            <div class="wrong-item-secondary">${escHtml(w.secondary)}</div>
          </div>
          <div class="wrong-item-badge">${gameLabel[w.gameId] || w.gameId}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== 게임 시작 =====
function startGame(gameId) {
  currentGame = gameId;

  document.querySelector('.main-content').style.display = 'none';
  const screen = document.getElementById('game-screen');
  screen.style.display = 'flex';
  screen.style.flexDirection = 'column';

  const badge = document.getElementById('current-level-badge');
  const levelNames = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  badge.textContent = levelNames[currentLevel];
  badge.className = 'current-level-badge ' + (currentLevel !== 'beginner' ? currentLevel : '');

  const container = document.getElementById('game-container');
  container.innerHTML = '';

  // 일일 도전: 게임 플레이 기록
  Storage.updateDailyChallenge('game', 1, gameId);

  const gameLoaders = {
    'word-cards':      loadWordCards,
    'fill-blank':      loadFillBlank,
    'pronunciation':   loadPronunciation,
    'word-rain':       loadWordRain,
    'sentence-puzzle': loadSentencePuzzle,
    'matching':        loadMatching,
    'ox-quiz':         loadOxQuiz,
    'korean-typing':   loadKoreanTyping
  };

  if (gameLoaders[gameId]) {
    gameLoaders[gameId](container, currentLevel);
  }
}

// ===== 홈으로 돌아가기 =====
function goHome() {
  if (typeof stopWordRain === 'function') stopWordRain();

  document.getElementById('game-screen').style.display = 'none';
  document.querySelector('.main-content').style.display = 'block';
  currentGame = null;

  updateScoreBoard();
  updateBestScoreDisplays();
  updateLevelLocks();
  renderDailyChallenge();
  renderStatsPanel();
}

// ===== 게임 종료 공통 처리 =====
function onGameEnd(gameId, score) {
  Storage.addScore(score);
  Storage.addScoreHistory(gameId, score);
  const isNewRecord = Storage.updateBestScore(gameId, score);
  return isNewRecord;
}

// ===== 리셋 =====
function confirmReset() {
  if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
    Storage.reset();
    updateScoreBoard();
    updateBestScoreDisplays();
    updateLevelLocks();
    renderDailyChallenge();
    renderStatsPanel();
    alert('Progress has been reset!');
  }
}

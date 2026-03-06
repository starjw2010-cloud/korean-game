/* =============================================
   게임 4: 단어 비 내리기 (Word Rain - 타자 게임)
   ============================================= */

let wordRainInterval = null;
let wordRainAnimFrame = null;

function stopWordRain() {
  if (wordRainInterval) { clearInterval(wordRainInterval); wordRainInterval = null; }
  if (wordRainAnimFrame) { cancelAnimationFrame(wordRainAnimFrame); wordRainAnimFrame = null; }
}

function loadWordRain(container, level) {
  stopWordRain();
  const wordPool = shuffle([...GameData.words[level]]);
  let score = 0;
  let lives = 3;
  let speed = 0.4;          // 초당 px 이동 (점점 빨라짐)
  let spawnInterval = 2800; // ms마다 새 단어 생성
  let activeWords = [];
  let poolIndex = 0;
  let gameOver = false;

  container.innerHTML = `
    <h2 class="game-title">🌧️ Word Rain</h2>
    <div class="game-score-bar">
      <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="wr-score">0</span></div>
      <div class="stat"><span class="stat-label">Lives</span><span class="stat-value" id="wr-lives">❤️❤️❤️</span></div>
      <div class="stat"><span class="stat-label">Speed</span><span class="stat-value" id="wr-speed">1</span></div>
    </div>
    <div id="wr-arena" style="position:relative;width:100%;height:320px;background:linear-gradient(180deg,#1d3557,#457b9d);border-radius:16px;overflow:hidden;margin-bottom:16px;">
      <div id="wr-instruction" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:rgba(255,255,255,0.5);font-size:0.9rem;text-align:center;pointer-events:none;">
        Type the <b>English meaning</b> of the falling Korean word!
      </div>
    </div>
    <div style="display:flex;gap:10px;">
      <input id="wr-input" type="text" placeholder="Type the English meaning here..." autocomplete="off"
        style="flex:1;padding:14px 18px;font-size:1.1rem;border:2px solid #dee2e6;border-radius:10px;outline:none;" />
      <button onclick="wrSubmit()" style="padding:14px 22px;background:#e63946;color:white;border:none;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;">Enter</button>
    </div>
    <p style="font-size:0.8rem;color:#888;margin-top:8px;text-align:center;">Press Enter or click the button to submit your answer</p>
  `;

  const arena = document.getElementById('wr-arena');
  const input = document.getElementById('wr-input');
  input.focus();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') wrSubmit(); });

  function spawnWord() {
    if (gameOver) return;
    if (poolIndex >= wordPool.length) poolIndex = 0;
    const word = wordPool[poolIndex++];
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      top:-40px;
      left:${Math.random() * 75}%;
      background:rgba(255,255,255,0.15);
      backdrop-filter:blur(4px);
      border:1px solid rgba(255,255,255,0.3);
      border-radius:10px;
      padding:8px 14px;
      color:white;
      font-size:1.1rem;
      font-weight:700;
      white-space:nowrap;
      cursor:default;
      user-select:none;
    `;
    el.textContent = word.kr;
    el.dataset.en = word.en.toLowerCase();
    arena.appendChild(el);
    activeWords.push({ el, y: -40, answer: word.en.toLowerCase() });
  }

  function gameLoop() {
    if (gameOver) return;
    activeWords = activeWords.filter(w => w.el.parentNode);
    for (const w of activeWords) {
      w.y += speed;
      w.el.style.top = w.y + 'px';
      if (w.y > 310) {
        w.el.remove();
        activeWords = activeWords.filter(x => x !== w);
        lives--;
        updateLives();
        if (lives <= 0) return endGame();
      }
    }
    wordRainAnimFrame = requestAnimationFrame(gameLoop);
  }

  function updateLives() {
    document.getElementById('wr-lives').textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
  }

  window.wrSubmit = function() {
    if (gameOver) return;
    const typed = input.value.trim().toLowerCase();
    if (!typed) return;
    let hit = false;
    for (const w of [...activeWords]) {
      if (typed === w.answer || w.answer.includes(typed) && typed.length >= 3) {
        w.el.style.background = 'rgba(82,183,136,0.8)';
        setTimeout(() => w.el.remove(), 300);
        activeWords = activeWords.filter(x => x !== w);
        score += 15;
        document.getElementById('wr-score').textContent = score;
        hit = true;
        speed = Math.min(speed + 0.05, 2.5);
        document.getElementById('wr-speed').textContent = Math.floor(speed / 0.4);
        break;
      }
    }
    if (!hit) {
      input.style.borderColor = '#e63946';
      setTimeout(() => { input.style.borderColor = '#dee2e6'; }, 500);
    }
    input.value = '';
    input.focus();
  };

  function endGame() {
    gameOver = true;
    stopWordRain();
    activeWords.forEach(w => w.el.remove());
    const isNew = onGameEnd('word-rain', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${score >= 100 ? '🌟' : score >= 50 ? '👍' : '🌧️'}</div>
        <h2 class="result-title">${score >= 100 ? 'Word Rain Master!' : score >= 50 ? 'Nice reflexes!' : 'Game Over!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadWordRain(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  // 게임 시작
  wordRainInterval = setInterval(spawnWord, spawnInterval);
  setTimeout(() => { wordRainAnimFrame = requestAnimationFrame(gameLoop); }, 100);
}

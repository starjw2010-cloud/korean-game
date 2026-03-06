/* =============================================
   게임 9: 스피드 퀴즈 (Speed Quiz - 60초)
   ============================================= */

let speedQuizTimer = null;

function stopSpeedQuiz() {
  if (speedQuizTimer) { clearInterval(speedQuizTimer); speedQuizTimer = null; }
}

function loadSpeedQuiz(container, level) {
  stopSpeedQuiz();
  const allWords = GameData.words[level];
  let wordPool = shuffle([...allWords]);
  let poolIndex = 0;
  let score = 0, totalCorrect = 0, timeLeft = 60, answered = false, gameActive = true;

  function nextWord() {
    if (poolIndex >= wordPool.length) { wordPool = shuffle([...allWords]); poolIndex = 0; }
    return wordPool[poolIndex++];
  }

  container.innerHTML = `
    <h2 class="game-title">⚡ Speed Quiz</h2>
    <div class="game-score-bar">
      <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="sq-score">0</span></div>
      <div class="stat"><span class="stat-label">Correct</span><span class="stat-value" id="sq-correct">0</span></div>
      <div class="stat"><span class="stat-label">Time</span><span class="stat-value"><span id="sq-time">60</span>s</span></div>
    </div>
    <div style="background:#dee2e6;border-radius:4px;height:8px;margin-bottom:20px;overflow:hidden;">
      <div id="sq-bar" style="background:#e63946;height:100%;width:100%;transition:width 1s linear;border-radius:4px;"></div>
    </div>
    <div id="sq-question" style="background:white;border-radius:20px;padding:36px 24px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.12);margin-bottom:20px;"></div>
    <div id="sq-choices" class="choices-grid"></div>
    <div id="sq-feedback" style="text-align:center;font-size:1rem;font-weight:700;min-height:24px;margin-top:10px;"></div>
  `;

  function renderQuestion() {
    if (!gameActive || !document.getElementById('sq-question')) return;
    const word = nextWord();
    const options = makeOptions(word, allWords, 'en');
    answered = false;

    document.getElementById('sq-question').innerHTML = `
      <p style="font-size:0.8rem;color:#888;margin-bottom:6px;">What does this mean?</p>
      <div style="font-size:3rem;font-weight:900;color:#1d3557;">${word.kr}</div>
      <div style="font-size:0.95rem;color:#aaa;margin-top:6px;">${word.romanization}</div>
    `;
    document.getElementById('sq-choices').innerHTML = options.map(opt =>
      `<button class="choice-btn sq-btn" data-chosen="${escHtml(opt)}" data-correct="${escHtml(word.en)}">${escHtml(opt)}</button>`
    ).join('');
    document.getElementById('sq-feedback').textContent = '';

    container.querySelectorAll('.sq-btn').forEach(b => {
      b.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        container.querySelectorAll('.sq-btn').forEach(x => x.disabled = true);
        const isCorrect = b.dataset.chosen === b.dataset.correct;
        const fb = document.getElementById('sq-feedback');
        if (isCorrect) {
          b.classList.add('correct', 'pop');
          score += 10; totalCorrect++;
          document.getElementById('sq-score').textContent = score;
          document.getElementById('sq-correct').textContent = totalCorrect;
          fb.textContent = '✅ +10'; fb.style.color = '#52b788';
        } else {
          b.classList.add('wrong', 'shake');
          container.querySelectorAll('.sq-btn').forEach(x => { if (x.dataset.chosen === x.dataset.correct) x.classList.add('correct'); });
          fb.textContent = '❌ Wrong!'; fb.style.color = '#e63946';
        }
        setTimeout(() => { if (gameActive) renderQuestion(); }, 700);
      });
    });
  }

  speedQuizTimer = setInterval(() => {
    timeLeft--;
    const timeEl = document.getElementById('sq-time');
    const bar = document.getElementById('sq-bar');
    if (timeEl) timeEl.textContent = timeLeft;
    if (bar) {
      bar.style.width = `${(timeLeft / 60) * 100}%`;
      if (timeLeft <= 10) bar.style.background = '#f4a261';
    }
    if (timeLeft <= 0) { stopSpeedQuiz(); gameActive = false; showResult(); }
  }, 1000);

  function showResult() {
    stopSpeedQuiz();
    gameActive = false;
    const isNew = onGameEnd('speed-quiz', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${totalCorrect >= 15 ? '⚡' : totalCorrect >= 8 ? '👍' : '📚'}</div>
        <h2 class="result-title">${totalCorrect >= 15 ? 'Lightning Fast!' : totalCorrect >= 8 ? 'Good speed!' : 'Keep practicing!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <p style="color:#888;">${totalCorrect} correct in 60 seconds!</p>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadSpeedQuiz(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  renderQuestion();
}

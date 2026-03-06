/* =============================================
   게임 10: 한글 타이핑 (Korean Typing)
   ============================================= */

function loadKoreanTyping(container, level) {
  const words = shuffle([...GameData.words[level]]).slice(0, 10);
  let score = 0, current = 0, correct = 0;

  function render() {
    if (current >= words.length) return showResult();
    const word = words[current];

    container.innerHTML = `
      <h2 class="game-title">⌨️ Korean Typing</h2>
      <div class="game-score-bar">
        <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="kt-score">${score}</span></div>
        <div class="stat"><span class="stat-label">Word</span><span class="stat-value">${current + 1} / ${words.length}</span></div>
        <div class="stat"><span class="stat-label">Correct</span><span class="stat-value" id="kt-correct">${correct}</span></div>
      </div>
      <div class="fade-in" style="background:white;border-radius:20px;padding:36px 24px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.12);margin-bottom:20px;">
        <p style="font-size:0.85rem;color:#888;margin-bottom:10px;">Type the Korean word for:</p>
        <div style="font-size:2rem;font-weight:800;color:#1d3557;margin-bottom:10px;">${escHtml(word.en)}</div>
        <div style="background:#f0f4f8;border-radius:8px;padding:8px 16px;display:inline-block;">
          <span style="font-size:0.85rem;color:#457b9d;">💡 Hint: starts with <b>${word.kr[0]}</b> · romanization: <b>${word.romanization}</b></span>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-bottom:10px;">
        <input id="kt-input" type="text" placeholder="한글 또는 romanization 입력..." autocomplete="off" autocorrect="off"
          style="flex:1;padding:14px 18px;font-size:1.1rem;border:2px solid #dee2e6;border-radius:10px;outline:none;font-family:inherit;" />
        <button id="kt-check-btn" style="padding:14px 22px;background:#1d3557;color:white;border:none;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;">Check</button>
      </div>
      <button id="kt-skip-btn" style="display:block;margin:0 auto;background:transparent;border:none;color:#aaa;font-size:0.85rem;cursor:pointer;text-decoration:underline;">Skip</button>
      <div id="kt-feedback" style="text-align:center;font-size:1rem;font-weight:700;min-height:28px;margin-top:14px;"></div>
    `;

    const input = document.getElementById('kt-input');
    input.focus();

    function submit() {
      const val = input.value.trim();
      if (!val) return;
      input.disabled = true;
      document.getElementById('kt-check-btn').disabled = true;
      document.getElementById('kt-skip-btn').disabled = true;
      const isCorrect = val === word.kr || val.toLowerCase() === word.romanization.toLowerCase();
      const fb = document.getElementById('kt-feedback');
      if (isCorrect) {
        input.style.borderColor = '#52b788';
        score += 15; correct++;
        document.getElementById('kt-score').textContent = score;
        document.getElementById('kt-correct').textContent = correct;
        fb.textContent = '✅ Correct! +15'; fb.style.color = '#52b788';
      } else {
        input.style.borderColor = '#e63946';
        fb.innerHTML = `❌ Answer: <b>${word.kr}</b> (${word.romanization})`; fb.style.color = '#e63946';
      }
      setTimeout(() => { current++; render(); }, 1800);
    }

    function skip() {
      input.disabled = true;
      document.getElementById('kt-check-btn').disabled = true;
      document.getElementById('kt-skip-btn').disabled = true;
      const fb = document.getElementById('kt-feedback');
      fb.innerHTML = `⏭️ Answer: <b>${word.kr}</b> (${word.romanization})`; fb.style.color = '#888';
      setTimeout(() => { current++; render(); }, 1800);
    }

    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    document.getElementById('kt-check-btn').addEventListener('click', submit);
    document.getElementById('kt-skip-btn').addEventListener('click', skip);
  }

  function showResult() {
    const isNew = onGameEnd('korean-typing', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${correct >= 8 ? '⌨️' : correct >= 5 ? '👍' : '📚'}</div>
        <h2 class="result-title">${correct >= 8 ? 'Typing Master!' : correct >= 5 ? 'Good job!' : 'Keep practicing!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <p style="color:#888;">${correct} out of ${words.length} correct!</p>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadKoreanTyping(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  render();
}

/* =============================================
   게임 3: 발음 퀴즈 (Pronunciation / Romanization)
   ============================================= */

function loadPronunciation(container, level) {
  const words = shuffle([...GameData.words[level]]).slice(0, 10);
  let score = 0;
  let current = 0;
  let answered = false;

  function render() {
    if (current >= words.length) return showResult();
    const word = words[current];
    const options = makeOptions(word, GameData.words[level], 'romanization');
    answered = false;

    container.innerHTML = `
      <h2 class="game-title">🔤 Pronunciation Quiz</h2>
      <div class="game-score-bar">
        <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="pr-score">${score}</span></div>
        <div class="stat"><span class="stat-label">Question</span><span class="stat-value">${current + 1} / ${words.length}</span></div>
      </div>
      <div class="fade-in" style="background:white;border-radius:20px;padding:48px 24px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.12);margin-bottom:24px;">
        <p style="font-size:0.85rem;color:#888;margin-bottom:8px;">How do you pronounce this?</p>
        <div style="font-size:3.8rem;font-weight:900;color:#1d3557;">${word.kr}</div>
        <div style="font-size:0.9rem;color:#aaa;margin-top:8px;">Meaning: ${word.en}</div>
      </div>
      <div class="choices-grid">
        ${options.map(opt => `<button class="choice-btn" style="font-family:monospace;font-size:0.95rem;" onclick="prAnswer(this, '${escHtml(opt)}', '${escHtml(word.romanization)}')">${escHtml(opt)}</button>`).join('')}
      </div>
    `;
  }

  window.prAnswer = function(btn, chosen, correct) {
    if (answered) return;
    answered = true;
    const allBtns = container.querySelectorAll('.choice-btn');
    allBtns.forEach(b => b.disabled = true);
    if (chosen === correct) {
      btn.classList.add('correct', 'pop');
      score += 10;
      document.getElementById('pr-score').textContent = score;
    } else {
      btn.classList.add('wrong', 'shake');
      allBtns.forEach(b => { if (b.textContent.trim() === correct) b.classList.add('correct'); });
    }
    setTimeout(() => { current++; render(); }, 1200);
  };

  function showResult() {
    const isNew = onGameEnd('pronunciation', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${score >= 80 ? '🎉' : score >= 50 ? '👍' : '📖'}</div>
        <h2 class="result-title">${score >= 80 ? 'Perfect pronunciation!' : score >= 50 ? 'Good job!' : 'Keep practicing!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <p style="color:#888;">${score / 10} out of ${words.length} correct!</p>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadPronunciation(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  render();
}

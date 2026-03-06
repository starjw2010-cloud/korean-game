/* =============================================
   게임 1: 단어 카드 뒤집기 (Word Flip Cards)
   ============================================= */

function loadWordCards(container, level) {
  const words = shuffle([...GameData.words[level]]).slice(0, 10);
  let score = 0;
  let current = 0;
  let answered = false;

  function render() {
    if (current >= words.length) return showResult();
    const word = words[current];
    const options = makeOptions(word, GameData.words[level], 'en');
    answered = false;

    container.innerHTML = `
      <h2 class="game-title">🃏 Word Flip Cards</h2>
      <div class="game-score-bar">
        <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="wc-score">${score}</span></div>
        <div class="stat"><span class="stat-label">Question</span><span class="stat-value">${current + 1} / ${words.length}</span></div>
      </div>
      <div class="card-display fade-in" style="background:white;border-radius:20px;padding:48px 24px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.12);margin-bottom:24px;">
        <p style="font-size:0.85rem;color:#888;margin-bottom:8px;">What does this mean?</p>
        <div style="font-size:3.5rem;font-weight:900;color:#1d3557;letter-spacing:0.05em;">${word.kr}</div>
        <div style="font-size:1rem;color:#aaa;margin-top:8px;">${word.romanization}</div>
      </div>
      <div class="choices-grid">
        ${options.map(opt => `<button class="choice-btn" data-chosen="${escHtml(opt)}" data-correct="${escHtml(word.en)}">${escHtml(opt)}</button>`).join('')}
      </div>
    `;
    container.querySelectorAll('.choice-btn').forEach(b =>
      b.addEventListener('click', () => window.wcAnswer(b, b.dataset.chosen, b.dataset.correct))
    );
  }

  window.wcAnswer = function(btn, chosen, correct) {
    if (answered) return;
    answered = true;
    const allBtns = container.querySelectorAll('.choice-btn');
    allBtns.forEach(b => b.disabled = true);
    if (chosen === correct) {
      btn.classList.add('correct');
      score += 10;
      document.getElementById('wc-score').textContent = score;
      btn.classList.add('pop');
    } else {
      btn.classList.add('wrong');
      btn.classList.add('shake');
      allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    }
    setTimeout(() => { current++; render(); }, 1200);
  };

  function showResult() {
    const isNew = onGameEnd('word-cards', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${score >= 80 ? '🎉' : score >= 50 ? '👍' : '📖'}</div>
        <h2 class="result-title">${score >= 80 ? 'Excellent!' : score >= 50 ? 'Good job!' : 'Keep studying!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <p style="color:#888;">You got ${score / 10} out of ${words.length} correct!</p>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadWordCards(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  render();
}

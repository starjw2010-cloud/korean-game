/* =============================================
   게임 8: 카테고리 분류 (Category Sort)
   ============================================= */

function loadCategorySort(container, level) {
  const allWords = GameData.words[level];
  const catKeys = [...new Set(allWords.map(w => w.category))].slice(0, 4);
  const catLabels = {
    greetings: '인사', food: '음식', numbers: '숫자',
    daily: '일상', travel: '여행', kpop: 'K-pop',
    slang: '슬랭', grammar: '문법'
  };
  const words = shuffle(allWords.filter(w => catKeys.includes(w.category))).slice(0, 12);
  let score = 0, current = 0, correct = 0, answered = false;

  function render() {
    if (current >= words.length) return showResult();
    const word = words[current];
    answered = false;

    container.innerHTML = `
      <h2 class="game-title">🗂️ Category Sort</h2>
      <div class="game-score-bar">
        <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="cs-score">${score}</span></div>
        <div class="stat"><span class="stat-label">Word</span><span class="stat-value">${current + 1} / ${words.length}</span></div>
        <div class="stat"><span class="stat-label">Correct</span><span class="stat-value" id="cs-correct">${correct}</span></div>
      </div>
      <div class="fade-in" style="background:white;border-radius:20px;padding:48px 24px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.12);margin-bottom:24px;">
        <p style="font-size:0.85rem;color:#888;margin-bottom:8px;">Which category does this belong to?</p>
        <div style="font-size:3rem;font-weight:900;color:#1d3557;">${word.kr}</div>
        <div style="font-size:1rem;color:#888;margin-top:6px;">${word.en}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        ${catKeys.map(cat => `
          <button class="cs-btn" data-cat="${cat}"
            style="padding:20px 12px;background:white;border:2px solid #457b9d;border-radius:14px;font-size:1rem;font-weight:700;color:#1d3557;cursor:pointer;transition:all 0.15s;">
            ${catLabels[cat] || cat}
          </button>
        `).join('')}
      </div>
      <div id="cs-feedback" style="text-align:center;font-size:1rem;font-weight:700;min-height:28px;"></div>
    `;

    container.querySelectorAll('.cs-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const isCorrect = btn.dataset.cat === word.category;
        container.querySelectorAll('.cs-btn').forEach(b => {
          b.disabled = true;
          if (b.dataset.cat === word.category) {
            b.style.background = '#d8f3dc';
            b.style.borderColor = '#52b788';
            b.style.color = '#1b4332';
          }
        });
        if (!isCorrect) {
          btn.style.background = '#ffd6d9';
          btn.style.borderColor = '#e63946';
          btn.style.color = '#6b0011';
        }
        const fb = document.getElementById('cs-feedback');
        if (isCorrect) {
          score += 10; correct++;
          document.getElementById('cs-score').textContent = score;
          document.getElementById('cs-correct').textContent = correct;
          fb.innerHTML = '✅ Correct!';
          fb.style.color = '#52b788';
        } else {
          fb.innerHTML = `❌ It's <b>${catLabels[word.category]}</b>!`;
          fb.style.color = '#e63946';
        }
        setTimeout(() => { current++; render(); }, 1300);
      });
    });
  }

  function showResult() {
    const isNew = onGameEnd('category-sort', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${correct >= 10 ? '🗂️' : correct >= 7 ? '👍' : '📚'}</div>
        <h2 class="result-title">${correct >= 10 ? 'Category Master!' : correct >= 7 ? 'Good sorting!' : 'Keep practicing!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <p style="color:#888;">${correct} out of ${words.length} correct!</p>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadCategorySort(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  render();
}

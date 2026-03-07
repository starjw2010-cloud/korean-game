/* =============================================
   게임 2: 빈칸 채우기 (Fill in the Blank)
   ============================================= */

function loadFillBlank(container, level) {
  const questions = shuffle([...GameData.fillBlank[level]]).slice(0, 8);
  let score = 0;
  let current = 0;
  let answered = false;
  let streak = 0;
  let hintsLeft = 3;
  let hintUsed = false;
  let correctCount = 0;

  function render() {
    if (current >= questions.length) return showResult();
    const q = questions[current];
    const shuffledOpts = shuffle([...q.options]);
    answered = false;
    hintUsed = false;

    container.innerHTML = `
      <h2 class="game-title">✏️ Fill in the Blank</h2>
      <div class="game-score-bar">
        <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="fb-score">${score}</span></div>
        <div class="stat"><span class="stat-label">Question</span><span class="stat-value">${current + 1} / ${questions.length}</span></div>
        <div class="stat streak-stat"><span class="stat-label">Streak</span><span class="stat-value" id="fb-streak">${streak > 0 ? '🔥' + streak : '-'}</span></div>
        <button class="hint-btn" id="fb-hint" ${hintsLeft <= 0 ? 'disabled' : ''} onclick="fbUseHint()">💡 힌트 (${hintsLeft})</button>
      </div>
      <div id="fb-hint-box"></div>
      <div class="fade-in" style="background:white;border-radius:16px;padding:32px 24px;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
        <p style="font-size:0.85rem;color:#888;margin-bottom:10px;">Translation: ${q.sentence_en}</p>
        <div style="font-size:1.5rem;font-weight:700;color:#1d3557;line-height:1.8;text-align:center;">
          ${q.sentence_kr.replace('___', '<span style="background:#ffd6d9;border-radius:6px;padding:2px 12px;color:#e63946;">___</span>')}
        </div>
      </div>
      <div class="choices-grid">
        ${shuffledOpts.map(opt => `<button class="choice-btn" data-chosen="${escHtml(opt)}" data-correct="${escHtml(q.answer)}">${escHtml(opt)}</button>`).join('')}
      </div>
    `;
    container.querySelectorAll('.choice-btn').forEach(b =>
      b.addEventListener('click', () => window.fbAnswer(b, b.dataset.chosen, b.dataset.correct, q))
    );
  }

  window.fbUseHint = function() {
    if (hintsLeft <= 0 || hintUsed) return;
    hintUsed = true;
    hintsLeft--;
    score = Math.max(0, score - 5);
    document.getElementById('fb-score').textContent = score;
    document.getElementById('fb-hint').textContent = `💡 힌트 (${hintsLeft})`;
    document.getElementById('fb-hint').disabled = hintsLeft <= 0;
    const q = questions[current];
    document.getElementById('fb-hint-box').innerHTML =
      `<div class="hint-box">정답의 첫 글자: <b>${q.answer[0].toUpperCase()}</b></div>`;
  };

  window.fbAnswer = function(btn, chosen, correct, q) {
    if (answered) return;
    answered = true;
    const allBtns = container.querySelectorAll('.choice-btn');
    allBtns.forEach(b => b.disabled = true);
    if (chosen === correct) {
      btn.classList.add('correct', 'pop');
      const bonus = hintUsed ? 5 : 10;
      score += bonus;
      streak++;
      correctCount++;
      document.getElementById('fb-score').textContent = score;
      document.getElementById('fb-streak').textContent = '🔥' + streak;
      Storage.updateStreak(true);
      Storage.updateDailyChallenge('correct', 1);
      Storage.updateDailyChallenge('streak', streak);
    } else {
      btn.classList.add('wrong', 'shake');
      allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
      streak = 0;
      document.getElementById('fb-streak').textContent = '-';
      Storage.updateStreak(false);
      Storage.saveWrongAnswer({
        primary: q.sentence_kr,
        secondary: '정답: ' + q.answer,
        gameId: 'fill-blank'
      });
    }
    setTimeout(() => { current++; render(); }, 1300);
  };

  function showResult() {
    const isNew = onGameEnd('fill-blank', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${score >= 70 ? '🎉' : score >= 40 ? '👍' : '📖'}</div>
        <h2 class="result-title">${score >= 70 ? 'Excellent!' : score >= 40 ? 'Good job!' : 'Keep studying!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <p style="color:#888;">${correctCount} out of ${questions.length} correct!</p>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadFillBlank(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  render();
}

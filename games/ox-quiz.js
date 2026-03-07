/* =============================================
   게임 7: OX 퀴즈 (True / False Quiz)
   ============================================= */

function loadOxQuiz(container, level) {
  const questions = shuffle([...GameData.oxQuiz[level]]).slice(0, 8);
  let score = 0;
  let current = 0;
  let answered = false;
  let streak = 0;
  let hintsLeft = 3;
  let hintUsed = false;

  function render() {
    if (current >= questions.length) return showResult();
    const q = questions[current];
    answered = false;
    hintUsed = false;

    container.innerHTML = `
      <h2 class="game-title">❓ OX Quiz</h2>
      <div class="game-score-bar">
        <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="ox-score">${score}</span></div>
        <div class="stat"><span class="stat-label">Question</span><span class="stat-value">${current + 1} / ${questions.length}</span></div>
        <div class="stat streak-stat"><span class="stat-label">Streak</span><span class="stat-value" id="ox-streak">${streak > 0 ? '🔥'.repeat(Math.min(streak,3)) : '-'}</span></div>
      </div>
      <div class="hint-area">
        <button class="hint-btn" id="ox-hint" ${hintsLeft <= 0 ? 'disabled' : ''} onclick="oxUseHint()">💡 힌트 (${hintsLeft})</button>
        <div id="ox-hint-box"></div>
      </div>

      <div class="fade-in" style="background:white;border-radius:20px;padding:40px 28px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.10);margin-bottom:28px;min-height:160px;display:flex;align-items:center;justify-content:center;">
        <p style="font-size:clamp(1rem,3vw,1.3rem);font-weight:600;color:#1d3557;line-height:1.6;">${q.question}</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
        <button onclick="oxAnswer(this, true, ${q.answer})"
          style="padding:32px 16px;font-size:3rem;background:linear-gradient(135deg,#d8f3dc,#b7e4c7);border:3px solid #52b788;border-radius:20px;cursor:pointer;transition:all 0.2s;font-weight:900;color:#1b4332;">
          ⭕
          <div style="font-size:1rem;font-weight:700;margin-top:8px;">TRUE</div>
        </button>
        <button onclick="oxAnswer(this, false, ${q.answer})"
          style="padding:32px 16px;font-size:3rem;background:linear-gradient(135deg,#ffd6d9,#ffb3ba);border:3px solid #e63946;border-radius:20px;cursor:pointer;transition:all 0.2s;font-weight:900;color:#6b0011;">
          ❌
          <div style="font-size:1rem;font-weight:700;margin-top:8px;">FALSE</div>
        </button>
      </div>
      <div id="ox-feedback" style="display:none;background:white;border-radius:14px;padding:16px 20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);text-align:center;">
        <p id="ox-explanation" style="font-size:0.95rem;color:#1d3557;line-height:1.6;"></p>
      </div>
    `;
  }

  window.oxUseHint = function() {
    if (hintsLeft <= 0 || hintUsed) return;
    hintUsed = true;
    hintsLeft--;
    score = Math.max(0, score - 5);
    document.getElementById('ox-score').textContent = score;
    document.getElementById('ox-hint').textContent = `💡 힌트 (${hintsLeft})`;
    document.getElementById('ox-hint').disabled = hintsLeft <= 0;
    const q = questions[current];
    // 설명의 첫 5단어를 힌트로 보여줌
    const clue = q.explanation.split(' ').slice(0, 5).join(' ') + '...';
    document.getElementById('ox-hint-box').innerHTML =
      `<div class="hint-box">힌트: ${clue}</div>`;
  };

  window.oxAnswer = function(btn, chosen, correct) {
    if (answered) return;
    answered = true;
    const isCorrect = chosen === correct;

    btn.parentElement.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');

    if (isCorrect) {
      btn.style.transform = 'scale(1.05)';
      btn.style.boxShadow = '0 0 0 4px #52b788';
      streak++;
      const bonus = hintUsed ? (streak >= 3 ? 10 : 5) : (streak >= 3 ? 20 : 10);
      score += bonus;
      document.getElementById('ox-score').textContent = score;
      document.getElementById('ox-streak').textContent = '🔥'.repeat(Math.min(streak, 3));
      Storage.updateStreak(true);
      Storage.updateDailyChallenge('correct', 1);
      Storage.updateDailyChallenge('streak', streak);
    } else {
      btn.style.opacity = '0.4';
      streak = 0;
      document.getElementById('ox-streak').textContent = '-';
      Storage.updateStreak(false);
      Storage.saveWrongAnswer({
        primary: questions[current].question.slice(0, 60) + (questions[current].question.length > 60 ? '...' : ''),
        secondary: (correct ? '정답: ⭕ TRUE' : '정답: ❌ FALSE'),
        gameId: 'ox-quiz'
      });
    }

    const fb = document.getElementById('ox-feedback');
    const ex = document.getElementById('ox-explanation');
    fb.style.display = 'block';
    fb.style.borderLeft = `4px solid ${isCorrect ? '#52b788' : '#e63946'}`;
    ex.innerHTML = `${isCorrect ? '✅ Correct!' : '❌ Wrong!'} — ${questions[current].explanation}`;

    setTimeout(() => { current++; render(); }, 2200);
  };

  function showResult() {
    const isNew = onGameEnd('ox-quiz', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${score >= 70 ? '🎓' : score >= 40 ? '👍' : '📚'}</div>
        <h2 class="result-title">${score >= 70 ? 'Korean Culture Expert!' : score >= 40 ? 'Good knowledge!' : 'Time to learn more!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <p style="color:#888;">${current} questions answered</p>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadOxQuiz(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  render();
}

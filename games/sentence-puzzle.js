/* =============================================
   게임 5: 문장 퍼즐 (Sentence Puzzle)
   ============================================= */

function loadSentencePuzzle(container, level) {
  const puzzles = shuffle([...GameData.sentencePuzzle[level]]).slice(0, 6);
  let score = 0;
  let current = 0;

  function render() {
    if (current >= puzzles.length) return showResult();
    const puzzle = puzzles[current];
    const shuffledWords = shuffle([...puzzle.words]);
    let selected = [];

    function updateDisplay() {
      const answerEl = document.getElementById('sp-answer');
      const checkEl  = document.getElementById('sp-check');
      answerEl.innerHTML = selected.length === 0
        ? '<span style="color:#aaa;font-size:0.9rem;">Tap words below to build the sentence</span>'
        : selected.map((w, i) =>
            `<span class="sp-token selected" onclick="spDeselect(${i})"
              style="display:inline-block;background:#1d3557;color:white;padding:8px 14px;border-radius:8px;margin:4px;cursor:pointer;font-weight:600;"
            >${w}</span>`
          ).join('');
      checkEl.disabled = selected.length !== puzzle.words.length;
    }

    container.innerHTML = `
      <h2 class="game-title">🧩 Sentence Puzzle</h2>
      <div class="game-score-bar">
        <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="sp-score">${score}</span></div>
        <div class="stat"><span class="stat-label">Puzzle</span><span class="stat-value">${current + 1} / ${puzzles.length}</span></div>
      </div>
      <div class="fade-in" style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
        <p style="font-size:0.85rem;color:#888;margin-bottom:6px;">Arrange the words to say:</p>
        <p style="font-size:1.1rem;font-weight:700;color:#1d3557;">"${puzzle.translation}"</p>
      </div>

      <!-- 답 조립 영역 -->
      <div id="sp-answer" style="min-height:60px;background:#f8f9fa;border:2px dashed #dee2e6;border-radius:12px;padding:12px;margin-bottom:16px;display:flex;flex-wrap:wrap;align-items:center;gap:6px;">
        <span style="color:#aaa;font-size:0.9rem;">Tap words below to build the sentence</span>
      </div>

      <!-- 단어 블록 -->
      <div id="sp-pool" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
        ${shuffledWords.map((w, i) =>
          `<button class="sp-word" id="sp-word-${i}" onclick="spSelect('${escHtml(w)}', ${i})"
            style="padding:10px 18px;background:white;border:2px solid #457b9d;border-radius:10px;font-size:1rem;font-weight:600;color:#1d3557;cursor:pointer;transition:all 0.15s;"
          >${w}</button>`
        ).join('')}
      </div>

      <div style="display:flex;gap:10px;">
        <button id="sp-check" class="btn-primary" disabled onclick="spCheck()">Check Answer</button>
        <button class="btn-secondary" onclick="spClear()">Clear</button>
      </div>
      <div id="sp-feedback" style="margin-top:14px;text-align:center;font-size:1rem;font-weight:700;"></div>
    `;

    window.spSelect = function(word, idx) {
      const btn = document.getElementById(`sp-word-${idx}`);
      if (!btn || btn.disabled) return;
      selected.push(word);
      btn.disabled = true;
      btn.style.opacity = '0.3';
      updateDisplay();
    };

    window.spDeselect = function(selIdx) {
      const word = selected[selIdx];
      selected.splice(selIdx, 1);
      // 단어 블록 다시 활성화
      const pool = document.getElementById('sp-pool');
      if (pool) {
        pool.querySelectorAll('.sp-word').forEach(btn => {
          if (btn.textContent === word && btn.disabled) {
            btn.disabled = false;
            btn.style.opacity = '1';
          }
        });
      }
      updateDisplay();
    };

    window.spClear = function() {
      selected = [];
      container.querySelectorAll('.sp-word').forEach(b => {
        b.disabled = false;
        b.style.opacity = '1';
      });
      updateDisplay();
    };

    window.spCheck = function() {
      const correct = puzzle.correct_order.map(i => puzzle.words[i]);
      const isCorrect = selected.every((w, i) => w === correct[i]);
      const fb = document.getElementById('sp-feedback');
      if (isCorrect) {
        fb.textContent = '✅ Correct!';
        fb.style.color = '#52b788';
        score += 15;
        document.getElementById('sp-score').textContent = score;
        setTimeout(() => { current++; render(); }, 1200);
      } else {
        fb.textContent = `❌ Not quite! Correct: ${correct.join(' ')}`;
        fb.style.color = '#e63946';
        setTimeout(() => { current++; render(); }, 2000);
      }
    };
  }

  function showResult() {
    const isNew = onGameEnd('sentence-puzzle', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${score >= 70 ? '🎉' : score >= 40 ? '👍' : '🧩'}</div>
        <h2 class="result-title">${score >= 70 ? 'Sentence Master!' : score >= 40 ? 'Good effort!' : 'Keep practicing!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadSentencePuzzle(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  render();
}

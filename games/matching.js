/* =============================================
   게임 6: 짝꿍 찾기 (Memory Card Matching)
   ============================================= */

function loadMatching(container, level) {
  const words = shuffle([...GameData.words[level]]).slice(0, 6);
  let score = 0;
  let flipped = [];
  let matched = 0;
  let lockBoard = false;
  let moves = 0;
  let mtHintsLeft = 3;

  const cards = shuffle([
    ...words.map((w, i) => ({ id: i, type: 'kr', text: w.kr })),
    ...words.map((w, i) => ({ id: i, type: 'en', text: w.en }))
  ]);

  function render() {
    container.innerHTML = `
      <h2 class="game-title">🔗 Matching Game</h2>
      <div class="game-score-bar">
        <div class="stat"><span class="stat-label">Score</span><span class="stat-value" id="mt-score">${score}</span></div>
        <div class="stat"><span class="stat-label">Moves</span><span class="stat-value" id="mt-moves">${moves}</span></div>
        <div class="stat"><span class="stat-label">Pairs</span><span class="stat-value" id="mt-pairs">${matched} / ${words.length}</span></div>
      </div>
      <div class="hint-area" style="margin-bottom:12px;">
        <button class="hint-btn" id="mt-hint" onclick="mtUseHint()">💡 힌트 (${mtHintsLeft})</button>
        <div id="mt-hint-box"></div>
      </div>
      <p style="text-align:center;color:#888;font-size:0.85rem;margin-bottom:16px;">
        Click cards to flip them. Match Korean words with their English meanings!
      </p>
      <div id="mt-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
        ${cards.map((card, idx) => `
          <div class="mt-card" id="mt-card-${idx}" data-idx="${idx}"
            onclick="mtFlip(${idx})"
            style="aspect-ratio:3/2;cursor:pointer;perspective:600px;">
            <div class="mt-card-inner" id="mt-inner-${idx}"
              style="width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 0.4s;">
              <div style="position:absolute;inset:0;background:linear-gradient(135deg,#1d3557,#457b9d);border-radius:10px;display:flex;align-items:center;justify-content:center;backface-visibility:hidden;">
                <span style="font-size:1.6rem;">🇰🇷</span>
              </div>
              <div style="position:absolute;inset:0;background:white;border:2px solid #dee2e6;border-radius:10px;display:flex;align-items:center;justify-content:center;backface-visibility:hidden;transform:rotateY(180deg);padding:6px;text-align:center;">
                <span style="font-size:${card.type === 'kr' ? '1.1rem' : '0.85rem'};font-weight:700;color:#1d3557;line-height:1.3;">${card.text}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  window.mtUseHint = function() {
    if (mtHintsLeft <= 0) return;
    mtHintsLeft--;
    const btn = document.getElementById('mt-hint');
    if (btn) { btn.textContent = `💡 힌트 (${mtHintsLeft})`; btn.disabled = mtHintsLeft <= 0; }
    // Find an unmatched word and reveal its pair info
    const unmatched = words.find((w, i) => !document.querySelector(`[data-matched][data-id="${i}"]`));
    if (unmatched) {
      const hintBox = document.getElementById('mt-hint-box');
      if (hintBox) hintBox.innerHTML = `<div class="hint-box">힌트: <b>${unmatched.kr}</b> = <b>${unmatched.en}</b></div>`;
    }
  };

  window.mtFlip = function(idx) {
    if (lockBoard) return;
    const inner = document.getElementById(`mt-inner-${idx}`);
    const card  = document.getElementById(`mt-card-${idx}`);
    if (!inner || card.dataset.matched || flipped.find(f => f.idx === idx)) return;

    inner.style.transform = 'rotateY(180deg)';
    flipped.push({ idx, id: cards[idx].id });

    if (flipped.length === 2) {
      moves++;
      document.getElementById('mt-moves').textContent = moves;
      lockBoard = true;

      if (flipped[0].id === flipped[1].id) {
        flipped.forEach(f => {
          const el = document.getElementById(`mt-card-${f.idx}`);
          el.dataset.matched = 'true';
          el.style.opacity = '0.6';
          document.getElementById(`mt-inner-${f.idx}`).style.boxShadow = '0 0 0 3px #52b788';
        });
        matched++;
        score += Math.max(20 - moves, 5);
        document.getElementById('mt-score').textContent = score;
        document.getElementById('mt-pairs').textContent = `${matched} / ${words.length}`;
        flipped = [];
        lockBoard = false;
        Storage.updateDailyChallenge('correct', 1);
        if (matched === words.length) setTimeout(showResult, 600);
      } else {
        setTimeout(() => {
          flipped.forEach(f => { document.getElementById(`mt-inner-${f.idx}`).style.transform = ''; });
          flipped = [];
          lockBoard = false;
        }, 1000);
      }
    }
  };

  function showResult() {
    const isNew = onGameEnd('matching', score);
    container.innerHTML = `
      <div class="result-screen fade-in">
        <div class="result-emoji">${moves <= words.length + 2 ? '🌟' : '🎉'}</div>
        <h2 class="result-title">${moves <= words.length + 2 ? 'Amazing memory!' : 'All pairs found!'}</h2>
        ${isNew ? '<p style="color:#f4a261;font-weight:700;font-size:1.1rem;">🏆 New Best Score!</p>' : ''}
        <div class="result-score">${score} pts</div>
        <p style="color:#888;">Completed in ${moves} moves</p>
        <div class="result-buttons">
          <button class="btn-primary" onclick="loadMatching(document.getElementById('game-container'), currentLevel)">Play Again</button>
          <button class="btn-secondary" onclick="goHome()">Home</button>
        </div>
      </div>
    `;
  }

  render();
}

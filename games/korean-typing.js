/* =============================================
   게임 10: 한글 타이핑 (Korean Typing)
   ============================================= */

function loadKoreanTyping(container, level) {
  const allWords = GameData.words[level];
  const words = shuffle([...allWords]).slice(0, 15);
  let current = 0, score = 0, correct = 0;

  function render() {
    if (current >= words.length) return showResult();
    const word = words[current];
    container.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <div style="margin-bottom:8px; color:#888; font-size:14px;">
          ${current + 1} / ${words.length} &nbsp;|&nbsp; Score: <b>${score}</b>
        </div>
        <div style="font-size:14px; color:#555; margin-bottom:6px;">Type the Korean word for:</div>
        <div style="font-size:36px; font-weight:bold; margin-bottom:8px; color:#1a3a5c;">${word.en}</div>
        <div style="font-size:14px; color:#888; margin-bottom:20px;">
          Hint: starts with <b>${word.kr[0]}</b> (${word.romanization.split(' ')[0]})
        </div>
        <input id="typing-input" type="text" placeholder="Type in Korean or romanization..."
          style="width:280px; padding:12px; font-size:18px; border:2px solid #ddd; border-radius:8px; text-align:center; outline:none;"
          autofocus />
        <br/><br/>
        <button id="submit-btn" style="padding:12px 32px; background:#e63946; color:#fff; border:none; border-radius:8px; font-size:16px; cursor:pointer;">
          Submit
        </button>
        <div id="feedback" style="margin-top:16px; font-size:18px; min-height:28px;"></div>
      </div>`;

    const input = container.querySelector('#typing-input');
    const btn = container.querySelector('#submit-btn');

    function check() {
      const val = input.value.trim().toLowerCase();
      const fb = container.querySelector('#feedback');
      if (!val) return;
      const isCorrect = val === word.kr ||
        val === word.romanization.toLowerCase() ||
        (word.romanization.toLowerCase().startsWith(val) && val.length >= 3);
      if (isCorrect) {
        score += 10; correct++;
        fb.innerHTML = `<span style="color:green">✅ 정답! ${word.kr} (${word.romanization})</span>`;
      } else {
        fb.innerHTML = `<span style="color:red">❌ 오답! 정답: ${word.kr} (${word.romanization})</span>`;
      }
      input.disabled = true;
      btn.disabled = true;
      setTimeout(() => { current++; render(); }, 1200);
    }

    btn.addEventListener('click', check);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  }

  function showResult() {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 20px;">
        <div style="font-size:48px;">⌨️</div>
        <h2>게임 종료!</h2>
        <p style="font-size:22px;">Score: <b>${score}</b></p>
        <p style="color:#555;">${correct} / ${words.length} correct</p>
        <button onclick="startGame('korean-typing')"
          style="margin-top:16px; padding:12px 32px; background:#e63946; color:#fff; border:none; border-radius:8px; font-size:16px; cursor:pointer;">
          Play Again
        </button>
      </div>`;
    if (typeof saveScore === 'function') saveScore('korean-typing', score);
    onGameEnd('korean-typing', score);
  }

  render();
}

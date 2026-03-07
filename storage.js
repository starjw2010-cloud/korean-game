/* =============================================
   storage.js - 브라우저 저장 기능 (localStorage)
   ============================================= */

const Storage = {

  defaultData: {
    totalScore: 0,
    gamesPlayed: 0,
    selectedLevel: 'beginner',
    bestScores: {
      'word-cards': null,
      'fill-blank': null,
      'pronunciation': null,
      'word-rain': null,
      'sentence-puzzle': null,
      'matching': null,
      'ox-quiz': null,
      'korean-typing': null
    },
    lastPlayed: null,
    streak: { current: 0, best: 0 },
    wrongAnswers: [],       // [{ primary, secondary, gameId, timestamp }]
    dailyChallenge: null,   // { date, challenges: [...] }
    scoreHistory: [],       // [{ gameId, score, date }] 최대 20개
    totalWordsCorrect: 0,
    totalWordsWrong: 0
  },

  load() {
    const raw = localStorage.getItem('koreanArcade');
    if (!raw) return JSON.parse(JSON.stringify(this.defaultData));
    try {
      const data = JSON.parse(raw);
      // 새 필드가 없을 경우 기본값으로 채우기
      const def = JSON.parse(JSON.stringify(this.defaultData));
      return Object.assign(def, data);
    } catch {
      return JSON.parse(JSON.stringify(this.defaultData));
    }
  },

  save(data) {
    localStorage.setItem('koreanArcade', JSON.stringify(data));
  },

  updateBestScore(gameId, score) {
    const data = this.load();
    if (!data.bestScores) data.bestScores = {};
    const current = data.bestScores[gameId];
    if (current === null || current === undefined || score > current) {
      data.bestScores[gameId] = score;
      this.save(data);
      return true;
    }
    return false;
  },

  addScore(points) {
    const data = this.load();
    data.totalScore = (data.totalScore || 0) + points;
    data.gamesPlayed = (data.gamesPlayed || 0) + 1;
    data.lastPlayed = new Date().toISOString();
    this.save(data);
  },

  saveLevel(level) {
    const data = this.load();
    data.selectedLevel = level;
    this.save(data);
  },

  // ===== 오답 노트 =====

  // primary: 화면에 보여주는 것 (예: 한국어 단어)
  // secondary: 정답 (예: 영어 뜻)
  saveWrongAnswer(entry) {
    const data = this.load();
    if (!Array.isArray(data.wrongAnswers)) data.wrongAnswers = [];
    const idx = data.wrongAnswers.findIndex(w => w.primary === entry.primary && w.gameId === entry.gameId);
    if (idx !== -1) {
      data.wrongAnswers[idx].timestamp = Date.now();
      data.wrongAnswers[idx].count = (data.wrongAnswers[idx].count || 1) + 1;
    } else {
      data.wrongAnswers.unshift({ ...entry, timestamp: Date.now(), count: 1 });
      if (data.wrongAnswers.length > 50) data.wrongAnswers.pop();
    }
    data.totalWordsWrong = (data.totalWordsWrong || 0) + 1;
    this.save(data);
  },

  removeWrongAnswer(primary, gameId) {
    const data = this.load();
    data.wrongAnswers = (data.wrongAnswers || []).filter(
      w => !(w.primary === primary && w.gameId === gameId)
    );
    this.save(data);
  },

  // ===== 스트릭 =====

  updateStreak(correct) {
    const data = this.load();
    if (!data.streak) data.streak = { current: 0, best: 0 };
    if (correct) {
      data.streak.current++;
      if (data.streak.current > data.streak.best) {
        data.streak.best = data.streak.current;
      }
      data.totalWordsCorrect = (data.totalWordsCorrect || 0) + 1;
    } else {
      data.streak.current = 0;
    }
    this.save(data);
    return { ...data.streak };
  },

  // ===== 점수 히스토리 (진행 그래프용) =====

  addScoreHistory(gameId, score) {
    const data = this.load();
    if (!Array.isArray(data.scoreHistory)) data.scoreHistory = [];
    data.scoreHistory.unshift({ gameId, score, date: new Date().toISOString() });
    if (data.scoreHistory.length > 20) data.scoreHistory = data.scoreHistory.slice(0, 20);
    this.save(data);
  },

  // ===== 일일 도전 과제 =====

  getDailyChallenge() {
    const today = new Date().toISOString().slice(0, 10);
    const data = this.load();
    if (data.dailyChallenge && data.dailyChallenge.date === today) {
      return data.dailyChallenge;
    }
    const dc = {
      date: today,
      challenges: [
        { id: 'words10', label: '오늘 10단어 맞추기', icon: '📖', goal: 10, current: 0, completed: false },
        { id: 'play3',   label: '3가지 게임 플레이하기', icon: '🎮', goal: 3,  current: 0, completed: false, games: [] },
        { id: 'streak5', label: '5연속 정답 달성하기',  icon: '🔥', goal: 5,  current: 0, completed: false }
      ]
    };
    data.dailyChallenge = dc;
    this.save(data);
    return dc;
  },

  updateDailyChallenge(type, value, gameId) {
    const today = new Date().toISOString().slice(0, 10);
    const data = this.load();
    if (!data.dailyChallenge || data.dailyChallenge.date !== today) {
      this.getDailyChallenge();
      return null;
    }
    const dc = data.dailyChallenge;
    dc.challenges.forEach(c => {
      if (c.completed) return;
      if (type === 'correct' && c.id === 'words10') {
        c.current = Math.min(c.current + 1, c.goal);
        if (c.current >= c.goal) c.completed = true;
      }
      if (type === 'game' && c.id === 'play3' && gameId) {
        if (!c.games) c.games = [];
        if (!c.games.includes(gameId)) {
          c.games.push(gameId);
          c.current = c.games.length;
          if (c.current >= c.goal) c.completed = true;
        }
      }
      if (type === 'streak' && c.id === 'streak5') {
        c.current = Math.max(c.current, value);
        if (c.current >= c.goal) c.completed = true;
      }
    });
    data.dailyChallenge = dc;
    this.save(data);
    return dc;
  },

  reset() {
    localStorage.removeItem('koreanArcade');
  }

};

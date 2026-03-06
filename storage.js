/* =============================================
   storage.js - 브라우저 저장 기능 (localStorage)
   비유: 브라우저 안의 작은 메모장
   창을 꺼도 지워지지 않는 영구 저장소
   ============================================= */

const Storage = {

  // 저장 데이터의 기본 구조 (처음 시작할 때 이 형태로 초기화됨)
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
      'ox-quiz': null
    },
    lastPlayed: null
  },

  // 저장된 데이터 전부 불러오기
  load() {
    const raw = localStorage.getItem('koreanArcade');
    if (!raw) return JSON.parse(JSON.stringify(this.defaultData));
    try {
      return JSON.parse(raw);
    } catch {
      return JSON.parse(JSON.stringify(this.defaultData));
    }
  },

  // 데이터 전부 저장하기
  save(data) {
    localStorage.setItem('koreanArcade', JSON.stringify(data));
  },

  // 특정 게임의 최고 점수 업데이트
  updateBestScore(gameId, score) {
    const data = this.load();
    const current = data.bestScores[gameId];
    if (current === null || score > current) {
      data.bestScores[gameId] = score;
      this.save(data);
      return true; // 새 최고 기록!
    }
    return false;
  },

  // 총 점수 + 게임 플레이 횟수 추가
  addScore(points) {
    const data = this.load();
    data.totalScore += points;
    data.gamesPlayed += 1;
    data.lastPlayed = new Date().toISOString();
    this.save(data);
  },

  // 선택한 난이도 저장
  saveLevel(level) {
    const data = this.load();
    data.selectedLevel = level;
    this.save(data);
  },

  // 모든 데이터 초기화 (리셋)
  reset() {
    localStorage.removeItem('koreanArcade');
  }

};

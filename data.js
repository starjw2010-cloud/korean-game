/* =============================================
   data.js - 게임 콘텐츠 데이터
   단어, 문장, 퀴즈 문제 모음
   난이도별 (beginner / intermediate / advanced)
   ============================================= */

const GameData = {

  /* ==========================================
     단어 데이터 (게임 1, 3, 4, 6에서 사용)
     형태: { kr, romanization, en, category }
     ========================================== */
  words: {
    beginner: [
      { kr: '안녕하세요', romanization: 'annyeonghaseyo', en: 'Hello', category: 'greetings' },
      { kr: '감사합니다', romanization: 'gamsahamnida',   en: 'Thank you', category: 'greetings' },
      { kr: '미안합니다', romanization: 'mianhamnida',    en: "I'm sorry", category: 'greetings' },
      { kr: '네',         romanization: 'ne',              en: 'Yes', category: 'greetings' },
      { kr: '아니요',     romanization: 'aniyo',           en: 'No', category: 'greetings' },
      { kr: '이름',       romanization: 'ireum',           en: 'Name', category: 'greetings' },
      { kr: '물',         romanization: 'mul',             en: 'Water', category: 'food' },
      { kr: '밥',         romanization: 'bap',             en: 'Rice / Meal', category: 'food' },
      { kr: '빵',         romanization: 'bbang',           en: 'Bread', category: 'food' },
      { kr: '우유',       romanization: 'uyu',             en: 'Milk', category: 'food' },
      { kr: '하나',       romanization: 'hana',            en: 'One', category: 'numbers' },
      { kr: '둘',         romanization: 'dul',             en: 'Two', category: 'numbers' },
      { kr: '셋',         romanization: 'set',             en: 'Three', category: 'numbers' },
      { kr: '넷',         romanization: 'net',             en: 'Four', category: 'numbers' },
      { kr: '다섯',       romanization: 'daseot',          en: 'Five', category: 'numbers' },
      { kr: '사람',       romanization: 'saram',           en: 'Person', category: 'daily' },
      { kr: '집',         romanization: 'jip',             en: 'House / Home', category: 'daily' },
      { kr: '학교',       romanization: 'hakgyo',          en: 'School', category: 'daily' },
      { kr: '친구',       romanization: 'chingu',          en: 'Friend', category: 'daily' },
      { kr: '좋아요',     romanization: 'joayo',           en: 'I like it / Good', category: 'daily' }
    ],
    intermediate: [
      { kr: '비빔밥',     romanization: 'bibimbap',        en: 'Mixed rice bowl', category: 'food' },
      { kr: '삼겹살',     romanization: 'samgyeopsal',     en: 'Grilled pork belly', category: 'food' },
      { kr: '김치찌개',   romanization: 'kimchijjigae',    en: 'Kimchi stew', category: 'food' },
      { kr: '떡볶이',     romanization: 'tteokbokki',      en: 'Spicy rice cakes', category: 'food' },
      { kr: '지하철',     romanization: 'jihacheol',       en: 'Subway / Metro', category: 'travel' },
      { kr: '버스',       romanization: 'beoseu',          en: 'Bus', category: 'travel' },
      { kr: '공항',       romanization: 'gonghang',        en: 'Airport', category: 'travel' },
      { kr: '호텔',       romanization: 'hotel',           en: 'Hotel', category: 'travel' },
      { kr: '얼마예요?',  romanization: 'eolmayeyo?',      en: 'How much is it?', category: 'travel' },
      { kr: '어디예요?',  romanization: 'eodiyeyo?',       en: 'Where is it?', category: 'travel' },
      { kr: '대박',       romanization: 'daebak',          en: 'Awesome / Jackpot', category: 'kpop' },
      { kr: '화이팅',     romanization: 'hwaiting',        en: 'Fighting! / Go for it!', category: 'kpop' },
      { kr: '오빠',       romanization: 'oppa',            en: 'Older brother (said by girl)', category: 'kpop' },
      { kr: '아이돌',     romanization: 'aidol',           en: 'Idol', category: 'kpop' },
      { kr: '보고 싶어',  romanization: 'bogo sipeo',      en: 'I miss you', category: 'kpop' },
      { kr: '날씨',       romanization: 'nalssi',          en: 'Weather', category: 'daily' },
      { kr: '시장',       romanization: 'sijang',          en: 'Market', category: 'daily' },
      { kr: '병원',       romanization: 'byeongwon',       en: 'Hospital', category: 'daily' },
      { kr: '약국',       romanization: 'yakguk',          en: 'Pharmacy', category: 'daily' },
      { kr: '주세요',     romanization: 'juseyo',          en: 'Please give me', category: 'daily' }
    ],
    advanced: [
      { kr: '눈치',       romanization: 'nunchi',          en: 'Social awareness / reading the room', category: 'culture' },
      { kr: '정',         romanization: 'jeong',           en: 'Deep emotional bond / attachment', category: 'culture' },
      { kr: '빨리빨리',   romanization: 'bballi bballi',   en: 'Hurry hurry / speed culture', category: 'culture' },
      { kr: '눈치가 빠르다', romanization: 'nunchi ga barreuda', en: 'Quick to read the room', category: 'culture' },
      { kr: '어쩔 수 없다', romanization: 'eojjeol su eopda', en: 'There is no other way', category: 'expressions' },
      { kr: '그러게요',   romanization: 'geureogeyo',      en: 'I know right / Exactly', category: 'expressions' },
      { kr: '아무튼',     romanization: 'amutun',          en: 'Anyway / In any case', category: 'expressions' },
      { kr: '솔직히',     romanization: 'soljikhi',        en: 'Honestly / To be frank', category: 'expressions' },
      { kr: '귀찮다',     romanization: 'gwichanta',       en: "It's a hassle / Can't be bothered", category: 'expressions' },
      { kr: '설레다',     romanization: 'seolleda',        en: 'Feeling of excited anticipation', category: 'expressions' },
      { kr: '드라마',     romanization: 'deurama',         en: 'Drama (TV show)', category: 'kpop' },
      { kr: '주인공',     romanization: 'juingong',        en: 'Main character / Protagonist', category: 'kpop' },
      { kr: '사랑해',     romanization: 'saranghae',       en: 'I love you', category: 'kpop' },
      { kr: '운명',       romanization: 'unmyeong',        en: 'Fate / Destiny', category: 'kpop' },
      { kr: '존댓말',     romanization: 'jondaemal',       en: 'Formal/polite speech level', category: 'grammar' },
      { kr: '반말',       romanization: 'banmal',          en: 'Informal/casual speech', category: 'grammar' },
      { kr: '조사',       romanization: 'josa',            en: 'Particle (grammar)', category: 'grammar' },
      { kr: '이/가',      romanization: 'i/ga',            en: 'Subject particle', category: 'grammar' },
      { kr: '을/를',      romanization: 'eul/reul',        en: 'Object particle', category: 'grammar' },
      { kr: '에서',       romanization: 'eseo',            en: 'At / In (location of action)', category: 'grammar' }
    ]
  },

  /* ==========================================
     빈칸 채우기 문제 (게임 2)
     형태: { sentence_en, sentence_kr, blank, options, answer }
     ========================================== */
  fillBlank: {
    beginner: [
      {
        sentence_en: 'Hello, nice to meet you.',
        sentence_kr: '___, 만나서 반갑습니다.',
        blank: '___',
        options: ['안녕하세요', '감사합니다', '미안합니다', '잘 가요'],
        answer: '안녕하세요'
      },
      {
        sentence_en: 'I want to drink water.',
        sentence_kr: '저는 ___을 마시고 싶어요.',
        blank: '___',
        options: ['밥', '물', '우유', '빵'],
        answer: '물'
      },
      {
        sentence_en: 'This person is my friend.',
        sentence_kr: '이 사람은 제 ___이에요.',
        blank: '___',
        options: ['가족', '선생님', '친구', '학생'],
        answer: '친구'
      },
      {
        sentence_en: 'I go to school every day.',
        sentence_kr: '저는 매일 ___에 가요.',
        blank: '___',
        options: ['집', '학교', '병원', '시장'],
        answer: '학교'
      },
      {
        sentence_en: 'Thank you very much!',
        sentence_kr: '정말 ___!',
        blank: '___',
        options: ['미안합니다', '안녕하세요', '감사합니다', '잘 자요'],
        answer: '감사합니다'
      }
    ],
    intermediate: [
      {
        sentence_en: 'How much is this?',
        sentence_kr: '이거 ___?',
        blank: '___',
        options: ['어디예요?', '뭐예요?', '얼마예요?', '언제예요?'],
        answer: '얼마예요?'
      },
      {
        sentence_en: 'I want to eat bibimbap.',
        sentence_kr: '저는 ___을 먹고 싶어요.',
        blank: '___',
        options: ['김치찌개', '비빔밥', '삼겹살', '떡볶이'],
        answer: '비빔밥'
      },
      {
        sentence_en: 'The weather is really nice today.',
        sentence_kr: '오늘 ___가 정말 좋네요.',
        blank: '___',
        options: ['날씨', '시간', '기분', '장소'],
        answer: '날씨'
      },
      {
        sentence_en: 'I miss you so much.',
        sentence_kr: '정말 ___.',
        blank: '___',
        options: ['보고 싶어', '사랑해요', '행복해', '화이팅'],
        answer: '보고 싶어'
      },
      {
        sentence_en: 'Please give me one more.',
        sentence_kr: '하나 더 ___.',
        blank: '___',
        options: ['주세요', '드세요', '가세요', '오세요'],
        answer: '주세요'
      }
    ],
    advanced: [
      {
        sentence_en: 'You really know how to read the room.',
        sentence_kr: '당신은 정말 ___가 빠르네요.',
        blank: '___',
        options: ['눈치', '정', '빨리', '마음'],
        answer: '눈치'
      },
      {
        sentence_en: 'Honestly, it was a bit difficult.',
        sentence_kr: '___, 조금 어려웠어요.',
        blank: '___',
        options: ['아무튼', '솔직히', '그러게요', '어쩔 수 없다'],
        answer: '솔직히'
      },
      {
        sentence_en: 'Anyway, let\'s move on.',
        sentence_kr: '___, 계속 진행하죠.',
        blank: '___',
        options: ['솔직히', '설레다', '아무튼', '귀찮다'],
        answer: '아무튼'
      },
      {
        sentence_en: 'In Korean, you use a subject particle after the subject.',
        sentence_kr: '한국어에서 주어 뒤에 ___ 을 붙여요.',
        blank: '___',
        options: ['조사', '존댓말', '반말', '동사'],
        answer: '조사'
      },
      {
        sentence_en: 'The protagonist of this drama is very cool.',
        sentence_kr: '이 드라마의 ___이 정말 멋있어요.',
        blank: '___',
        options: ['주인공', '배우', '감독', '작가'],
        answer: '주인공'
      }
    ]
  },

  /* ==========================================
     OX 퀴즈 문제 (게임 7)
     형태: { question, answer: true/false, explanation }
     ========================================== */
  oxQuiz: {
    beginner: [
      { question: 'In Korean, "안녕하세요" is used to say hello.',          answer: true,  explanation: 'Yes! 안녕하세요 (annyeonghaseyo) is the most common formal greeting.' },
      { question: 'Korean is written from right to left.',                  answer: false, explanation: 'Korean (Hangul) is written from left to right, just like English.' },
      { question: '"감사합니다" means "I\'m sorry" in Korean.',             answer: false, explanation: '"감사합니다" means "Thank you." "미안합니다" means "I\'m sorry."' },
      { question: 'The Korean alphabet is called Hangul (한글).',            answer: true,  explanation: 'Hangul was created by King Sejong the Great in 1443.' },
      { question: '"네" means "Yes" in Korean.',                            answer: true,  explanation: 'Yes! "네" (ne) means yes. "아니요" (aniyo) means no.' },
      { question: 'Korea has only one official language.',                  answer: true,  explanation: 'Korean is the official language of both North and South Korea.' },
      { question: 'In Korea, age 1 is added at birth in the traditional system.', answer: true, explanation: 'In the traditional Korean age system, everyone is 1 at birth and gains a year every January 1st.' }
    ],
    intermediate: [
      { question: 'Kimchi is always spicy.',                                answer: false, explanation: 'There are over 200 types of kimchi! Some varieties like "white kimchi" (백김치) are not spicy.' },
      { question: 'In Korea, it is polite to receive things with two hands.', answer: true, explanation: 'Using two hands or one hand supported by the other arm shows respect.' },
      { question: '"대박" literally means "big gourd" but is used to say "awesome."', answer: true, explanation: '"대박" originally meant a big hit (jackpot), and the gourd shape was associated with luck.' },
      { question: 'Korean BBQ is always eaten indoors.',                    answer: false, explanation: 'Korean BBQ can be enjoyed both indoors and outdoors.' },
      { question: 'Seoul is the capital city of South Korea.',              answer: true,  explanation: 'Seoul (서울) has been the capital for over 600 years.' },
      { question: 'The Korean subway system is the largest in the world.',  answer: false, explanation: 'Seoul\'s subway is one of the largest, but systems like Beijing and Shanghai are larger.' },
      { question: 'Chuseok is a major Korean harvest festival similar to Thanksgiving.', answer: true, explanation: 'Chuseok (추석) is celebrated on the 15th day of the 8th lunar month.' }
    ],
    advanced: [
      { question: 'In Korean grammar, the verb always comes at the end of the sentence.', answer: true, explanation: 'Korean follows Subject-Object-Verb (SOV) order, unlike English\'s SVO.' },
      { question: '"존댓말" and "반말" refer to different levels of formality in Korean.', answer: true, explanation: '존댓말 is polite/formal speech, 반말 is casual speech used between close friends.' },
      { question: 'The particle "은/는" marks the object of a sentence.',  answer: false, explanation: '"은/는" is the topic particle. "을/를" marks the object.' },
      { question: '"눈치" is a uniquely Korean concept with no direct English translation.', answer: true, explanation: '"눈치" describes the ability to read a social situation without being told explicitly.' },
      { question: 'Korean has exactly 24 letters in the Hangul alphabet.',  answer: true,  explanation: 'Hangul has 14 consonants and 10 vowels = 24 letters total.' },
      { question: 'In Korean, age determines the speech level you use.',    answer: true,  explanation: 'Younger people use formal speech to elders; friends of the same age can use casual speech.' },
      { question: '"빨리빨리" culture refers to Koreans\' preference for slowness.', answer: false, explanation: '"빨리빨리" means "hurry hurry" — it refers to the Korean preference for speed and efficiency.' }
    ]
  },

  /* ==========================================
     문장 퍼즐 데이터 (게임 5)
     형태: { words: [], correct_order: [], translation }
     ========================================== */
  sentencePuzzle: {
    beginner: [
      { words: ['저는', '학생', '이에요'], correct_order: [0,1,2], translation: 'I am a student.' },
      { words: ['물', '주세요'], correct_order: [0,1], translation: 'Please give me water.' },
      { words: ['이름이', '뭐예요?'], correct_order: [0,1], translation: 'What is your name?' },
      { words: ['저는', '밥을', '먹어요'], correct_order: [0,1,2], translation: 'I eat rice.' },
      { words: ['오늘', '날씨가', '좋아요'], correct_order: [0,1,2], translation: 'The weather is nice today.' }
    ],
    intermediate: [
      { words: ['비빔밥', '하나', '주세요'], correct_order: [0,1,2], translation: 'Please give me one bibimbap.' },
      { words: ['지하철역이', '어디예요?'], correct_order: [0,1], translation: 'Where is the subway station?' },
      { words: ['저는', '한국어를', '배우고', '있어요'], correct_order: [0,1,2,3], translation: 'I am learning Korean.' },
      { words: ['오빠를', '보고', '싶어요'], correct_order: [0,1,2], translation: 'I miss you, oppa.' },
      { words: ['얼마예요?', '이거'], correct_order: [1,0], translation: 'How much is this?' }
    ],
    advanced: [
      { words: ['그', '드라마의', '주인공이', '정말', '멋있어요'], correct_order: [0,1,2,3,4], translation: 'The main character of that drama is really cool.' },
      { words: ['솔직히', '말하면', '조금', '어려웠어요'], correct_order: [0,1,2,3], translation: 'To be honest, it was a bit difficult.' },
      { words: ['한국어는', '동사가', '문장', '끝에', '와요'], correct_order: [0,1,2,3,4], translation: 'In Korean, the verb comes at the end of the sentence.' },
      { words: ['당신의', '눈치가', '정말', '빠르네요'], correct_order: [0,1,2,3], translation: 'You really read the room well.' },
      { words: ['아무튼', '계속', '열심히', '해봐요'], correct_order: [0,1,2,3], translation: 'Anyway, let\'s keep working hard.' }
    ]
  }

};

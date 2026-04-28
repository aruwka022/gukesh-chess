// lib/translations.ts
//
// All UI text in three languages.
// Structure: t.{section}.{key}
//
// Add a new key here, reference it via t("section.key") in components.

export const SUPPORTED_LANGUAGES = ["en", "ru", "kz"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "EN",
  ru: "RU",
  kz: "ҚЗ",
};

export const LANGUAGE_FULL_NAMES: Record<Language, string> = {
  en: "English",
  ru: "Русский",
  kz: "Қазақша",
};

// ============================================================
// Translation dictionary
// ============================================================
// Each top-level key is a "namespace" (a section of the app).
// Each leaf is the same key in three languages.
// ============================================================

export const translations = {
  // -------- Landing page --------
  landing: {
    nav: {
      methodology: { en: "Methodology", ru: "Методология", kz: "Әдіс" },
      features: { en: "Features", ru: "Возможности", kz: "Мүмкіндіктер" },
      pricing: { en: "Pricing", ru: "Тарифы", kz: "Тарифтер" },
      startPlaying: {
        en: "Start playing →",
        ru: "Начать игру →",
        kz: "Ойнауды бастау →",
      },
    },
    hero: {
      tagline: {
        en: "◆ A new chess platform · Est. 2026",
        ru: "◆ Новая шахматная платформа · 2026",
        kz: "◆ Жаңа шахмат платформасы · 2026",
      },
      titleStart: { en: "Chess, the way", ru: "Шахматы так,", kz: "Шахматты" },
      titleName: { en: "Gukesh", ru: "как играет Гукеш", kz: "Гукеш ойнайтындай" },
      titleEnd: { en: "plays it.", ru: ".", kz: "." },
      subtitle: {
        en: "Built around the principles of the world's youngest undisputed champion: deep calculation, elite time management, slow deliberate play. No bullet. No autopilot.",
        ru: "Построено на принципах самого молодого чемпиона мира: глубокий расчёт, элитное управление временем, медленная вдумчивая игра. Без буллета. Без автопилота.",
        kz: "Әлемдегі ең жас әмбебап чемпионның ұстанымдары негізінде құрылған: терең есептеу, уақытты шебер басқару, асықпай ойлап ойнау. Буллетсіз. Автопилотсыз.",
      },
      ctaPrimary: {
        en: "Play your first game",
        ru: "Сыграть первую партию",
        kz: "Алғашқы партияны ойнау",
      },
      ctaSecondary: {
        en: "Try the calculation trainer",
        ru: "Попробовать тренажёр расчёта",
        kz: "Есептеу жаттықтырғышын көру",
      },
    },
    methodology: {
      label: {
        en: "◆ The methodology",
        ru: "◆ Методология",
        kz: "◆ Әдіс",
      },
      quote: {
        en: '"I\'m known as a slow player — very calculative and thoughtful with each move. There has to be a balance between depth of thought and time available. It\'s a work in progress."',
        ru: '«Я известен как медленный игрок — очень расчётливый и вдумчивый в каждом ходе. Должен быть баланс между глубиной мысли и доступным временем. Это работа в процессе».',
        kz: '«Мені баяу ойнайтын ойыншы ретінде біледі — әр жүрістерімді мұқият есептеп, ойланып жасаймын. Ой тереңдігі мен уақыт арасында тепе-теңдік болуы керек. Бұл — әлі де жетілдіріп жатқан дүние».',
      },
      attribution: {
        en: "— Gukesh Dommaraju, World Chess Champion · Feb 2026",
        ru: "— Гукеш Доммараджу, чемпион мира по шахматам · Февраль 2026",
        kz: "— Гукеш Доммараджу, әлем шахмат чемпионы · Ақпан 2026",
      },
    },
    features: {
      label: { en: "◆ Three pillars", ru: "◆ Три опоры", kz: "◆ Үш тірек" },
      one: {
        title: {
          en: "Calculation Trainer",
          ru: "Тренажёр расчёта",
          kz: "Есептеу жаттықтырғышы",
        },
        body: {
          en: "Timed positions where you must find the best move under pressure. Trains the exact skill that won Gukesh the title.",
          ru: "Позиции на время, где нужно найти лучший ход под давлением. Тренирует тот самый навык, что принёс Гукешу титул.",
          kz: "Қысым астында ең жақсы жүрісті табу керек уақытпен шектелген позициялар. Гукешке атақ әперген дағдыны жаттықтырады.",
        },
      },
      two: {
        title: { en: "Slow Mode", ru: "Медленный режим", kz: "Баяу режим" },
        body: {
          en: "Long-form games against AI with no rapid clock. A deliberate rejection of bullet culture. Think before you move.",
          ru: "Длинные партии против ИИ без быстрого контроля. Сознательный отказ от буллет-культуры. Думай прежде чем ходить.",
          kz: "Жылдам сағатсыз ИИ-мен ұзақ ойындар. Буллет мәдениетінен саналы түрде бас тарту. Жүріс жасамас бұрын ойлан.",
        },
      },
      three: {
        title: { en: "AI Coach", ru: "ИИ-тренер", kz: "ИИ-жаттықтырушы" },
        body: {
          en: "After each game, the coach shows where you spent time on obvious moves — and where you rushed the critical ones.",
          ru: "После каждой партии тренер покажет, где ты потратил время на очевидные ходы — и где поспешил с критическими.",
          kz: "Әр ойыннан кейін жаттықтырушы сізге қайда айқын жүрістерге уақыт жұмсағаныңызды және қайда сын сәттерде асықққаныңызды көрсетеді.",
        },
      },
    },
    pricing: {
      label: {
        en: "◆ Free to play · Pro for serious training",
        ru: "◆ Бесплатно · Pro для серьёзной тренировки",
        kz: "◆ Тегін · Pro нағыз жаттығу үшін",
      },
      title: {
        en: "Train with the discipline of a champion.",
        ru: "Тренируйся с дисциплиной чемпиона.",
        kz: "Чемпионның тәртібімен жаттық.",
      },
      titleAccent: { en: "discipline", ru: "дисциплиной", kz: "тәртібімен" },
      ctaFree: { en: "Start free", ru: "Начать бесплатно", kz: "Тегін бастау" },
      ctaPro: { en: "See Pro features", ru: "Что в Pro", kz: "Pro мүмкіндіктері" },
    },
    footer: {
      tagline: {
        en: "◆ Gukesh.Mode · 2026",
        ru: "◆ Gukesh.Mode · 2026",
        kz: "◆ Gukesh.Mode · 2026",
      },
      tribute: {
        en: "A tribute, not affiliated with the player.",
        ru: "Дань уважения; не связано с игроком напрямую.",
        kz: "Құрмет көрсету; ойыншымен тікелей байланысты емес.",
      },
    },
  },

  // -------- Lobby (/play) --------
  lobby: {
    header: {
      chooseMode: {
        en: "◆ Choose your mode",
        ru: "◆ Выбери режим",
        kz: "◆ Режимді таңда",
      },
      home: { en: "← Home", ru: "← На главную", kz: "← Басты бет" },
    },
    hero: {
      tagline: {
        en: "◆ Begin a session",
        ru: "◆ Начать сессию",
        kz: "◆ Сессияны бастау",
      },
      title: {
        en: "How would you like to play today?",
        ru: "Как хочешь сыграть сегодня?",
        kz: "Бүгін қалай ойнағың келеді?",
      },
      titleAccent: { en: "play", ru: "сыграть", kz: "ойнағың" },
      subtitle: {
        en: "Pick a mode. You can switch anytime once the game begins.",
        ru: "Выбери режим. Можно переключаться прямо в игре.",
        kz: "Режимді таңда. Ойын барысында кез келген уақытта ауыстыруға болады.",
      },
    },
    cards: {
      local: {
        tag: { en: "Local match", ru: "На одном экране", kz: "Бір экранда" },
        title: {
          en: "Two players, one screen.",
          ru: "Двое игроков, один экран.",
          kz: "Екі ойыншы, бір экран.",
        },
        body: {
          en: "A quiet game between friends. The board flips automatically. No clock unless you want one.",
          ru: "Тихая партия между друзьями. Доска переворачивается автоматически. Часы — по желанию.",
          kz: "Достар арасындағы тыныш ойын. Тақта автоматты түрде аударылады. Сағат — қалаған кезде.",
        },
        cta: {
          en: "Start a local match →",
          ru: "Начать локальную партию →",
          kz: "Локалды партияны бастау →",
        },
      },
      ai: {
        tag: { en: "Versus AI", ru: "Против ИИ", kz: "ИИ-мен" },
        title: {
          en: "Calibrated to your level.",
          ru: "Под твой уровень.",
          kz: "Сіздің деңгейіңізге.",
        },
        body: {
          en: "Play against the engine at four strengths — from your first tournament to a world champion. The engine adapts; you grow.",
          ru: "Игра против движка на четырёх уровнях — от первого турнира до чемпионата мира. Движок подстраивается, ты растёшь.",
          kz: "Қозғалтқышпен төрт деңгейде ойнаңыз — алғашқы турнирден әлем чемпионатына дейін. Қозғалтқыш бейімделеді, сіз өсесіз.",
        },
        cta: {
          en: "Choose your opponent →",
          ru: "Выбрать соперника →",
          kz: "Қарсыласты таңдау →",
        },
      },
      multiplayer: {
        tag: { en: "Multiplayer", ru: "Мультиплеер", kz: "Мультиплеер" },
        title: {
          en: "Play a friend by link.",
          ru: "Играй с другом по ссылке.",
          kz: "Доспен сілтеме арқылы ойна.",
        },
        body: {
          en: "Share a private URL. Coming in the next release.",
          ru: "Поделись приватной ссылкой. Скоро в следующем релизе.",
          kz: "Жеке сілтемемен бөлісіңіз. Келесі шығарылымда келеді.",
        },
      },
      trainer: {
        tag: {
          en: "Calculation Trainer",
          ru: "Тренажёр расчёта",
          kz: "Есептеу жаттықтырғышы",
        },
        title: {
          en: "Find the move under pressure.",
          ru: "Найди ход под давлением.",
          kz: "Қысым астында жүрісті тап.",
        },
        body: {
          en: "Timed positions from the world's elite. Coming soon.",
          ru: "Позиции на время от мировой элиты. Скоро.",
          kz: "Әлемдік элитадан уақытпен шектелген позициялар. Жақында.",
        },
      },
      soonSuffix: { en: "soon", ru: "скоро", kz: "жақында" },
    },
  },

  // -------- AI level picker & game (/play/ai) --------
  ai: {
    header: {
      chooseOpponent: {
        en: "◆ Choose your opponent",
        ru: "◆ Выбери соперника",
        kz: "◆ Қарсыласты таңда",
      },
      lobby: { en: "← Lobby", ru: "← В лобби", kz: "← Лоббиға" },
      changeLevel: {
        en: "Change level",
        ru: "Сменить уровень",
        kz: "Деңгейді өзгерту",
      },
    },
    picker: {
      tagline: {
        en: "◆ Four strengths · One journey",
        ru: "◆ Четыре уровня · Один путь",
        kz: "◆ Төрт деңгей · Бір жол",
      },
      title: {
        en: "Pick the level you want to face today.",
        ru: "Выбери уровень, с которым хочешь сразиться сегодня.",
        kz: "Бүгін қарсы шыққың келетін деңгейді таңда.",
      },
      titleAccent: { en: "level", ru: "уровень", kz: "деңгейді" },
      subtitle: {
        en: "Each level is a milestone from a champion's career. Start where you are. Climb when you're ready.",
        ru: "Каждый уровень — веха из карьеры чемпиона. Начни там, где находишься. Поднимайся когда готов.",
        kz: "Әр деңгей — чемпион мансабындағы кезең. Қазір қай жерде тұрсаң, сонан баста. Дайын болғанда көтеріл.",
      },
      loadingEngine: {
        en: "◆ Loading engine...",
        ru: "◆ Загружаем движок...",
        kz: "◆ Қозғалтқыш жүктелуде...",
      },
      levelPrefix: { en: "◆ Level", ru: "◆ Уровень", kz: "◆ Деңгей" },
      begin: { en: "Begin →", ru: "Начать →", kz: "Бастау →" },
    },
    levels: {
      prodigy: {
        label: { en: "Prodigy", ru: "Вундеркинд", kz: "Сәби дарын" },
        description: {
          en: "First tournament. ~1200 ELO.",
          ru: "Первый турнир. ~1200 ELO.",
          kz: "Алғашқы турнир. ~1200 ELO.",
        },
      },
      master: {
        label: { en: "Master", ru: "Мастер", kz: "Ұстаз" },
        description: {
          en: "On the path to GM. ~1800 ELO.",
          ru: "На пути к гроссмейстеру. ~1800 ELO.",
          kz: "Гроссмейстерлікке жол. ~1800 ELO.",
        },
      },
      candidate: {
        label: { en: "Candidate", ru: "Претендент", kz: "Үміткер" },
        description: {
          en: "Top of the rating list. ~2300 ELO.",
          ru: "Вершина рейтинга. ~2300 ELO.",
          kz: "Рейтингтің шыңы. ~2300 ELO.",
        },
      },
      champion: {
        label: { en: "Champion", ru: "Чемпион", kz: "Чемпион" },
        description: {
          en: "World title strength. ~2800 ELO.",
          ru: "Уровень чемпиона мира. ~2800 ELO.",
          kz: "Әлем чемпионы деңгейі. ~2800 ELO.",
        },
      },
    },
    engineNotes: {
      label: { en: "◆ Engine notes", ru: "◆ Заметки движка", kz: "◆ Қозғалтқыш ескертулері" },
      bodyPrefix: {
        en: "You're facing the engine at",
        ru: "Ты играешь с движком уровня",
        kz: "Сіз қозғалтқышпен",
      },
      bodySuffix: {
        en: "level. Take your time. Calculate fully. The engine doesn't reward speed — it rewards precision.",
        ru: ". Не торопись. Считай до конца. Движок не вознаграждает скорость — только точность.",
        kz: " деңгейінде ойнайсыз. Асықпаңыз. Толық есептеңіз. Қозғалтқыш жылдамдықты емес — дәлдікті бағалайды.",
      },
    },
  },

  // -------- Game board (shared between local + ai) --------
  board: {
    yourMove: { en: "Your move", ru: "Твой ход", kz: "Сіздің жүрісіңіз" },
    whiteToMove: { en: "White to move", ru: "Ход белых", kz: "Ақтың жүрісі" },
    blackToMove: { en: "Black to move", ru: "Ход чёрных", kz: "Қараның жүрісі" },
    toMoveSuffix: { en: "to move", ru: "ходит", kz: "жүреді" },
    engineThinking: {
      en: "Engine is thinking...",
      ru: "Движок думает...",
      kz: "Қозғалтқыш ойлануда...",
    },
    moveLabel: { en: "Move", ru: "Ход", kz: "Жүріс" },
    thinking: { en: "Thinking", ru: "Думаю", kz: "Ойлануда" },
    hint: {
      en: "◆ Drag pieces, or tap to select then tap destination",
      ru: "◆ Перетаскивай фигуры, или нажми чтобы выбрать, потом куда сходить",
      kz: "◆ Тастарды сүйреңіз немесе таңдау үшін басып, содан соң барар жерді басыңыз",
    },
    statusLabel: { en: "◆ Status", ru: "◆ Статус", kz: "◆ Статус" },
    history: {
      label: { en: "◆ Move history", ru: "◆ История ходов", kz: "◆ Жүрістер тарихы" },
      empty: {
        en: "No moves yet. White to begin.",
        ru: "Ходов ещё нет. Белые начинают.",
        kz: "Әзірге жүрістер жоқ. Ақтар бастайды.",
      },
    },
    actions: {
      undo: { en: "Undo", ru: "Отменить", kz: "Кері қайтару" },
      reset: { en: "Reset", ru: "Сброс", kz: "Қайта бастау" },
    },
    comingNext: {
      label: { en: "◆ Coming next", ru: "◆ Скоро", kz: "◆ Жақында" },
      multiplayer: {
        en: "· Multiplayer by link",
        ru: "· Мультиплеер по ссылке",
        kz: "· Сілтеме арқылы мультиплеер",
      },
      coach: {
        en: "· AI Coach post-game review",
        ru: "· Разбор партии от ИИ-тренера",
        kz: "· ИИ-жаттықтырушының ойыннан кейінгі талдауы",
      },
      trainer: {
        en: "· Calculation Trainer",
        ru: "· Тренажёр расчёта",
        kz: "· Есептеу жаттықтырғышы",
      },
      profiles: {
        en: "· Player profiles",
        ru: "· Профили игроков",
        kz: "· Ойыншы профильдері",
      },
    },
    statuses: {
      checkmateWhite: {
        en: "Checkmate. White wins.",
        ru: "Мат. Белые победили.",
        kz: "Мат. Ақтар жеңді.",
      },
      checkmateBlack: {
        en: "Checkmate. Black wins.",
        ru: "Мат. Чёрные победили.",
        kz: "Мат. Қаралар жеңді.",
      },
      stalemate: {
        en: "Stalemate. The game is drawn.",
        ru: "Пат. Ничья.",
        kz: "Пат. Тең ойын.",
      },
      threefold: {
        en: "Draw by threefold repetition.",
        ru: "Ничья по троекратному повторению.",
        kz: "Үш реттік қайталау бойынша тең ойын.",
      },
      insufficient: {
        en: "Draw — insufficient material.",
        ru: "Ничья — недостаточно материала.",
        kz: "Тең ойын — материал жеткіліксіз.",
      },
      draw: { en: "Draw.", ru: "Ничья.", kz: "Тең ойын." },
      check: { en: "Check.", ru: "Шах.", kz: "Шах." },
    },
  },

  // -------- Mode switcher in headers --------
  modeSwitch: {
    local: { en: "Local match", ru: "Локально", kz: "Локалды" },
    ai: { en: "Vs AI", ru: "Против ИИ", kz: "ИИ-мен" },
    lobby: { en: "Lobby", ru: "Лобби", kz: "Лобби" },
  },
};
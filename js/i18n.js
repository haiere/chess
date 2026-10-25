/**
 * i18n — Internasionalisasi Hajir Chess.
 * Struktur key id/en identik. Fallback aman: tidak pernah menampilkan key mentah.
 */

const STORAGE_KEY = 'chess:lang';
const SUPPORTED = ['id', 'en'];
const DEFAULT_LANG = 'id';

export const LOCALES = {
  id: {
    app: { name: 'Hajir Chess', tagline: 'Catur strategis, gratis, tanpa akun.' },
    navigation: {
      home: 'Beranda', dashboard: 'Beranda', play: 'Main', puzzle: 'Puzzle',
      learning: 'Belajar', settings: 'Pengaturan', about: 'Tentang', more: 'Lainnya'
    },
    common: {
      loading: 'Memuat…', error: 'Terjadi kesalahan.', emptyState: 'Belum ada data.',
      tryAgain: 'Coba lagi', close: 'Tutup', cancel: 'Batal', confirm: 'Konfirmasi',
      save: 'Simpan', back: 'Kembali', next: 'Berikutnya', previous: 'Sebelumnya',
      retry: 'Ulangi', yes: 'Ya', no: 'Tidak', comingSoon: 'Segera hadir',
      level: 'Level', progress: 'Progres', of: 'dari'
    },
    game: {
      title: 'Main Catur', subtitle: 'PvP atau lawan komputer.',
      pvp: 'Pemain vs Pemain', pvc: 'Pemain vs Komputer',
      mode: 'Mode', color: 'Warna', white: 'Putih', black: 'Hitam', random: 'Acak',
      difficulty: 'Kesulitan', easy: 'Mudah', medium: 'Sedang', hard: 'Sulit',
      timeControl: 'Kontrol Waktu', unlimited: 'Tanpa batas',
      start: 'Mulai Permainan', newGame: 'Permainan Baru',
      undo: 'Undo', redo: 'Redo', resign: 'Menyerah', draw: 'Tawar Damai',
      flip: 'Putar Papan', moveHistory: 'Riwayat Langkah',
      capturedPieces: 'Bidak Tertangkap',

      /* Status dinamis */
      yourTurn: 'Giliran Anda',
      opponentTurn: 'Giliran Lawan',
      whiteToMove: 'Giliran Putih',
      blackToMove: 'Giliran Hitam',
      thinking: 'Komputer berpikir…',
      computer: 'Komputer',
      waiting: 'Menunggu',
      statusCheck: 'Skak!',
      statusProtect: 'Lindungi raja {color}.',
      check: 'Skak!',

      /* Akhir permainan */
      gameOver: 'Permainan Berakhir',
      checkmateWin: '{color} menang!',
      whiteWins: 'Putih menang!',
      blackWins: 'Hitam menang!',
      stalemate: 'Stalemate.',
      drawTitle: 'Remis',
      msgCheckmate: 'Skakmat.',
      msgTimeout: 'Waktu habis.',
      msgStalemate: 'Stalemate — tidak ada langkah legal.',
      msgDraw: 'Permainan berakhir seri.',
      msgInsufficient: 'Remis karena materi tidak cukup.',
      checkmateMessage: 'Skakmat!',
      stalemateMessage: 'Remis karena stalemate.',
      drawMessage: 'Permainan berakhir seri.',
      youWin: 'Anda menang!', youLose: 'Anda kalah.',

      /* Aksi */
      rematch: 'Main Lagi',
      close: 'Tutup',
      closeBtn: 'Tutup',
      copyPGN: 'Salin PGN',

      /* Undo/Redo */
      undoEmpty: 'Belum ada langkah untuk dibatalkan.',
      undoOk: 'Langkah dibatalkan.',
      redoEmpty: 'Belum ada langkah untuk diulang.',
      redoOk: 'Langkah diulang.',

      /* PGN / FEN */
      clipboardUnsupported: 'Clipboard tidak didukung browser ini.',
      pgnEmpty: 'Belum ada langkah.',
      pgnCopied: 'PGN disalin.',
      pgnCopyFail: 'Gagal menyalin PGN.',
      pgnDownloadFail: 'Gagal mengunduh PGN.',
      fenLoaded: 'Posisi FEN dimuat.',
      fenInvalid: 'FEN tidak valid.',
      fenPrompt: 'Masukkan FEN:',
      fenCopied: 'FEN disalin.',
      fenCopyFail: 'Gagal menyalin FEN.',

      /* Konfirmasi & status UI */
      confirmResign: 'Yakin ingin menyerah?',
      confirmDraw: 'Ajukan tawar damai?',
      confirmNewGame: 'Mulai permainan baru? Langkah saat ini akan hilang.',
      themeDark: 'Tema gelap aktif.',
      themeLight: 'Tema terang aktif.',
      soundOn: 'Suara aktif.',
      soundOff: 'Suara nonaktif.',

      /* Lain-lain */
      drawOffered: 'Tawaran damai dikirim.',
      drawDeclined: 'Tawaran damai ditolak.',
      invalidMove: 'Langkah tidak valid.',
      illegalMove: 'Langkah ilegal.',
      promotion: 'Promosi',
      promoteTo: 'Promosi ke {type}',
      choosePromotion: 'Pilih bidak promosi',
      noMoves: 'Tidak ada langkah tersedia.',
      timeOut: 'Waktu habis'
    },
    puzzle: {
      title: 'Puzzle Catur', subtitle: 'Latih taktik dan penglihatan papan.',
      difficulty: 'Kesulitan', easy: 'Mudah', medium: 'Sedang', hard: 'Sulit', expert: 'Ahli',
      level: 'Level', tryAgain: 'Coba Lagi', retry: 'Ulangi',
      next: 'Puzzle Berikutnya', previous: 'Puzzle Sebelumnya',
      hint: 'Petunjuk', showHint: 'Tampilkan Petunjuk', showSolution: 'Lihat Solusi',
      random: 'Acak', daily: 'Harian', id: 'ID Puzzle',
      solved: 'Berhasil!', wrong: 'Belum tepat.',
      solvedShort: 'Terpecahkan', wrongShort: 'Salah',
      streak: 'Streak', totalSolved: 'Total Terpecahkan', best: 'Terbaik',
      progress: 'Progres', whiteToMove: 'Putih melangkah', blackToMove: 'Hitam melangkah',
      solution: 'Solusi', noPuzzle: 'Puzzle tidak ditemukan.',
      loading: 'Memuat puzzle…',
      statusReady: 'Siap dimainkan', statusPlaying: 'Sedang bermain',
      statusSolved: 'Selesai', statusWrong: 'Belum tepat'
    },
    learning: {
      title: 'Belajar Catur', subtitle: 'Kuasai dasar hingga strategi lanjutan.',
      level: 'Tingkat', previous: 'Sebelumnya', next: 'Berikutnya',
      complete: 'Selesai', markComplete: 'Tandai Selesai', completed: 'Sudah Selesai',
      progress: 'Progres Belajar', progressCount: 'Pelajaran selesai: {current} dari {total}',
      exercise: 'Latihan', correct: 'Benar!', incorrect: 'Belum tepat.', tryAgain: 'Coba Lagi',
      locked: 'Terkunci', unlocked: 'Terbuka',
      noLesson: 'Pelajaran tidak ditemukan.', loading: 'Memuat pelajaran…',
      startLesson: 'Mulai Pelajaran', summary: 'Ringkasan', step: 'Langkah',
      notAvailable: 'Modul pembelajaran tidak tersedia. Buka Console untuk detail.'
    },
    settings: {
      title: 'Pengaturan', subtitle: 'Sesuaikan tampilan dan preferensi.',
      language: 'Bahasa', theme: 'Tema', boardTheme: 'Tema Papan',
      light: 'Terang', dark: 'Gelap', system: 'Sistem',
      themeLight: 'Terang', themeDark: 'Gelap', themeSystem: 'Ikuti Sistem',
      themeWood: 'Kayu', themeMarble: 'Marmer', themeNeon: 'Neon',
      themeClassic: 'Klasik', themeEmerald: 'Zamrud', themeOcean: 'Samudra',
      boardThemes: {
        classic: 'Klasik', emerald: 'Zamrud', midnight: 'Midnight',
        rose: 'Rose', bw: 'Hitam Putih', neon: 'Neon',
        wood: 'Kayu', marble: 'Marmer', ocean: 'Samudra'
      },
      sound: 'Efek Suara', animations: 'Animasi', on: 'Aktif', off: 'Nonaktif',
      resetAll: 'Atur Ulang Semua'
    },
    about: {
      title: 'Tentang', subtitle: 'Hajir Chess adalah aplikasi catur gratis.',
      description: 'Latih taktik, pelajari strategi, dan mainkan catur melawan teman atau komputer.',
      version: 'Versi', features: 'Fitur',
      feature1: 'Main lawan komputer atau teman',
      feature2: 'Teka-teki taktik',
      feature3: 'Pembelajaran terstruktur',
      feature4: 'Bilingual (Indonesia & English)'
    },
    toast: {
      saved: 'Tersimpan.', copied: 'Disalin.', failed: 'Gagal.',
      languageChanged: 'Bahasa diperbarui.'
    },
    aria: {
      mainMenu: 'Menu utama', languageSwitch: 'Ganti bahasa',
      closeDialog: 'Tutup dialog', board: 'Papan catur',
      boardSquare: 'Kotak {square}', turnIndicator: 'Giliran saat ini',
      difficultyBadge: 'Tingkat kesulitan', progressBar: 'Progres',
      puzzleStatus: 'Status puzzle', lessonStatus: 'Status pelajaran',
      boardLabel: 'Papan catur'
    }
  },

  en: {
    app: { name: 'Hajir Chess', tagline: 'Strategic chess, free, no account.' },
    navigation: {
      home: 'Home', dashboard: 'Home', play: 'Play', puzzle: 'Puzzle',
      learning: 'Learn', settings: 'Settings', about: 'About', more: 'More'
    },
    common: {
      loading: 'Loading…', error: 'Something went wrong.', emptyState: 'Nothing here yet.',
      tryAgain: 'Try again', close: 'Close', cancel: 'Cancel', confirm: 'Confirm',
      save: 'Save', back: 'Back', next: 'Next', previous: 'Previous',
      retry: 'Retry', yes: 'Yes', no: 'No', comingSoon: 'Coming soon',
      level: 'Level', progress: 'Progress', of: 'of'
    },
    game: {
      title: 'Play Chess', subtitle: 'PvP or play against the computer.',
      pvp: 'Player vs Player', pvc: 'Player vs Computer',
      mode: 'Mode', color: 'Color', white: 'White', black: 'Black', random: 'Random',
      difficulty: 'Difficulty', easy: 'Easy', medium: 'Medium', hard: 'Hard',
      timeControl: 'Time Control', unlimited: 'Unlimited',
      start: 'Start Game', newGame: 'New Game',
      undo: 'Undo', redo: 'Redo', resign: 'Resign', draw: 'Offer Draw',
      flip: 'Flip Board', moveHistory: 'Move History',
      capturedPieces: 'Captured Pieces',

      yourTurn: 'Your turn',
      opponentTurn: "Opponent's turn",
      whiteToMove: 'White to move',
      blackToMove: 'Black to move',
      thinking: 'Computer thinking…',
      computer: 'Computer',
      waiting: 'Waiting',
      statusCheck: 'Check!',
      statusProtect: 'Protect the {color} king.',
      check: 'Check!',

      gameOver: 'Game Over',
      checkmateWin: '{color} wins!',
      whiteWins: 'White wins!',
      blackWins: 'Black wins!',
      stalemate: 'Stalemate.',
      drawTitle: 'Draw',
      msgCheckmate: 'Checkmate.',
      msgTimeout: 'Time is up.',
      msgStalemate: 'Stalemate — no legal moves.',
      msgDraw: 'The game is a draw.',
      msgInsufficient: 'Draw — insufficient material.',
      checkmateMessage: 'Checkmate!',
      stalemateMessage: 'Stalemate — draw.',
      drawMessage: 'Game ended in a draw.',
      youWin: 'You win!', youLose: 'You lose.',

      rematch: 'Rematch',
      close: 'Close',
      closeBtn: 'Close',
      copyPGN: 'Copy PGN',

      undoEmpty: 'Nothing to undo.',
      undoOk: 'Move undone.',
      redoEmpty: 'Nothing to redo.',
      redoOk: 'Move redone.',

      clipboardUnsupported: 'Clipboard not supported in this browser.',
      pgnEmpty: 'No moves yet.',
      pgnCopied: 'PGN copied.',
      pgnCopyFail: 'Failed to copy PGN.',
      pgnDownloadFail: 'Failed to download PGN.',
      fenLoaded: 'FEN position loaded.',
      fenInvalid: 'Invalid FEN.',
      fenPrompt: 'Enter FEN:',
      fenCopied: 'FEN copied.',
      fenCopyFail: 'Failed to copy FEN.',

      confirmResign: 'Are you sure you want to resign?',
      confirmDraw: 'Offer a draw?',
      confirmNewGame: 'Start a new game? Current moves will be lost.',
      themeDark: 'Dark theme enabled.',
      themeLight: 'Light theme enabled.',
      soundOn: 'Sound on.',
      soundOff: 'Sound off.',

      drawOffered: 'Draw offer sent.',
      drawDeclined: 'Draw offer declined.',
      invalidMove: 'Invalid move.',
      illegalMove: 'Illegal move.',
      promotion: 'Promotion',
      promoteTo: 'Promote to {type}',
      choosePromotion: 'Choose a promotion piece',
      noMoves: 'No moves available.',
      timeOut: 'Time is up'
    },
    puzzle: {
      title: 'Chess Puzzles', subtitle: 'Sharpen tactics and board vision.',
      difficulty: 'Difficulty', easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert',
      level: 'Level', tryAgain: 'Try Again', retry: 'Retry',
      next: 'Next Puzzle', previous: 'Previous Puzzle',
      hint: 'Hint', showHint: 'Show Hint', showSolution: 'Show Solution',
      random: 'Random', daily: 'Daily', id: 'Puzzle ID',
      solved: 'Solved!', wrong: 'Not quite.',
      solvedShort: 'Solved', wrongShort: 'Wrong',
      streak: 'Streak', totalSolved: 'Total Solved', best: 'Best',
      progress: 'Progress', whiteToMove: 'White to move', blackToMove: 'Black to move',
      solution: 'Solution', noPuzzle: 'Puzzle not found.',
      loading: 'Loading puzzle…',
      statusReady: 'Ready to play', statusPlaying: 'In progress',
      statusSolved: 'Completed', statusWrong: 'Not quite'
    },
    learning: {
      title: 'Learn Chess', subtitle: 'From basics to advanced strategy.',
      level: 'Level', previous: 'Previous', next: 'Next',
      complete: 'Complete', markComplete: 'Mark Complete', completed: 'Completed',
      progress: 'Learning Progress', progressCount: 'Lessons completed: {current} of {total}',
      exercise: 'Exercise', correct: 'Correct!', incorrect: 'Not quite.', tryAgain: 'Try Again',
      locked: 'Locked', unlocked: 'Unlocked',
      noLesson: 'Lesson not found.', loading: 'Loading lesson…',
      startLesson: 'Start Lesson', summary: 'Summary', step: 'Step',
      notAvailable: 'Learning module not available. Check Console for details.'
    },
    settings: {
      title: 'Settings', subtitle: 'Adjust appearance and preferences.',
      language: 'Language', theme: 'Theme', boardTheme: 'Board Theme',
      light: 'Light', dark: 'Dark', system: 'System',
      themeLight: 'Light', themeDark: 'Dark', themeSystem: 'System',
      themeWood: 'Wood', themeMarble: 'Marble', themeNeon: 'Neon',
      themeClassic: 'Classic', themeEmerald: 'Emerald', themeOcean: 'Ocean',
      boardThemes: {
        classic: 'Classic', emerald: 'Emerald', midnight: 'Midnight',
        rose: 'Rose', bw: 'B&W', neon: 'Neon',
        wood: 'Wood', marble: 'Marble', ocean: 'Ocean'
      },
      sound: 'Sound Effects', animations: 'Animations', on: 'On', off: 'Off',
      resetAll: 'Reset All'
    },
    about: {
      title: 'About', subtitle: 'Hajir Chess is a free chess app.',
      description: 'Practice tactics, study strategy, and play chess against friends or the computer.',
      version: 'Version', features: 'Features',
      feature1: 'Play against the computer or friends',
      feature2: 'Tactical puzzles',
      feature3: 'Structured learning',
      feature4: 'Bilingual (Indonesian & English)'
    },
    toast: {
      saved: 'Saved.', copied: 'Copied.', failed: 'Failed.',
      languageChanged: 'Language updated.'
    },
    aria: {
      mainMenu: 'Main menu', languageSwitch: 'Switch language',
      closeDialog: 'Close dialog', board: 'Chess board',
      boardSquare: 'Square {square}', turnIndicator: 'Current turn',
      difficultyBadge: 'Difficulty badge', progressBar: 'Progress',
      puzzleStatus: 'Puzzle status', lessonStatus: 'Lesson status',
      boardLabel: 'Chess board'
    }
  }
};

// ---------------------------------------------------------------------------
// Engine

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch (_) {}
  const nav = ((typeof navigator !== 'undefined' && navigator.language) || '').toLowerCase();
  if (nav.startsWith('en')) return 'en';
  return DEFAULT_LANG;
}

function lookup(locale, path) {
  const parts = path.split('.');
  let node = locale;
  for (const p of parts) {
    if (node && typeof node === 'object' && p in node) node = node[p];
    else return undefined;
  }
  return typeof node === 'string' ? node : undefined;
}

function interpolate(str, params) {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(params, k) ? String(params[k]) : m
  );
}

function humanize(key) {
  const last = String(key).split('.').pop() || '';
  const spaced = last.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  if (!spaced) return '';
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

class I18n {
  constructor() {
    this.lang = detectInitialLang();
    this.listeners = new Set();
    this._applyLangAttr();
  }

  getLang() { return this.lang; }

  setLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === this.lang) return;
    this.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    this._applyLangAttr();
    this.emit();
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit() {
    for (const fn of this.listeners) {
      try { fn(this.lang); } catch (e) { console.error(e); }
    }
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: this.lang } }));
    }
  }

  _applyLangAttr() {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('lang', this.lang);
    }
  }

  t(key, params, options) {
    if (!key) return '';
    const active = LOCALES[this.lang];
    let str = lookup(active, key);
    if (str === undefined) {
      const other = this.lang === 'id' ? 'en' : 'id';
      str = lookup(LOCALES[other], key);
    }
    if (str === undefined) {
      if (options && typeof options.defaultValue === 'string') return options.defaultValue;
      console.warn('[i18n] missing key:', key);
      return humanize(key);
    }
    return interpolate(str, params);
  }

  hasKey(key) {
    return lookup(LOCALES.id, key) !== undefined && lookup(LOCALES.en, key) !== undefined;
  }

  // Method kompatibel — main.js memanggilnya sebagai window.I18n.init()
  init() {
    this._applyLangAttr();
    this.emit();
  }
}

export const i18n = new I18n();
export const t = (key, params, options) => i18n.t(key, params, options);
export const setLang = (lang) => i18n.setLang(lang);
export const getLang = () => i18n.getLang();

if (typeof window !== 'undefined') {
  window.I18n = {
    t,
    setLang,
    getLang,
    init:  () => i18n.init(),
    onChange: (fn) => i18n.onChange(fn),
    LOCALES
  };
      }

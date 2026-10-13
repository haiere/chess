/**
 * i18n.js — Bilingual engine dengan locales ter-embed.
 * Tidak butuh js/locales.js, tidak butuh build step.
 * Default: "id". Supported: "id", "en".
 * Storage key: "lang".
 */
(function (global) {
  "use strict";

  var LOCALES = {
    id: {
      common: { cancel:"Batal", close:"Tutup", confirm:"Konfirmasi", save:"Simpan", delete:"Hapus", reset:"Atur Ulang", back:"Kembali", next:"Berikutnya", previous:"Sebelumnya", loading:"Memuat...", yes:"Ya", no:"Tidak", ok:"OK", retry:"Coba Lagi", copy:"Salin", copied:"Tersalin", done:"Selesai", skip:"Lewati ke konten", more:"Selengkapnya", less:"Lebih Sedikit" },
      navigation: { play:"Main", puzzles:"Teka-teki", learning:"Pembelajaran", settings:"Pengaturan", about:"Tentang", menu:"Menu", mainNavigation:"Navigasi utama" },
      game: { title:"Permainan", newGame:"Permainan Baru", restart:"Mulai Ulang", restartConfirm:"Mulai ulang permainan? Progres saat ini akan hilang.", undo:"Urungkan", redo:"Ulangi", resign:"Menyerah", resignConfirm:"Yakin ingin menyerah?", draw:"Remis", drawOffer:"Tawarkan Remis", flipBoard:"Putar Papan", copyFEN:"Salin FEN", copyPGN:"Salin PGN", check:"Skak", checkmate:"Skakmat", stalemate:"Stalemate", drawResult:"Remis", yourTurn:"Giliran Anda", whiteTurn:"Giliran Putih", blackTurn:"Giliran Hitam", whiteWins:"Putih Menang", blackWins:"Hitam Menang", white:"Putih", black:"Hitam", player:"Pemain", computer:"Komputer", aiLevel:"Tingkat Komputer", easy:"Mudah", medium:"Sedang", hard:"Sulit", expert:"Ahli", playAs:"Main Sebagai", random:"Acak", timeControl:"Kontrol Waktu", noTime:"Tanpa Waktu", bullet:"Bullet", blitz:"Blitz", rapid:"Rapid", classical:"Klasik", increment:"Increment", moveHistory:"Riwayat Langkah", capturedPieces:"Bidak Tertangkap", promotion:"Promosi Pion", choosePromotion:"Pilih bidak promosi", queen:"Ratu", rook:"Benteng", bishop:"Uskup", knight:"Kuda", pawn:"Pion", king:"Raja", gameOver:"Permainan Selesai", threefoldRepetition:"Pengulangan Tiga Kali", fiftyMoveRule:"Aturan 50 Langkah", insufficientMaterial:"Materi Tidak Cukup", timeout:"Waktu Habis", resigned:"Menyerah", agreedDraw:"Remis Disetujui", checkmateWin:"Skakmat", moves:"langkah", move:"langkah", vs:"vs", you:"Anda", opponent:"Lawan" },
      puzzle: { title:"Teka-teki Catur", subtitle:"Latih taktik dan tingkatkan permainan Anda", difficulty:"Tingkat Kesulitan", easy:"Mudah", medium:"Menengah", hard:"Sulit", expert:"Master", next:"Teka-teki Berikutnya", previous:"Teka-teki Sebelumnya", random:"Acak", daily:"Teka-teki Harian", retry:"Coba Lagi", reset:"Atur Ulang", hint:"Petunjuk", hintOne:"Petunjuk 1: Perhatikan arah serangan", hintTwo:"Petunjuk 2: Bidak ini yang bergerak", showSolution:"Tampilkan Solusi", hideSolution:"Sembunyikan Solusi", correct:"Langkah benar!", incorrect:"Langkah salah, coba lagi", completed:"Teka-teki selesai!", failed:"Teka-teki gagal", inProgress:"Sedang berlangsung", whiteToMove:"Putih melangkah", blackToMove:"Hitam melangkah", progress:"Teka-teki {current} dari {total}", progressShort:"{current}/{total}", stats:"Statistik", solved:"Terselesaikan", failedCount:"Gagal", accuracy:"Akurasi", streak:"Streak", bestStreak:"Streak Terbaik", time:"Waktu", resetProgress:"Atur Ulang Progres", resetConfirm:"Yakin ingin mengatur ulang semua progres teka-teki?", noPuzzles:"Tidak ada teka-teki tersedia", loadingPuzzles:"Memuat teka-teki...", loadError:"Gagal memuat teka-teki. Menggunakan data cadangan.", theme:"Tema", themes: { fork:"Fork", pin:"Pin", skewer:"Skewer", mate:"Skakmat", endgame:"Endgame", opening:"Opening", middlegame:"Middlegame", discoveredAttack:"Serangan Terbuka", doubleAttack:"Serangan Ganda", backRank:"Baris Belakang" } },
      learning: { title:"Pembelajaran", subtitle:"Pelajari dasar hingga mahir", chapters:"Bab", lessons:"Pelajaran", previous:"Sebelumnya", next:"Berikutnya", completed:"Selesai", inProgress:"Sedang Dipelajari", notStarted:"Belum Dimulai", start:"Mulai", continue:"Lanjutkan", restart:"Ulangi Pelajaran", finish:"Selesaikan", progress:"Progres: {done} dari {total}", progressPercent:"{percent}% selesai", quiz:"Kuis", quizQuestion:"Pertanyaan {current} dari {total}", quizCorrect:"Jawaban benar!", quizIncorrect:"Jawaban salah", quizScore:"Skor: {score}/{total}", tryAgain:"Coba Lagi", levels: { beginner:"Pemula", intermediate:"Menengah", advanced:"Mahir" }, resetProgress:"Atur Ulang Progres", resetConfirm:"Yakin ingin mengatur ulang semua progres pembelajaran?" },
      settings: { title:"Pengaturan", language:"Bahasa", indonesian:"Bahasa Indonesia", english:"English", theme:"Tema", themeLight:"Terang", themeDark:"Gelap", themeSystem:"Ikuti Sistem", boardTheme:"Tema Papan", boardThemes: { classic:"Klasik", emerald:"Emerald", midnight:"Midnight", rose:"Rose", bw:"Hitam Putih", neon:"Neon" }, sound:"Suara", soundOn:"Aktif", soundOff:"Nonaktif", animations:"Animasi", animationsOn:"Aktif", animationsOff:"Nonaktif", coordinates:"Koordinat", coordinatesOn:"Tampilkan", coordinatesOff:"Sembunyikan", resetAll:"Atur Ulang Semua Pengaturan", resetConfirm:"Yakin ingin mengatur ulang semua pengaturan?", about:"Tentang Aplikasi", version:"Versi" },
      about: { title:"Tentang", description:"Aplikasi catur modern untuk bermain, berlatih, dan belajar.", features:"Fitur", feature1:"Main lawan komputer atau teman", feature2:"Teka-teki taktik", feature3:"Pembelajaran terstruktur", feature4:"Bilingual (Indonesia & English)", credits:"Kredit", license:"Lisensi" },
      a11y: { boardLabel:"Papan catur, {turn} melangkah", squareLabel:"{piece} di {square}", emptySquare:"Kotak kosong di {square}", selected:"Terpilih", legalMove:"Langkah legal tersedia", lastMove:"Langkah terakhir", checkIndicator:"Raja sedang diskak", languageSwitcher:"Pilih bahasa", mainNavigation:"Navigasi utama", closeDialog:"Tutup dialog", gameStatus:"Status permainan", moveAnnounced:"Langkah: {move}", pieceNames: { p:"Pion", n:"Kuda", b:"Uskup", r:"Benteng", q:"Ratu", k:"Raja" } },
      errors: { generic:"Terjadi kesalahan. Silakan coba lagi.", storageUnavailable:"Penyimpanan lokal tidak tersedia. Progres tidak akan tersimpan.", invalidFEN:"Posisi FEN tidak valid.", loadFailed:"Gagal memuat data.", networkError:"Kesalahan jaringan.", browserUnsupported:"Browser Anda tidak mendukung fitur ini." },
      toast: { copied:"Disalin ke clipboard", copyFailed:"Gagal menyalin", saved:"Tersimpan", resetDone:"Progres diatur ulang", settingsSaved:"Pengaturan disimpan" }
    },
    en: {
      common: { cancel:"Cancel", close:"Close", confirm:"Confirm", save:"Save", delete:"Delete", reset:"Reset", back:"Back", next:"Next", previous:"Previous", loading:"Loading...", yes:"Yes", no:"No", ok:"OK", retry:"Try Again", copy:"Copy", copied:"Copied", done:"Done", skip:"Skip to content", more:"More", less:"Less" },
      navigation: { play:"Play", puzzles:"Puzzles", learning:"Learning", settings:"Settings", about:"About", menu:"Menu", mainNavigation:"Main navigation" },
      game: { title:"Game", newGame:"New Game", restart:"Restart", restartConfirm:"Restart the game? Current progress will be lost.", undo:"Undo", redo:"Redo", resign:"Resign", resignConfirm:"Are you sure you want to resign?", draw:"Draw", drawOffer:"Offer Draw", flipBoard:"Flip Board", copyFEN:"Copy FEN", copyPGN:"Copy PGN", check:"Check", checkmate:"Checkmate", stalemate:"Stalemate", drawResult:"Draw", yourTurn:"Your Turn", whiteTurn:"White to move", blackTurn:"Black to move", whiteWins:"White Wins", blackWins:"Black Wins", white:"White", black:"Black", player:"Player", computer:"Computer", aiLevel:"Computer Level", easy:"Easy", medium:"Medium", hard:"Hard", expert:"Expert", playAs:"Play As", random:"Random", timeControl:"Time Control", noTime:"No Time", bullet:"Bullet", blitz:"Blitz", rapid:"Rapid", classical:"Classical", increment:"Increment", moveHistory:"Move History", capturedPieces:"Captured Pieces", promotion:"Pawn Promotion", choosePromotion:"Choose promotion piece", queen:"Queen", rook:"Rook", bishop:"Bishop", knight:"Knight", pawn:"Pawn", king:"King", gameOver:"Game Over", threefoldRepetition:"Threefold Repetition", fiftyMoveRule:"Fifty-Move Rule", insufficientMaterial:"Insufficient Material", timeout:"Timeout", resigned:"Resigned", agreedDraw:"Draw Agreed", checkmateWin:"Checkmate", moves:"moves", move:"move", vs:"vs", you:"You", opponent:"Opponent" },
      puzzle: { title:"Chess Puzzles", subtitle:"Train tactics and sharpen your game", difficulty:"Difficulty", easy:"Easy", medium:"Medium", hard:"Hard", expert:"Master", next:"Next Puzzle", previous:"Previous Puzzle", random:"Random", daily:"Daily Puzzle", retry:"Try Again", reset:"Reset", hint:"Hint", hintOne:"Hint 1: Look at the attack direction", hintTwo:"Hint 2: This piece is the one to move", showSolution:"Show Solution", hideSolution:"Hide Solution", correct:"Correct move!", incorrect:"Incorrect move, try again", completed:"Puzzle solved!", failed:"Puzzle failed", inProgress:"In progress", whiteToMove:"White to move", blackToMove:"Black to move", progress:"Puzzle {current} of {total}", progressShort:"{current}/{total}", stats:"Statistics", solved:"Solved", failedCount:"Failed", accuracy:"Accuracy", streak:"Streak", bestStreak:"Best Streak", time:"Time", resetProgress:"Reset Progress", resetConfirm:"Are you sure you want to reset all puzzle progress?", noPuzzles:"No puzzles available", loadingPuzzles:"Loading puzzles...", loadError:"Failed to load puzzles. Using fallback data.", theme:"Theme", themes: { fork:"Fork", pin:"Pin", skewer:"Skewer", mate:"Checkmate", endgame:"Endgame", opening:"Opening", middlegame:"Middlegame", discoveredAttack:"Discovered Attack", doubleAttack:"Double Attack", backRank:"Back Rank" } },
      learning: { title:"Learning", subtitle:"Learn from basics to mastery", chapters:"Chapters", lessons:"Lessons", previous:"Previous", next:"Next", completed:"Completed", inProgress:"In Progress", notStarted:"Not Started", start:"Start", continue:"Continue", restart:"Restart Lesson", finish:"Finish", progress:"Progress: {done} of {total}", progressPercent:"{percent}% complete", quiz:"Quiz", quizQuestion:"Question {current} of {total}", quizCorrect:"Correct!", quizIncorrect:"Incorrect", quizScore:"Score: {score}/{total}", tryAgain:"Try Again", levels: { beginner:"Beginner", intermediate:"Intermediate", advanced:"Advanced" }, resetProgress:"Reset Progress", resetConfirm:"Are you sure you want to reset all learning progress?" },
      settings: { title:"Settings", language:"Language", indonesian:"Bahasa Indonesia", english:"English", theme:"Theme", themeLight:"Light", themeDark:"Dark", themeSystem:"System", boardTheme:"Board Theme", boardThemes: { classic:"Classic", emerald:"Emerald", midnight:"Midnight", rose:"Rose", bw:"Black & White", neon:"Neon" }, sound:"Sound", soundOn:"On", soundOff:"Off", animations:"Animations", animationsOn:"On", animationsOff:"Off", coordinates:"Coordinates", coordinatesOn:"Show", coordinatesOff:"Hide", resetAll:"Reset All Settings", resetConfirm:"Are you sure you want to reset all settings?", about:"About", version:"Version" },
      about: { title:"About", description:"A modern chess app for playing, practicing, and learning.", features:"Features", feature1:"Play against computer or friend", feature2:"Tactical puzzles", feature3:"Structured learning", feature4:"Bilingual (Indonesian & English)", credits:"Credits", license:"License" },
      a11y: { boardLabel:"Chess board, {turn} to move", squareLabel:"{piece} on {square}", emptySquare:"Empty square on {square}", selected:"Selected", legalMove:"Legal move available", lastMove:"Last move", checkIndicator:"King is in check", languageSwitcher:"Choose language", mainNavigation:"Main navigation", closeDialog:"Close dialog", gameStatus:"Game status", moveAnnounced:"Move: {move}", pieceNames: { p:"Pawn", n:"Knight", b:"Bishop", r:"Rook", q:"Queen", k:"King" } },
      errors: { generic:"Something went wrong. Please try again.", storageUnavailable:"Local storage unavailable. Progress will not be saved.", invalidFEN:"Invalid FEN position.", loadFailed:"Failed to load data.", networkError:"Network error.", browserUnsupported:"Your browser does not support this feature." },
      toast: { copied:"Copied to clipboard", copyFailed:"Failed to copy", saved:"Saved", resetDone:"Progress reset", settingsSaved:"Settings saved" }
    }
  };

  var DEFAULT_LANG = "id", FALLBACK_LANG = "id";
  var SUPPORTED = ["id", "en"], STORAGE_KEY = "lang";
  var currentLang = DEFAULT_LANG, listeners = [];

  function safeGet(k) {
    try {
      if (global.AppStorage && AppStorage.get) return AppStorage.get(k);
      return global.localStorage ? localStorage.getItem("chess:" + k) : null;
    } catch (e) { return null; }
  }
  function safeSet(k, v) {
    try {
      if (global.AppStorage && AppStorage.set) return AppStorage.set(k, v);
      if (global.localStorage) localStorage.setItem("chess:" + k, v);
    } catch (e) {}
  }
  function detectInitial() {
    var saved = safeGet(STORAGE_KEY);
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = global.navigator || {}, cands = [];
    if (Array.isArray(nav.languages)) cands = cands.concat(nav.languages);
    if (nav.language) cands.push(nav.language);
    for (var i = 0; i < cands.length; i++) {
      var code = String(cands[i] || "").toLowerCase().split("-")[0];
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return DEFAULT_LANG;
  }
  function getNested(obj, path) {
    if (!obj || !path) return undefined;
    var parts = path.split("."), cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== "object") return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }
  function interpolate(tpl, params) {
    if (!params || typeof tpl !== "string") return tpl;
    return tpl.replace(/\{(\w+)\}/g, function (m, n) {
      return Object.prototype.hasOwnProperty.call(params, n) ? String(params[n]) : m;
    });
  }

  var I18n = {
    DEFAULT_LANG: DEFAULT_LANG,
    FALLBACK_LANG: FALLBACK_LANG,
    init: function (options) {
      options = options || {};
      // Prioritas: override dari options > embedded
      if (options.locales) { /* untuk backward compat, abaikan */ }
      currentLang = options.forceLang || detectInitial();
      if (SUPPORTED.indexOf(currentLang) === -1) currentLang = FALLBACK_LANG;
      I18n.applyLangAttribute();
      I18n.applyToDOM();
      return I18n;
    },
    getLang: function () { return currentLang; },
    getAvailable: function () { return SUPPORTED.slice(); },
    t: function (key, params) {
      var value = getNested(LOCALES[currentLang], key);
      if (value === undefined && currentLang !== FALLBACK_LANG) value = getNested(LOCALES[FALLBACK_LANG], key);
      if (value === undefined) return key;
      if (typeof value !== "string") return value;
      return interpolate(value, params);
    },
    setLang: function (lang) {
      if (SUPPORTED.indexOf(lang) === -1) lang = FALLBACK_LANG;
      if (lang === currentLang) return I18n;
      currentLang = lang;
      safeSet(STORAGE_KEY, lang);
      I18n.applyLangAttribute();
      I18n.applyToDOM();
      for (var i = 0; i < listeners.length; i++) {
        try { listeners[i](lang); } catch (e) { if (global.console) console.error(e); }
      }
      return I18n;
    },
    applyToDOM: function (root) {
      var scope = root || global.document;
      if (!scope || !scope.querySelectorAll) return;
      var nodes = scope.querySelectorAll("[data-i18n]");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i], key = el.getAttribute("data-i18n");
        if (key) el.textContent = I18n.t(key);
      }
      var attrNodes = scope.querySelectorAll("[data-i18n-attr]");
      for (var j = 0; j < attrNodes.length; j++) {
        var el2 = attrNodes[j], spec = el2.getAttribute("data-i18n-attr");
        if (!spec) continue;
        var pairs = spec.split(",");
        for (var k = 0; k < pairs.length; k++) {
          var pair = pairs[k].split(":");
          if (pair.length !== 2) continue;
          var an = pair[0].trim(), ak = pair[1].trim();
          if (an && ak) el2.setAttribute(an, I18n.t(ak));
        }
      }
    },
    applyLangAttribute: function () {
      if (global.document && global.document.documentElement) {
        global.document.documentElement.setAttribute("lang", currentLang);
      }
    },
    onChange: function (cb) {
      if (typeof cb === "function") listeners.push(cb);
      return function () {
        var i = listeners.indexOf(cb);
        if (i !== -1) listeners.splice(i, 1);
      };
    }
  };

  global.I18n = I18n;
})(typeof window !== "undefined" ? window : this);

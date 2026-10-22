/**
 * js/i18n.js — ESM. Locale ter-embed. Tidak butuh js/locales.js.
 */
const LOCALES = {
  id: {
    common:{cancel:"Batal",close:"Tutup",confirm:"Konfirmasi",save:"Simpan",delete:"Hapus",reset:"Atur Ulang",back:"Kembali",next:"Berikutnya",previous:"Sebelumnya",loading:"Memuat...",yes:"Ya",no:"Tidak",ok:"OK",retry:"Coba Lagi",copy:"Salin",copied:"Tersalin",done:"Selesai",skip:"Lewati ke konten",more:"Selengkapnya",less:"Lebih Sedikit",error:"Terjadi kesalahan"},
    navigation:{play:"Main",puzzles:"Teka-teki",learning:"Pembelajaran",settings:"Pengaturan",about:"Tentang",menu:"Menu",mainNavigation:"Navigasi utama",dashboard:"Dasbor"},
    game:{title:"Permainan",newGame:"Permainan Baru",restart:"Mulai Ulang",restartConfirm:"Mulai ulang permainan? Progres saat ini akan hilang.",undo:"Urungkan",redo:"Ulangi",resign:"Menyerah",resignConfirm:"Yakin ingin menyerah?",draw:"Remis",drawOffer:"Tawarkan Remis",flipBoard:"Putar Papan",copyFEN:"Salin FEN",copyPGN:"Salin PGN",check:"Skak",checkmate:"Skakmat",stalemate:"Stalemate",drawResult:"Remis",yourTurn:"Giliran Anda",whiteTurn:"Giliran Putih",blackTurn:"Giliran Hitam",whiteToMove:"Giliran Putih",blackToMove:"Giliran Hitam",whiteWins:"Putih Menang",blackWins:"Hitam Menang",white:"Putih",black:"Hitam",player:"Pemain",computer:"Komputer",aiLevel:"Tingkat Komputer",easy:"Mudah",medium:"Sedang",hard:"Sulit",expert:"Ahli",playAs:"Main Sebagai",random:"Acak",timeControl:"Kontrol Waktu",noTime:"Tanpa Waktu",bullet:"Bullet",blitz:"Blitz",rapid:"Rapid",classical:"Klasik",increment:"Increment",moveHistory:"Riwayat Langkah",capturedPieces:"Bidak Tertangkap",promotion:"Promosi Pion",choosePromotion:"Pilih bidak promosi",queen:"Ratu",rook:"Benteng",bishop:"Uskup",knight:"Kuda",pawn:"Pion",king:"Raja",gameOver:"Permainan Selesai",threefoldRepetition:"Pengulangan Tiga Kali",fiftyMoveRule:"Aturan 50 Langkah",insufficientMaterial:"Materi Tidak Cukup",timeout:"Waktu Habis",resigned:"Menyerah",agreedDraw:"Remis Disetujui",checkmateWin:"Skakmat",moves:"langkah",move:"langkah",vs:"vs",you:"Anda",opponent:"Lawan"},
    puzzle:{title:"Teka-teki Catur",subtitle:"Latih taktik dan tingkatkan permainan Anda",difficulty:"Tingkat Kesulitan",easy:"Mudah",medium:"Menengah",hard:"Sulit",expert:"Master",next:"Teka-teki Berikutnya",previous:"Teka-teki Sebelumnya",random:"Acak",daily:"Teka-teki Harian",retry:"Coba Lagi",reset:"Atur Ulang",hint:"Petunjuk",hintOne:"Petunjuk 1: Perhatikan arah serangan",hintTwo:"Petunjuk 2: Bidak ini yang bergerak",showSolution:"Tampilkan Solusi",hideSolution:"Sembunyikan Solusi",correct:"Langkah benar!",incorrect:"Langkah salah, coba lagi",completed:"Teka-teki selesai!",failed:"Teka-teki gagal",inProgress:"Sedang berlangsung",turnStatus:"{color} melangkah — langkah {done} dari {total}",statsLine:"Selesai: {solved} · Salah: {mistakes} · Streak: {streak}",info:"{title} · {difficulty} · rating {rating}",pick:"Pilih teka-teki untuk mulai",solvedCount:"{count} terselesaikan",whiteToMove:"Putih melangkah",blackToMove:"Hitam melangkah",progress:"Teka-teki {current} dari {total}",progressShort:"{current}/{total}",stats:"Statistik",solved:"Terselesaikan",failedCount:"Gagal",accuracy:"Akurasi",streak:"Streak",bestStreak:"Streak Terbaik",time:"Waktu",resetProgress:"Atur Ulang Progres",resetConfirm:"Yakin ingin mengatur ulang semua progres teka-teki?",resetToast:"Progres puzzle direset",noPuzzles:"Tidak ada teka-teki tersedia",loadingPuzzles:"Memuat teka-teki...",loadError:"Gagal memuat teka-teki. Menggunakan data cadangan.",theme:"Tema",themes:{fork:"Fork",pin:"Pin",skewer:"Skewer",mate:"Skakmat",endgame:"Endgame",opening:"Opening",middlegame:"Middlegame",discoveredAttack:"Serangan Terbuka",doubleAttack:"Serangan Ganda",backRank:"Baris Belakang"}},
    learning:{title:"Pembelajaran",subtitle:"Pelajari dasar hingga mahir",chapters:"Bab",lessons:"Pelajaran",previous:"Sebelumnya",next:"Berikutnya",completed:"Selesai",done:"Selesai",inProgress:"Sedang Dipelajari",notStarted:"Belum Dimulai",start:"Mulai",continue:"Lanjutkan",restart:"Ulangi Pelajaran",finish:"Selesaikan",progress:"Progres: {done} dari {total}",progressPercent:"{percent}% selesai",stepCounter:"Langkah {current} dari {total}",stepsCount:"{count} langkah",goal:"Tujuan: {goal}",beginner:"Pemula",elementary:"Dasar",intermediate:"Menengah",advanced:"Lanjutan",levels:{beginner:"Pemula",elementary:"Dasar",intermediate:"Menengah",advanced:"Lanjutan"},resetProgress:"Atur Ulang Progres",resetConfirm:"Yakin ingin mengatur ulang semua progres pembelajaran?",resetToast:"Progres pembelajaran direset"},
    settings:{title:"Pengaturan",language:"Bahasa",indonesian:"Bahasa Indonesia",english:"English",theme:"Tema",themeLight:"Terang",themeDark:"Gelap",themeSystem:"Ikuti Sistem",boardTheme:"Tema Papan",boardThemes:{classic:"Klasik",emerald:"Emerald",midnight:"Midnight",rose:"Rose",bw:"Hitam Putih",neon:"Neon"},sound:"Suara",soundOn:"Aktif",soundOff:"Nonaktif",animations:"Animasi",animationsOn:"Aktif",animationsOff:"Nonaktif",coordinates:"Koordinat",coordinatesOn:"Tampilkan",coordinatesOff:"Sembunyikan",resetProgress:"Reset Progres",resetSettings:"Reset Pengaturan",resetAll:"Atur Ulang Semua Pengaturan",resetConfirm:"Yakin ingin mengatur ulang semua pengaturan?",resetProgressConfirm:"Hapus SEMUA progres puzzle dan lesson?",resetSettingsConfirm:"Kembalikan semua pengaturan ke bawaan?",resetToast:"Pengaturan dikembalikan ke bawaan",about:"Tentang Aplikasi",version:"Versi"},
    about:{title:"Tentang",description:"Aplikasi catur modern untuk bermain, berlatih, dan belajar.",features:"Fitur",feature1:"Main lawan komputer atau teman",feature2:"Teka-teki taktik",feature3:"Pembelajaran terstruktur",feature4:"Bilingual (Indonesia & English)",credits:"Kredit",license:"Lisensi"},
    a11y:{boardLabel:"Papan catur, {turn} melangkah",squareLabel:"{piece} di {square}",emptySquare:"Kotak kosong di {square}",selected:"Terpilih",legalMove:"Langkah legal tersedia",lastMove:"Langkah terakhir",checkIndicator:"Raja sedang diskak",languageSwitcher:"Pilih bahasa",mainNavigation:"Navigasi utama",closeDialog:"Tutup dialog",gameStatus:"Status permainan",moveAnnounced:"Langkah: {move}",pieceNames:{p:"Pion",n:"Kuda",b:"Uskup",r:"Benteng",q:"Ratu",k:"Raja"}},
    errors:{generic:"Terjadi kesalahan. Silakan coba lagi.",storageUnavailable:"Penyimpanan lokal tidak tersedia.",invalidFEN:"Posisi FEN tidak valid.",loadFailed:"Gagal memuat data.",networkError:"Kesalahan jaringan.",browserUnsupported:"Browser Anda tidak mendukung fitur ini."},
    toast:{copied:"Disalin ke clipboard",copyFailed:"Gagal menyalin",saved:"Tersimpan",resetDone:"Progres diatur ulang",settingsSaved:"Pengaturan disimpan"},
    dashboard:{title:"Dasbor",subtitle:"Ringkasan progres belajar dan latihan Anda",stats:"Statistik",puzzleProgress:"Progres Puzzle",learningProgress:"Progres Pembelajaran",puzzlesSolved:"Puzzle Selesai",lessonsCompleted:"Lesson Selesai",streak:"Streak Latihan",bestStreak:"Streak Terbaik",lastLesson:"Lesson Terakhir",lastPuzzle:"Puzzle Terakhir",continueLearning:"Lanjutkan Belajar",recommendedPuzzle:"Puzzle Rekomendasi Berikutnya",noProgress:"Belum ada progres. Mulai perjalanan catur Anda!",startLearning:"Mulai Belajar",solvePuzzle:"Kerjakan Puzzle",none:"Belum ada",quickActions:"Aksi Cepat",totalPuzzles:"dari {total} puzzle",totalLessons:"dari {total} lesson"},
    search:{placeholder:"Cari...",noResults:"Tidak ada hasil yang cocok",filter:"Filter",allLevels:"Semua Tingkat",allDifficulties:"Semua Kesulitan"},
    favorites:{title:"Favorit",empty:"Belum ada favorit",add:"Tambah ke favorit",remove:"Hapus dari favorit",showOnly:"Tampilkan Favorit Saja",added:"Ditambahkan ke favorit",removed:"Dihapus dari favorit"},
    offline:{title:"Anda sedang offline",message:"Koneksi terputus. Beberapa fitur mungkin tidak tersedia.",retry:"Muat Ulang"},
    clipboard:{copied:"Disalin ke papan klip",failed:"Gagal menyalin",unsupported:"Papan klip tidak didukung di browser ini"},
    pwa:{install:"Instal Aplikasi",offlineReady:"Aplikasi siap digunakan offline"},
    shortcuts:{prev:"Sebelumnya",next:"Berikutnya",retry:"Coba lagi / reset",hint:"Petunjuk"},
    progress:{label:"Progres"}
  },
  en: {
    common:{cancel:"Cancel",close:"Close",confirm:"Confirm",save:"Save",delete:"Delete",reset:"Reset",back:"Back",next:"Next",previous:"Previous",loading:"Loading...",yes:"Yes",no:"No",ok:"OK",retry:"Try Again",copy:"Copy",copied:"Copied",done:"Done",skip:"Skip to content",more:"More",less:"Less",error:"An error occurred"},
    navigation:{play:"Play",puzzles:"Puzzles",learning:"Learning",settings:"Settings",about:"About",menu:"Menu",mainNavigation:"Main navigation",dashboard:"Dashboard"},
    game:{title:"Game",newGame:"New Game",restart:"Restart",restartConfirm:"Restart the game? Current progress will be lost.",undo:"Undo",redo:"Redo",resign:"Resign",resignConfirm:"Are you sure you want to resign?",draw:"Draw",drawOffer:"Offer Draw",flipBoard:"Flip Board",copyFEN:"Copy FEN",copyPGN:"Copy PGN",check:"Check",checkmate:"Checkmate",stalemate:"Stalemate",drawResult:"Draw",yourTurn:"Your Turn",whiteTurn:"White to move",blackTurn:"Black to move",whiteToMove:"White to Move",blackToMove:"Black to Move",whiteWins:"White Wins",blackWins:"Black Wins",white:"White",black:"Black",player:"Player",computer:"Computer",aiLevel:"Computer Level",easy:"Easy",medium:"Medium",hard:"Hard",expert:"Expert",playAs:"Play As",random:"Random",timeControl:"Time Control",noTime:"No Time",bullet:"Bullet",blitz:"Blitz",rapid:"Rapid",classical:"Classical",increment:"Increment",moveHistory:"Move History",capturedPieces:"Captured Pieces",promotion:"Pawn Promotion",choosePromotion:"Choose promotion piece",queen:"Queen",rook:"Rook",bishop:"Bishop",knight:"Knight",pawn:"Pawn",king:"King",gameOver:"Game Over",threefoldRepetition:"Threefold Repetition",fiftyMoveRule:"Fifty-Move Rule",insufficientMaterial:"Insufficient Material",timeout:"Timeout",resigned:"Resigned",agreedDraw:"Draw Agreed",checkmateWin:"Checkmate",moves:"moves",move:"move",vs:"vs",you:"You",opponent:"Opponent"},
    puzzle:{title:"Chess Puzzles",subtitle:"Train tactics and sharpen your game",difficulty:"Difficulty",easy:"Easy",medium:"Medium",hard:"Hard",expert:"Master",next:"Next Puzzle",previous:"Previous Puzzle",random:"Random",daily:"Daily Puzzle",retry:"Try Again",reset:"Reset",hint:"Hint",hintOne:"Hint 1: Look at the attack direction",hintTwo:"Hint 2: This piece is the one to move",showSolution:"Show Solution",hideSolution:"Hide Solution",correct:"Correct move!",incorrect:"Incorrect move, try again",completed:"Puzzle solved!",failed:"Puzzle failed",inProgress:"In progress",turnStatus:"{color} to move — move {done} of {total}",statsLine:"Solved: {solved} · Mistakes: {mistakes} · Streak: {streak}",info:"{title} · {difficulty} · rating {rating}",pick:"Pick a puzzle to begin",solvedCount:"{count} solved",whiteToMove:"White to move",blackToMove:"Black to move",progress:"Puzzle {current} of {total}",progressShort:"{current}/{total}",stats:"Statistics",solved:"Solved",failedCount:"Failed",accuracy:"Accuracy",streak:"Streak",bestStreak:"Best Streak",time:"Time",resetProgress:"Reset Progress",resetConfirm:"Are you sure you want to reset all puzzle progress?",resetToast:"Puzzle progress reset",noPuzzles:"No puzzles available",loadingPuzzles:"Loading puzzles...",loadError:"Failed to load puzzles. Using fallback data.",theme:"Theme",themes:{fork:"Fork",pin:"Pin",skewer:"Skewer",mate:"Checkmate",endgame:"Endgame",opening:"Opening",middlegame:"Middlegame",discoveredAttack:"Discovered Attack",doubleAttack:"Double Attack",backRank:"Back Rank"}},
    learning:{title:"Learning",subtitle:"Learn from basics to mastery",chapters:"Chapters",lessons:"Lessons",previous:"Previous",next:"Next",completed:"Completed",done:"Done",inProgress:"In Progress",notStarted:"Not Started",start:"Start",continue:"Continue",restart:"Restart Lesson",finish:"Finish",progress:"Progress: {done} of {total}",progressPercent:"{percent}% complete",stepCounter:"Step {current} of {total}",stepsCount:"{count} steps",goal:"Goal: {goal}",beginner:"Beginner",elementary:"Elementary",intermediate:"Intermediate",advanced:"Advanced",levels:{beginner:"Beginner",elementary:"Elementary",intermediate:"Intermediate",advanced:"Advanced"},resetProgress:"Reset Progress",resetConfirm:"Are you sure you want to reset all learning progress?",resetToast:"Learning progress reset"},
    settings:{title:"Settings",language:"Language",indonesian:"Bahasa Indonesia",english:"English",theme:"Theme",themeLight:"Light",themeDark:"Dark",themeSystem:"System",boardTheme:"Board Theme",boardThemes:{classic:"Classic",emerald:"Emerald",midnight:"Midnight",rose:"Rose",bw:"Black & White",neon:"Neon"},sound:"Sound",soundOn:"On",soundOff:"Off",animations:"Animations",animationsOn:"On",animationsOff:"Off",coordinates:"Coordinates",coordinatesOn:"Show",coordinatesOff:"Hide",resetProgress:"Reset Progress",resetSettings:"Reset Settings",resetAll:"Reset All Settings",resetConfirm:"Are you sure you want to reset all settings?",resetProgressConfirm:"Delete ALL puzzle and lesson progress?",resetSettingsConfirm:"Restore all settings to defaults?",resetToast:"Settings reset to defaults",about:"About",version:"Version"},
    about:{title:"About",description:"A modern chess app for playing, practicing, and learning.",features:"Features",feature1:"Play against computer or friend",feature2:"Tactical puzzles",feature3:"Structured learning",feature4:"Bilingual (Indonesian & English)",credits:"Credits",license:"License"},
    a11y:{boardLabel:"Chess board, {turn} to move",squareLabel:"{piece} on {square}",emptySquare:"Empty square on {square}",selected:"Selected",legalMove:"Legal move available",lastMove:"Last move",checkIndicator:"King is in check",languageSwitcher:"Choose language",mainNavigation:"Main navigation",closeDialog:"Close dialog",gameStatus:"Game status",moveAnnounced:"Move: {move}",pieceNames:{p:"Pawn",n:"Knight",b:"Bishop",r:"Rook",q:"Queen",k:"King"}},
    errors:{generic:"Something went wrong. Please try again.",storageUnavailable:"Local storage unavailable.",invalidFEN:"Invalid FEN position.",loadFailed:"Failed to load data.",networkError:"Network error.",browserUnsupported:"Your browser does not support this feature."},
    toast:{copied:"Copied to clipboard",copyFailed:"Failed to copy",saved:"Saved",resetDone:"Progress reset",settingsSaved:"Settings saved"},
    dashboard:{title:"Dashboard",subtitle:"Your learning and practice progress at a glance",stats:"Statistics",puzzleProgress:"Puzzle Progress",learningProgress:"Learning Progress",puzzlesSolved:"Puzzles Solved",lessonsCompleted:"Lessons Completed",streak:"Practice Streak",bestStreak:"Best Streak",lastLesson:"Last Lesson",lastPuzzle:"Last Puzzle",continueLearning:"Continue Learning",recommendedPuzzle:"Recommended Next Puzzle",noProgress:"No progress yet. Start your chess journey!",startLearning:"Start Learning",solvePuzzle:"Solve a Puzzle",none:"None yet",quickActions:"Quick Actions",totalPuzzles:"of {total} puzzles",totalLessons:"of {total} lessons"},
    search:{placeholder:"Search...",noResults:"No matching results",filter:"Filter",allLevels:"All Levels",allDifficulties:"All Difficulties"},
    favorites:{title:"Favorites",empty:"No favorites yet",add:"Add to favorites",remove:"Remove from favorites",showOnly:"Show Favorites Only",added:"Added to favorites",removed:"Removed from favorites"},
    offline:{title:"You are offline",message:"Connection lost. Some features may be unavailable.",retry:"Reload"},
    clipboard:{copied:"Copied to clipboard",failed:"Copy failed",unsupported:"Clipboard not supported in this browser"},
    pwa:{install:"Install App",offlineReady:"App is ready for offline use"},
    shortcuts:{prev:"Previous",next:"Next",retry:"Retry / reset",hint:"Hint"},
    progress:{label:"Progress"}
  }
};

const DEFAULT_LANG = "id", FALLBACK_LANG = "id";
const SUPPORTED = ["id", "en"], STORAGE_KEY = "lang";
let currentLang = DEFAULT_LANG;
const listeners = [];

function safeGet(k) {
  try {
    if (window.AppStorage && window.AppStorage.get) return window.AppStorage.get(k);
    return window.localStorage ? localStorage.getItem("chess:" + k) : null;
  } catch (e) { return null; }
}
function safeSet(k, v) {
  try {
    if (window.AppStorage && window.AppStorage.set) return window.AppStorage.set(k, v);
    if (window.localStorage) localStorage.setItem("chess:" + k, v);
  } catch (e) {}
}
function detectInitial() {
  const saved = safeGet(STORAGE_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const nav = navigator || {}, cands = [];
  if (Array.isArray(nav.languages)) cands.push(...nav.languages);
  if (nav.language) cands.push(nav.language);
  for (const c of cands) {
    const code = String(c || "").toLowerCase().split("-")[0];
    if (SUPPORTED.includes(code)) return code;
  }
  return DEFAULT_LANG;
}
function getNested(obj, path) {
  if (!obj || !path) return undefined;
  let cur = obj;
  for (const p of path.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}
function interpolate(tpl, params) {
  if (!params || typeof tpl !== "string") return tpl;
  return tpl.replace(/\{(\w+)\}/g, (m, n) =>
    Object.prototype.hasOwnProperty.call(params, n) ? String(params[n]) : m
  );
}

export const I18n = {
  DEFAULT_LANG, FALLBACK_LANG,
  init(options) {
    options = options || {};
    currentLang = options.forceLang || detectInitial();
    if (!SUPPORTED.includes(currentLang)) currentLang = FALLBACK_LANG;
    this.applyLangAttribute();
    this.applyToDOM();
    return this;
  },
  getLang() { return currentLang; },
  getAvailable() { return SUPPORTED.slice(); },
  t(key, params) {
    let value = getNested(LOCALES[currentLang], key);
    let missing = value === undefined;
    if (missing && currentLang !== FALLBACK_LANG) { value = getNested(LOCALES[FALLBACK_LANG], key); }
    if (value === undefined) {
      if (typeof window !== "undefined") {
        (window.__I18N_MISSING = window.__I18N_MISSING || new Set()).add(key);
      }
      return key;
    }
    if (typeof value !== "string") return value;
    return interpolate(value, params);
  },
  setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = FALLBACK_LANG;
    if (lang === currentLang) return this;
    currentLang = lang;
    safeSet(STORAGE_KEY, lang);
    this.applyLangAttribute();
    this.applyToDOM();
    for (const cb of listeners) { try { cb(lang); } catch (e) { console.error(e); } }
    return this;
  },
  applyToDOM(root) {
    const scope = root || document;
    if (!scope || !scope.querySelectorAll) return;
    scope.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      if (k) el.textContent = this.t(k);
    });
    scope.querySelectorAll("[data-i18n-attr]").forEach(el => {
      const spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;
      spec.split(",").forEach(p => {
        const [an, ak] = p.split(":").map(s => s && s.trim());
        if (an && ak) el.setAttribute(an, this.t(ak));
      });
    });
  },
  applyLangAttribute() {
    if (document && document.documentElement) document.documentElement.setAttribute("lang", currentLang);
  },
  onChange(cb) {
    if (typeof cb === "function") listeners.push(cb);
    return () => { const i = listeners.indexOf(cb); if (i !== -1) listeners.splice(i, 1); };
  }
};

if (typeof window !== "undefined") window.I18n = I18n;
export default I18n;

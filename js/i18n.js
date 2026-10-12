import os, json, subprocess
base = '/mnt/agents/output/chess'
os.makedirs(base+'/locales', exist_ok=True)

i18n_js = r'''/* ============================================================
   I18n — lightweight bilingual system (vanilla JS, no deps).
   - Source of truth: locales/id.json and locales/en.json
   - Loaded synchronously via window.LOCALES (js/locales.js,
     regenerate with: node tests/build-locales.mjs)
   - Default + fallback language: "id"
   - Persisted choice: AppStorage key "lang"
   - Missing key: falls back to "id", then returns the key
     itself (never throws, never crashes).
   Usage: I18n.t('game.undo') or I18n.t('puzzle.progress', {done:1,total:3})
   ============================================================ */
(function () {
    'use strict';

    const SUPPORTED = ['id', 'en'];
    const FALLBACK = 'id';
    const STORAGE_KEY = 'lang';

    let lang = detectInitial();
    const listeners = [];

    function detectInitial() {
        try {
            const stored = window.AppStorage.get(STORAGE_KEY, null);
            if (SUPPORTED.includes(stored)) return stored;
            const nav = ((navigator.languages && navigator.languages[0]) || navigator.language || 'id').toLowerCase();
            if (nav.indexOf('en') === 0) return 'en';
        } catch (e) { /* noop */ }
        return FALLBACK;
    }

    function dict(l) {
        const all = window.LOCALES || {};
        return all[l] || all[FALLBACK] || {};
    }

    function lookup(key, l) {
        let node = dict(l);
        for (const part of key.split('.')) {
            if (!node || typeof node !== 'object') return undefined;
            node = node[part];
        }
        return (typeof node === 'string') ? node : undefined;
    }

    /**
     * Translate a dotted key with optional {param} interpolation.
     * @param {string} key e.g. 'game.check'
     * @param {object} [params] e.g. { done: 1, total: 3 }
     * @returns {string} translated text (never throws)
     */
    function t(key, params) {
        if (typeof key !== 'string' || !key) return '';
        let str = lookup(key, lang);
        if (str === undefined) str = lookup(key, FALLBACK);
        if (str === undefined) return key; // safe fallback: raw key, app keeps running
        if (params) {
            str = str.replace(/\{(\w+)\}/g, (m, name) =>
                (params[name] !== undefined && params[name] !== null) ? String(params[name]) : m);
        }
        return str;
    }

    /** Re-apply data-i18n / data-i18n-aria attributes under root (default: whole document). */
    function apply(root) {
        const scope = root || document;
        scope.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        scope.querySelectorAll('[data-i18n-aria]').forEach(el => {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
        });
    }

    /** Switch language without page reload. Notifies all subscribers. */
    function setLang(next, silent) {
        if (!SUPPORTED.includes(next)) next = FALLBACK;
        if (next === lang) return;
        lang = next;
        try { window.AppStorage.set(STORAGE_KEY, lang); } catch (e) { /* noop */ }
        document.documentElement.setAttribute('lang', lang);
        if (!silent) {
            apply(document);
            listeners.forEach(cb => { try { cb(lang); } catch (e) { /* noop */ } });
        }
    }

    function onChange(cb) { listeners.push(cb); }

    document.documentElement.setAttribute('lang', lang);

    window.I18n = {
        t, apply, setLang, onChange,
        get lang() { return lang; },
        get supported() { return SUPPORTED.slice(); },
        FALLBACK
    };
})();
'''
open(base+'/js/i18n.js','w').write(i18n_js)

# ---------------- locales/id.json ----------------
locales_id = {
  "common": {"cancel":"Batal","close":"Tutup","on":"Aktif","off":"Nonaktif","show":"Tampilkan","hide":"Sembunyikan"},
  "navigation": {"play":"Main","puzzles":"Puzzle","learning":"Belajar","settings":"Pengaturan","about":"Tentang","language":"Bahasa"},
  "game": {
    "white":"Putih","black":"Hitam","whiteToMove":"White to move","blackToMove":"Black to move",
    "yourTurn":"Giliran Anda","waiting":"Menunggu","computer":"Komputer","thinking":"Berpikir...",
    "undo":"Undo","redo":"Redo","resign":"Resign","draw":"Draw","newGame":"New Game","flip":"Putar papan",
    "copyPGN":"Salin PGN","downloadPGN":"Unduh PGN","settings":"Pengaturan","theme":"Tema",
    "importFEN":"Impor FEN","exportFEN":"Ekspor FEN","sound":"Suara",
    "history":"Riwayat Langkah","statusCheck":"Check!","statusProtect":"{color} harus melindungi raja",
    "checkmateWin":"{color} Menang — Checkmate!","stalemate":"Stalemate — Remis","gameOver":"Permainan Berakhir",
    "whiteWins":"Putih Menang","blackWins":"Hitam Menang","drawTitle":"Permainan Remis",
    "msgCheckmate":"Checkmate!","msgTimeout":"Waktu habis!","msgStalemate":"Stalemate — tidak ada langkah legal.",
    "msgInsufficient":"Materi tidak cukup untuk mematikan.","msgDraw":"Permainan berakhir seri.",
    "promotionTitle":"Pilih Promosi","promoteTo":"Promosi ke {type}",
    "confirmResign":"Yakin ingin menyerah?","confirmDraw":"Tawarkan / terima remis?",
    "confirmNewGame":"Permainan sedang berjalan. Mulai permainan baru?",
    "undoEmpty":"Tidak ada langkah untuk di-undo","redoEmpty":"Tidak ada langkah untuk di-redo",
    "undoOk":"Undo berhasil","redoOk":"Redo berhasil",
    "pgnCopied":"PGN disalin!","pgnCopyFail":"Gagal menyalin PGN","pgnDownloadFail":"Gagal mengunduh PGN","pgnEmpty":"Belum ada langkah",
    "fenCopied":"FEN disalin!","fenCopyFail":"Gagal menyalin FEN","fenInvalid":"Format FEN tidak valid","fenLoaded":"FEN berhasil dimuat",
    "fenPrompt":"Masukkan FEN string:","clipboardUnsupported":"Clipboard tidak didukung",
    "themeDark":"Mode Gelap","themeLight":"Mode Terang","soundOn":"Suara Aktif","soundOff":"Suara Nonaktif",
    "rematch":"Rematch","closeBtn":"Tutup",
    "ariaFlip":"Putar papan","ariaUndo":"Urungkan langkah terakhir","ariaRedo":"Ulangi langkah",
    "ariaResign":"Menyerah","ariaDraw":"Tawarkan remis","ariaNewGame":"Mulai permainan baru",
    "ariaCopyPGN":"Salin PGN","ariaDownloadPGN":"Unduh PGN","ariaSettings":"Buka pengaturan",
    "ariaTheme":"Ganti tema","ariaImportFEN":"Impor FEN","ariaExportFEN":"Ekspor FEN","ariaSound":"Aktifkan atau matikan suara",
    "ariaBoard":"Papan catur","capturedWhite":"Bidak yang ditangkap putih","capturedBlack":"Bidak yang ditangkap hitam",
    "ngTitle":"Permainan Baru","ngMode":"Mode Permainan","ngModePvp":"Pemain vs Pemain","ngModePvc":"Pemain vs Komputer",
    "ngColor":"Warna Pemain","ngColorWhite":"Putih","ngColorBlack":"Hitam","ngColorRandom":"Acak",
    "ngDifficulty":"Kesulitan AI","ngEasy":"Mudah","ngMedium":"Menengah","ngHard":"Sulit",
    "ngTimer":"Kontrol Waktu","ngRapid":"10|0 Rapid","ngBlitz53":"5|3 Blitz","ngBlitz32":"3|2 Blitz",
    "ngBullet":"1|0 Bullet","ngNone":"Tanpa Timer","ngBoardTheme":"Tema Papan","ngStart":"Mulai",
    "themeClassic":"Classic Brown","themeEmerald":"Emerald","themeMidnight":"Midnight Blue",
    "themeRose":"Rose","themeBW":"Black and White","themeNeon":"Neon Cyberpunk"
  },
  "puzzle": {
    "title":"Teka-teki Catur","easy":"Mudah","medium":"Menengah","hard":"Sulit","master":"Master",
    "random":"Acak","daily":"Puzzle Harian","hint":"Hint","solution":"Lihat Solusi","retry":"Coba Lagi",
    "reset":"Reset Progres","stats":"Statistik Puzzle","pick":"Pilih tingkat kesulitan untuk memulai.",
    "inProgress":"{color} bergerak — temukan langkah terbaik ({done}/{total})",
    "hintStatus":"Petunjuk level {level}/{max} — {color} bergerak ({done}/{total})",
    "wrong":"Langkah salah. Coba lagi atau lihat petunjuk.",
    "solved":"Puzzle selesai — langkah benar!",
    "available":"{count} puzzle tersedia untuk level {label}",
    "info":"{title} · {difficulty} · rating {rating}{themes}",
    "statsLine":"Diselesaikan: {solved} · Salah: {mistakes} · Streak: {streak} (terbaik {best}) · Waktu: {minutes}m{seconds}s",
    "toastSolved":"Puzzle selesai! Streak {streak}","toastWrong":"Langkah salah — coba lagi",
    "resetConfirm":"Reset semua progres puzzle (statistik dan puzzle yang sudah selesai)?",
    "noPuzzles":"Tidak ada puzzle untuk level ini",
    "ariaPrev":"Puzzle sebelumnya","ariaNext":"Puzzle berikutnya","ariaHint":"Petunjuk langkah",
    "ariaSolution":"Lihat solusi puzzle","ariaRetry":"Coba lagi puzzle","ariaReset":"Reset progres puzzle",
    "ariaBoard":"Papan puzzle catur"
  },
  "learning": {
    "title":"Belajar Catur","progress":"Progres: {done}/{total} lesson selesai","done":"✓ Selesai",
    "stepsCount":"{count} langkah","goal":"Tujuan: {goal}","stepCounter":"Langkah {current}/{total}",
    "back":"← Semua Lesson","prev":"← Sebelumnya","next":"Berikutnya","repeat":"Ulangi Lesson",
    "reset":"Reset Progres Belajar","resetConfirm":"Reset semua progres pembelajaran?",
    "completedToast":"Lesson \"{title}\" selesai!","resetToast":"Progres pembelajaran direset",
    "levelBeginner":"pemula","levelIntermediate":"menengah"
  },
  "settings": {
    "title":"Pengaturan","appTheme":"Tema Aplikasi","themeDark":"Gelap","themeLight":"Terang","themeSystem":"Ikuti Sistem",
    "boardTheme":"Tema Papan","sound":"Efek Suara","coords":"Koordinat Papan","language":"Bahasa",
    "indonesian":"Bahasa Indonesia","english":"English",
    "data":"Data","dataDesc":"Semua data tersimpan hanya di perangkat Anda (localStorage). Reset tidak dapat dibatalkan.",
    "resetAll":"Reset Semua Data","resetAllConfirm":"Reset SEMUA data aplikasi (preferensi, progres puzzle, progres lesson)?",
    "resetToast":"Semua data direset — memuat ulang..."
  },
  "about": {
    "title":"Tentang","p1":"adalah aplikasi catur modern yang berjalan sepenuhnya di browser: tanpa server, tanpa akun, tanpa pelacakan. Engine aturan catur, AI, puzzle, dan pembelajaran semuanya dihitung lokal di perangkat Anda.",
    "f1":"Main — Pemain vs Pemain atau vs Komputer (3 level), timer, undo/redo, PGN/FEN.",
    "f2":"Puzzle — 14+ puzzle tervalidasi engine dengan 4 tingkat kesulitan, hint bertahap, dan statistik.",
    "f3":"Belajar — 15 lesson berbahasa Indonesia dari dasar hingga endgame.",
    "footer":"Dibuat oleh Haiere dan Hajir Studio. Lisensi: lihat LICENSE di repositori.","repo":"Repositori GitHub"
  },
  "pieces": {"king":"raja","queen":"menteri","rook":"benteng","bishop":"gajah","knight":"kuda","pawn":"pion","white":"putih","black":"hitam"}
}
json.dump(locales_id, open(base+'/locales/id.json','w'), ensure_ascii=False, indent=2)

# ---------------- locales/en.json ----------------
locales_en = {
  "common": {"cancel":"Cancel","close":"Close","on":"On","off":"Off","show":"Show","hide":"Hide"},
  "navigation": {"play":"Play","puzzles":"Puzzles","learning":"Learn","settings":"Settings","about":"About","language":"Language"},
  "game": {
    "white":"White","black":"Black","whiteToMove":"White to move","blackToMove":"Black to move",
    "yourTurn":"Your turn","waiting":"Waiting","computer":"Computer","thinking":"Thinking...",
    "undo":"Undo","redo":"Redo","resign":"Resign","draw":"Draw","newGame":"New Game","flip":"Flip board",
    "copyPGN":"Copy PGN","downloadPGN":"Download PGN","settings":"Settings","theme":"Theme",
    "importFEN":"Import FEN","exportFEN":"Export FEN","sound":"Sound",
    "history":"Move History","statusCheck":"Check!","statusProtect":"{color} must protect the king",
    "checkmateWin":"{color} Wins — Checkmate!","stalemate":"Stalemate — Draw","gameOver":"Game Over",
    "whiteWins":"White Wins","blackWins":"Black Wins","drawTitle":"Draw",
    "msgCheckmate":"Checkmate!","msgTimeout":"Time out!","msgStalemate":"Stalemate — no legal moves.",
    "msgInsufficient":"Insufficient material to checkmate.","msgDraw":"The game is a draw.",
    "promotionTitle":"Choose Promotion","promoteTo":"Promote to {type}",
    "confirmResign":"Are you sure you want to resign?","confirmDraw":"Offer / accept a draw?",
    "confirmNewGame":"A game is in progress. Start a new game?",
    "undoEmpty":"No move to undo","redoEmpty":"No move to redo",
    "undoOk":"Undo successful","redoOk":"Redo successful",
    "pgnCopied":"PGN copied!","pgnCopyFail":"Failed to copy PGN","pgnDownloadFail":"Failed to download PGN","pgnEmpty":"No moves yet",
    "fenCopied":"FEN copied!","fenCopyFail":"Failed to copy FEN","fenInvalid":"Invalid FEN format","fenLoaded":"FEN loaded successfully",
    "fenPrompt":"Enter FEN string:","clipboardUnsupported":"Clipboard not supported",
    "themeDark":"Dark Mode","themeLight":"Light Mode","soundOn":"Sound On","soundOff":"Sound Off",
    "rematch":"Rematch","closeBtn":"Close",
    "ariaFlip":"Flip board","ariaUndo":"Undo last move","ariaRedo":"Redo move",
    "ariaResign":"Resign","ariaDraw":"Offer draw","ariaNewGame":"Start new game",
    "ariaCopyPGN":"Copy PGN","ariaDownloadPGN":"Download PGN","ariaSettings":"Open settings",
    "ariaTheme":"Switch theme","ariaImportFEN":"Import FEN","ariaExportFEN":"Export FEN","ariaSound":"Toggle sound on or off",
    "ariaBoard":"Chess board","capturedWhite":"Pieces captured by White","capturedBlack":"Pieces captured by Black",
    "ngTitle":"New Game","ngMode":"Game Mode","ngModePvp":"Player vs Player","ngModePvc":"Player vs Computer",
    "ngColor":"Player Color","ngColorWhite":"White","ngColorBlack":"Black","ngColorRandom":"Random",
    "ngDifficulty":"AI Difficulty","ngEasy":"Easy","ngMedium":"Medium","ngHard":"Hard",
    "ngTimer":"Time Control","ngRapid":"10|0 Rapid","ngBlitz53":"5|3 Blitz","ngBlitz32":"3|2 Blitz",
    "ngBullet":"1|0 Bullet","ngNone":"No Timer","ngBoardTheme":"Board Theme","ngStart":"Start",
    "themeClassic":"Classic Brown","themeEmerald":"Emerald","themeMidnight":"Midnight Blue",
    "themeRose":"Rose","themeBW":"Black and White","themeNeon":"Neon Cyberpunk"
  },
  "puzzle": {
    "title":"Chess Puzzles","easy":"Easy","medium":"Medium","hard":"Hard","master":"Master",
    "random":"Random","daily":"Daily Puzzle","hint":"Hint","solution":"Show Solution","retry":"Try Again",
    "reset":"Reset Progress","stats":"Puzzle Statistics","pick":"Pick a difficulty to start.",
    "inProgress":"{color} to move — find the best move ({done}/{total})",
    "hintStatus":"Hint level {level}/{max} — {color} to move ({done}/{total})",
    "wrong":"Wrong move. Try again or view a hint.",
    "solved":"Puzzle solved — correct moves!",
    "available":"{count} puzzles available for {label}",
    "info":"{title} · {difficulty} · rating {rating}{themes}",
    "statsLine":"Solved: {solved} · Mistakes: {mistakes} · Streak: {streak} (best {best}) · Time: {minutes}m{seconds}s",
    "toastSolved":"Puzzle solved! Streak {streak}","toastWrong":"Wrong move — try again",
    "resetConfirm":"Reset all puzzle progress (stats and completed puzzles)?",
    "noPuzzles":"No puzzles for this level",
    "ariaPrev":"Previous puzzle","ariaNext":"Next puzzle","ariaHint":"Move hint",
    "ariaSolution":"Show puzzle solution","ariaRetry":"Retry puzzle","ariaReset":"Reset puzzle progress",
    "ariaBoard":"Puzzle chess board"
  },
  "learning": {
    "title":"Learn Chess","progress":"Progress: {done}/{total} lessons completed","done":"✓ Done",
    "stepsCount":"{count} steps","goal":"Goal: {goal}","stepCounter":"Step {current}/{total}",
    "back":"← All Lessons","prev":"← Previous","next":"Next","repeat":"Repeat Lesson",
    "reset":"Reset Learning Progress","resetConfirm":"Reset all learning progress?",
    "completedToast":"Lesson \"{title}\" completed!","resetToast":"Learning progress reset",
    "levelBeginner":"beginner","levelIntermediate":"intermediate"
  },
  "settings": {
    "title":"Settings","appTheme":"App Theme","themeDark":"Dark","themeLight":"Light","themeSystem":"Follow System",
    "boardTheme":"Board Theme","sound":"Sound Effects","coords":"Board Coordinates","language":"Language",
    "indonesian":"Bahasa Indonesia","english":"English",
    "data":"Data","dataDesc":"All data is stored only on your device (localStorage). Reset cannot be undone.",
    "resetAll":"Reset All Data","resetAllConfirm":"Reset ALL app data (preferences, puzzle progress, lesson progress)?",
    "resetToast":"All data reset — reloading..."
  },
  "about": {
    "title":"About","p1":"is a modern chess application that runs entirely in your browser: no server, no account, no tracking. The chess rules engine, AI, puzzles, and learning material are all computed locally on your device.",
    "f1":"Play — Player vs Player or vs Computer (3 levels), timer, undo/redo, PGN/FEN.",
    "f2":"Puzzles — 14+ engine-validated puzzles with 4 difficulty levels, staged hints, and statistics.",
    "f3":"Learn — 15 lessons from beginner to endgame.",
    "footer":"Made by Haiere and Hajir Studio. License: see LICENSE in the repository.","repo":"GitHub Repository"
  },
  "pieces": {"king":"king","queen":"queen","rook":"rook","bishop":"bishop","knight":"knight","pawn":"pawn","white":"white","black":"black"}
}
json.dump(locales_en, open(base+'/locales/en.json','w'), ensure_ascii=False, indent=2)

# ---------------- build script: JSON -> js/locales.js ----------------
build = r'''/* Regenerates js/locales.js from locales/*.json so translations work
   on file:// (fetch of JSON is blocked there) and without async loading.
   Run after editing any locale file: node tests/build-locales.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = {};
for (const l of ['id', 'en']) {
    out[l] = JSON.parse(readFileSync(join(root, 'locales', l + '.json'), 'utf8'));
}
const js = '/* GENERATED FILE — edit locales/*.json then run: node tests/build-locales.mjs */\n' +
           'window.LOCALES = ' + JSON.stringify(out, null, 2) + ';\n';
writeFileSync(join(root, 'js', 'locales.js'), js);
console.log('js/locales.js regenerated (' + Object.keys(out.id).length + ' namespaces, ' +
            Object.keys(out.en).length + ' namespaces)');
'''
open(base+'/tests/build-locales.mjs','w').write(build)
r = subprocess.run(['node','tests/build-locales.mjs'], cwd=base, capture_output=True, text=True)
print(r.stdout, r.stderr[:300])
r = subprocess.run(['node','--check',base+'/js/i18n.js'], capture_output=True, text=True)
print('i18n.js:', 'OK' if r.returncode==0 else r.stderr[:200])

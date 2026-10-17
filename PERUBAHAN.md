# Changelog — Unified Design System v7

Ringkasan perubahan untuk membuat aplikasi **bagus dan konsisten**.

## 1. CSS & HTML

- **`style.css` ditulis ulang** sebagai satu design system (±23 KB):
  - Satu set token: `--bg`, `--surface`, `--accent`, plus skala
    `--space-*`, `--radius-*`, `--shadow-*`, `--t-fast` / `--t-base`.
  - Alias lama dijaga agar JS bridge tidak rusak: `--text2`, `--surface2`,
    `--radius2/3`, `--text-muted`, `--focus`, `--board-light/dark`,
    dan seluruh `--app-*` (sebelumnya inline di index.html).
- **`index.html` dibersihkan** (33.824 → 21.727 bytes):
  - Blok inline `<style>` (±12 KB) dihapus.
  - Link `style.ext.css` dibuang — tersisa satu stylesheet.
- **`style.ext.css` dihapus** (isinya yang relevan sudah digabung:
  feedback puzzle, lesson card, shake, language switcher, settings grid).
- **Folder `css/` dihapus** — tidak pernah di-load siapa pun
  (variables/base/components/layout/pages adalah sistem lama mati).

### Perbaikan visual
- Tombol `.btn-row` (Permainan Baru, Petunjuk, dll.) kini distyle
  konsisten dengan `.btn` — sebelumnya tampil polos tanpa style.
- Sidebar nav: item aktif punya pill accent + indikator garis kiri.
- Bottom-nav mobile kini benar-benar tampil & punya state aktif.
- Animasi halaman fade-slide; header & bottom-nav backdrop blur.
- Focus ring `:focus-visible` seragam 2px accent di semua kontrol.
- Scrollbar custom, `:active` scale(.97) pada tombol, hover lift
  lesson-card, `::selection` accent.
- `100dvh` menggantikan `100vh`; `prefers-reduced-motion` dihormati.

## 2. JavaScript

- **`js/main.js`**: guard anti-duplicate diperbaiki — `boot()` sekarang
  dipanggil *di dalam* guard, jadi double-load benar-benar dicegah
  (sebelumnya flag diset tapi boot tetap jalan dua kali).
- **`js/bridge/eror-tracer.js` → `error-tracer.js`** (typo; tidak
  di-import siapa pun, aman).

## 3. Build & i18n

- **`scripts/build.mjs`**: tidak lagi menyalin `style.ext.css` ke dist.
- **`locales/en.json` & `locales/id.json`**: +48 key yang dipanggil via
  `t()` di JS tapi tidak pernah ada di JSON — bug tersembunyi karena
  test hanya menampilkan 8 kegagalan pertama:
  - `pieces.*` (white/black/king/queen/rook/bishop/knight/pawn)
  - `game.*`: statusCheck, statusProtect, thinking, waiting, promoteTo,
    drawTitle, msgStalemate, msgInsufficient, msgDraw, msgCheckmate,
    msgTimeout, confirmNewGame, confirmResign, confirmDraw, rematch,
    closeBtn, fenCopied/fenCopyFail/fenInvalid/fenLoaded/fenPrompt,
    pgnCopied/pgnCopyFail/pgnDownloadFail/pgnEmpty,
    undoEmpty/undoOk, redoEmpty/redoOk,
    soundOn/soundOff, themeDark/themeLight, clipboardUnsupported
  - `learning.*`: completedToast, done, goal, resetToast,
    stepCounter, stepsCount
  - `puzzle.*`: available, hintStatus, info, pick, statsLine,
    toastSolved, toastWrong, wrong
  - `settings.resetToast`
- Placeholder disamakan persis dengan pemakaian di JS
  (`{color}`, `{type}`, `{title}`, `{current}/{total}`, `{count}`,
  `{level}/{max}/{done}/{total}`, `{solved}/{mistakes}/{streak}/{best}`,
  `{title}/{difficulty}/{rating}/{themes}`, `{count}/{label}`,
  `{goal}`, `{streak}`).
- **`js/locales.js`** diregenerasi via `tests/build-locales.mjs`.

## 4. Hasil test

| Tahap | Lulus | Gagal |
|---|---|---|
| Setelah cleanup CSS/JS | 216 | 9 (key i18n missing) |
| Setelah +9 key pertama | 224 | 1 (daftar terpotong) |
| Setelah +39 key sisanya | **225** | **0 — ALL TESTS PASSED** |

## 5. Cara pakai

- Web: buka `index.html` langsung, atau `npm run build` untuk Capacitor.
- Test: `node tests/build-locales.mjs && node tests/run.mjs`

---

# QA Report — Final (uji nyata Chromium headless, 7 viewport)

## Status: 225/225 unit test PASS, 0 console error, build dist OK

### Terverifikasi via browser
Layout 7 viewport (320x568 s/d 1920x1080): papan persegi (rasio 1.000), 64 petak,
tanpa horizontal overflow. Console bersih. Langkah legal/ilegal, klik-dobel, undo,
sinkronisasi giliran, flip, checkmate (Fool's Mate), castling (O-O), en passant
(exd6 e.p. — bidak korban terhapus), promosi engine (a8=Q), tema tersimpan setelah
refresh (localStorage chess:theme), 15 kartu pembelajaran, halaman puzzle aktif,
touch tap, role=grid + tabindex papan, aria-label lengkap, ikon 100% SVG.

### Bug diperbaiki saat QA
1. js/main.js — TDZ kritis: boot() dipanggil sebelum const BRIDGE_IMPORTS;
   aplikasi gagal boot total di semua viewport. Dipindah ke akhir file.
2. js/game.js — status tidak mirror ke #game-status (setelah skakmat tetap
   "Your Turn") -> kini disalin dari gameStatusText.
3. js/game.js — riwayat hanya ke div legacy #moveHistory; <ol id="move-history">
   di HTML asli selalu kosong -> kini di-mirror sebagai <li class="move-row">.
4. js/bridge/visual-polish.js — watchdog setInterval 2 detik tanpa batas
   -> dibatasi 5x lalu clearInterval (anti memory/CPU leak).

### Dikenali (bukan bug)
- Modal New Game tertahan confirm(): artefak auto-dismiss dialog headless;
  alur pengguna asli normal.
- Settings berupa halaman route (#settings), bukan modal — by design.
- Posisi papan setelah refresh tidak dipulihkan (by design; hanya preferensi
  yang disimpan).

### File berubah seluruhnya
style.css (rewritten), index.html (bersih), js/main.js, js/game.js,
js/bridge/game-bridge.js, js/bridge/visual-polish.js,
js/bridge/eror-tracer.js -> error-tracer.js, locales/en.json, locales/id.json,
scripts/build.mjs, PERUBAHAN.md. Terhapus: style.ext.css, folder css/.

---

# Android / Capacitor (tahap platform)

- npm install: @capacitor/core/android/cli/status-bar 6.2.x + @capacitor/app 6.0.2
  (satu-satunya dependency baru — diperlukan untuk hardware back button).
- resources/icon.png (1024) & splash.png (2732): kuda catur brand, dibuat PIL.
- npx cap add android: platform Android 6 lengkap (MainActivity, capacitor plugin
  status-bar terdaftar otomatis).
- Icon: mipmap mdpi→xxxhdpi (ic_launcher, ic_launcher_round, ic_launcher_foreground
  66% safe-zone) + ic_launcher_background #0F1117 => adaptive icon siap.
- Splash: drawable/{port,land}-{mdpi..xxxhdpi}/splash.png + drawable/splash.png.
- AndroidManifest: android:screenOrientation="portrait" pada MainActivity.
- js/main.js: initAndroidIntegration() — StatusBar overlay (konten tak tertutup
  status bar berkat env(safe-area-inset-*)) + backButton (history.back / exitApp),
  aman di browser (try/catch, dynamic import).
- npx cap sync android: SUKSES (web assets masuk android/app/src/main/assets/public).
- js/storage.js: sudah punya guard penuh (probe + fallback in-memory) sejak awal.
- Verifikasi: 225/225 test PASS, npm run build OK, browser smoke 64 petak 0 error.
- APK debug/release: ./gradlew assembleDebug/assembleRelease (perlu Android SDK + JDK17).

---

# Fitur: 50 Puzzle + 50 Lesson + Skeleton (tahap konten)

- 50 puzzle tervalidasi engine (Easy 15/Medium 15/Hard 10/Expert 10),
  dihasilkan scripts/gen-puzzles.js (forced-mate solver, dedupe FEN).
  master -> expert; key i18n puzzle.medium/expert.
- 50 lesson bilingual (EN primer + {en,id}), js/lessons-data.js;
  js/lessons.js renderer pakai LANG()/pick().
- Skeleton screen (shimmer) + empty/error/retry state (AppSkeleton util)
  untuk lesson & puzzle; i18n missing-key collector di js/i18n.js
  (window.__I18N_MISSING + console.warn saat localhost).
- Cleanup: js/data/puzzles.js, js/data/Lesson.js, js/LanguageSwitcher.js
  dihapus; entri loader mati dibersihkan dari js/main.js.
- npm run build OK; cap sync android OK.
- Test: 413 PASSED / 0 FAILED. Lint: 32/32 file JS OK.

---

# Update Besar: Web Murni + Konten Lengkap + Skeleton

- Capacitor/Android dihapus total: folder android/, capacitor.config.json,
  resources/, semua @capacitor/* deps & script. dependencies = {} (vanilla JS,
  tanpa npm runtime). npm run build OK sebagai website biasa.
- Router hash rapi: #/game #/puzzle #/puzzle/qlv01..50 #/learning
  #/learning/lesson-01..50 #/settings (+ alias lama & query ?id=).
- 50 puzzle (qlv01-50, 4 tingkat) tervalidasi engine + generator scripts/gen-puzzles.js.
- 50 lesson bilingual EN primer + ID, 4 level (beginner/elementary/intermediate/
  advanced), contoh FEN tiap langkah, exercise interaktif board 8x8
  (42 mate-in-1 tervalidasi + 8 latihan pembukaan), TANPA kuis.
- Skeleton shimmer (CSS animation, timeout 8 dtk -> error state + retry),
  empty/error state di puzzle & learning & sidebar.
- Layout: desktop dual-screen 28%/72%, mobile bottom-nav + safe-area, tablet adaptif.
- Sidebar progress: lesson progressCount + puzzle solvedCount.
- i18n: key terstruktur, default id, html lang sinkron, missing-key collector,
  fallback tak mentah, bahasa+tema persist di localStorage (guard anti-rusak).
- selectPuzzle idempotent; puzzle prev/next sinkron route; markDone lesson.
- Lint 32/32 OK | Test 563/0 | Build OK.

---

# Hotfix: Splash Skeleton + Regresi Papan

- Splash loading diganti spinner -> skeleton shimmer (blok papan aspect-ratio 1/1
  + garis teks, animasi CSS, prefers-reduced-motion).
- Fix regresi: sisa panggilan initAndroidIntegration() (Capacitor) yang crash
  boot -> halaman tidak aktif, papan 0x0 invisible.
- Fix loader: entri ./data/Lesson.js (file sudah dihapus) -> 404.
- Terverifikasi browser: skeleton tampil->hilang, papan persegi 64 petak di
  320x568/768x1024/1366x768/1920x1080, console bersih, test 563/0, build OK.

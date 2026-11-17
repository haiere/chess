"""
Browser smoke test (Playwright, Python). Jalankan setelah server statis aktif:
  python3 -m http.server 8000   (di folder proyek)
  BASE=http://localhost:8000 python3 tests/e2e/smoke.py
Memeriksa: error halaman, papan puzzle/learn/game tampil, langkah puzzle benar,
tidak ada teks Indonesia saat English, dan tidak ada horizontal overflow di 320px.
"""
import os, sys
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE', 'http://localhost:8000')
ID_WORDS = ['Belajar', 'Pengaturan', 'Tentang', 'Giliran', 'Lewati', 'Salin FEN', 'Sebelumnya', 'Berikutnya', 'Coba Lagi', 'Petunjuk', 'Tandai', 'Gagal', 'Memuat']
failures = []

def check(cond, msg):
    print(('  OK   ' if cond else '  FAIL '), msg)
    if not cond: failures.append(msg)

def sq_sel(container, sq):
    return f"#{container} [data-square='{sq}']"

def piece(pg, sq, container='puzzle-board-container'):
    return pg.evaluate(f"(document.querySelector(\"#{container} [data-square='{sq}'] .piece\")||{{}}).className || null")

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={'width': 1280, 'height': 860})
    pg = ctx.new_page()
    errors = []
    pg.on('pageerror', lambda e: errors.append(str(e)))

    print('Puzzle (qlv01, mate-in-1 h1h8)')
    pg.goto(BASE + '/#/puzzle/qlv01'); pg.wait_for_timeout(1200)
    check(pg.evaluate("document.querySelectorAll('[data-square]').length") == 64, 'papan puzzle 64 kotak')
    pg.click(sq_sel('puzzle-board-container', 'h1')); pg.wait_for_timeout(120); pg.click(sq_sel('puzzle-board-container', 'h8')); pg.wait_for_timeout(500)
    check(pg.evaluate("document.getElementById('puzzle-status').textContent") == 'Solved!', 'langkah benar → Solved!')

    print('Puzzle multi-langkah (qlv16) dengan langkah salah dan balasan lawan')
    pg.goto(BASE + '/#/puzzle/qlv16'); pg.wait_for_timeout(1000)
    P='puzzle-board-container'
    pg.click(sq_sel(P,'e1')); pg.wait_for_timeout(100); pg.click(sq_sel(P,'e2')); pg.wait_for_timeout(300)
    check(pg.evaluate("document.getElementById('puzzle-status').dataset.state") == 'wrong', 'langkah salah terdeteksi')
    pg.click(sq_sel(P,'e6')); pg.wait_for_timeout(100); pg.click(sq_sel(P,'e8')); pg.wait_for_timeout(900)
    check(piece(pg, 'a8', P) is None and 'piece-bR' in (piece(pg, 'e8', P) or ''), 'lawan membalas otomatis (a8 → e8)')
    pg.click(sq_sel(P,'e1')); pg.wait_for_timeout(100); pg.click(sq_sel(P,'e8')); pg.wait_for_timeout(700)
    check(pg.evaluate("document.getElementById('puzzle-status').dataset.state") == 'solved', 'puzzle selesai setelah seluruh solusi')

    print('Learn (lesson-01, latihan)')
    pg.goto(BASE + '/#/learning/lesson-01'); pg.wait_for_timeout(1000)
    check(pg.evaluate("document.querySelectorAll('#lesson-board-container [data-square]').length") == 64, 'papan learn 64 kotak')
    for _ in range(3): pg.click('#lesson-next'); pg.wait_for_timeout(100)
    L='lesson-board-container'
    pg.click(sq_sel(L,'h1')); pg.wait_for_timeout(100); pg.click(sq_sel(L,'h8')); pg.wait_for_timeout(200)
    check(pg.evaluate("document.getElementById('lesson-status').textContent") == 'Correct!', 'latihan learn: jawaban benar diterima')

    print('Drag & drop (puzzle qlv01)')
    pg.goto(BASE + '/#/puzzle/qlv01'); pg.wait_for_timeout(1000)
    def centre(scope, sq):
        return pg.evaluate("(()=>{const e=document.querySelector('#%s [data-square=\"%s\"]');const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]})()" % (scope, sq))
    x1,y1 = centre('puzzle-board-container','h1'); x2,y2 = centre('puzzle-board-container','h8')
    pg.mouse.move(x1,y1); pg.mouse.down()
    for i in range(1,9): pg.mouse.move(x1+(x2-x1)*i/8, y1+(y2-y1)*i/8); pg.wait_for_timeout(15)
    pg.mouse.up(); pg.wait_for_timeout(500)
    check(pg.evaluate("document.getElementById('puzzle-status').textContent") == 'Solved!', 'drag h1→h8 menyelesaikan puzzle')

    print('Lawan komputer (worker AI)')
    pg.goto(BASE + '/#/game'); pg.wait_for_timeout(1000)
    pg.click('#btn-new-game'); pg.wait_for_timeout(400)
    pg.select_option('#ngMode-visible', 'pvc'); pg.select_option('#ngDifficulty-visible', 'hard'); pg.wait_for_timeout(200)
    pg.get_by_role('button', name='Start', exact=True).click(); pg.wait_for_timeout(700)
    pg.click("#board [data-square='e2']"); pg.wait_for_timeout(120); pg.click("#board [data-square='e4']")
    pg.wait_for_timeout(3000)
    check(pg.evaluate("document.querySelector('#game-status, .status-text, [data-status]')?.textContent") == 'White to move', 'komputer membalas, giliran kembali ke putih')

    print('Bahasa: English default, tidak ada teks Indonesia')
    ctx2 = browser.new_context(viewport={'width': 1280, 'height': 860}); pg2 = ctx2.new_page()
    pg2.goto(BASE + '/#/'); pg2.wait_for_timeout(800)
    check(pg2.evaluate("document.documentElement.lang") == 'en', 'html lang=en secara default')
    for route in ['#/', '#/game', '#/puzzle', '#/learning', '#/settings']:
        pg2.goto(BASE + '/' + route); pg2.wait_for_timeout(500)
        txt = pg2.evaluate("document.body.innerText")
        leaks = [w for w in ID_WORDS if w in txt]
        check(not leaks, f'{route} tanpa teks Indonesia' + (f' (bocor: {leaks})' if leaks else ''))
    ctx2.close()

    print('Responsif: tidak ada horizontal overflow di 320px')
    ctx3 = browser.new_context(viewport={'width': 320, 'height': 640}); pg3 = ctx3.new_page()
    for route in ['#/game', '#/puzzle/qlv01', '#/learning/lesson-01']:
        pg3.goto(BASE + '/' + route); pg3.wait_for_timeout(700)
        sw = pg3.evaluate("document.documentElement.scrollWidth"); cw = pg3.evaluate("document.documentElement.clientWidth")
        check(sw <= cw, f'{route} scrollWidth {sw} ≤ clientWidth {cw}')
    ctx3.close()

    print('Error halaman:')
    check(not errors, 'tidak ada uncaught exception' + (f' → {errors[:2]}' if errors else ''))
    browser.close()

print('\nRESULT:', 'PASS' if not failures else f'FAIL ({len(failures)})')
sys.exit(1 if failures else 0)

audio_js = r'''/* ============================================================
   SFX — Web Audio oscillator sounds, no audio files required.
   Exposed as window.SFX. Audio never plays before a user gesture.
   ============================================================ */
(function () {
    'use strict';

    const VOLUME = 0.4;
    let ctx = null;
    let enabled = true;

    function getCtx() {
        try {
            if (!ctx) {
                const Ctor = window.AudioContext || window.webkitAudioContext;
                if (!Ctor) return null;
                ctx = new Ctor();
            }
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});
            return ctx;
        } catch (err) {
            return null;
        }
    }

    function tone(freq, duration, type, vol) {
        if (!enabled) return;
        try {
            const ac = getCtx();
            if (!ac) return;
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, ac.currentTime);
            gain.gain.setValueAtTime((vol || 0.3) * VOLUME, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.start(ac.currentTime);
            osc.stop(ac.currentTime + duration);
        } catch (err) { /* silent */ }
    }

    const SFX = {
        setEnabled(value) { enabled = !!value; },
        isEnabled() { return enabled; },

        play(type) {
            switch (type) {
                case 'move':      tone(600, 0.08, 'sine', 0.2); break;
                case 'capture':   tone(200, 0.15, 'triangle', 0.35); break;
                case 'check':
                    tone(800, 0.15, 'square', 0.35);
                    setTimeout(() => tone(1000, 0.2, 'square', 0.35), 150);
                    break;
                case 'castle':
                    tone(500, 0.1, 'sine', 0.25);
                    setTimeout(() => tone(700, 0.1, 'sine', 0.25), 100);
                    break;
                case 'promote':   tone(900, 0.2, 'sine', 0.3); break;
                case 'game-over':
                    tone(400, 0.3, 'triangle', 0.4);
                    setTimeout(() => tone(300, 0.3, 'triangle', 0.4), 300);
                    setTimeout(() => tone(200, 0.5, 'triangle', 0.4), 600);
                    break;
                case 'success':
                    tone(660, 0.12, 'sine', 0.3);
                    setTimeout(() => tone(880, 0.18, 'sine', 0.3), 120);
                    break;
                case 'error':     tone(180, 0.2, 'sawtooth', 0.25); break;
            }
        }
    };

    window.SFX = SFX;
})();
'''
open(base+'/js/audio.js','w').write(audio_js)

# Also shared SVG piece artwork module (needed by board-view, game, puzzle, lessons)
pieces_js = r'''/* ============================================================
   ChessPieces — inline SVG chess piece artwork as data URIs.
   Standard Cburnett-style shapes, embedded to stay dependency
   and network free. Exposed as window.ChessPieces.
   ============================================================ */
(function () {
    'use strict';

    const wrap = (inner) => 'data:image/svg+xml,' + encodeURIComponent(inner);

    const SVG = {
        white: {
            king: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#fff"/><path d="M20 8h5"/><circle cx="22.5" cy="33.5" r="1.5" fill="#000"/><circle cx="20.5" cy="30.5" r="1.5" fill="#000"/><circle cx="24.5" cy="30.5" r="1.5" fill="#000"/></g></svg>'),
            queen: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm13 4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" fill="#fff"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 12l-3.5 6.5-5.5-7-5.5 7L13 12l-7.5 1.5L9 26z" fill="#fff"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#fff"/><circle cx="6" cy="12" r="1.5" fill="#000"/><circle cx="20.5" cy="7" r="1.5" fill="#000"/><circle cx="35" cy="12" r="1.5" fill="#000"/></g></svg>'),
            rook: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3.5-7h18V10h-18v22zm3-17.5h12" fill="#fff"/><path d="M15 10V3h15v7M15 10h-4.5v6.5M30 10h4.5v6.5" fill="#fff"/></g></svg>'),
            bishop: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g></g></svg>'),
            knight: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 15H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/></g></svg>'),
            pawn: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 13 19 13 23.5v3h19v-3c0-4.5-4.33-7-6.28-8.12.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>')
        },
        black: {
            king: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#000"/><path d="M20 8h5"/><circle cx="22.5" cy="33.5" r="1.5" fill="#fff"/><circle cx="20.5" cy="30.5" r="1.5" fill="#fff"/><circle cx="24.5" cy="30.5" r="1.5" fill="#fff"/></g></svg>'),
            queen: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm13 4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" fill="#000"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 12l-3.5 6.5-5.5-7-5.5 7L13 12l-7.5 1.5L9 26z" fill="#000"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000"/><circle cx="6" cy="12" r="1.5" fill="#fff"/><circle cx="20.5" cy="7" r="1.5" fill="#fff"/><circle cx="35" cy="12" r="1.5" fill="#fff"/></g></svg>'),
            rook: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3.5-7h18V10h-18v22zm3-17.5h12" fill="#000"/><path d="M15 10V3h15v7M15 10h-4.5v6.5M30 10h4.5v6.5" fill="#000"/></g></svg>'),
            bishop: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g></g></svg>'),
            knight: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 15H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/></g></svg>'),
            pawn: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 13 19 13 23.5v3h19v-3c0-4.5-4.33-7-6.28-8.12.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>')
        }
    };

    window.ChessPieces = SVG;
})();
'''
open(base+'/js/pieces.js','w').write(audio_js.replace(audio_js, pieces_js))
print('audio.js + pieces.js written') 

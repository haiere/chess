/* ============================================================
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

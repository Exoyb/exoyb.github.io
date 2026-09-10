// Exoyb power gate lighting — visually dark while offline, then wakes like a PC chassis.
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const gate = document.querySelector('.power-gate');
        const button = gate?.querySelector('.power-button');
        const bootContent = document.querySelector('#bootScreen .boot-content');
        if (!gate || !button) return;

        const style = document.createElement('style');
        style.id = 'exoyb-power-lighting-styles';
        style.textContent = `
            .power-gate {
                background: #050505 !important;
                transition: background .42s ease, filter .42s ease;
            }
            .power-gate::before {
                opacity: .035 !important;
                transition: opacity .45s ease;
            }
            .power-gate .power-panel {
                border-color: rgba(110,118,114,.18) !important;
                background: rgba(8,8,8,.98) !important;
                box-shadow: inset 0 0 34px rgba(0,0,0,.86) !important;
                transition: border-color .36s ease, box-shadow .46s ease, background .36s ease, filter .36s ease;
            }
            .power-gate .power-kicker,
            .power-gate .power-title,
            .power-gate .power-label,
            .power-gate .power-hint {
                color: #454b48 !important;
                text-shadow: none !important;
                transition: color .28s ease, text-shadow .35s ease, opacity .28s ease;
            }
            .power-gate .power-button {
                border-color: rgba(105,112,109,.34) !important;
                background: #090a09 !important;
                color: #555c58 !important;
                box-shadow: inset 0 0 18px rgba(0,0,0,.86) !important;
                transition: transform .14s ease, color .24s ease, border-color .24s ease, box-shadow .34s ease, background .24s ease;
            }
            .power-gate .power-button:hover,
            .power-gate .power-button:focus-visible {
                color: #747d78 !important;
                border-color: rgba(145,154,149,.48) !important;
                box-shadow: 0 0 10px rgba(255,255,255,.025), inset 0 0 18px rgba(0,0,0,.72) !important;
            }
            .power-gate .power-icon { text-shadow: none !important; }

            .power-gate.system-powered {
                background:
                    radial-gradient(circle at 50% 42%, rgba(0,255,140,.075), transparent 34rem),
                    #090a0a !important;
            }
            .power-gate.system-powered::before { opacity: .16 !important; }
            .power-gate.system-powered .power-panel {
                border-color: rgba(0,255,140,.42) !important;
                background: rgba(13,15,14,.96) !important;
                box-shadow: 0 0 48px rgba(0,255,140,.11), inset 0 0 30px rgba(0,0,0,.45) !important;
                animation: chassisWake .52s ease both !important;
            }
            .power-gate.system-powered .power-kicker {
                color: #78847d !important;
                animation: indicatorFlicker .46s steps(2,end) both;
            }
            .power-gate.system-powered .power-title {
                color: #dce7e1 !important;
                text-shadow: 0 0 12px rgba(0,255,140,.08) !important;
                animation: indicatorFlicker .38s .06s steps(2,end) both;
            }
            .power-gate.system-powered .power-label {
                color: var(--green, #00ff8c) !important;
                text-shadow: 0 0 10px rgba(0,255,140,.42) !important;
                animation: indicatorFlicker .34s .11s steps(2,end) both;
            }
            .power-gate.system-powered .power-hint {
                color: #68736d !important;
                animation: indicatorFlicker .30s .16s steps(2,end) both;
            }
            .power-gate.system-powered .power-button {
                color: var(--green, #00ff8c) !important;
                border-color: rgba(0,255,140,.88) !important;
                background: #0c100e !important;
                box-shadow: 0 0 0 8px rgba(0,255,140,.045), 0 0 38px rgba(0,255,140,.30), inset 0 0 22px rgba(0,255,140,.08) !important;
                animation: powerLedSnap .42s ease both;
            }
            .power-gate.system-powered .power-icon {
                text-shadow: 0 0 16px rgba(0,255,140,.72) !important;
            }

            @keyframes powerLedSnap {
                0% { filter: brightness(.35); }
                22% { filter: brightness(2.35); }
                38% { filter: brightness(.75); }
                62% { filter: brightness(1.65); }
                100% { filter: brightness(1); }
            }
            @keyframes chassisWake {
                0% { filter: brightness(.45); transform: scale(.998); }
                24% { filter: brightness(1.45); transform: scale(1.004); }
                42% { filter: brightness(.82); }
                100% { filter: brightness(1); transform: scale(1); }
            }
            @keyframes indicatorFlicker {
                0% { opacity: .18; }
                30% { opacity: 1; }
                52% { opacity: .38; }
                72%, 100% { opacity: 1; }
            }

            @media (prefers-reduced-motion: reduce) {
                .power-gate.system-powered .power-panel,
                .power-gate.system-powered .power-button,
                .power-gate.system-powered .power-kicker,
                .power-gate.system-powered .power-title,
                .power-gate.system-powered .power-label,
                .power-gate.system-powered .power-hint { animation: none !important; }
            }
        `;
        document.head.appendChild(style);

        button.addEventListener('click', () => {
            // The POST screen is kept invisible by critical inline CSS until the
            // power gesture, preventing a one-frame green flash during page load.
            if (bootContent) bootContent.style.visibility = 'visible';
            gate.classList.add('system-powered');
        }, { once: true, capture: true });
    });
})();

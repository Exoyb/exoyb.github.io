// Exoyb power gate lighting — visually dark while waiting for the user, then wakes like a PC chassis.
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const gate = document.querySelector('.power-gate');
        const button = gate?.querySelector('.power-button');
        const title = gate?.querySelector('.power-title');
        const bootContent = document.querySelector('#bootScreen .boot-content');
        if (!gate || !button) return;

        // Make the initial state read as an intentional hardware prompt rather than an error state.
        if (title) title.textContent = 'PRESS TO POWER ON';

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
            .power-gate .power-label,
            .power-gate .power-hint {
                color: #454b48 !important;
                text-shadow: none !important;
                transition: color .28s ease, text-shadow .35s ease, opacity .28s ease;
            }
            .power-gate .power-title {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: .62rem;
                color: #c6cfca !important;
                text-shadow: none !important;
                transition: color .28s ease, text-shadow .35s ease, opacity .28s ease;
            }
            .power-gate .power-title::before {
                content: '';
                display: inline-block;
                width: 9px;
                height: 9px;
                flex: 0 0 9px;
                border-radius: 50%;
                background: #ef4545;
                box-shadow: 0 0 5px rgba(239,69,69,.7), 0 0 12px rgba(239,69,69,.28);
                animation: standbyLedBlink 1.05s steps(1,end) infinite;
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

            /* First stage after the click: the board has power, but is still stabilising. */
            .power-gate.system-starting {
                background:
                    radial-gradient(circle at 50% 42%, rgba(0,255,140,.035), transparent 34rem),
                    #070908 !important;
            }
            .power-gate.system-starting::before { opacity: .09 !important; }
            .power-gate.system-starting .power-title::before {
                background: var(--green, #00ff8c);
                box-shadow: 0 0 7px rgba(0,255,140,.9), 0 0 16px rgba(0,255,140,.45);
                animation: startupLedRamp 1.55s linear both;
            }
            .power-gate.system-starting .power-button {
                color: var(--green, #00ff8c) !important;
                border-color: rgba(0,255,140,.7) !important;
                background: #0b0f0d !important;
                animation: startupPowerFlicker 1.55s linear both;
            }
            .power-gate.system-starting .power-icon {
                text-shadow: 0 0 14px rgba(0,255,140,.58) !important;
            }
            .power-gate.system-starting .power-panel {
                animation: startupChassisFlicker 1.55s linear both !important;
            }
            .power-gate.system-starting .power-panel::after {
                content: '';
                position: absolute;
                inset: -1px;
                z-index: 2;
                pointer-events: none;
                border: 1px solid rgba(0,255,140,.72);
                border-radius: inherit;
                box-shadow: 0 0 16px rgba(0,255,140,.12);
                animation: startupPanelBorderFlicker 1.55s linear both;
            }

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
                animation: chassisWake .22s ease both !important;
            }
            .power-gate.system-powered .power-kicker {
                color: #78847d !important;
            }
            .power-gate.system-powered .power-title {
                color: #dce7e1 !important;
                text-shadow: 0 0 12px rgba(0,255,140,.08) !important;
            }
            .power-gate.system-powered .power-title::before {
                background: var(--green, #00ff8c);
                box-shadow: 0 0 8px rgba(0,255,140,.95), 0 0 18px rgba(0,255,140,.5);
                opacity: 1;
                filter: brightness(1.15);
                animation: none;
            }
            .power-gate.system-powered .power-label {
                color: var(--green, #00ff8c) !important;
                text-shadow: 0 0 10px rgba(0,255,140,.42) !important;
            }
            .power-gate.system-powered .power-hint {
                color: #68736d !important;
            }
            .power-gate.system-powered .power-button {
                color: var(--green, #00ff8c) !important;
                border-color: rgba(0,255,140,.88) !important;
                background: #0c100e !important;
                box-shadow: 0 0 0 8px rgba(0,255,140,.045), 0 0 38px rgba(0,255,140,.30), inset 0 0 22px rgba(0,255,140,.08) !important;
                animation: none;
            }
            .power-gate.system-powered .power-icon {
                text-shadow: 0 0 16px rgba(0,255,140,.72) !important;
            }

            @keyframes standbyLedBlink {
                0%, 44% { opacity: 1; filter: brightness(1.08); }
                45%, 100% { opacity: .2; filter: brightness(.45); }
            }
            /* Long pulses at first, then increasingly rapid flashes before locking solid. */
            @keyframes startupLedRamp {
                0%, 13% { opacity: 1; filter: brightness(1.15); }
                14%, 29% { opacity: .12; filter: brightness(.35); }
                30%, 43% { opacity: 1; filter: brightness(1.22); }
                44%, 54% { opacity: .16; filter: brightness(.42); }
                55%, 64% { opacity: 1; filter: brightness(1.3); }
                65%, 72% { opacity: .18; filter: brightness(.45); }
                73%, 79% { opacity: 1; filter: brightness(1.36); }
                80%, 84% { opacity: .2; filter: brightness(.5); }
                85%, 88% { opacity: 1; filter: brightness(1.42); }
                89%, 91% { opacity: .22; filter: brightness(.52); }
                92%, 94% { opacity: 1; filter: brightness(1.48); }
                95%, 96% { opacity: .25; filter: brightness(.58); }
                97%, 100% { opacity: 1; filter: brightness(1.15); }
            }
            @keyframes startupPowerFlicker {
                0%, 13%, 30%, 43%, 55%, 64%, 73%, 79%, 85%, 88%, 92%, 94%, 97%, 100% {
                    box-shadow: 0 0 0 7px rgba(0,255,140,.035), 0 0 32px rgba(0,255,140,.25), inset 0 0 21px rgba(0,255,140,.07);
                    filter: brightness(1.08);
                }
                14%, 29%, 44%, 54%, 65%, 72%, 80%, 84%, 89%, 91%, 95%, 96% {
                    box-shadow: 0 0 0 4px rgba(0,255,140,.012), 0 0 8px rgba(0,255,140,.08), inset 0 0 18px rgba(0,0,0,.68);
                    filter: brightness(.62);
                }
            }
            @keyframes startupPanelBorderFlicker {
                0%, 13%, 30%, 43%, 55%, 64%, 73%, 79%, 85%, 88%, 92%, 94%, 97%, 100% {
                    opacity: 1;
                    filter: brightness(1.08);
                }
                14%, 29%, 44%, 54%, 65%, 72%, 80%, 84%, 89%, 91%, 95%, 96% {
                    opacity: .08;
                    filter: brightness(.55);
                }
            }
            @keyframes startupChassisFlicker {
                0%, 13%, 30%, 43%, 55%, 64%, 73%, 79%, 85%, 88%, 92%, 94%, 97%, 100% {
                    box-shadow: 0 0 34px rgba(0,255,140,.07), inset 0 0 30px rgba(0,0,0,.52);
                }
                14%, 29%, 44%, 54%, 65%, 72%, 80%, 84%, 89%, 91%, 95%, 96% {
                    box-shadow: inset 0 0 34px rgba(0,0,0,.82);
                }
            }
            @keyframes chassisWake {
                0% { filter: brightness(.82); transform: scale(.999); }
                55% { filter: brightness(1.16); transform: scale(1.002); }
                100% { filter: brightness(1); transform: scale(1); }
            }

            @media (prefers-reduced-motion: reduce) {
                .power-gate .power-title::before,
                .power-gate.system-starting .power-panel,
                .power-gate.system-starting .power-panel::after,
                .power-gate.system-starting .power-button,
                .power-gate.system-starting .power-title::before,
                .power-gate.system-powered .power-panel { animation: none !important; }
            }
        `;
        document.head.appendChild(style);

        button.addEventListener('click', event => {
            // The real click is reserved for the staged power-up. Prevent the boot
            // handler from running until the light has ramped and settled solid green.
            event.preventDefault();
            event.stopImmediatePropagation();

            // Unlock audio from the genuine user gesture before we delay POST.
            try {
                window.ExoybAudio?.unlock?.();
            } catch (_) {
                // Power animation and POST do not depend on sound support.
            }

            if (bootContent) bootContent.style.visibility = 'visible';

            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            gate.classList.add('system-starting');

            const releaseBoot = () => {
                gate.classList.remove('system-starting');
                gate.classList.add('system-powered');

                // Give the solid-green state a readable beat, then hand the same
                // power button to boot-ssh.js. This second click is synthetic by design;
                // Web Audio was already unlocked by the real click above.
                window.setTimeout(() => button.click(), reducedMotion ? 0 : 180);
            };

            if (reducedMotion) {
                releaseBoot();
                return;
            }

            window.setTimeout(releaseBoot, 1550);
        }, { once: true, capture: true });
    });
})();

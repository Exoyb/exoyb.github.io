// Animated ASCII system-fan monitor for the homepage POST/SSH sequence.
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const bootScreen = document.getElementById('bootScreen');
        const bootContent = bootScreen?.querySelector('.boot-content');
        const bootTerminal = bootScreen?.querySelector('.boot-terminal');
        const bootProgress = bootScreen?.querySelector('.boot-progress');
        if (!bootScreen || !bootContent || !bootTerminal) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Keep the fan housing and screw mounts completely static. The central rotor is
        // a rounded text glyph, so it can spin smoothly without turning into a square crop.
        const fanShellArt = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣿⣿⡆⠀⠀⢀⣤⠶⠟⠛⠉⠉⠉⠉⠉⠉⠛⠻⠶⣤⡀⠀⠀⠰⣿⣿⠀⠀
⠀⠀⠀⠁⠀⣠⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⣄⠀⠈⠁⠀⠀
⠀⠀⠀⢀⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡀⠀⠀⠀
⠀⠀⢠⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⠀⠀
⠀⢀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡀⠀
⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀
⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀
⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀
⠀⠈⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⠁⠀
⠀⠀⠘⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠃⠀⠀
⠀⠀⠀⠈⢷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠁⠀⠀⠀
⠀⠀⢀⡀⠀⠙⢦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⠋⠀⢀⡀⠀⠀
⠀⠀⣿⣿⠀⠀⠀⠈⠛⠶⣦⣤⣀⣀⣀⣀⣀⣀⣤⣴⠶⠛⠁⠀⠀⠐⣿⣿⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

        const style = document.createElement('style');
        style.id = 'exoyb-boot-fan-styles';
        style.textContent = `
            .boot-content { position: relative; }
            .boot-fan-monitor {
                position: absolute;
                right: 1.45rem;
                bottom: 1.35rem;
                z-index: 4;
                width: 214px;
                padding: .2rem 0 0 .9rem;
                border-left: 1px dashed rgba(0,255,140,.20);
                opacity: 0;
                transform: translateY(6px);
                transition: opacity .22s linear, transform .28s ease, border-color .22s linear;
                pointer-events: none;
            }
            .boot-fan-monitor.visible {
                opacity: .72;
                transform: translateY(0);
            }
            .boot-fan-monitor.stable {
                border-left-color: rgba(0,255,140,.34);
            }
            .boot-fan-head,
            .boot-fan-foot {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: .55rem;
                color: #71877c;
                font: 600 .58rem/1.15 var(--font-mono, monospace);
                letter-spacing: .075em;
                text-transform: uppercase;
            }
            .boot-fan-head { margin-bottom: .15rem; }
            .boot-fan-foot { margin-top: .1rem; }
            .boot-fan-status,
            .boot-fan-rpm { color: var(--green, #00ff8c); }
            .boot-fan-stage {
                position: relative;
                height: 118px;
                overflow: hidden;
            }
            .boot-fan-shell {
                position: absolute;
                left: 50%;
                top: 50%;
                margin: 0;
                color: #75d49a;
                font-family: "IBM Plex Mono", "Cascadia Mono", "Segoe UI Symbol", monospace;
                font-size: 4.55px;
                font-weight: 500;
                line-height: 1.18;
                white-space: pre;
                user-select: none;
                transform: translate(-50%, -50%);
                filter: drop-shadow(0 0 4px rgba(0,255,140,.14));
            }
            .boot-fan-rotor-wrap {
                position: absolute;
                left: 50%;
                top: 50%;
                width: 48px;
                height: 48px;
                display: grid;
                place-items: center;
                transform: translate(-50%, -50%);
            }
            .boot-fan-rotor {
                display: block;
                color: #8affba;
                font-family: "Segoe UI Symbol", "Noto Sans Symbols", sans-serif;
                font-size: 44px;
                font-weight: 400;
                line-height: 1;
                transform-origin: 50% 50%;
                filter: drop-shadow(0 0 5px rgba(0,255,140,.22));
                will-change: transform;
            }
            .boot-fan-rotor.fan-slow { animation: bootFanRotor 1.55s linear infinite; }
            .boot-fan-rotor.fan-medium { animation: bootFanRotor .88s linear infinite; }
            .boot-fan-rotor.fan-fast { animation: bootFanRotor .48s linear infinite; }
            @keyframes bootFanRotor {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @media (max-width: 1180px) {
                .boot-fan-monitor {
                    right: .9rem;
                    bottom: .9rem;
                    width: 188px;
                }
                .boot-fan-stage { height: 104px; }
                .boot-fan-shell { font-size: 4px; }
                .boot-fan-rotor-wrap { width: 42px; height: 42px; }
                .boot-fan-rotor { font-size: 38px; }
            }
            @media (max-width: 900px) {
                .boot-fan-monitor { display: none; }
            }
            @media (prefers-reduced-motion: reduce) {
                .boot-fan-rotor { animation: none !important; }
                .boot-fan-monitor { transition: none; }
            }
        `;
        document.head.appendChild(style);

        const panel = document.createElement('aside');
        panel.className = 'boot-fan-monitor';
        panel.setAttribute('aria-hidden', 'true');
        panel.innerHTML = `
            <div class="boot-fan-head"><span>SYS_FAN_01</span><span class="boot-fan-status">IDLE</span></div>
            <div class="boot-fan-stage">
                <pre class="boot-fan-shell"></pre>
                <div class="boot-fan-rotor-wrap"><span class="boot-fan-rotor">✣</span></div>
            </div>
            <div class="boot-fan-foot"><span>CHASSIS FAN</span><span>RPM: <span class="boot-fan-rpm">0000</span></span></div>`;
        bootContent.appendChild(panel);

        const shell = panel.querySelector('.boot-fan-shell');
        const rotor = panel.querySelector('.boot-fan-rotor');
        const status = panel.querySelector('.boot-fan-status');
        const rpm = panel.querySelector('.boot-fan-rpm');
        shell.textContent = fanShellArt;

        const setFan = (speed, nextStatus, nextRpm, stable = false) => {
            rotor.classList.remove('fan-slow', 'fan-medium', 'fan-fast');
            if (!reducedMotion && speed) rotor.classList.add(speed);
            status.textContent = nextStatus;
            rpm.textContent = nextRpm;
            panel.classList.toggle('stable', stable);
        };

        let visibleLines = 0;
        let sshSeen = false;

        const syncFromBoot = () => {
            const nowVisible = bootTerminal.querySelectorAll('.boot-line-visible, .boot-line-complete').length;
            if (nowVisible > 0 && !panel.classList.contains('visible')) {
                panel.classList.add('visible');
                setFan('fan-slow', 'SPIN-UP', '0420');
            }

            if (nowVisible !== visibleLines) {
                visibleLines = nowVisible;
                if (visibleLines >= 2 && visibleLines < 5) setFan('fan-medium', 'POST', '0980');
                if (visibleLines >= 5) setFan('fan-fast', 'POST', '1680', true);
            }

            if (bootProgress?.classList.contains('boot-progress-visible')) {
                setFan('fan-fast', 'STABLE', '1680', true);
            }

            const ssh = bootContent.querySelector('.boot-ssh');
            if (ssh?.classList.contains('visible') && !sshSeen) {
                sshSeen = true;
                setFan('fan-medium', 'ONLINE', '1240', true);
            }
        };

        const observer = new MutationObserver(syncFromBoot);
        observer.observe(bootContent, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
        syncFromBoot();

        const screenObserver = new MutationObserver(() => {
            if (bootScreen.hidden || bootScreen.classList.contains('fade-out')) {
                panel.classList.remove('visible');
                observer.disconnect();
                screenObserver.disconnect();
            }
        });
        screenObserver.observe(bootScreen, { attributes: true, attributeFilter: ['class', 'hidden'] });
    });
})();

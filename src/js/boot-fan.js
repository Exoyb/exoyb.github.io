// Animated ASCII system-fan monitor for the homepage POST/SSH sequence.
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const bootScreen = document.getElementById('bootScreen');
        const bootContent = bootScreen?.querySelector('.boot-content');
        const bootTerminal = bootScreen?.querySelector('.boot-terminal');
        const bootProgress = bootScreen?.querySelector('.boot-progress');
        if (!bootScreen || !bootContent || !bootTerminal) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Keep the fan housing and screw mounts completely static. Only the inner
        // rotor spins, avoiding the wobble created by rotating the whole Unicode block.
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

        // A square-ish crop of the original blades. Character width and line height
        // are balanced separately so rotation does not squash the rotor into an oval.
        const fanRotorArt = `⠛⢿⣿⣿⣿⡇⠀⠀⢸⣿⣿⣿
⠀⠀⠈⠻⠟⠛⠀⠀⢿⣿⣿⠟
⣷⣶⠀⣀⠘⢉⡀⠳⡄⠉⠁⠀
⡿⠿⠀⠇⠰⣿⣿⠆⢰⠀⣶⣾
⠀⢀⣀⠘⢦⠈⣁⡄⠉⠀⠿⢿
⣴⣿⣿⣷⠀⠀⣤⣴⣦⡀⠀⠀
⣿⣿⣿⡇⠀⠀⢸⣿⣿⣿⣷⣤`;

        const style = document.createElement('style');
        style.id = 'exoyb-boot-fan-styles';
        style.textContent = `
            .boot-fan-monitor {
                position: fixed;
                top: 50%;
                right: clamp(1rem, 4vw, 4rem);
                z-index: 10020;
                width: 286px;
                padding: .72rem .78rem .68rem;
                border: 1px solid rgba(0,255,140,.22);
                border-radius: 5px;
                background: rgba(4,8,6,.78);
                box-shadow: 0 0 20px rgba(0,255,140,.07), inset 0 0 16px rgba(0,0,0,.55);
                opacity: 0;
                transform: translateY(calc(-50% + 8px));
                transition: opacity .22s linear, transform .28s ease, border-color .22s linear;
                pointer-events: none;
            }
            .boot-fan-monitor.visible {
                opacity: .84;
                transform: translateY(-50%);
            }
            .boot-fan-monitor.stable {
                border-color: rgba(0,255,140,.38);
            }
            .boot-fan-head,
            .boot-fan-foot {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: .7rem;
                color: #799487;
                font: 600 .64rem/1.2 var(--font-mono, monospace);
                letter-spacing: .08em;
                text-transform: uppercase;
            }
            .boot-fan-head { margin-bottom: .35rem; }
            .boot-fan-foot { margin-top: .35rem; }
            .boot-fan-status,
            .boot-fan-rpm { color: var(--green, #00ff8c); }
            .boot-fan-stage {
                position: relative;
                min-height: 154px;
                overflow: hidden;
            }
            .boot-fan-shell,
            .boot-fan-rotor {
                margin: 0;
                color: #8affba;
                font-family: "IBM Plex Mono", "Cascadia Mono", "Segoe UI Symbol", monospace;
                font-weight: 500;
                white-space: pre;
                user-select: none;
            }
            .boot-fan-shell {
                position: absolute;
                left: 50%;
                top: 50%;
                font-size: 6px;
                line-height: 1.2;
                transform: translate(-50%, -50%);
                filter: drop-shadow(0 0 5px rgba(0,255,140,.18));
            }
            .boot-fan-rotor-wrap {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 62px;
                height: 62px;
                display: grid;
                place-items: center;
            }
            .boot-fan-rotor {
                display: block;
                font-size: 8px;
                line-height: 1;
                transform-origin: 50% 50%;
                filter: drop-shadow(0 0 6px rgba(0,255,140,.22));
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
                    right: 1rem;
                    width: 232px;
                    opacity: 0;
                }
                .boot-fan-monitor.visible { opacity: .68; }
                .boot-fan-stage { min-height: 136px; }
                .boot-fan-shell { font-size: 5.2px; }
                .boot-fan-rotor-wrap { width: 54px; height: 54px; }
                .boot-fan-rotor { font-size: 7px; }
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
                <div class="boot-fan-rotor-wrap"><pre class="boot-fan-rotor"></pre></div>
            </div>
            <div class="boot-fan-foot"><span>CHASSIS FAN</span><span>RPM: <span class="boot-fan-rpm">0000</span></span></div>`;
        bootScreen.appendChild(panel);

        const shell = panel.querySelector('.boot-fan-shell');
        const rotor = panel.querySelector('.boot-fan-rotor');
        const status = panel.querySelector('.boot-fan-status');
        const rpm = panel.querySelector('.boot-fan-rpm');
        shell.textContent = fanShellArt;
        rotor.textContent = fanRotorArt;

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

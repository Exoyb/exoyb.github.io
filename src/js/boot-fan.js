// Animated ASCII system-fan monitor for the homepage POST/SSH sequence.
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const bootScreen = document.getElementById('bootScreen');
        const bootContent = bootScreen?.querySelector('.boot-content');
        const bootTerminal = bootScreen?.querySelector('.boot-terminal');
        const bootProgress = bootScreen?.querySelector('.boot-progress');
        if (!bootScreen || !bootContent || !bootTerminal) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const fanArt = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣿⣿⡆⠀⠀⢀⣤⠶⠟⠛⠉⠉⠉⠉⠉⠉⠛⠻⠶⣤⡀⠀⠀⠰⣿⣿⠀⠀
⠀⠀⠀⠁⠀⣠⠞⢋⣠⣶⣿⣿⣿⡄⠀⠀⠀⢻⣿⣿⣶⣄⡙⠳⣄⠀⠈⠁⠀⠀
⠀⠀⠀⢀⡾⠁⢰⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⢸⣿⣿⣿⣿⣿⠄⠈⢷⡀⠀⠀⠀
⠀⠀⢠⡟⠀⠀⠀⠈⠉⠛⢿⣿⣿⣿⡇⠀⠀⢸⣿⣿⣿⣿⠋⠀⠀⠀⢻⡄⠀⠀
⠀⢀⣿⠁⢀⣀⣀⡀⠀⠀⠀⠈⠻⠟⠛⠀⠀⢿⣿⣿⠟⠁⠀⠀⠀⣀⠈⣿⡀⠀
⠀⢸⡇⢰⣿⣿⣿⣿⣿⣷⣶⠀⣀⠘⢉⡀⠳⡄⠉⠁⠀⠀⣠⣴⣿⣿⡇⢸⡇⠀
⠀⢸⡇⢸⣿⣿⣿⣿⣿⡿⠿⠀⠇⠰⣿⣿⠆⢰⠀⣶⣾⣿⣿⣿⣿⣿⡇⢸⡇⠀
⠀⢸⡇⢸⣿⣿⠟⠋⠀⠀⢀⣀⠘⢦⠈⣁⡄⠉⠀⠿⢿⣿⣿⣿⣿⣿⠇⢸⡇⠀
⠀⠈⣿⡀⠉⠀⠀⠀⢀⣴⣿⣿⣷⠀⠀⣤⣴⣦⡀⠀⠀⠀⠈⠉⠉⠁⢀⣿⠁⠀
⠀⠀⠘⣧⠀⠀⠀⣠⣿⣿⣿⣿⡇⠀⠀⢸⣿⣿⣿⣷⣤⣀⡀⠀⠀⠀⣼⠃⠀⠀
⠀⠀⠀⠈⢷⡀⠐⣿⣿⣿⣿⣿⡇⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⠇⢀⡾⠁⠀⠀⠀
⠀⠀⢀⡀⠀⠙⢦⣌⠙⠿⣿⣿⣇⠀⠀⠀⠘⣿⣿⣿⠿⠋⣡⡴⠋⠀⢀⡀⠀⠀
⠀⠀⣿⣿⠀⠀⠀⠈⠛⠶⣦⣤⣀⣀⣀⣀⣀⣀⣤⣴⠶⠛⠁⠀⠀⠐⣿⣿⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

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
                overflow: visible;
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
            .boot-fan-head { margin-bottom: .45rem; }
            .boot-fan-foot { margin-top: .45rem; }
            .boot-fan-status,
            .boot-fan-rpm { color: var(--green, #00ff8c); }
            .boot-fan-stage {
                display: grid;
                place-items: center;
                min-height: 168px;
                overflow: visible;
            }
            .boot-fan-art {
                display: inline-block;
                margin: 0;
                color: #8affba;
                font-family: "IBM Plex Mono", "Cascadia Mono", "Segoe UI Symbol", monospace;
                font-size: 5.25px;
                font-weight: 500;
                line-height: 1;
                white-space: pre;
                transform-origin: 50% 50%;
                filter: drop-shadow(0 0 5px rgba(0,255,140,.18));
                will-change: transform;
            }
            .boot-fan-art.fan-slow { animation: bootFanSpin 1.55s linear infinite; }
            .boot-fan-art.fan-medium { animation: bootFanSpin .88s linear infinite; }
            .boot-fan-art.fan-fast { animation: bootFanSpin .48s linear infinite; }
            @keyframes bootFanSpin {
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
                .boot-fan-stage { min-height: 140px; }
                .boot-fan-art { font-size: 4.25px; }
            }
            @media (max-width: 900px) {
                .boot-fan-monitor { display: none; }
            }
            @media (prefers-reduced-motion: reduce) {
                .boot-fan-art { animation: none !important; }
                .boot-fan-monitor { transition: none; }
            }
        `;
        document.head.appendChild(style);

        const panel = document.createElement('aside');
        panel.className = 'boot-fan-monitor';
        panel.setAttribute('aria-hidden', 'true');
        panel.innerHTML = `
            <div class="boot-fan-head"><span>SYS_FAN_01</span><span class="boot-fan-status">IDLE</span></div>
            <div class="boot-fan-stage"><pre class="boot-fan-art"></pre></div>
            <div class="boot-fan-foot"><span>CHASSIS FAN</span><span>RPM: <span class="boot-fan-rpm">0000</span></span></div>`;
        bootScreen.appendChild(panel);

        const art = panel.querySelector('.boot-fan-art');
        const status = panel.querySelector('.boot-fan-status');
        const rpm = panel.querySelector('.boot-fan-rpm');
        art.textContent = fanArt;

        const setFan = (speed, nextStatus, nextRpm, stable = false) => {
            art.classList.remove('fan-slow', 'fan-medium', 'fan-fast');
            if (!reducedMotion && speed) art.classList.add(speed);
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

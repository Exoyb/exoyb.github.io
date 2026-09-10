// Homepage boot choreography: POST typewriter -> SSH -> portfolio session
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const bootScreen = document.getElementById('bootScreen');
        const bootContent = bootScreen?.querySelector('.boot-content');
        const bootTerminal = bootScreen?.querySelector('.boot-terminal');
        const bootProgress = bootScreen?.querySelector('.boot-progress');
        const bootProgressBar = bootScreen?.querySelector('.boot-progress-bar');
        const bootFooter = bootScreen?.querySelector('.boot-footer');
        if (!bootScreen || !bootContent || !bootTerminal || !bootProgress || !bootProgressBar || !bootFooter) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

        const style = document.createElement('style');
        style.textContent = `
            .boot-terminal p {
                opacity: 0 !important;
                animation: none !important;
            }
            .boot-terminal p.boot-line-visible,
            .boot-terminal p.boot-line-complete {
                opacity: 1 !important;
            }
            .boot-terminal .boot-status {
                opacity: 0 !important;
                animation: none !important;
            }
            .boot-terminal p.boot-line-complete .boot-status {
                opacity: 1 !important;
            }
            .boot-terminal p.boot-line-complete .boot-ready {
                animation: terminalBlink .82s steps(1,end) infinite !important;
            }
            .boot-type-cursor {
                display: inline-block;
                width: 2px;
                height: .95em;
                margin-left: 2px;
                vertical-align: -.1em;
                background: var(--green);
                box-shadow: 0 0 7px rgba(0,255,140,.62);
                animation: terminalBlink .4s steps(1,end) infinite;
            }
            .boot-progress {
                opacity: 0 !important;
                animation: none !important;
                transition: opacity .1s linear;
            }
            .boot-progress.boot-progress-visible { opacity: 1 !important; }
            .boot-progress-bar {
                width: 0 !important;
                animation: none !important;
                transition: width .85s steps(24,end);
            }
            .boot-progress.boot-progress-active .boot-progress-bar { width: 100% !important; }
            .boot-footer {
                opacity: 0 !important;
                animation: none !important;
                transition: opacity .1s linear;
            }
            .boot-footer.boot-footer-visible { opacity: 1 !important; }
            .boot-ssh {
                margin: .85rem 0 .7rem;
                padding-top: .8rem;
                border-top: 1px dashed rgba(0,255,140,.18);
                color: #a6b8ad;
                font: 500 .9rem/1.6 var(--font-mono, monospace);
                opacity: 0;
                transition: opacity .12s linear;
            }
            .boot-ssh.visible { opacity: 1; }
            .boot-ssh-line { min-height: 1.45em; }
            .boot-ssh-prompt { color: var(--green); font-weight: 700; }
            .boot-ssh-command { color: #d7e1db; }
            .boot-ssh-password { color: #91a399; }
            .boot-ssh-status { color: var(--cyan); }
            .boot-ssh-login { color: #7e9185; }
            .boot-ssh-cursor {
                display: inline-block;
                width: 3px;
                height: 1em;
                margin-left: 3px;
                vertical-align: -.12em;
                background: var(--green);
                box-shadow: 0 0 8px rgba(0,255,140,.7);
                animation: terminalBlink .55s steps(1,end) infinite;
            }
            .boot-ssh-password-line,
            .boot-ssh-status-line,
            .boot-ssh-login-line { opacity: 0; }
            .boot-ssh-password-line.visible,
            .boot-ssh-status-line.visible,
            .boot-ssh-login-line.visible { opacity: 1; }
            @media (max-width: 620px) {
                .boot-ssh { font-size: .78rem; }
            }
        `;
        document.head.appendChild(style);

        const lines = [...bootTerminal.querySelectorAll('p')].map(line => {
            const prompt = line.querySelector('.boot-prompt');
            const text = line.querySelector('.boot-text');
            const status = line.querySelector('.boot-status');
            return {
                line,
                prompt,
                text,
                status,
                promptText: prompt?.textContent || '',
                bodyText: text?.textContent || '',
                statusText: status?.textContent || ''
            };
        });

        const ssh = document.createElement('div');
        ssh.className = 'boot-ssh';
        ssh.setAttribute('aria-live', 'polite');
        ssh.innerHTML = `
            <div class="boot-ssh-line boot-ssh-command-line"><span class="boot-ssh-prompt">$ </span><span class="boot-ssh-command"></span><span class="boot-ssh-cursor"></span></div>
            <div class="boot-ssh-line boot-ssh-password-line"><span class="boot-ssh-password">exoyb@portfolio's password: </span><span class="boot-ssh-cursor"></span></div>
            <div class="boot-ssh-line boot-ssh-status-line"><span class="boot-ssh-status">Authenticated.</span></div>
            <div class="boot-ssh-line boot-ssh-login-line"><span class="boot-ssh-login">Last login: portfolio session established</span></div>
        `;
        bootContent.insertBefore(ssh, bootFooter);

        const sshCommand = ssh.querySelector('.boot-ssh-command');
        const sshCommandCursor = ssh.querySelector('.boot-ssh-command-line .boot-ssh-cursor');
        const passwordLine = ssh.querySelector('.boot-ssh-password-line');
        const statusLine = ssh.querySelector('.boot-ssh-status-line');
        const loginLine = ssh.querySelector('.boot-ssh-login-line');

        const finishBoot = () => {
            if (bootScreen.hidden || bootScreen.classList.contains('fade-out')) return;
            bootScreen.classList.add('fade-out');
            window.setTimeout(() => {
                bootScreen.hidden = true;
            }, 380);
        };

        const revealEverything = () => {
            lines.forEach(item => {
                if (item.prompt) item.prompt.textContent = item.promptText;
                if (item.text) item.text.textContent = item.bodyText;
                if (item.status) item.status.textContent = item.statusText;
                item.line.classList.add('boot-line-complete');
            });
            bootProgress.classList.add('boot-progress-visible', 'boot-progress-active');
            bootProgressBar.style.width = '100%';
            bootFooter.classList.add('boot-footer-visible');
            sshCommand.textContent = 'ssh exoyb@portfolio';
            sshCommandCursor?.remove();
            ssh.classList.add('visible');
            passwordLine.classList.add('visible');
            statusLine.classList.add('visible');
            loginLine.classList.add('visible');
        };

        if (reducedMotion) {
            revealEverything();
            return;
        }

        lines.forEach(item => {
            if (item.prompt) item.prompt.textContent = '';
            if (item.text) item.text.textContent = '';
            if (item.status) item.status.textContent = '';
        });

        const typeInto = async (element, value, delay) => {
            if (!element) return;
            for (const character of value) {
                element.textContent += character;
                await sleep(delay);
            }
        };

        const typeHuman = async (element, value) => {
            for (const character of value) {
                element.textContent += character;
                let delay = 82 + Math.random() * 82;
                if (character === ' ') delay += 95;
                if (character === '@') delay += 70;
                await sleep(delay);
            }
        };

        const run = async () => {
            await sleep(250);

            for (const item of lines) {
                if (bootScreen.classList.contains('fade-out')) return;

                item.line.classList.add('boot-line-visible');
                const cursor = document.createElement('span');
                cursor.className = 'boot-type-cursor';
                item.text?.after(cursor);

                await typeInto(item.prompt, item.promptText, 12);
                await typeInto(item.text, item.bodyText, 8);

                cursor.remove();
                if (item.status) item.status.textContent = item.statusText;
                item.line.classList.add('boot-line-complete');
                window.ExoybAudio?.play('boot');
                await sleep(70);
            }

            bootProgress.classList.add('boot-progress-visible');
            await sleep(80);
            bootProgress.classList.add('boot-progress-active');
            await sleep(950);
            bootFooter.classList.add('boot-footer-visible');
            await sleep(220);

            ssh.classList.add('visible');
            await typeHuman(sshCommand, 'ssh exoyb@portfolio');

            await sleep(260);
            sshCommandCursor?.remove();
            passwordLine.classList.add('visible');

            // Real SSH does not echo password characters; the pause is the "typing".
            await sleep(1100);
            passwordLine.querySelector('.boot-ssh-cursor')?.remove();
            statusLine.classList.add('visible');
            window.ExoybAudio?.play('auth');

            await sleep(300);
            loginLine.classList.add('visible');

            // Enough time to read the successful login without leaving a long dead hang.
            await sleep(650);
            finishBoot();
        };

        run().catch(revealEverything);
    });
})();

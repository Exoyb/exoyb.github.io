// Homepage SSH handoff: POST -> secure portfolio session
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const bootScreen = document.getElementById('bootScreen');
        const bootContent = bootScreen?.querySelector('.boot-content');
        const bootFooter = bootScreen?.querySelector('.boot-footer');
        if (!bootScreen || !bootContent || !bootFooter) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const style = document.createElement('style');
        style.textContent = `
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

        const command = ssh.querySelector('.boot-ssh-command');
        const commandCursor = ssh.querySelector('.boot-ssh-command-line .boot-ssh-cursor');
        const passwordLine = ssh.querySelector('.boot-ssh-password-line');
        const statusLine = ssh.querySelector('.boot-ssh-status-line');
        const loginLine = ssh.querySelector('.boot-ssh-login-line');
        const text = 'ssh exoyb@portfolio';

        if (reducedMotion) {
            command.textContent = text;
            commandCursor?.remove();
            ssh.classList.add('visible');
            passwordLine.classList.add('visible');
            statusLine.classList.add('visible');
            loginLine.classList.add('visible');
            return;
        }

        // Let POST finish, then deliberately slow the SSH handoff down enough to be readable.
        window.setTimeout(() => {
            ssh.classList.add('visible');
            let index = 0;
            const timer = window.setInterval(() => {
                command.textContent = text.slice(0, ++index);
                if (index < text.length) return;
                window.clearInterval(timer);
                commandCursor?.remove();
            }, 70);
        }, 5000);

        // Real SSH does not echo password characters, so hold on the prompt instead.
        window.setTimeout(() => passwordLine.classList.add('visible'), 6500);
        window.setTimeout(() => {
            passwordLine.querySelector('.boot-ssh-cursor')?.remove();
            statusLine.classList.add('visible');
        }, 7600);
        window.setTimeout(() => loginLine.classList.add('visible'), 8000);
    });
})();

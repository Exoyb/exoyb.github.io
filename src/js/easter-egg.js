// Exoyb Easter egg: decryptable clue on Cyber Log -> arrow-key display override on Home
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setupCipherClue = () => {
        const panel = document.getElementById('cipherTransmission');
        const payload = document.getElementById('cipherPayload');
        if (!panel || !payload) return;

        const cipherText = payload.dataset.cipher || payload.textContent || '';
        const plainText = payload.dataset.plain || 'HOME:// ↑ ↑ ↓ ↓ ← ← → →';
        const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=/<>[]{}';
        let timer = null;
        let decrypted = false;

        const scrambleTo = target => {
            if (timer) window.clearInterval(timer);

            if (reducedMotion) {
                payload.textContent = target;
                return;
            }

            const frames = 26;
            let frame = 0;
            timer = window.setInterval(() => {
                frame += 1;
                const progress = Math.min(1, frame / frames);
                const revealCount = Math.floor(target.length * progress);

                payload.textContent = [...target].map((character, index) => {
                    if (index < revealCount || character === ' ') return character;
                    return glyphs[Math.floor(Math.random() * glyphs.length)];
                }).join('');

                if (progress >= 1) {
                    window.clearInterval(timer);
                    timer = null;
                    payload.textContent = target;
                }
            }, 28);
        };

        const decrypt = () => {
            decrypted = true;
            panel.classList.add('decrypted');
            scrambleTo(plainText);
        };

        const encrypt = () => {
            decrypted = false;
            panel.classList.remove('decrypted');
            scrambleTo(cipherText);
        };

        panel.addEventListener('mouseenter', decrypt);
        panel.addEventListener('mouseleave', encrypt);
        panel.addEventListener('focus', decrypt);
        panel.addEventListener('blur', encrypt);
        panel.addEventListener('click', () => decrypted ? encrypt() : decrypt());
    };

    const setupHomeSequence = () => {
        if (!document.querySelector('.home-hero')) return;

        const sequence = [
            'ArrowUp', 'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowLeft',
            'ArrowRight', 'ArrowRight'
        ];

        let position = 0;
        let lastKeyAt = 0;
        let effectRunning = false;

        const bootIsVisible = () => {
            const boot = document.getElementById('bootScreen');
            return Boolean(boot && !boot.hidden && !boot.classList.contains('fade-out'));
        };

        const runMatrixEffect = () => {
            if (effectRunning) return;
            effectRunning = true;

            const overlay = document.createElement('div');
            overlay.className = 'matrix-easter-egg';
            overlay.setAttribute('aria-hidden', 'true');
            overlay.innerHTML = `
                <canvas class="matrix-easter-canvas"></canvas>
                <div class="matrix-easter-status">SEQUENCE ACCEPTED // DISPLAY OVERRIDE</div>`;
            document.body.appendChild(overlay);

            const canvas = overlay.querySelector('canvas');
            const context = canvas.getContext('2d');
            let rainTimer = null;
            let drops = [];
            let columns = 0;
            const fontSize = 18;
            const glyphs = '01EXOYB<>[]{}#$%*+=-/';

            const sizeCanvas = () => {
                const ratio = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.floor(window.innerWidth * ratio);
                canvas.height = Math.floor(window.innerHeight * ratio);
                canvas.style.width = `${window.innerWidth}px`;
                canvas.style.height = `${window.innerHeight}px`;
                context.setTransform(ratio, 0, 0, ratio, 0, 0);
                columns = Math.ceil(window.innerWidth / fontSize);
                drops = Array.from({ length: columns }, () => -Math.floor(Math.random() * 35));
            };

            const draw = () => {
                context.fillStyle = 'rgba(2, 6, 4, .15)';
                context.fillRect(0, 0, window.innerWidth, window.innerHeight);
                context.font = `600 ${fontSize}px 'IBM Plex Mono', monospace`;
                context.textAlign = 'left';

                for (let column = 0; column < columns; column += 1) {
                    const character = glyphs[Math.floor(Math.random() * glyphs.length)];
                    const x = column * fontSize;
                    const y = drops[column] * fontSize;
                    context.fillStyle = Math.random() > .965 ? '#dfffee' : '#00ff8c';
                    context.fillText(character, x, y);

                    if (y > window.innerHeight && Math.random() > .965) {
                        drops[column] = -Math.floor(Math.random() * 12);
                    }
                    drops[column] += 1;
                }
            };

            const cleanup = () => {
                if (rainTimer) window.clearInterval(rainTimer);
                window.removeEventListener('resize', sizeCanvas);
                overlay.remove();
                effectRunning = false;
            };

            if (reducedMotion || !context) {
                overlay.classList.add('matrix-static', 'visible');
                window.setTimeout(() => overlay.classList.add('fade-out'), 1200);
                window.setTimeout(cleanup, 1900);
                return;
            }

            sizeCanvas();
            window.addEventListener('resize', sizeCanvas, { passive: true });
            draw();
            rainTimer = window.setInterval(draw, 45);

            window.requestAnimationFrame(() => overlay.classList.add('visible'));
            window.setTimeout(() => overlay.querySelector('.matrix-easter-status')?.classList.add('hide'), 1550);
            window.setTimeout(() => overlay.classList.add('fade-out'), 4700);
            window.setTimeout(cleanup, 5550);
        };

        document.addEventListener('keydown', event => {
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
            if (bootIsVisible()) return;

            const now = Date.now();
            if (now - lastKeyAt > 4500) position = 0;
            lastKeyAt = now;

            if (event.key === sequence[position]) {
                event.preventDefault();
                position += 1;
            } else {
                position = event.key === sequence[0] ? 1 : 0;
            }

            if (position === sequence.length) {
                position = 0;
                runMatrixEffect();
            }
        });
    };

    const addEffectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .matrix-easter-egg {
                position: fixed;
                inset: 0;
                z-index: 8500;
                overflow: hidden;
                pointer-events: none;
                background: rgba(0, 3, 1, .92);
                opacity: 0;
                transition: opacity .28s ease;
            }
            .matrix-easter-egg.visible { opacity: 1; }
            .matrix-easter-egg.fade-out { opacity: 0; transition-duration: .72s; }
            .matrix-easter-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
            .matrix-easter-status {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                max-width: calc(100vw - 2rem);
                padding: .7rem 1rem;
                border: 1px solid rgba(0,255,140,.7);
                color: #baffda;
                background: rgba(2,8,5,.88);
                box-shadow: 0 0 28px rgba(0,255,140,.18);
                font: 700 clamp(.72rem, 1.6vw, 1rem)/1.3 var(--font-mono, monospace);
                letter-spacing: .08em;
                text-align: center;
                white-space: nowrap;
                opacity: 1;
                transition: opacity .5s ease;
            }
            .matrix-easter-status.hide { opacity: 0; }
            .matrix-easter-egg.matrix-static .matrix-easter-canvas { display: none; }
            @media (prefers-reduced-motion: reduce) {
                .matrix-easter-egg { transition: opacity .12s linear; }
                .matrix-easter-status { transition: none; }
            }
        `;
        document.head.appendChild(style);
    };

    document.addEventListener('DOMContentLoaded', () => {
        addEffectStyles();
        setupCipherClue();
        setupHomeSequence();
    });
})();

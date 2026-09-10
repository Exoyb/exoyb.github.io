// Exoyb terminal audio — generated with Web Audio, no external sound assets.
(() => {
    const storageKey = 'exoyb-audio-enabled';
    let audioContext = null;
    let enabled = false;

    try {
        enabled = window.sessionStorage.getItem(storageKey) === '1';
    } catch (_) {
        enabled = false;
    }

    const setEnabled = value => {
        enabled = Boolean(value);
        try {
            if (enabled) window.sessionStorage.setItem(storageKey, '1');
            else window.sessionStorage.removeItem(storageKey);
        } catch (_) {
            // Audio still works for the current page when storage is unavailable.
        }
        document.querySelectorAll('[data-audio-toggle]').forEach(button => {
            button.classList.toggle('enabled', enabled);
            button.setAttribute('aria-pressed', String(enabled));
            button.textContent = enabled ? '[ AUDIO: ON ]' : '[ AUDIO: ENABLE ]';
        });
    };

    const getContext = () => {
        if (audioContext && audioContext.state !== 'closed') return audioContext;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        try {
            audioContext = new AudioContextClass();
        } catch (_) {
            audioContext = null;
        }
        return audioContext;
    };

    const scheduleTone = (ctx, frequency, start, duration, gainValue, type = 'triangle') => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.025);
    };

    const scheduleNoiseClick = (ctx, start, duration = 0.032, gainValue = 0.038) => {
        const sampleRate = ctx.sampleRate;
        const frameCount = Math.max(1, Math.floor(sampleRate * duration));
        const buffer = ctx.createBuffer(1, frameCount, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i += 1) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
        }

        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1450, start);
        filter.Q.setValueAtTime(0.8, start);
        gain.gain.setValueAtTime(gainValue, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(start);
    };

    const renderSound = (ctx, kind) => {
        const now = ctx.currentTime + 0.004;

        if (kind === 'click') {
            scheduleNoiseClick(ctx, now, 0.032, 0.038);
            scheduleTone(ctx, 610, now, 0.045, 0.027, 'square');
            scheduleTone(ctx, 360, now + 0.018, 0.055, 0.018, 'triangle');
            return;
        }

        if (kind === 'boot') {
            scheduleTone(ctx, 500, now, 0.052, 0.018, 'square');
            return;
        }

        if (kind === 'auth') {
            scheduleTone(ctx, 560, now, 0.095, 0.032, 'triangle');
            scheduleTone(ctx, 840, now + 0.105, 0.14, 0.038, 'triangle');
            return;
        }

        if (kind === 'matrix') {
            scheduleTone(ctx, 300, now, 0.12, 0.034, 'square');
            scheduleTone(ctx, 450, now + 0.1, 0.13, 0.03, 'square');
            scheduleTone(ctx, 675, now + 0.2, 0.19, 0.032, 'triangle');
        }
    };

    const renderIfRunning = (ctx, kind) => {
        if (!ctx || ctx.state !== 'running') return false;
        try {
            renderSound(ctx, kind);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Must be called from a real user gesture when the browser has suspended audio.
    const unlock = async (kind = null) => {
        const ctx = getContext();
        if (!ctx) return false;

        try {
            if (ctx.state === 'suspended') await ctx.resume();
            if (ctx.state !== 'running') return false;
            setEnabled(true);
            if (kind) renderIfRunning(ctx, kind);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Programmatic sounds such as POST/auth only fire after audio has been unlocked once.
    const play = kind => {
        if (!enabled) return false;
        const ctx = getContext();
        if (!ctx) return false;

        if (ctx.state === 'running') return renderIfRunning(ctx, kind);

        ctx.resume()
            .then(() => renderIfRunning(ctx, kind))
            .catch(() => {});
        return false;
    };

    const addStyles = () => {
        if (document.getElementById('exoyb-audio-styles')) return;
        const style = document.createElement('style');
        style.id = 'exoyb-audio-styles';
        style.textContent = `
            .boot-audio-toggle {
                position: absolute;
                top: .72rem;
                right: .85rem;
                z-index: 3;
                appearance: none;
                padding: .32rem .5rem;
                border: 1px solid rgba(0,217,255,.38);
                border-radius: 3px;
                color: #7f9b89;
                background: rgba(1,7,4,.88);
                font: 600 .68rem/1.2 var(--font-mono, monospace);
                letter-spacing: .045em;
                cursor: pointer;
                opacity: .82;
                transition: color .15s ease, border-color .15s ease, box-shadow .15s ease, opacity .15s ease;
            }
            .boot-audio-toggle:hover,
            .boot-audio-toggle:focus-visible {
                color: #d8ffe9;
                border-color: rgba(0,255,140,.78);
                box-shadow: 0 0 12px rgba(0,255,140,.14);
                opacity: 1;
            }
            .boot-audio-toggle.enabled {
                color: var(--green, #00ff8c);
                border-color: rgba(0,255,140,.56);
                text-shadow: 0 0 8px rgba(0,255,140,.35);
            }
            @media (max-width: 620px) {
                .boot-audio-toggle { top: .5rem; right: .55rem; font-size: .61rem; }
            }
        `;
        document.head.appendChild(style);
    };

    const setupBootToggle = () => {
        const boot = document.getElementById('bootScreen');
        const content = boot?.querySelector('.boot-content');
        if (!boot || !content) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'boot-audio-toggle';
        button.dataset.audioToggle = 'true';
        button.setAttribute('aria-label', 'Enable terminal sound effects');
        content.appendChild(button);
        setEnabled(enabled);

        // Enabling audio must not count as "click to skip" on the boot screen.
        button.addEventListener('pointerdown', event => event.stopPropagation());
        button.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
        });
        button.addEventListener('click', async event => {
            event.preventDefault();
            event.stopPropagation();
            if (enabled) {
                setEnabled(false);
                return;
            }
            const success = await unlock('auth');
            if (!success) button.textContent = '[ AUDIO: BLOCKED ]';
        });
    };

    const isInteractive = target => target.closest('a[href], button, summary, [role="button"], .cipher-transmission');

    document.addEventListener('pointerdown', event => {
        if (!(event.target instanceof Element)) return;
        if (event.target.closest('[data-audio-toggle]')) return;
        if (!isInteractive(event.target)) return;
        unlock('click');
    }, { passive: true });

    document.addEventListener('keydown', event => {
        if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
        if (!(event.target instanceof Element)) return;
        if (event.target.closest('[data-audio-toggle]')) return;
        if (!isInteractive(event.target)) return;
        unlock('click');
    });

    addStyles();
    setupBootToggle();

    window.ExoybAudio = {
        play,
        unlock,
        isEnabled: () => enabled
    };
})();

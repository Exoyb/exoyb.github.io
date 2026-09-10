// Exoyb terminal audio — generated with Web Audio, no external sound assets.
(() => {
    const storageKey = 'exoyb-audio-preference';
    let audioContext = null;
    let preference = null;

    try {
        const stored = window.sessionStorage.getItem(storageKey);
        if (stored === 'on' || stored === 'off') preference = stored;
    } catch (_) {
        preference = null;
    }

    const setPreference = value => {
        preference = value;
        try {
            if (value) window.sessionStorage.setItem(storageKey, value);
            else window.sessionStorage.removeItem(storageKey);
        } catch (_) {
            // Audio still works for the current document when storage is unavailable.
        }

        document.querySelectorAll('[data-audio-toggle]').forEach(button => {
            const on = preference === 'on';
            button.classList.toggle('enabled', on);
            button.setAttribute('aria-pressed', String(on));
            button.textContent = on ? '[ AUDIO: ON ]' : '[ AUDIO: ENABLE ]';
        });
    };

    const getContext = () => {
        if (audioContext && audioContext.state !== 'closed') return audioContext;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;

        try {
            audioContext = new AudioContextClass({ latencyHint: 'interactive' });
        } catch (_) {
            try {
                audioContext = new AudioContextClass();
            } catch (_) {
                audioContext = null;
            }
        }
        return audioContext;
    };

    const scheduleTone = (ctx, frequency, start, duration, gainValue, type = 'triangle') => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.025);
    };

    const scheduleNoiseClick = (ctx, start, duration = 0.045, gainValue = 0.065) => {
        const sampleRate = ctx.sampleRate;
        const frameCount = Math.max(1, Math.floor(sampleRate * duration));
        const buffer = ctx.createBuffer(1, frameCount, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < frameCount; i += 1) {
            const envelope = Math.pow(1 - i / frameCount, 2.4);
            data[i] = (Math.random() * 2 - 1) * envelope;
        }

        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1250, start);
        filter.Q.setValueAtTime(1.05, start);
        gain.gain.setValueAtTime(gainValue, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(start);
    };

    const renderSound = (ctx, kind) => {
        const now = ctx.currentTime + 0.006;

        if (kind === 'click') {
            scheduleNoiseClick(ctx, now, 0.045, 0.065);
            scheduleTone(ctx, 520, now, 0.07, 0.045, 'square');
            scheduleTone(ctx, 310, now + 0.022, 0.075, 0.025, 'triangle');
            return;
        }

        if (kind === 'type') {
            // Dry, quiet terminal-key tick: mostly mechanical noise with a tiny tonal body.
            const jitter = (Math.random() - 0.5) * 180;
            scheduleNoiseClick(ctx, now, 0.018 + Math.random() * 0.008, 0.018 + Math.random() * 0.009);
            scheduleTone(ctx, 980 + jitter, now, 0.022, 0.008, 'square');
            return;
        }

        if (kind === 'power') {
            scheduleTone(ctx, 360, now, 0.09, 0.04, 'square');
            scheduleTone(ctx, 540, now + 0.09, 0.12, 0.05, 'triangle');
            return;
        }

        if (kind === 'boot') {
            scheduleNoiseClick(ctx, now, 0.026, 0.025);
            scheduleTone(ctx, 470, now, 0.075, 0.032, 'square');
            return;
        }

        if (kind === 'auth') {
            scheduleTone(ctx, 520, now, 0.12, 0.045, 'triangle');
            scheduleTone(ctx, 780, now + 0.12, 0.18, 0.055, 'triangle');
            return;
        }

        if (kind === 'matrix') {
            scheduleTone(ctx, 280, now, 0.14, 0.045, 'square');
            scheduleTone(ctx, 420, now + 0.11, 0.15, 0.04, 'square');
            scheduleTone(ctx, 680, now + 0.22, 0.22, 0.045, 'triangle');
        }
    };

    const renderIfRunning = (ctx, kind) => {
        if (!ctx || ctx.state !== 'running' || preference === 'off') return false;
        try {
            renderSound(ctx, kind);
            return true;
        } catch (_) {
            return false;
        }
    };

    // This is deliberately called directly from a trusted user gesture.
    // That is the only reliable way to unlock Web Audio in modern browsers.
    const unlockAndPlay = kind => {
        if (preference === 'off') return false;
        const ctx = getContext();
        if (!ctx) return false;

        if (preference !== 'on') setPreference('on');

        if (ctx.state === 'running') return renderIfRunning(ctx, kind);

        try {
            const resume = ctx.resume();
            if (resume && typeof resume.then === 'function') {
                resume.then(() => renderIfRunning(ctx, kind)).catch(() => {});
            }
            return true;
        } catch (_) {
            return false;
        }
    };

    // Decorative/programmatic sounds never try to fake an unlock.
    // If the browser has not granted audio yet, they simply stay silent.
    const play = kind => {
        if (preference !== 'on') return false;
        return renderIfRunning(getContext(), kind);
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
                padding: .34rem .52rem;
                border: 1px solid rgba(0,217,255,.46);
                border-radius: 3px;
                color: #9aaca1;
                background: rgba(1,7,4,.9);
                font: 600 .68rem/1.2 var(--font-mono, monospace);
                letter-spacing: .045em;
                cursor: pointer;
                opacity: .9;
                transition: color .15s ease, border-color .15s ease, box-shadow .15s ease, opacity .15s ease;
            }
            .boot-audio-toggle:hover,
            .boot-audio-toggle:focus-visible {
                color: #e7fff1;
                border-color: rgba(0,255,140,.82);
                box-shadow: 0 0 14px rgba(0,255,140,.18);
                opacity: 1;
            }
            .boot-audio-toggle.enabled {
                color: var(--green, #00ff8c);
                border-color: rgba(0,255,140,.66);
                text-shadow: 0 0 8px rgba(0,255,140,.4);
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
        setPreference(preference);

        // Sound toggle must never bubble into the boot's click-to-skip handler.
        ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type => {
            button.addEventListener(type, event => event.stopPropagation());
        });
        button.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
        });

        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            if (preference === 'on') {
                setPreference('off');
                return;
            }

            setPreference('on');
            const ctx = getContext();
            if (!ctx) {
                button.textContent = '[ AUDIO: UNSUPPORTED ]';
                return;
            }

            if (ctx.state === 'running') {
                renderIfRunning(ctx, 'power');
                return;
            }

            try {
                const resume = ctx.resume();
                Promise.resolve(resume)
                    .then(() => {
                        if (!renderIfRunning(ctx, 'power')) button.textContent = '[ AUDIO: BLOCKED ]';
                    })
                    .catch(() => { button.textContent = '[ AUDIO: BLOCKED ]'; });
            } catch (_) {
                button.textContent = '[ AUDIO: BLOCKED ]';
            }
        });
    };

    const isInteractive = target => target.closest('a[href], button, summary, [role="button"], .cipher-transmission, .decrypt-tag');

    // Capture phase ensures the sound starts before a link transition/navigation handler runs.
    document.addEventListener('pointerdown', event => {
        if (!(event.target instanceof Element)) return;
        if (event.target.closest('[data-audio-toggle]')) return;
        if (!isInteractive(event.target)) return;
        unlockAndPlay('click');
    }, true);

    document.addEventListener('keydown', event => {
        if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
        if (!(event.target instanceof Element)) return;
        if (event.target.closest('[data-audio-toggle]')) return;
        if (!isInteractive(event.target)) return;
        unlockAndPlay('click');
    }, true);

    addStyles();
    setupBootToggle();

    window.ExoybAudio = {
        play,
        unlock: () => unlockAndPlay('power'),
        isEnabled: () => preference === 'on'
    };
})();

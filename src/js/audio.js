// Exoyb terminal audio — generated with Web Audio, no external sound assets.
(() => {
    let audioContext = null;

    const getContext = () => {
        if (audioContext) return audioContext;
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
        gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
    };

    const scheduleNoiseClick = (ctx, start, duration = 0.026, gainValue = 0.018) => {
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
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(900, start);
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
            scheduleNoiseClick(ctx, now, 0.024, 0.016);
            scheduleTone(ctx, 720, now, 0.035, 0.012, 'square');
            return;
        }

        if (kind === 'boot') {
            scheduleTone(ctx, 520, now, 0.045, 0.009, 'square');
            return;
        }

        if (kind === 'auth') {
            scheduleTone(ctx, 590, now, 0.08, 0.016, 'triangle');
            scheduleTone(ctx, 880, now + 0.095, 0.11, 0.019, 'triangle');
            return;
        }

        if (kind === 'matrix') {
            scheduleTone(ctx, 330, now, 0.1, 0.02, 'square');
            scheduleTone(ctx, 495, now + 0.09, 0.11, 0.018, 'square');
            scheduleTone(ctx, 742, now + 0.18, 0.16, 0.017, 'triangle');
        }
    };

    const play = kind => {
        const ctx = getContext();
        if (!ctx) return;

        const start = () => {
            try { renderSound(ctx, kind); } catch (_) { /* Audio is decorative only. */ }
        };

        if (ctx.state === 'suspended') {
            ctx.resume().then(start).catch(() => {});
        } else {
            start();
        }
    };

    const interactiveSelector = [
        '.logo a',
        '.nav-links a',
        '.directory-link',
        '.btn',
        '.training-platform-card',
        '.credential-link',
        '.project-link',
        '.log-filter',
        '.log-fold summary',
        '.review-shot a',
        '.lightbox-close',
        '.lightbox-nav'
    ].join(',');

    document.addEventListener('pointerdown', event => {
        if (!(event.target instanceof Element)) return;
        if (!event.target.closest(interactiveSelector)) return;
        play('click');
    }, { passive: true });

    document.addEventListener('keydown', event => {
        if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
        if (!(event.target instanceof Element)) return;
        if (!event.target.closest(interactiveSelector)) return;
        play('click');
    });

    window.ExoybAudio = { play };
})();

// Layer a physical CRT-style relay click + low electrical thump onto the power gesture.
// Kept separate from the general UI sounds so the boot power-on can feel heavier
// without making normal clicks obnoxious.
(() => {
    const baseAudio = window.ExoybAudio;
    if (!baseAudio || typeof baseAudio.unlock !== 'function') return;

    const originalUnlock = baseAudio.unlock.bind(baseAudio);
    let crtContext = null;

    const getContext = () => {
        if (crtContext && crtContext.state !== 'closed') return crtContext;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;

        try {
            crtContext = new AudioContextClass({ latencyHint: 'interactive' });
        } catch (_) {
            try { crtContext = new AudioContextClass(); } catch (_) { crtContext = null; }
        }
        return crtContext;
    };

    const noiseBurst = (ctx, destination, start, duration, gainValue, frequency, q = .8) => {
        const frames = Math.max(1, Math.floor(ctx.sampleRate * duration));
        const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < frames; i += 1) {
            const envelope = Math.pow(1 - (i / frames), 2.8);
            data[i] = (Math.random() * 2 - 1) * envelope;
        }

        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        source.buffer = buffer;
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(frequency, start);
        filter.Q.setValueAtTime(q, start);
        gain.gain.setValueAtTime(gainValue, start);
        gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(destination);
        source.start(start);
    };

    const sweptTone = (ctx, destination, start, duration, fromHz, toHz, gainValue, type = 'sine') => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(fromHz, start);
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, toHz), start + duration);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(gainValue, start + .006);
        gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        oscillator.connect(gain);
        gain.connect(destination);
        oscillator.start(start);
        oscillator.stop(start + duration + .03);
    };

    const playCrtPower = ctx => {
        if (!ctx || ctx.state !== 'running') return;

        const now = ctx.currentTime + .008;
        const master = ctx.createGain();
        const compressor = ctx.createDynamicsCompressor();

        master.gain.setValueAtTime(.72, now);
        compressor.threshold.setValueAtTime(-18, now);
        compressor.knee.setValueAtTime(8, now);
        compressor.ratio.setValueAtTime(5, now);
        compressor.attack.setValueAtTime(.002, now);
        compressor.release.setValueAtTime(.16, now);
        master.connect(compressor);
        compressor.connect(ctx.destination);

        // Relay / mains switch snap.
        noiseBurst(ctx, master, now, .018, .22, 2100, .75);
        sweptTone(ctx, master, now, .035, 760, 260, .07, 'square');

        // The cabinet / transformer "whump" — deliberately centred high enough
        // to survive phone and laptop speakers while still feeling low and physical.
        sweptTone(ctx, master, now + .012, .34, 118, 48, .23, 'sine');
        sweptTone(ctx, master, now + .018, .21, 176, 82, .075, 'triangle');

        // Tiny high-voltage/flyback wake-up edge. Subtle rather than a sci-fi beep.
        sweptTone(ctx, master, now + .045, .16, 2300, 5200, .018, 'sine');

        // A small secondary mechanical tick as the set settles.
        noiseBurst(ctx, master, now + .205, .012, .055, 1350, 1.1);
    };

    const unlockCrt = () => {
        const ctx = getContext();
        if (!ctx) return;

        if (ctx.state === 'running') {
            playCrtPower(ctx);
            return;
        }

        try {
            // resume() is invoked synchronously from the real power-button gesture.
            const resume = ctx.resume();
            Promise.resolve(resume).then(() => playCrtPower(ctx)).catch(() => {});
        } catch (_) {
            // General boot audio and visuals still continue if this layer is unavailable.
        }
    };

    window.ExoybAudio.unlock = () => {
        // Both unlocks are kicked off in the same trusted click stack.
        const result = originalUnlock();
        unlockCrt();
        return result;
    };
})();

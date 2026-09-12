(() => {
  const layer = document.querySelector('[data-asteroid-space-fx]');
  if (!layer) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  const random = (min, max) => Math.random() * (max - min) + min;

  // Small white points that briefly brighten like stars against the existing matrix-dot background.
  for (let i = 0; i < 28; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'asteroid-twinkle';
    dot.style.left = `${random(2, 98)}%`;
    dot.style.top = `${random(4, 96)}%`;
    dot.style.background = '#f2f5f3';
    dot.style.boxShadow = '0 0 5px rgba(255,255,255,.62), 0 0 12px rgba(255,255,255,.24)';
    dot.style.setProperty('--twinkle-duration', `${random(5.5, 10.5).toFixed(2)}s`);
    dot.style.setProperty('--twinkle-delay', `${random(-9, 0).toFixed(2)}s`);
    layer.appendChild(dot);
  }

  let cometTimer;

  const createComet = (delay = 0) => {
    window.setTimeout(() => {
      if (document.hidden) return;

      const comet = document.createElement('span');
      comet.className = `asteroid-comet${Math.random() < 0.28 ? ' cyan' : ''}`;
      comet.style.setProperty('--comet-y', `${random(6, 66).toFixed(1)}vh`);
      comet.style.setProperty('--comet-length', `${Math.round(random(140, 235))}px`);
      comet.style.setProperty('--comet-angle', `${random(10, 17).toFixed(1)}deg`);
      comet.style.setProperty('--comet-drift', `${random(16, 28).toFixed(1)}vh`);
      comet.style.setProperty('--comet-duration', `${random(2.1, 3.0).toFixed(2)}s`);
      layer.appendChild(comet);
      comet.addEventListener('animationend', () => comet.remove(), { once: true });
    }, delay);
  };

  const scheduleComet = () => {
    cometTimer = window.setTimeout(() => {
      if (!document.hidden) {
        createComet();
        if (Math.random() < 0.42) createComet(random(900, 1800));
      }
      scheduleComet();
    }, random(5000, 9000));
  };

  // Let the page settle, then send a visible diagonal pair across the background.
  cometTimer = window.setTimeout(() => {
    createComet();
    createComet(1400);
    scheduleComet();
  }, random(2200, 3800));

  window.addEventListener('pagehide', () => window.clearTimeout(cometTimer), { once: true });
})();

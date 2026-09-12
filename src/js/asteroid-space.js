(() => {
  const layer = document.querySelector('[data-asteroid-space-fx]');
  if (!layer) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  const random = (min, max) => Math.random() * (max - min) + min;

  // A small field of green/cyan points that briefly brighten like the existing matrix dots.
  for (let i = 0; i < 22; i += 1) {
    const dot = document.createElement('span');
    dot.className = `asteroid-twinkle${Math.random() < 0.28 ? ' cyan' : ''}`;
    dot.style.left = `${random(2, 98)}%`;
    dot.style.top = `${random(4, 96)}%`;
    dot.style.setProperty('--twinkle-duration', `${random(5.5, 10.5).toFixed(2)}s`);
    dot.style.setProperty('--twinkle-delay', `${random(-9, 0).toFixed(2)}s`);
    layer.appendChild(dot);
  }

  let cometTimer;

  const scheduleComet = () => {
    cometTimer = window.setTimeout(() => {
      if (document.hidden) {
        scheduleComet();
        return;
      }

      const comet = document.createElement('span');
      comet.className = `asteroid-comet${Math.random() < 0.32 ? ' cyan' : ''}`;
      comet.style.setProperty('--comet-y', `${random(8, 72).toFixed(1)}vh`);
      comet.style.setProperty('--comet-length', `${Math.round(random(120, 220))}px`);
      comet.style.setProperty('--comet-angle', `${random(5, 13).toFixed(1)}deg`);
      comet.style.setProperty('--comet-drift', `${random(8, 18).toFixed(1)}vh`);
      comet.style.setProperty('--comet-duration', `${random(.95, 1.35).toFixed(2)}s`);
      layer.appendChild(comet);
      comet.addEventListener('animationend', () => comet.remove(), { once: true });
      scheduleComet();
    }, random(8000, 15000));
  };

  // Let the page settle before the first one appears.
  cometTimer = window.setTimeout(() => {
    const first = document.createElement('span');
    first.className = 'asteroid-comet';
    first.style.setProperty('--comet-y', `${random(15, 55).toFixed(1)}vh`);
    first.style.setProperty('--comet-length', `${Math.round(random(130, 190))}px`);
    first.style.setProperty('--comet-angle', `${random(6, 11).toFixed(1)}deg`);
    first.style.setProperty('--comet-drift', `${random(9, 15).toFixed(1)}vh`);
    layer.appendChild(first);
    first.addEventListener('animationend', () => first.remove(), { once: true });
    scheduleComet();
  }, random(2800, 5200));

  window.addEventListener('pagehide', () => window.clearTimeout(cometTimer), { once: true });
})();

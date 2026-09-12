(() => {
  if (!document.querySelector('.asteroid-page')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layer = document.createElement('div');
  layer.className = 'asteroid-space-fx';
  layer.setAttribute('aria-hidden', 'true');
  document.body.prepend(layer);

  const placeTwinkles = () => {
    layer.querySelectorAll('.asteroid-twinkle').forEach(dot => dot.remove());

    const spacing = 52;
    const offset = 26;
    const columns = Math.max(1, Math.floor(window.innerWidth / spacing));
    const rows = Math.max(1, Math.floor(window.innerHeight / spacing));
    const count = Math.min(24, Math.max(12, Math.round((window.innerWidth * window.innerHeight) / 90000)));
    const used = new Set();

    for (let index = 0; index < count; index += 1) {
      let column;
      let row;
      let key;

      do {
        column = Math.floor(Math.random() * columns);
        row = Math.floor(Math.random() * rows);
        key = `${column}:${row}`;
      } while (used.has(key));

      used.add(key);

      const dot = document.createElement('span');
      dot.className = `asteroid-twinkle${Math.random() > .72 ? ' cyan' : ''}`;
      dot.style.left = `${offset + (column * spacing)}px`;
      dot.style.top = `${offset + (row * spacing)}px`;
      dot.style.setProperty('--twinkle-delay', `${(-Math.random() * 10).toFixed(2)}s`);
      dot.style.setProperty('--twinkle-duration', `${(4.8 + Math.random() * 4.5).toFixed(2)}s`);
      layer.appendChild(dot);
    }
  };

  const spawnComet = () => {
    if (document.hidden) {
      scheduleComet();
      return;
    }

    const comet = document.createElement('span');
    comet.className = `asteroid-comet${Math.random() > .68 ? ' cyan' : ''}`;
    comet.style.setProperty('--comet-y', `${8 + Math.random() * 64}vh`);
    comet.style.setProperty('--comet-length', `${110 + Math.round(Math.random() * 110)}px`);
    comet.style.setProperty('--comet-angle', `${6 + Math.random() * 7}deg`);
    comet.style.setProperty('--comet-drift', `${10 + Math.random() * 13}vh`);
    comet.style.setProperty('--comet-duration', `${(.95 + Math.random() * .45).toFixed(2)}s`);
    layer.appendChild(comet);

    comet.addEventListener('animationend', () => comet.remove(), { once: true });
    scheduleComet();
  };

  let cometTimer = 0;
  const scheduleComet = (first = false) => {
    window.clearTimeout(cometTimer);
    const delay = first ? 3200 : 9000 + Math.random() * 8500;
    cometTimer = window.setTimeout(spawnComet, delay);
  };

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(placeTwinkles, 180);
  }, { passive: true });

  placeTwinkles();
  scheduleComet(true);
})();

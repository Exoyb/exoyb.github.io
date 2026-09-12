(() => {
  const launcher = document.querySelector('[data-game-launcher]');
  if (!launcher) return;

  const gameSrc = launcher.dataset.gameSrc;
  const standby = launcher.querySelector('[data-game-standby]');
  const runtime = launcher.querySelector('[data-game-runtime]');
  const frame = launcher.querySelector('[data-game-frame]');
  const state = launcher.querySelector('[data-game-state]');
  const launchButton = launcher.querySelector('[data-game-launch]');
  const restartButton = launcher.querySelector('[data-game-restart]');
  const fullscreenButton = launcher.querySelector('[data-game-fullscreen]');
  const exitButton = launcher.querySelector('[data-game-exit]');
  const viewport = launcher.querySelector('.game-viewport');
  const project = document.getElementById('project-game');

  let running = false;

  const setState = (message) => {
    if (state) state.textContent = message;
  };

  const loadGame = () => {
    if (!frame || !gameSrc) return;
    running = true;
    standby.hidden = true;
    runtime.hidden = false;
    setState('runtime: loading Godot web build...');
    frame.src = gameSrc;
  };

  const stopGame = () => {
    if (!frame) return;
    running = false;
    frame.src = 'about:blank';
    runtime.hidden = true;
    standby.hidden = false;
    setState('runtime: offline');
  };

  launchButton?.addEventListener('click', loadGame);

  frame?.addEventListener('load', () => {
    if (!running || frame.src === 'about:blank') return;
    setState('runtime: shell loaded // Godot loader active');
  });

  restartButton?.addEventListener('click', () => {
    if (!running || !frame) return;
    setState('runtime: restarting...');
    frame.src = 'about:blank';
    requestAnimationFrame(() => {
      frame.src = gameSrc;
    });
  });

  fullscreenButton?.addEventListener('click', async () => {
    if (!running || !viewport) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await viewport.requestFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
    }
  });

  exitButton?.addEventListener('click', stopGame);

  project?.addEventListener('toggle', () => {
    if (!project.open && running) stopGame();
  });
})();

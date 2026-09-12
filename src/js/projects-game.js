(() => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const fixAppLink = () => {
    const appLink = document.querySelector('.nav-app-link');
    if (!appLink) return;
    appLink.href = 'asteroid-miner.html';
    appLink.textContent = 'Asteroid_Miner.exe';
    appLink.setAttribute('aria-label', 'Open Asteroid Miner');
    appLink.classList.toggle('active', currentPage === 'asteroid-miner.html');
  };

  const setupProjectsTeaser = () => {
    if (currentPage !== 'projects.html') return false;

    if (window.location.hash === '#project-game') {
      window.location.replace('asteroid-miner.html');
      return true;
    }

    const project = document.getElementById('project-game');
    if (!project) return false;

    const content = project.querySelector('.project-content');
    if (!content) return false;

    const readme = content.querySelector('.project-readme-lines');
    if (readme) {
      [...readme.children].slice(2).forEach(item => item.remove());
    }

    content.querySelector('.game-launcher')?.remove();
    content.querySelector('.project-release-history')?.remove();

    if (!content.querySelector('.project-game-teaser-actions')) {
      const actions = document.createElement('div');
      actions.className = 'project-actions project-game-teaser-actions';
      actions.innerHTML = `
        <a class="btn btn-primary" href="asteroid-miner.html">&gt; OPEN ASTEROID MINER</a>
        <span class="project-date">V1 // PLAYABLE WEB BUILD</span>`;
      content.appendChild(actions);
    }

    return false;
  };

  const setupLauncher = () => {
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

    let running = false;

    const setState = message => {
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
  };

  const init = () => {
    if (setupProjectsTeaser()) return;
    setupLauncher();
    window.setTimeout(fixAppLink, 0);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

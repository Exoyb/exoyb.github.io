/*
 * CYBER LOG — EDIT THIS ARRAY TO ADD NEW ENTRIES.
 *
 * Each entry becomes a compact expandable card. The closed view deliberately
 * shows the entry number, date and title. Supporting context, tags and evidence
 * appear once the entry is opened so the feed stays easy to scan as it grows.
 * Newest dates are shown first by default. Any optional field can be omitted.
 */

const cyberLogEntries = [
  {
    date: '2026-09-09',
    type: 'Portfolio Development // Version History',
    title: 'Portfolio Development + Updates',
    summary: 'Here I track the updates and revisions I make to the portfolio.',
    tags: ['portfolio', 'github', 'html', 'css', 'javascript', 'ui', 'performance', 'testing'],
    versions: [
      {
        version: 'V1',
        date: '2026-09-09',
        title: 'Initial build',
        summary: 'Created my GitHub account and turned the original single-page template into the first working version of this portfolio.',
        changes: [
          'Changed the original single index.html template into one repository containing separate HTML files for each page.',
          'Removed clutter and irrelevant information tabs to make the site more focused and concise.',
          'Started using GitHub Pages as the live home for the project.'
        ],
        learned: [
          'A single-page template can be restructured into a multi-page site while keeping everything inside one repository.',
          'A portfolio is clearer when irrelevant or duplicated sections are removed instead of filling space for the sake of it.'
        ]
      },
      {
        version: 'V1.1',
        date: '2026-09-10',
        title: 'Workstation rebuild',
        summary: 'Reworked the site from a normal portfolio into the terminal/workstation experience and added most of the interaction, audio and feedback features.',
        changes: [
          'Reworked the homepage into a terminal-style directory interface with live cd path previewing and a stronger cyber/security identity.',
          'Added hover-to-decrypt behaviour to the homepage role banner.',
          'Added a full power-on gate before the homepage boot sequence so the system stays OFF until the visitor explicitly powers it on.',
          'Changed the power screen so it starts genuinely dark with muted labels, an inactive power symbol and almost no ambient lighting.',
          'Added a staged power-up animation and CRT-style electrical power-on audio.',
          'Changed the boot flow so POST and SSH only begin after power-on instead of progressing in the background.',
          'Added a human-paced SSH command typing sequence, quiet per-character clicks, hidden password entry and a readable authentication hold.',
          'Fixed a lifecycle conflict where an older boot timer could hide the boot screen before the new POST/SSH sequence had finished.',
          'Removed a brief green first-paint flash by moving the OFF-state styling into critical page-head CSS.',
          'Expanded the audio system with separate UI, boot, authentication, typing, Matrix and power-on behaviours.',
          'Added the mouse-follow glow, terminal-style internal navigation, scroll progress and staggered reveal animations.',
          'Built the Feedback page with expandable employer sections, Caseware CSAT evidence, Cash Converters reviews, Kwik Fit evidence and a review lightbox.',
          'Added a hidden homepage Easter egg and an encrypted Cyber Log clue pointing toward it.',
          'Added responsive and accessibility handling including keyboard support, focus states and reduced-motion behaviour.',
          'Used cache-busting version updates while iterating so browser-cached CSS and JavaScript did not mask new changes.'
        ],
        learned: [
          'Tiny timing differences between the initial HTML/CSS paint and later JavaScript can create visible flashes.',
          'Interactive effects feel more convincing when their visual, timing and audio states share the same lifecycle.',
          'Browser audio restrictions are easier to work with when sound starts from a genuine user gesture.',
          'Layering new behaviour over older generic handlers can create hidden conflicts, so ownership of a UI lifecycle needs to be clear.',
          'Evidence is stronger when it is curated and structured instead of dumped onto one page.'
        ]
      },
      {
        version: 'V1.2',
        date: '2026-09-11',
        title: 'Performance + usability',
        summary: 'Family testing exposed two things: changing pages felt slower than it should and the first power screen looked like an error instead of something you were meant to interact with.',
        changes: [
          'Removed an unnecessary 230ms JavaScript delay from internal page navigation.',
          'Researched browser prefetching and added low-priority prefetching for the main portfolio pages during the roughly 12-second boot sequence, using otherwise hidden boot time to warm the browser cache.',
          'Standardised shared CSS and JavaScript cache-busting versions so the browser can reuse the same cached files between pages instead of treating them as different requests.',
          'Replaced the boot-screen Audio on/off control with a [ SKIP BOOT SEQUENCE ] button and made skipping abort the remaining POST/SSH sequence cleanly.',
          'Changed SYSTEM OFFLINE to PRESS TO POWER ON after initial family testing showed the old wording was being read as an error rather than an interactive screen.',
          'Added a blinking red standby LED to make the powered-off state clearer.',
          'Changed the power-on state so the LED turns green, flickers slowly, speeds up, then settles solid green before POST begins.',
          'Matched the outer panel border flicker to the power-button state so the whole workstation appears to stabilise together.',
          'Removed the redundant click/tap helper line from the power screen once PRESS TO POWER ON and the LED made the interaction clear enough on their own.'
        ],
        learned: [
          'User testing catches things that make sense to the person building the site but read completely differently to a first-time visitor.',
          'The boot sequence can double as a useful loading window instead of existing only for the visual effect.',
          'Consistent asset URLs matter if shared files are meant to stay cached between pages.',
          'A small state cue like a red or green LED can explain an interaction better than another line of instructions.'
        ]
      }
    ]
  },
  {
    date: '2026-09-10',
    type: 'Security Project',
    title: 'Completed my first security audit',
    summary: 'Completed my first Security Audit and uploaded the finished documents to my Projects page.',
    tags: ['security-audit', 'projects'],
    links: [{ label: 'View the project', url: 'projects.html' }]
  }
];

// Everything below this line builds the page automatically.
(() => {
  const entriesRoot = document.getElementById('cyberLogEntries');
  const emptyState = document.getElementById('logEmptyState');
  const filtersRoot = document.getElementById('logFilters');
  const sortRoot = document.getElementById('logSort');
  const entryCount = document.getElementById('entryCount');
  const topicCount = document.getElementById('topicCount');
  const latestEntry = document.getElementById('latestEntry');

  if (!entriesRoot || !filtersRoot) return;

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const formatDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const renderBody = (value) => {
    if (Array.isArray(value)) {
      if (!value.length) return '';
      return `<ul>${value.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
    }
    return value ? `<p>${escapeHTML(value)}</p>` : '';
  };

  const renderFold = (className, label, value, countLabel = 'notes') => {
    if (!value || (Array.isArray(value) && !value.length)) return '';
    const count = Array.isArray(value) ? value.length : 1;
    const singular = countLabel.endsWith('s') ? countLabel.slice(0, -1) : countLabel;
    const suffix = count === 1 ? singular : countLabel;

    return `
      <details class="log-fold ${className}">
        <summary>
          <span class="log-fold-label">${escapeHTML(label)}</span>
          <span class="log-fold-count">${count} ${escapeHTML(suffix)}</span>
        </summary>
        <div class="log-fold-body">${renderBody(value)}</div>
      </details>`;
  };

  const renderVersion = (release) => {
    const changes = Array.isArray(release.changes) && release.changes.length
      ? `<p><strong>Changes</strong></p>${renderBody(release.changes)}`
      : '';
    const learned = Array.isArray(release.learned) && release.learned.length
      ? `<p><strong>What I learned</strong></p>${renderBody(release.learned)}`
      : '';

    return `
      <details class="log-fold did version">
        <summary>
          <span class="log-fold-label">${escapeHTML(release.version || 'Version')}</span>
          <span class="log-fold-count">${escapeHTML(formatDate(release.date || ''))}</span>
        </summary>
        <div class="log-fold-body">
          ${release.title ? `<p><strong>${escapeHTML(release.title)}</strong></p>` : ''}
          ${release.summary ? `<p>${escapeHTML(release.summary)}</p>` : ''}
          ${changes}
          ${learned}
        </div>
      </details>`;
  };

  const chronologicalEntries = [...cyberLogEntries].sort((a, b) =>
    String(a.date || '').localeCompare(String(b.date || ''))
  );
  const serialByEntry = new Map(
    chronologicalEntries.map((entry, index) => [entry, String(index + 1).padStart(3, '0')])
  );

  const allTags = [...new Set(cyberLogEntries.flatMap(entry => entry.tags || []))]
    .map(tag => String(tag).trim().toLowerCase())
    .filter(Boolean)
    .sort();

  const newestEntry = [...cyberLogEntries].sort((a, b) =>
    String(b.date || '').localeCompare(String(a.date || ''))
  )[0];

  entryCount.textContent = cyberLogEntries.length;
  topicCount.textContent = allTags.length;
  latestEntry.textContent = newestEntry ? formatDate(newestEntry.date) : '--';

  allTags.forEach(tag => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'log-filter';
    button.dataset.filter = tag;
    button.textContent = tag;
    filtersRoot.appendChild(button);
  });

  if (!cyberLogEntries.length) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  let currentFilter = 'all';
  let currentSort = 'newest';

  const renderEntries = () => {
    const displayEntries = [...cyberLogEntries].sort((a, b) => {
      const comparison = String(a.date || '').localeCompare(String(b.date || ''));
      return currentSort === 'oldest' ? comparison : -comparison;
    });

    entriesRoot.innerHTML = displayEntries.map(entry => {
      const tags = (entry.tags || []).map(tag => String(tag).trim().toLowerCase()).filter(Boolean);
      const tagMarkup = tags.length
        ? `<div class="log-tags">${tags.map(tag => `<span class="log-tag">${escapeHTML(tag)}</span>`).join('')}</div>`
        : '';

      const versions = Array.isArray(entry.versions) && entry.versions.length
        ? `<div class="log-folds">${[...entry.versions].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).map(renderVersion).join('')}</div>`
        : '';

      const folds = [
        renderFold('did', 'what I did', entry.did),
        renderFold('learned', 'what I learned', entry.learned),
        renderFold('tools', 'tools used', entry.tools, 'tools'),
        renderFold('issue', 'issue / blocker', entry.stuck),
        renderFold('next', 'next steps', entry.next)
      ].filter(Boolean).join('');

      const detailMarkup = [
        versions,
        folds ? `<div class="log-folds">${folds}</div>` : ''
      ].filter(Boolean).join('');

      const links = Array.isArray(entry.links) && entry.links.length
        ? `<div class="log-links">${entry.links.map(link => `<a class="log-link" href="${escapeHTML(link.url || '#')}"${/^https?:\/\//.test(link.url || '') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(link.label || 'Related link')} ↗</a>`).join('')}</div>`
        : '';

      const serial = serialByEntry.get(entry) || '---';
      const hidden = currentFilter !== 'all' && !tags.includes(currentFilter);

      return `
        <article class="log-entry" data-tags="${escapeHTML(tags.join(' '))}"${hidden ? ' hidden' : ''}>
          <details class="log-entry-card">
            <summary class="log-entry-toggle">
              <span class="log-entry-switch" aria-hidden="true"></span>
              <span class="log-entry-preview">
                <span class="log-entry-preview-meta">
                  <span class="log-index">entry_${serial}.log</span>
                  <time class="log-date" datetime="${escapeHTML(entry.date || '')}">${escapeHTML(formatDate(entry.date || ''))}</time>
                </span>
                <span class="log-entry-title">${escapeHTML(entry.title || 'Untitled entry')}</span>
              </span>
            </summary>

            <div class="log-entry-content">
              <div class="log-entry-expanded-meta">
                <span class="log-entry-type">${escapeHTML(entry.type || 'Log')}</span>
              </div>
              ${entry.summary ? `<p class="log-entry-summary">${escapeHTML(entry.summary)}</p>` : ''}
              ${tagMarkup}
              ${detailMarkup || '<p class="log-no-detail">No additional notes for this entry yet.</p>'}
              ${links}
            </div>
          </details>
        </article>`;
    }).join('');
  };

  renderEntries();

  filtersRoot.addEventListener('click', (event) => {
    const button = event.target.closest('.log-filter');
    if (!button) return;

    filtersRoot.querySelectorAll('.log-filter').forEach(filter => filter.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter || 'all';
    renderEntries();
  });

  sortRoot?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sort]');
    if (!button) return;

    sortRoot.querySelectorAll('[data-sort]').forEach(option => option.classList.remove('active'));
    button.classList.add('active');
    currentSort = button.dataset.sort === 'oldest' ? 'oldest' : 'newest';
    renderEntries();
  });
})();
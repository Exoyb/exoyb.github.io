/*
 * CYBER LOG — short diary entries only.
 *
 * Projects hold the detailed write-ups and evidence. Cyber Log records what I
 * completed or released on a given day and points back to the relevant project.
 */

const cyberLogEntries = [
  {
    date: '2026-09-12',
    type: 'Project Update',
    title: 'Added New Project: Asteroid Miner',
    summary: 'Added in old and ongoing project, "Asteroid Miner". Created new page for it, added a new toolbar icon that lights up and has a blinking red LED. As this is a game page, I have added some appropriate eye-candy pieces to the background like twinkling stars, and a comet or two.',
    tags: ['asteroid-miner', 'projects'],
    links: [{ label: 'Open Asteroid Miner', url: 'asteroid-miner.html' }]
  },
  {
    date: '2026-09-11',
    type: 'Portfolio Update',
    title: 'Released V1.2 of Exoyb Cybersecurity Portfolio',
    summary: 'Released a performance and usability update following family testing, including faster navigation, boot-time page prefetching and a clearer power-on experience.',
    tags: ['portfolio', 'release', 'performance', 'testing'],
    links: [{ label: 'View Portfolio project', url: 'projects.html#project-portfolio' }]
  },
  {
    date: '2026-09-10',
    type: 'Security Project',
    title: 'Completed my first security audit',
    summary: 'Completed the Botium Toys security audit and published the assessment, controls and compliance checklist, and recommendations.',
    tags: ['security-audit', 'projects'],
    links: [{ label: 'View Botium Toys project', url: 'projects.html#project-security' }]
  }
];

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
      const hidden = currentFilter !== 'all' && !tags.includes(currentFilter);
      const serial = serialByEntry.get(entry) || '---';
      const tagMarkup = tags.length
        ? `<div class="log-tags">${tags.map(tag => `<span class="log-tag">${escapeHTML(tag)}</span>`).join('')}</div>`
        : '';
      const links = Array.isArray(entry.links) && entry.links.length
        ? `<div class="log-links">${entry.links.map(link => `<a class="log-link" href="${escapeHTML(link.url || '#')}">${escapeHTML(link.label || 'View project')} →</a>`).join('')}</div>`
        : '';

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
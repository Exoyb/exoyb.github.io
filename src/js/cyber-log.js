/*
 * CYBER LOG — THIS IS THE ONLY SECTION YOU NEED TO EDIT FOR NEW ENTRIES.
 *
 * Add a new object to cyberLogEntries. Newest dates are shown first.
 * Any optional field can simply be omitted.
 *
 * EXAMPLE:
 * {
 *   date: '2026-09-10',
 *   type: 'Daily Log',
 *   title: 'What I learned today',
 *   summary: 'A short intro explaining what the session was about.',
 *   tags: ['sc-900', 'identity', 'zero-trust'],
 *   learned: ['First thing I learned.', 'Second thing I learned.'],
 *   did: ['Completed a lab.', 'Used a new tool.'],
 *   stuck: 'Something that confused me or broke.',
 *   next: 'The next thing I want to tackle.',
 *   links: [{ label: 'Related project', url: 'projects.html' }]
 * }
 */

const cyberLogEntries = [
  {
    date: '2026-09-10',
    type: 'Portfolio Development',
    title: 'Refining the portfolio (and breaking the boot screen)',
    summary: 'More work on the portfolio today: refining the landing page, adding content and polishing the terminal-style interface. Also managed to create my first proper self-inflicted debugging session.',
    tags: ['portfolio', 'html', 'ui', 'debugging'],
    learned: [
      'Small changes can have surprisingly large knock-on effects when markup or scripts are removed.',
      'When something suddenly stops working, retracing the most recent changes is usually a good place to start.'
    ],
    did: [
      'Built the landing-page terminal with hover effects and a flashing pipe-style cursor ready for the cd interaction.',
      'Added more information, photos and formatting across the portfolio.',
      'Added the first Cyber Log entries.'
    ],
    stuck: 'I accidentally deleted the closing script for the boot screen while removing a redundant contact form, then spent about 30 minutes hunting down what I had broken. Whoops!'
  },
  {
    date: '2026-09-09',
    type: 'Portfolio Development',
    title: 'Started my first GitHub project',
    summary: 'Created a GitHub account and started development of my first project: this portfolio.',
    tags: ['github', 'portfolio', 'html'],
    learned: [
      'A single-page template can be restructured into a multi-page site while keeping everything inside one repository.',
      'A portfolio is clearer when irrelevant or duplicated sections are removed instead of filling space for the sake of it.'
    ],
    did: [
      'Changed the original single index.html template into one repository containing separate HTML files for each page.',
      'Removed clutter and irrelevant information tabs to make the site more focused and concise.'
    ]
  }
];

// Everything below this line builds the page automatically.
(() => {
  const entriesRoot = document.getElementById('cyberLogEntries');
  const emptyState = document.getElementById('logEmptyState');
  const filtersRoot = document.getElementById('logFilters');
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

  const renderFold = (className, label, value) => {
    if (!value || (Array.isArray(value) && !value.length)) return '';
    const count = Array.isArray(value) ? value.length : 1;
    const suffix = count === 1 ? 'note' : 'notes';

    return `
      <details class="log-fold ${className}">
        <summary>
          <span class="log-fold-label">${escapeHTML(label)}</span>
          <span class="log-fold-count">${count} ${suffix}</span>
        </summary>
        <div class="log-fold-body">${renderBody(value)}</div>
      </details>`;
  };

  const sortedEntries = [...cyberLogEntries].sort((a, b) =>
    String(b.date || '').localeCompare(String(a.date || ''))
  );

  const allTags = [...new Set(sortedEntries.flatMap(entry => entry.tags || []))]
    .map(tag => String(tag).trim().toLowerCase())
    .filter(Boolean)
    .sort();

  entryCount.textContent = sortedEntries.length;
  topicCount.textContent = allTags.length;
  latestEntry.textContent = sortedEntries.length ? formatDate(sortedEntries[0].date) : '--';

  allTags.forEach(tag => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'log-filter';
    button.dataset.filter = tag;
    button.textContent = tag;
    filtersRoot.appendChild(button);
  });

  if (!sortedEntries.length) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  entriesRoot.innerHTML = sortedEntries.map((entry, index) => {
    const tags = (entry.tags || []).map(tag => String(tag).trim().toLowerCase()).filter(Boolean);
    const tagMarkup = tags.length
      ? `<div class="log-tags">${tags.map(tag => `<span class="log-tag">${escapeHTML(tag)}</span>`).join('')}</div>`
      : '';

    const folds = [
      renderFold('learned', 'learned', entry.learned),
      renderFold('built', 'built', entry.did),
      renderFold('issue', 'issue / blocker', entry.stuck),
      renderFold('next', 'next', entry.next)
    ].filter(Boolean).join('');

    const links = Array.isArray(entry.links) && entry.links.length
      ? `<div class="log-links">${entry.links.map(link => `<a class="log-link" href="${escapeHTML(link.url || '#')}"${/^https?:\/\//.test(link.url || '') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(link.label || 'Related link')} ↗</a>`).join('')}</div>`
      : '';

    const serial = String(sortedEntries.length - index).padStart(3, '0');

    return `
      <article class="log-entry" data-tags="${escapeHTML(tags.join(' '))}">
        <div class="log-entry-card">
          <div class="log-entry-meta">
            <div class="log-entry-meta-left">
              <time class="log-date" datetime="${escapeHTML(entry.date || '')}">${escapeHTML(formatDate(entry.date || ''))}</time>
              <span class="log-index">entry_${serial}.log</span>
            </div>
            <span class="log-entry-type">${escapeHTML(entry.type || 'Log')}</span>
          </div>

          <h2 class="log-entry-title">${escapeHTML(entry.title || 'Untitled entry')}</h2>
          ${entry.summary ? `<p class="log-entry-summary">${escapeHTML(entry.summary)}</p>` : ''}
          ${tagMarkup}
          ${folds ? `<div class="log-folds">${folds}</div>` : ''}
          ${links}
        </div>
      </article>`;
  }).join('');

  filtersRoot.addEventListener('click', (event) => {
    const button = event.target.closest('.log-filter');
    if (!button) return;

    filtersRoot.querySelectorAll('.log-filter').forEach(filter => filter.classList.remove('active'));
    button.classList.add('active');

    const selected = button.dataset.filter;
    entriesRoot.querySelectorAll('.log-entry').forEach(entry => {
      const tags = (entry.dataset.tags || '').split(' ');
      entry.hidden = selected !== 'all' && !tags.includes(selected);
    });
  });
})();

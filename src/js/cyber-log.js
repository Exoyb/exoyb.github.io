/*
 * CYBER LOG — EDIT THIS ARRAY TO ADD NEW ENTRIES.
 *
 * Each entry becomes a compact expandable card. Inside it, the evidence is split
 * into smaller sections so visitors can inspect only the detail they care about.
 * Newest dates are shown first. Any optional field can be omitted.
 *
 * EXAMPLE:
 * {
 *   date: '2026-09-10',
 *   type: 'Daily Log',
 *   title: 'What I learned today',
 *   summary: 'One sentence explaining what this session was about.',
 *   tags: ['sc-900', 'identity', 'zero-trust'],
 *   did: ['Completed a lab.', 'Tested a configuration.'],
 *   learned: ['First thing I learned.', 'Second thing I learned.'],
 *   tools: ['Kali Linux', 'Wireshark'],
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
    summary: 'Refined the landing page, added content and polished the terminal-style interface — while creating a useful self-inflicted debugging session along the way.',
    tags: ['portfolio', 'html', 'ui', 'debugging'],
    did: [
      'Built the landing-page terminal with hover effects and a flashing pipe-style cursor ready for the cd interaction.',
      'Added more information, photos and formatting across the portfolio.',
      'Added the first Cyber Log entries.'
    ],
    learned: [
      'Small changes can have surprisingly large knock-on effects when markup or scripts are removed.',
      'When something suddenly stops working, retracing the most recent changes is usually a good place to start.'
    ],
    tools: ['HTML', 'CSS', 'JavaScript', 'GitHub'],
    stuck: 'I accidentally deleted the closing script for the boot screen while removing a redundant contact form, then spent about 30 minutes hunting down what I had broken. Whoops!'
  },
  {
    date: '2026-09-09',
    type: 'Portfolio Development',
    title: 'Started my first GitHub project',
    summary: 'Created a GitHub account and started development of my first project: this portfolio.',
    tags: ['github', 'portfolio', 'html'],
    did: [
      'Changed the original single index.html template into one repository containing separate HTML files for each page.',
      'Removed clutter and irrelevant information tabs to make the site more focused and concise.'
    ],
    learned: [
      'A single-page template can be restructured into a multi-page site while keeping everything inside one repository.',
      'A portfolio is clearer when irrelevant or duplicated sections are removed instead of filling space for the sake of it.'
    ],
    tools: ['GitHub', 'HTML', 'CSS']
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
      renderFold('did', 'what I did', entry.did),
      renderFold('learned', 'what I learned', entry.learned),
      renderFold('tools', 'tools used', entry.tools, 'tools'),
      renderFold('issue', 'issue / blocker', entry.stuck),
      renderFold('next', 'next steps', entry.next)
    ].filter(Boolean).join('');

    const links = Array.isArray(entry.links) && entry.links.length
      ? `<div class="log-links">${entry.links.map(link => `<a class="log-link" href="${escapeHTML(link.url || '#')}"${/^https?:\/\//.test(link.url || '') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(link.label || 'Related link')} ↗</a>`).join('')}</div>`
      : '';

    const serial = String(sortedEntries.length - index).padStart(3, '0');

    return `
      <article class="log-entry" data-tags="${escapeHTML(tags.join(' '))}">
        <details class="log-entry-card">
          <summary class="log-entry-toggle">
            <div class="log-entry-meta">
              <div class="log-entry-meta-left">
                <time class="log-date" datetime="${escapeHTML(entry.date || '')}">${escapeHTML(formatDate(entry.date || ''))}</time>
                <span class="log-index">entry_${serial}.log</span>
              </div>
              <span class="log-entry-type">${escapeHTML(entry.type || 'Log')}</span>
            </div>

            <div class="log-entry-heading">
              <span class="log-entry-switch" aria-hidden="true"></span>
              <div>
                <h2 class="log-entry-title">${escapeHTML(entry.title || 'Untitled entry')}</h2>
                ${entry.summary ? `<p class="log-entry-summary">${escapeHTML(entry.summary)}</p>` : ''}
              </div>
            </div>
            ${tagMarkup}
            <span class="log-entry-hint">inspect entry</span>
          </summary>

          <div class="log-entry-content">
            ${folds ? `<div class="log-folds">${folds}</div>` : '<p class="log-no-detail">No additional notes for this entry yet.</p>'}
            ${links}
          </div>
        </details>
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

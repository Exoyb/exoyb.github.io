/*
 * CYBER LOG — THIS IS THE ONLY SECTION YOU NEED TO EDIT FOR NEW ENTRIES.
 *
 * Copy the example object below into cyberLogEntries, remove the leading //
 * from each line, then change the values. Newest dates are shown first.
 *
 * You can delete any optional field you do not need.
 *
 * EXAMPLE:
 * {
 *   date: '2026-09-10',
 *   type: 'Daily Log',
 *   title: 'What I learned today',
 *   summary: 'A short intro explaining what the session was about.',
 *   tags: ['sc-900', 'identity', 'zero-trust'],
 *   learned: [
 *     'First thing I learned.',
 *     'Second thing I learned.'
 *   ],
 *   did: [
 *     'Completed a lab or practical exercise.',
 *     'Used a command or tool.'
 *   ],
 *   stuck: 'Something that confused me or that I want to revisit.',
 *   next: 'The next topic or practical task I want to tackle.',
 *   links: [
 *     { label: 'Related project', url: 'projects.html' }
 *   ]
 * }
 */

const cyberLogEntries = [
  // Add new entries here.
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

  const renderList = (items) => {
    if (!Array.isArray(items) || !items.length) return '';
    return `<ul>${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
  };

  const renderText = (value) => value ? `<p>${escapeHTML(value)}</p>` : '';

  const renderDetail = (className, heading, value) => {
    if (!value || (Array.isArray(value) && !value.length)) return '';
    const body = Array.isArray(value) ? renderList(value) : renderText(value);
    return `<section class="log-detail ${className}"><h3>${heading}</h3>${body}</section>`;
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

    const detailMarkup = [
      renderDetail('learned', 'What I learned', entry.learned),
      renderDetail('did', 'What I did', entry.did),
      renderDetail('stuck', 'What confused me', entry.stuck),
      renderDetail('next', 'Next', entry.next)
    ].filter(Boolean).join('');

    const links = Array.isArray(entry.links) && entry.links.length
      ? `<div class="log-links">${entry.links.map(link => `<a class="log-link" href="${escapeHTML(link.url || '#')}"${/^https?:\/\//.test(link.url || '') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(link.label || 'Related link')} ↗</a>`).join('')}</div>`
      : '';

    const serial = String(sortedEntries.length - index).padStart(3, '0');

    return `
      <article class="log-entry" data-tags="${escapeHTML(tags.join(' '))}">
        <div class="log-entry-meta">
          <time class="log-date" datetime="${escapeHTML(entry.date || '')}">${escapeHTML(formatDate(entry.date || ''))}</time>
          <span class="log-index">entry_${serial}.log</span>
        </div>
        <div class="log-entry-card">
          <div class="log-entry-header">
            <h2 class="log-entry-title">${escapeHTML(entry.title || 'Untitled entry')}</h2>
            <span class="log-entry-type">${escapeHTML(entry.type || 'Log')}</span>
          </div>
          ${entry.summary ? `<p class="log-entry-summary">${escapeHTML(entry.summary)}</p>` : ''}
          ${tagMarkup}
          ${detailMarkup ? `<div class="log-detail-grid">${detailMarkup}</div>` : ''}
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

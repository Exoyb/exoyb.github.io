/*
 * CYBER LOG — EDIT THIS ARRAY TO ADD NEW ENTRIES.
 *
 * Each entry becomes a compact expandable card. The closed view deliberately
 * shows the entry number, date and title. Supporting context, tags and evidence
 * appear once the entry is opened so the feed stays easy to scan as it grows.
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
    type: 'Portfolio Development // Patch Notes',
    title: 'Refining the portfolio — full patch notes',
    summary: 'A major polish pass across the portfolio focused on presentation, interaction, feedback evidence, boot-sequence immersion and small details that make the site feel more like a system than a template.',
    tags: ['portfolio', 'html', 'css', 'javascript', 'ui', 'debugging', 'audio', 'easter-egg'],
    did: [
      '[NEW FEATURE] Added a hidden Easter egg on the homepage, triggered by a keyboard sequence and rendered as a full-screen Matrix-style display override.',
      'Added an encrypted transmission clue to the Cyber Log that decrypts on hover/focus and points back to the hidden homepage sequence.',
      'Reworked the homepage into a terminal-style directory interface with clearer navigation, live cd path previewing and a stronger cyber/security identity.',
      'Added hover-to-decrypt behaviour to the homepage role banner.',
      'Added a full power-on gate before the homepage boot sequence so the system stays OFF until the visitor explicitly powers it on.',
      'Changed the power screen so it starts genuinely dark: muted panel, dim labels, inactive power symbol and almost no ambient lighting.',
      'Added a staged power-up animation so the panel, text, indicators and power LED visibly wake up after the button is pressed.',
      'Added a CRT-style electrical click/thump, low cabinet hit and short high-voltage whine to make power-on feel physical rather than like a normal UI interaction.',
      'Changed the boot flow so POST and SSH only begin after power-on, rather than progressing in the background while the visitor waits.',
      'Fixed a lifecycle conflict where the older generic boot timer could hide the boot screen before the new POST/SSH sequence had finished.',
      'Removed the brief green flash that appeared on first paint by moving the OFF-state styling into critical page-head CSS.',
      'Added a human-paced SSH command typing sequence with variable character delays.',
      'Added quiet per-character terminal/typewriter clicks to the visible SSH command so the typing feels physically keyed in.',
      'Kept password entry visually hidden while retaining the authentication pause and successful login sequence.',
      'Added a deliberate final hold after successful SSH authentication so the final login line can actually be read before the site appears.',
      'Expanded the site audio system with separate UI, boot, authentication, typing, Matrix and power-on sound behaviours.',
      'Added a stronger mouse-follow glow across the site and then tuned it down to a tighter radius with a brighter green centre and subtle cyan falloff.',
      'Added terminal-style page transitions so internal navigation briefly shows a cd command before changing page.',
      'Added a scroll progress indicator to the top navigation.',
      'Standardised terminal identity across pages around the exoyb@portfolio shell prompt.',
      'Normalised navigation labels into terminal-style directory paths such as >/about/ and >/projects/.',
      'Added consistent glow/hover treatment to cards, terminals, review panels and other interactive surfaces.',
      'Added staggered reveal animations to page content while respecting reduced-motion preferences.',
      'Built a dedicated Feedback page with expandable employer sections instead of presenting everything as one wall of text.',
      'Added a Caseware feedback section containing formal manager feedback and ranked client CSAT comments.',
      'Added the Caseware aggregate of 4.90/5 across 29 supplied responses, with 28 comments shown and the unresolved-status response deliberately omitted from display.',
      'Ranked Caseware comments by usefulness/strength rather than chronology so the most meaningful evidence appears first.',
      'Added Cash Converters review evidence with selected written examples and original review screenshots.',
      'Added the detailed after-sales DHL recovery review as a featured example of ownership, communication and customer care.',
      'Added a Kwik Fit section using the one currently attributable public review that specifically references calm, professional handling of a difficult customer.',
      'Added a review lightbox so original screenshots can be opened and inspected properly rather than being squeezed into the page.',
      'Added responsive styling and accessibility considerations across the new interactions, including real buttons, focus states, keyboard support and reduced-motion handling.',
      'Added cache-busting version updates while iterating so new CSS/JavaScript changes reliably replace older browser-cached files.'
    ],
    learned: [
      'Tiny timing differences between initial HTML/CSS paint and later JavaScript can create visible flashes, even when they only last a fraction of a second.',
      'Interactive effects feel much more convincing when their visual, timing and audio states all share the same lifecycle.',
      'Browser audio restrictions are easier to work with when sound starts from a genuine user gesture instead of trying to autoplay.',
      'Layering new behaviour on top of older generic handlers can create hidden conflicts, so ownership of a UI lifecycle needs to be clear.',
      'Evidence is stronger when it is curated and structured rather than simply dumping every review or metric onto one page.',
      'Small interface details — typing rhythm, light intensity, hover radius, delayed fades and consistent shell language — have a disproportionate effect on how polished a site feels.'
    ],
    tools: ['HTML', 'CSS', 'JavaScript', 'Web Audio API', 'GitHub'],
    stuck: 'The biggest debugging issue was the boot screen being controlled by more than one script. A legacy timeout and skip handler could still hide the screen even though the new power-gated POST/SSH sequence had not finished. I also had to remove a first-paint flash where the powered green state briefly appeared before the OFF-state overrides loaded.',
    next: 'Keep tightening the details, add new security learning/projects as they are completed, and only add portfolio features that improve the experience or prove something useful.'
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

// Exoyb shared UI system
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    const addHeadIdentity = () => {
        if (!document.querySelector('link[rel="icon"]')) {
            const icon = document.createElement('link');
            icon.rel = 'icon';
            icon.type = 'image/svg+xml';
            icon.href = 'src/assets/favicon.svg';
            document.head.appendChild(icon);
        }

        if (!document.querySelector('meta[name="theme-color"]')) {
            const theme = document.createElement('meta');
            theme.name = 'theme-color';
            theme.content = '#0d100f';
            document.head.appendChild(theme);
        }
    };

    const addInteractiveStyles = () => {
        if (document.getElementById('exoyb-interactive-styles')) return;
        const style = document.createElement('style');
        style.id = 'exoyb-interactive-styles';
        style.textContent = `
            .terminal-session-title {
                margin-left: .45rem;
                color: #707974;
                font-size: .82rem;
                white-space: nowrap;
            }
            .terminal-page-transition {
                position: fixed;
                left: 50%;
                bottom: 1.35rem;
                z-index: 5000;
                display: flex;
                align-items: center;
                max-width: calc(100vw - 2rem);
                padding: .62rem .9rem;
                border: 1px solid rgba(0,255,140,.68);
                border-radius: 6px;
                color: #d9dedb;
                background: rgba(9,9,10,.96);
                box-shadow: 0 0 15px rgba(0,255,140,.14), 0 12px 38px rgba(0,0,0,.46);
                font: 500 .82rem/1.2 var(--font-mono, monospace);
                opacity: 0;
                transform: translate(-50%, 7px);
                pointer-events: none;
                transition: opacity .08s linear, transform .12s ease;
            }
            .terminal-page-transition.show {
                opacity: 1;
                transform: translate(-50%, 0);
            }
            .transition-prompt { color: var(--green, #00ff8c); font-weight: 700; margin-right: .45rem; }
            .transition-command { color: #e5e8e6; white-space: nowrap; }
            .transition-cursor {
                width: 3px;
                height: 1.05em;
                margin-left: 4px;
                background: var(--green, #00ff8c);
                box-shadow: 0 0 8px rgba(0,255,140,.72);
                animation: transitionCursorBlink .22s steps(1,end) 1;
            }
            body.page-transitioning main,
            body.page-transitioning .hero {
                opacity: .94;
                filter: brightness(.94);
                transition: opacity .18s linear, filter .18s linear;
            }
            .nav-app-separator {
                width: 1px;
                height: 22px;
                margin: 0 -.25rem 0 .05rem;
                background: linear-gradient(180deg, transparent, rgba(0,255,140,.34), transparent);
                box-shadow: 0 0 9px rgba(0,255,140,.08);
            }
            .nav-links .nav-app-link {
                display: inline-flex;
                align-items: center;
                gap: .48rem;
                padding: .34rem .62rem;
                color: #d7ded9;
                border: 1px solid rgba(0,255,140,.32);
                border-radius: 5px;
                background: linear-gradient(180deg, rgba(255,255,255,.025), rgba(0,255,140,.018));
                box-shadow: inset 0 1px 0 rgba(255,255,255,.025), 0 0 10px rgba(0,255,140,.035);
                font-size: .82rem;
                letter-spacing: .01em;
                white-space: nowrap;
                transition: color .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease, transform .18s ease;
            }
            .nav-links .nav-app-link::before {
                content: '';
                width: 7px;
                height: 7px;
                flex: 0 0 auto;
                border-radius: 50%;
                background: var(--green, #00ff8c);
                box-shadow: 0 0 8px rgba(0,255,140,.72);
            }
            .nav-links .nav-app-link:hover,
            .nav-links .nav-app-link:focus-visible,
            .nav-links .nav-app-link.active {
                color: #f0f4f1;
                border-color: rgba(0,255,140,.72);
                background: rgba(0,255,140,.045);
                box-shadow: 0 0 16px rgba(0,255,140,.11), 0 0 30px rgba(0,255,140,.035);
                text-shadow: 0 0 10px rgba(0,255,140,.22);
                transform: translateY(-1px);
            }
            .nav-links .nav-app-link.active::after { content: none; }
            @keyframes transitionCursorBlink {
                0%, 42% { opacity: 1; }
                43%, 78% { opacity: 0; }
                79%, 100% { opacity: 1; }
            }
            @media (max-width: 820px) {
                .nav-app-separator {
                    width: 100%;
                    height: 1px;
                    margin: .35rem 0 .25rem;
                    background: linear-gradient(90deg, rgba(0,255,140,.32), transparent 74%);
                }
                .nav-links .nav-app-link {
                    width: max-content;
                    margin: .2rem .4rem .1rem;
                }
            }
            @media (max-width: 560px) {
                .terminal-page-transition { bottom: .8rem; font-size: .76rem; }
            }
            @media (prefers-reduced-motion: reduce) {
                .terminal-page-transition,
                body.page-transitioning main,
                body.page-transitioning .hero { transition: none; }
                .transition-cursor { animation: none; }
                .nav-links .nav-app-link:hover,
                .nav-links .nav-app-link:focus-visible,
                .nav-links .nav-app-link.active { transform: none; }
            }
        `;
        document.head.appendChild(style);
    };

    const normaliseNavigation = () => {
        const navLinksContainer = document.getElementById('navLinks');
        if (!navLinksContainer) return;

        navLinksContainer.querySelectorAll(
            'a[href="blog.html"], a[href="education.html"], a[href="certifications.html"], a[href="skills.html"], a[href="experience.html"], a[href="contact.html"]'
        ).forEach(link => link.remove());

        const ensureLink = (href, label, beforeHref = null) => {
            if (navLinksContainer.querySelector(`a[href="${href}"]`)) return;
            const link = document.createElement('a');
            link.href = href;
            link.textContent = label;
            const before = beforeHref ? navLinksContainer.querySelector(`a[href="${beforeHref}"]`) : null;
            navLinksContainer.insertBefore(link, before || null);
        };

        ensureLink('training.html', 'Training', 'projects.html');
        ensureLink('cyber-log.html', 'Cyber Log', 'feedback.html');
        ensureLink('feedback.html', 'Feedback');

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinksContainer.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href') || '';
            const file = href.split('#')[0].split('/').pop();
            const page = file.replace('.html', '');
            if (page) link.textContent = `>/${page.toLowerCase()}/`;
            link.classList.toggle('active', file === currentPage);
            link.addEventListener('click', () => closeMenu());
        });

        let separator = navLinksContainer.querySelector('.nav-app-separator');
        if (!separator) {
            separator = document.createElement('span');
            separator.className = 'nav-app-separator';
            separator.setAttribute('aria-hidden', 'true');
            navLinksContainer.appendChild(separator);
        }

        let appLink = navLinksContainer.querySelector('.nav-app-link');
        if (!appLink) {
            appLink = document.createElement('a');
            appLink.className = 'nav-app-link';
            navLinksContainer.appendChild(appLink);
        }

        appLink.href = 'asteroid-miner.html';
        appLink.textContent = 'Asteroid_Miner.exe';
        appLink.setAttribute('aria-label', 'Open Asteroid Miner');
        appLink.classList.toggle('active', currentPage === 'asteroid-miner.html');
        appLink.addEventListener('click', () => closeMenu());
    };

    const normaliseTerminalIdentity = () => {
        document.querySelectorAll('.logo a').forEach(link => {
            link.textContent = '$ ./Exoyb.sh';
        });

        document.querySelectorAll('.directory-shell-title').forEach(title => {
            title.textContent = 'exoyb@portfolio: ~';
        });

        document.querySelectorAll('.cd-terminal-header').forEach(header => {
            let title = header.querySelector('.terminal-session-title');
            const legacyTitle = header.querySelector('.about-mini-title');

            if (legacyTitle) {
                legacyTitle.className = 'terminal-session-title';
                title = legacyTitle;
            }

            if (!title) {
                title = document.createElement('span');
                title.className = 'terminal-session-title';
                header.appendChild(title);
            }

            title.textContent = 'exoyb@portfolio: ~';
        });

        document.querySelectorAll('.cd-terminal-body').forEach(body => {
            let currentPath = '~';

            body.querySelectorAll('p').forEach(line => {
                const prompt = line.querySelector('.prompt');
                if (!prompt) return;

                prompt.innerHTML = `<span class="shell-user">exoyb@portfolio</span><span class="shell-separator">:</span><span class="shell-path">${currentPath}</span><span class="shell-prompt">$</span>`;

                const command = line.querySelector('.cd-command')?.textContent.trim() || '';
                const cdMatch = command.match(/^cd\s+(\S+)$/);
                if (cdMatch) currentPath = cdMatch[1];
            });
        });
    };

    const repairLegacyLinks = () => {
        const swaps = [
            ['a[href="blog.html"]', 'cyber-log.html', '/blog', '/cyber-log'],
            ['a[href="education.html"]', 'training.html', '/education', '/training'],
            ['a[href="certifications.html"]', 'training.html', '/certifications', '/training'],
            ['a[href="skills.html"]', 'about.html', '/skills', '/about'],
            ['a[href="experience.html"]', 'about.html', '/experience', '/about'],
            ['a[href="contact.html"]', 'about.html#contact', '/contact', '/about#contact']
        ];

        swaps.forEach(([selector, href, from, to]) => {
            document.querySelectorAll(selector).forEach(link => {
                link.href = href;
                if (link.textContent.includes(from)) link.textContent = link.textContent.replace(from, to);
            });
        });
    };

    const setupScrollProgress = () => {
        const nav = document.querySelector('nav');
        if (!nav) return;

        const progress = document.createElement('div');
        progress.className = 'scroll-progress';
        progress.setAttribute('aria-hidden', 'true');
        progress.innerHTML = '<div class="scroll-progress-bar"></div>';
        nav.appendChild(progress);
        const bar = progress.firstElementChild;

        let ticking = false;
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const value = max > 1 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            bar.style.transform = `scaleX(${value})`;
            progress.style.opacity = max > 1 ? '1' : '0';
            ticking = false;
        };

        const requestUpdate = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate, { passive: true });
        requestUpdate();
    };

    const setupPointerGlow = () => {
        if (!finePointer || reducedMotion) return;
        let frame = 0;
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        window.addEventListener('pointermove', event => {
            x = event.clientX;
            y = event.clientY;
            if (frame) return;
            frame = requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--pointer-x', `${x}px`);
                document.documentElement.style.setProperty('--pointer-y', `${y}px`);
                frame = 0;
            });
        }, { passive: true });
    };

    const setupPageTransitions = () => {
        const overlay = document.createElement('div');
        overlay.className = 'terminal-page-transition';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = '<span class="transition-prompt">exoyb@portfolio:~$</span><span class="transition-command"></span><span class="transition-cursor"></span>';
        document.body.appendChild(overlay);
        const commandOutput = overlay.querySelector('.transition-command');
        let navigating = false;

        const directoryForUrl = url => {
            const file = url.pathname.split('/').filter(Boolean).pop() || '';
            if (!file || file === 'index.html') return '/home/';
            if (file.endsWith('.html')) return `/${file.replace('.html', '')}/`;
            return `/${file.replace(/^\/+|\/+$/g, '')}/`;
        };

        document.addEventListener('click', event => {
            if (navigating || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const link = event.target.closest('a[href]');
            if (!link || link.hasAttribute('download') || link.target === '_blank') return;

            const rawHref = link.getAttribute('href');
            if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) return;

            let url;
            try { url = new URL(link.href, window.location.href); } catch (_) { return; }
            if (url.origin !== window.location.origin) return;

            const sameDocument = url.pathname === window.location.pathname && url.search === window.location.search;
            if (sameDocument && url.hash) return;
            if (sameDocument && !url.hash) return;

            event.preventDefault();
            navigating = true;

            const directory = directoryForUrl(url);
            commandOutput.textContent = `cd ${directory}`;
            overlay.classList.add('show');
            document.body.classList.add('page-transitioning');

            const homepageTarget = document.getElementById('directoryTarget');
            if (homepageTarget) homepageTarget.textContent = directory;

            window.location.href = url.href;
        });
    };

    const glowSelectors = [
        '.directory-link', '.cd-terminal', '.content-card', '.detail-item', '.project-card',
        '.about-stat', '.about-mini-terminal', '.about-photo-frame', '.story-panel',
        '.bring-card', '.career-step', '.contact-card', '.training-card',
        '.credential-card', '.training-platform-card', '.manager-feature', '.manager-card',
        '.review-card', '.review-shot', '.log-entry-card'
    ].join(',');

    const decorateGlowSurfaces = (root = document) => {
        root.querySelectorAll?.(glowSelectors).forEach(element => element.classList.add('glow-surface'));
    };

    const setupRevealMotion = () => {
        if (reducedMotion || !('IntersectionObserver' in window)) return;

        const staggerGroups = [
            '.shell-directory-grid', '.about-stats', '.career-steps', '.bring-grid',
            '.about-contact-grid', '.training-grid', '.project-showcase', '.project-method',
            '.manager-grid', '.review-grid', '.review-gallery'
        ];

        staggerGroups.forEach(selector => {
            document.querySelectorAll(selector).forEach(group => {
                [...group.children].forEach((child, index) => {
                    child.classList.add('fade-in');
                    child.dataset.revealIndex = String(index);
                });
            });
        });

        document.body.classList.add('motion-enabled');
        const elements = [...document.querySelectorAll('.fade-in')];

        elements.forEach((element, index) => {
            element.classList.add('reveal-pending');
            const localIndex = Number(element.dataset.revealIndex);
            const staggerIndex = Number.isFinite(localIndex) ? localIndex : index % 4;
            element.style.setProperty('--reveal-delay', `${Math.min(staggerIndex, 5) * 65}ms`);
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: .08, rootMargin: '0px 0px -45px 0px' });

        elements.forEach(element => observer.observe(element));
    };

    const setupDirectoryPreview = () => {
        const target = document.getElementById('directoryTarget');
        const links = document.querySelectorAll('[data-directory]');
        if (!target || !links.length) return;

        const reset = () => { target.textContent = '[choose-directory]'; };
        links.forEach(link => {
            const show = () => { target.textContent = link.dataset.directory || '[choose-directory]'; };
            link.addEventListener('mouseenter', show);
            link.addEventListener('focus', show);
            link.addEventListener('mouseleave', reset);
            link.addEventListener('blur', reset);
        });
    };

    const setupSmoothAnchors = () => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', event => {
                const selector = link.getAttribute('href');
                if (!selector || selector === '#') return;
                const target = document.querySelector(selector);
                if (!target) return;
                event.preventDefault();
                const offset = 88;
                window.scrollTo({ top: target.offsetTop - offset, behavior: reducedMotion ? 'auto' : 'smooth' });
            });
        });
    };

    const setupReviewLightbox = () => {
        const reviewLinks = [...document.querySelectorAll('.review-shot a')];
        if (!reviewLinks.length) return;

        const lightbox = document.createElement('div');
        lightbox.className = 'review-lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Review screenshot viewer');
        lightbox.innerHTML = `
            <button class="lightbox-close" type="button" aria-label="Close review viewer">×</button>
            <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous review">‹</button>
            <img class="review-lightbox-image" alt="">
            <button class="lightbox-nav lightbox-next" type="button" aria-label="Next review">›</button>
            <div class="review-lightbox-caption"></div>`;
        document.body.appendChild(lightbox);

        const image = lightbox.querySelector('.review-lightbox-image');
        const caption = lightbox.querySelector('.review-lightbox-caption');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        let index = 0;
        let returnFocus = null;

        const show = nextIndex => {
            index = (nextIndex + reviewLinks.length) % reviewLinks.length;
            const link = reviewLinks[index];
            const img = link.querySelector('img');
            const figcaption = link.closest('figure')?.querySelector('figcaption');
            image.src = link.href;
            image.alt = img?.alt || 'Review screenshot';
            caption.textContent = figcaption?.textContent || '';
        };

        const open = nextIndex => {
            returnFocus = document.activeElement;
            show(nextIndex);
            lightbox.classList.add('open');
            document.body.classList.add('lightbox-open');
            closeButton.focus();
        };

        const close = () => {
            lightbox.classList.remove('open');
            document.body.classList.remove('lightbox-open');
            if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
        };

        reviewLinks.forEach((link, linkIndex) => {
            link.addEventListener('click', event => {
                event.preventDefault();
                open(linkIndex);
            });
        });

        closeButton.addEventListener('click', close);
        prevButton.addEventListener('click', () => show(index - 1));
        nextButton.addEventListener('click', () => show(index + 1));
        lightbox.addEventListener('click', event => {
            if (event.target === lightbox) close();
        });

        document.addEventListener('keydown', event => {
            if (!lightbox.classList.contains('open')) return;
            if (event.key === 'Escape') close();
            if (event.key === 'ArrowLeft') show(index - 1);
            if (event.key === 'ArrowRight') show(index + 1);
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        addHeadIdentity();
        addInteractiveStyles();
        normaliseNavigation();
        normaliseTerminalIdentity();
        repairLegacyLinks();
        setupScrollProgress();
        setupPointerGlow();
        setupPageTransitions();
        decorateGlowSurfaces();
        setupRevealMotion();
        setupDirectoryPreview();
        setupSmoothAnchors();
        setupReviewLightbox();

        const mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches?.(glowSelectors)) node.classList.add('glow-surface');
                    decorateGlowSurfaces(node);
                }
            }));
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });
    });
})();

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('active');
}

/* One-shot page-title decode. All characters scramble together, then the full title snaps into place. */
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=/<>[]{}';

    const decodeTitle = element => {
        const target = element.textContent || '';
        if (!target.trim() || reducedMotion) return;

        const frames = 14;
        let frame = 0;

        const scramble = () => {
            element.textContent = [...target].map(character => {
                if (character === ' ' || character === '|') return character;
                return glyphs[Math.floor(Math.random() * glyphs.length)];
            }).join('');
        };

        scramble();

        const timer = window.setInterval(() => {
            frame += 1;

            if (frame >= frames) {
                window.clearInterval(timer);
                element.textContent = target;
                return;
            }

            scramble();
        }, 28);
    };

    const setupPageTitleDecode = () => {
        /* Home keeps its existing hover-decrypt identity treatment. */
        if (document.querySelector('.home-hero')) return;
        document.querySelectorAll('main h1').forEach(decodeTitle);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.setTimeout(setupPageTitleDecode, 90), { once: true });
    } else {
        window.setTimeout(setupPageTitleDecode, 90);
    }
})();

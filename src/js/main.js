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

    const setupBoot = () => {
        const bootScreen = document.getElementById('bootScreen');
        if (!bootScreen) return;

        let hidden = false;
        const hideBoot = () => {
            if (hidden) return;
            hidden = true;
            bootScreen.classList.add('fade-out');
            window.setTimeout(() => {
                bootScreen.hidden = true;
            }, reducedMotion ? 0 : 380);
        };

        window.setTimeout(hideBoot, reducedMotion ? 500 : 5900);
        document.addEventListener('keydown', hideBoot, { once: true });
        bootScreen.addEventListener('click', hideBoot, { once: true });
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
            if (page) link.textContent = `>/${page.toLowerCase()}`;
            link.classList.toggle('active', file === currentPage);
            link.addEventListener('click', () => closeMenu());
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

    const glowSelectors = [
        '.directory-link', '.cd-terminal', '.content-card', '.detail-item',
        '.about-stat', '.about-mini-terminal', '.about-photo-frame', '.story-panel',
        '.bring-card', '.career-step', '.contact-card', '.training-card',
        '.education-feature', '.credential-empty', '.manager-feature', '.manager-card',
        '.review-card', '.review-shot', '.log-entry-card'
    ].join(',');

    const decorateGlowSurfaces = (root = document) => {
        root.querySelectorAll?.(glowSelectors).forEach(element => element.classList.add('glow-surface'));
    };

    const setupRevealMotion = () => {
        if (reducedMotion || !('IntersectionObserver' in window)) return;
        document.body.classList.add('motion-enabled');
        const elements = [...document.querySelectorAll('.fade-in')];
        elements.forEach((element, index) => {
            element.classList.add('reveal-pending');
            element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
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
            show(nextIndex);
            lightbox.classList.add('open');
            document.body.classList.add('lightbox-open');
            closeButton.focus();
        };

        const close = () => {
            lightbox.classList.remove('open');
            document.body.classList.remove('lightbox-open');
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
        setupBoot();
        repairLegacyLinks();
        normaliseNavigation();
        setupScrollProgress();
        setupPointerGlow();
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

// Exoyb portfolio shared interactions

document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('bootScreen');

    if (bootScreen) {
        const hideBoot = () => {
            bootScreen.classList.add('fade-out');
            setTimeout(() => {
                bootScreen.style.display = 'none';
            }, 500);
        };

        setTimeout(hideBoot, 6000);
        document.addEventListener('keydown', hideBoot, { once: true });
        bootScreen.addEventListener('click', hideBoot, { once: true });
    }

    const navLinksContainer = document.getElementById('navLinks');

    if (navLinksContainer) {
        // Blog has been retired. Remove any legacy Blog links from older page markup.
        navLinksContainer.querySelectorAll('a[href="blog.html"]').forEach(link => link.remove());

        // Education and Certifications are now one focused Training page.
        navLinksContainer.querySelectorAll('a[href="education.html"], a[href="certifications.html"]').forEach(link => link.remove());

        if (!navLinksContainer.querySelector('a[href="training.html"]')) {
            const trainingLink = document.createElement('a');
            trainingLink.href = 'training.html';
            trainingLink.textContent = 'Training';
            const projectsLink = navLinksContainer.querySelector('a[href="projects.html"]');
            navLinksContainer.insertBefore(trainingLink, projectsLink || null);
        }

        // Keep Cyber Log available exactly once across every page.
        if (!navLinksContainer.querySelector('a[href="cyber-log.html"]')) {
            const cyberLogLink = document.createElement('a');
            cyberLogLink.href = 'cyber-log.html';
            cyberLogLink.textContent = 'Cyber Log';
            const feedbackLink = navLinksContainer.querySelector('a[href="feedback.html"]');
            const contactLink = navLinksContainer.querySelector('a[href="contact.html"]');
            navLinksContainer.insertBefore(cyberLogLink, feedbackLink || contactLink || null);
        }

        // Keep Feedback available in the shared toolbar even on older page markup.
        if (!navLinksContainer.querySelector('a[href="feedback.html"]')) {
            const feedbackLink = document.createElement('a');
            feedbackLink.href = 'feedback.html';
            feedbackLink.textContent = 'Feedback';
            const contactLink = navLinksContainer.querySelector('a[href="contact.html"]');
            navLinksContainer.insertBefore(feedbackLink, contactLink || null);
        }
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Keep the top navigation consistent with the terminal/directory theme.
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const page = href.split('/').pop().replace('.html', '').replace(/^#/, '');
        if (page) link.textContent = `>/${page.toLowerCase()}`;
        if (href.split('/').pop() === currentPage) link.classList.add('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                }
            }
        });
    });

    const directoryTarget = document.getElementById('directoryTarget');
    const directoryLinks = document.querySelectorAll('[data-directory]');

    if (directoryTarget && directoryLinks.length) {
        const resetPrompt = () => {
            directoryTarget.textContent = '[choose-directory]';
        };

        directoryLinks.forEach(link => {
            const updatePrompt = () => {
                directoryTarget.textContent = link.dataset.directory || '[choose-directory]';
            };

            link.addEventListener('mouseenter', updatePrompt);
            link.addEventListener('focus', updatePrompt);
            link.addEventListener('mouseleave', resetPrompt);
            link.addEventListener('blur', resetPrompt);
        });
    }

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('lazy-section');
        lazyObserver.observe(section);
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-progress').forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => { bar.style.width = width; }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-category').forEach(category => skillObserver.observe(category));

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('active');
}

let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.style.overflowY = 'auto';
    }, 150);
}, { passive: true });

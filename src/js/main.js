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
        // Retired pages: keep them out of the visible navigation.
        navLinksContainer.querySelectorAll(
            'a[href="blog.html"], a[href="education.html"], a[href="certifications.html"], a[href="skills.html"], a[href="experience.html"], a[href="contact.html"]'
        ).forEach(link => link.remove());

        // Training replaces Education + Certifications.
        if (!navLinksContainer.querySelector('a[href="training.html"]')) {
            const trainingLink = document.createElement('a');
            trainingLink.href = 'training.html';
            trainingLink.textContent = 'Training';
            const projectsLink = navLinksContainer.querySelector('a[href="projects.html"]');
            navLinksContainer.insertBefore(trainingLink, projectsLink || null);
        }

        // Cyber Log replaces Blog.
        if (!navLinksContainer.querySelector('a[href="cyber-log.html"]')) {
            const cyberLogLink = document.createElement('a');
            cyberLogLink.href = 'cyber-log.html';
            cyberLogLink.textContent = 'Cyber Log';
            const feedbackLink = navLinksContainer.querySelector('a[href="feedback.html"]');
            navLinksContainer.insertBefore(cyberLogLink, feedbackLink || null);
        }

        if (!navLinksContainer.querySelector('a[href="feedback.html"]')) {
            const feedbackLink = document.createElement('a');
            feedbackLink.href = 'feedback.html';
            feedbackLink.textContent = 'Feedback';
            navLinksContainer.appendChild(feedbackLink);
        }
    }

    // Repair links left in older page actions without needing to maintain duplicate pages.
    document.querySelectorAll('a[href="blog.html"]').forEach(link => {
        link.href = 'cyber-log.html';
        if (link.textContent.includes('/blog')) link.textContent = link.textContent.replace('/blog', '/cyber-log');
    });

    document.querySelectorAll('a[href="education.html"], a[href="certifications.html"]').forEach(link => {
        link.href = 'training.html';
        if (link.textContent.includes('/education')) link.textContent = link.textContent.replace('/education', '/training');
        if (link.textContent.includes('/certifications')) link.textContent = link.textContent.replace('/certifications', '/training');
    });

    document.querySelectorAll('a[href="skills.html"], a[href="experience.html"]').forEach(link => {
        link.href = 'about.html';
        if (link.textContent.includes('/skills')) link.textContent = link.textContent.replace('/skills', '/about');
        if (link.textContent.includes('/experience')) link.textContent = link.textContent.replace('/experience', '/about');
    });

    document.querySelectorAll('a[href="contact.html"]').forEach(link => {
        link.href = 'about.html#contact';
        if (link.textContent.includes('/contact')) link.textContent = link.textContent.replace('/contact', '/about#contact');
    });

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

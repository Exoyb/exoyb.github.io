// Keeps the homepage boot lifecycle under boot-ssh.js control.
// main.js has a generic boot timeout/skip handler; this guard prevents that
// legacy handler from hiding the POST/SSH sequence before it genuinely finishes.
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const bootScreen = document.getElementById('bootScreen');
        if (!bootScreen) return;

        let repairing = false;
        const sshFinished = () => Boolean(
            bootScreen.querySelector('.boot-ssh-login-line.visible')
        );

        const restoreBootIfPremature = () => {
            if (repairing || sshFinished()) return;
            if (!bootScreen.hidden && !bootScreen.classList.contains('fade-out')) return;

            repairing = true;
            bootScreen.hidden = false;
            bootScreen.classList.remove('fade-out');
            repairing = false;
        };

        const observer = new MutationObserver(restoreBootIfPremature);
        observer.observe(bootScreen, {
            attributes: true,
            attributeFilter: ['hidden', 'class']
        });

        // Once SSH has completed, boot-ssh.js owns the normal fade/hide and the
        // guard disconnects so it cannot interfere with the legitimate exit.
        const completionObserver = new MutationObserver(() => {
            if (!sshFinished()) return;
            observer.disconnect();
            completionObserver.disconnect();
        });
        completionObserver.observe(bootScreen, {
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    });
})();

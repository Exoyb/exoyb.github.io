// Adds quiet mechanical key clicks to the visible SSH command typing.
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        let commandNode = null;
        let textObserver = null;

        const attach = () => {
            if (commandNode?.isConnected) return true;
            commandNode = document.querySelector('.boot-ssh-command');
            if (!commandNode) return false;

            let previousLength = commandNode.textContent.length;
            textObserver = new MutationObserver(() => {
                const currentLength = commandNode.textContent.length;
                if (currentLength > previousLength) {
                    window.ExoybAudio?.play('type');
                }
                previousLength = currentLength;
            });
            textObserver.observe(commandNode, { childList: true, characterData: true, subtree: true });
            return true;
        };

        if (attach()) return;

        const bootObserver = new MutationObserver(() => {
            if (!attach()) return;
            bootObserver.disconnect();
        });
        bootObserver.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('pagehide', () => {
            bootObserver.disconnect();
            textObserver?.disconnect();
        }, { once: true });
    });
})();

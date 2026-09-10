// Stronger homepage pointer glow without changing the shared site stylesheet.
(() => {
    const style = document.createElement('style');
    style.id = 'exoyb-pointer-glow-boost';
    style.textContent = `
        body::after {
            background:
                radial-gradient(
                    340px circle at var(--pointer-x) var(--pointer-y),
                    rgba(0,255,140,.19) 0%,
                    rgba(0,255,140,.11) 22%,
                    rgba(0,217,255,.055) 44%,
                    rgba(0,217,255,.018) 62%,
                    transparent 78%
                ) !important;
            opacity: .95 !important;
            filter: saturate(1.35) brightness(1.08);
            transition: opacity .18s ease !important;
        }
    `;
    document.head.appendChild(style);
})();

// Focused homepage pointer glow without changing the shared site stylesheet.
(() => {
    const style = document.createElement('style');
    style.id = 'exoyb-pointer-glow-boost';
    style.textContent = `
        body::after {
            background:
                radial-gradient(
                    220px circle at var(--pointer-x) var(--pointer-y),
                    rgba(0,255,140,.26) 0%,
                    rgba(0,255,140,.15) 24%,
                    rgba(0,217,255,.07) 45%,
                    rgba(0,217,255,.02) 64%,
                    transparent 80%
                ) !important;
            opacity: 1 !important;
            filter: saturate(1.45) brightness(1.12);
            transition: opacity .18s ease !important;
        }
    `;
    document.head.appendChild(style);
})();

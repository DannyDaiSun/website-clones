/* ============================================
   Apple Clone — Shared Components
   ============================================
   
   Usage pattern for any page:
   
   1. Add placeholder elements in HTML:
      <nav id="globalNav"></nav>          → gets nav injected
      <footer class="site-footer"></footer> → gets footer injected
   
   2. Include at end of <body>:
      <script src="components.js"></script>
      <script src="script.js"></script>
   
   3. Pass page config to set active nav item:
      <script>
        if (window.AppleComponents) AppleComponents.init({ activePage: 'iPhone' });
      </script>
      (called automatically by script.js if AppleComponents exists)
   
   This eliminates ~80 lines of duplicated HTML per page.
   ============================================ */

window.AppleComponents = (function () {
  'use strict';

  // --- SVG icons reused across components ---
  const ICONS = {
    apple: `<svg width="18" height="22" viewBox="0 0 18 22" fill="currentColor">
      <path d="M15.2 11.3c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9s-1.9-.9-3.2-.8c-1.6 0-3.1.9-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.7-3.8zM12.7 3.8C13.4 3 13.9 1.8 13.7.6c-1 0-2.3.7-3 1.5S9.8 3.8 10 4.9c1.2.1 2.3-.6 2.7-1.1z"/>
    </svg>`,
    search: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.5 7a4.5 4.5 0 1 0-1.6 3.4l3.8 3.8.7-.7-3.8-3.8A4.5 4.5 0 0 0 11.5 7zM7 10.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
    </svg>`,
    bag: `<svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor">
      <path d="M11.3 4.5V4a4.3 4.3 0 0 0-8.6 0v.5H0V16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4.5h-2.7zM3.7 4a3.3 3.3 0 1 1 6.6 0v.5H3.7V4zM13 16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5.5h1.7V7h1V5.5h4.6V7h1V5.5H13V16z"/>
    </svg>`,
  };

  // --- Nav links with labels and hrefs ---
  const NAV_LINKS = [
    { label: 'Store', href: './store.html' },
    { label: 'Mac', href: './mac.html' },
    { label: 'iPhone', href: './iphone.html' },
    { label: 'iPad', href: '#' },
    { label: 'Watch', href: '#' },
    { label: 'AirPods', href: '#' },
    { label: 'TV & Home', href: '#' },
    { label: 'Entertainment', href: '#' },
    { label: 'Accessories', href: '#' },
    { label: 'Support', href: '#' },
  ];

  // --- Quick links for search ---
  const QUICK_LINKS = [
    { label: 'iPhone 15 Pro', href: './iphone.html' },
    { label: 'MacBook Air', href: './mac.html' },
    { label: 'Apple Store', href: './store.html' },
    { label: 'Mac Studio', href: './mac.html' },
    { label: 'Compare iPhone models', href: './iphone.html' },
  ];

  // --- Footer columns ---
  const FOOTER_COLS = [
    {
      heading: 'Shop and Learn',
      links: [
        { label: 'Store', href: './store.html' },
        { label: 'Mac', href: './mac.html' },
        { label: 'iPhone', href: './iphone.html' },
        { label: 'iPad', href: '#' },
        { label: 'Apple Watch', href: '#' },
        { label: 'AirPods', href: '#' },
      ],
    },
    {
      heading: 'Services',
      links: [
        { label: 'Apple Music', href: '#' },
        { label: 'Apple TV+', href: '#' },
        { label: 'Apple Arcade', href: '#' },
        { label: 'iCloud', href: '#' },
        { label: 'Apple One', href: '#' },
        { label: 'Apple Card', href: '#' },
      ],
    },
    {
      heading: 'Apple Store',
      links: [
        { label: 'Find a Store', href: './store.html' },
        { label: 'Genius Bar', href: '#' },
        { label: 'Today at Apple', href: '#' },
        { label: 'Financing', href: '#' },
        { label: 'Apple Trade In', href: '#' },
        { label: 'Order Status', href: '#' },
      ],
    },
    {
      heading: 'About Apple',
      links: [
        { label: 'Newsroom', href: '#' },
        { label: 'Apple Leadership', href: '#' },
        { label: 'Investors', href: '#' },
        { label: 'Ethics & Compliance', href: '#' },
        { label: 'Events', href: '#' },
        { label: 'Contact Apple', href: '#' },
      ],
    },
  ];

  const FOOTER_BOTTOM_LINKS = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Sales and Refunds', href: '#' },
    { label: 'Site Map', href: '#' },
  ];

  // --- Render functions ---

  function renderNav(activePage) {
    const navLinksHtml = NAV_LINKS.map(link => {
      const activeClass = (activePage && link.label === activePage) ? ' class="active"' : '';
      return `<li><a href="${link.href}"${activeClass}>${link.label}</a></li>`;
    }).join('\n        ');

    const quickLinksHtml = QUICK_LINKS.map(l =>
      `<li><a href="${l.href}">${l.label}</a></li>`
    ).join('\n            ');

    return `
    <div class="nav-wrapper">
      <a href="./index.html" class="nav-logo" aria-label="Apple Home">
        ${ICONS.apple}
      </a>
      <button class="nav-hamburger" id="navHamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="navLinks">
        ${navLinksHtml}
      </ul>
      <button class="nav-search-btn" id="navSearchBtn" aria-label="Search">
        ${ICONS.search}
      </button>
      <a href="./store.html" class="nav-bag" aria-label="Shopping Bag">
        ${ICONS.bag}
      </a>
    </div>
    <!-- Search Overlay -->
    <div class="search-overlay" id="searchOverlay">
      <div class="search-overlay-inner">
        <div class="search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="search-icon">
            <path d="M11.5 7a4.5 4.5 0 1 0-1.6 3.4l3.8 3.8.7-.7-3.8-3.8A4.5 4.5 0 0 0 11.5 7zM7 10.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
          </svg>
          <input type="text" id="searchInput" placeholder="Search apple.com" autocomplete="off">
          <button class="search-close" id="searchClose" aria-label="Close">&times;</button>
        </div>
        <div class="search-suggestions" id="searchSuggestions">
          <h3>Quick Links</h3>
          <ul class="quick-links">
            ${quickLinksHtml}
          </ul>
        </div>
        <div class="search-results" id="searchResults"></div>
      </div>
    </div>`;
  }

  function renderFooter(legalText) {
    legalText = legalText || '* Trade‑in values vary. Additional terms apply. <a href="#">See details</a>';

    const colsHtml = FOOTER_COLS.map(col => `
        <div class="footer-col">
          <h4 class="footer-heading">${col.heading}</h4>
          <ul>
            ${col.links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('\n            ')}
          </ul>
        </div>`).join('');

    const bottomLinksHtml = FOOTER_BOTTOM_LINKS.map(l =>
      `<li><a href="${l.href}">${l.label}</a></li>`
    ).join('\n          ');

    return `
    <div class="footer-wrapper">
      <div class="footer-legal-top">
        <p>${legalText}</p>
      </div>
      <div class="footer-directory">
        ${colsHtml}
      </div>
      <div class="footer-bottom">
        <p>Copyright &copy; 2024 Apple Inc. All rights reserved.</p>
        <ul class="footer-bottom-links">
          ${bottomLinksHtml}
        </ul>
      </div>
    </div>`;
  }

  // --- Initialization ---

  function init(options) {
    options = options || {};
    var activePage = options.activePage || '';
    var legalText = options.legalText || undefined;

    // Inject nav into #globalNav if it exists and is empty
    var navEl = document.getElementById('globalNav');
    if (navEl && !navEl.querySelector('.nav-wrapper')) {
      navEl.innerHTML = renderNav(activePage);
    }

    // Inject footer into .site-footer if it exists and is empty
    var footerEl = document.querySelector('footer.site-footer');
    if (footerEl && !footerEl.querySelector('.footer-wrapper')) {
      footerEl.innerHTML = renderFooter(legalText);
    }
  }

  // Auto-init on DOMContentLoaded with defaults (pages can override via data attributes)
  document.addEventListener('DOMContentLoaded', function () {
    var navEl = document.getElementById('globalNav');
    var activePage = navEl ? navEl.getAttribute('data-active') || '' : '';
    var footerEl = document.querySelector('footer.site-footer');
    var legalText = footerEl ? footerEl.getAttribute('data-legal') || undefined : undefined;

    init({ activePage: activePage, legalText: legalText });
  });

  // Public API
  return {
    init: init,
    renderNav: renderNav,
    renderFooter: renderFooter,
    ICONS: ICONS,
    NAV_LINKS: NAV_LINKS,
    FOOTER_COLS: FOOTER_COLS,
  };

})();

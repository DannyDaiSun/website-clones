/* ============================================
   Discord Clone — script.js
   ============================================ */
(function () {
  'use strict';

  // === Hamburger / Mobile Menu ===
  var hamburger = document.getElementById('navHamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      closeSearch();
    });
  }

  // === Search Overlay ===
  var searchOverlay = document.getElementById('searchOverlay');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var searchClose = document.getElementById('searchClose');

  var searchIndex = [
    { title: 'Voice Channels', desc: 'Crystal-clear voice chat with noise suppression', url: './features.html' },
    { title: 'Text Chat', desc: 'Rich text with markdown, threads, and reactions', url: './features.html#text' },
    { title: 'Screen Share & Streaming', desc: 'Go Live up to 4K 60fps', url: './features.html#streaming' },
    { title: 'Bots & Apps', desc: '500K+ bots in the App Directory', url: './features.html#bots' },
    { title: 'Download for Windows', desc: 'Get Discord for Windows 10+', url: './download.html' },
    { title: 'Download for macOS', desc: 'Get Discord for macOS 10.15+', url: './download.html' },
    { title: 'Download for Linux', desc: 'deb, tar.gz, and rpm packages', url: './download.html' },
    { title: 'Download for iOS', desc: 'Get Discord on the App Store', url: './download.html' },
    { title: 'Download for Android', desc: 'Get Discord on Google Play', url: './download.html' },
    { title: 'Safety Center', desc: 'How Discord protects its community', url: './safety.html' },
    { title: 'AutoMod', desc: 'Automatic content moderation', url: './safety.html' },
    { title: 'Community Guidelines', desc: 'Rules for a positive experience', url: './safety.html' },
    { title: 'Verification Levels', desc: 'Control who can send messages', url: './safety.html' },
    { title: 'Privacy Controls', desc: 'DM restrictions, blocking, invisible mode', url: './safety.html' },
    { title: 'Server Roles', desc: 'Custom roles with colored names and permissions', url: './features.html' },
    { title: 'Nitro', desc: 'Premium features, larger uploads, custom emoji', url: '#' },
  ];

  // Open search with Ctrl+K or Cmd+K
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  function openSearch() {
    if (searchOverlay) {
      searchOverlay.classList.add('open');
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      showSuggestions();
    }
  }

  function closeSearch() {
    if (searchOverlay) searchOverlay.classList.remove('open');
  }

  function showSuggestions() {
    if (!searchResults) return;
    searchResults.innerHTML =
      '<div class="search-suggestions">' +
      '<h4>Quick Links</h4>' +
      '<a href="./features.html">Voice Channels</a>' +
      '<a href="./features.html#text">Text Chat</a>' +
      '<a href="./features.html#streaming">Screen Share & Streaming</a>' +
      '<a href="./download.html">Download for Windows</a>' +
      '<a href="./download.html">Download for Mac</a>' +
      '<a href="./safety.html">Community Guidelines</a>' +
      '</div>';
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Click overlay background to close
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }

  // Search input filtering
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      if (!q) {
        showSuggestions();
        return;
      }
      var matches = searchIndex.filter(function (item) {
        return item.title.toLowerCase().indexOf(q) !== -1 ||
               item.desc.toLowerCase().indexOf(q) !== -1;
      });
      if (matches.length === 0) {
        searchResults.innerHTML = '<div style="padding:20px;text-align:center;color:#72767d">No results found</div>';
      } else {
        searchResults.innerHTML = matches.map(function (m) {
          return '<a class="sr-item" href="' + m.url + '">' +
                 '<span class="sr-title">' + m.title + '</span>' +
                 '<span class="sr-desc">' + m.desc + '</span></a>';
        }).join('');
      }
    });
  }

  // Add search trigger to nav — via keyboard shortcut hint
  var navBar = document.querySelector('.nav-bar');
  if (navBar && !document.querySelector('.search-trigger')) {
    var searchTrigger = document.createElement('button');
    searchTrigger.className = 'btn btn-sm search-trigger';
    searchTrigger.setAttribute('aria-label', 'Search');
    searchTrigger.innerHTML = '🔍';
    searchTrigger.style.cssText = 'font-size:18px;padding:6px 10px;margin-left:8px;opacity:0.8;';
    searchTrigger.addEventListener('click', openSearch);
    var navActions = navBar.querySelector('.nav-actions');
    if (navActions) navActions.prepend(searchTrigger);
  }

  // === Feature Tabs (Features page) ===
  var featureTabs = document.querySelectorAll('.ftab');
  var featurePanels = document.querySelectorAll('.feature-tab-panel');

  if (featureTabs.length && featurePanels.length) {
    featureTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        featureTabs.forEach(function (t) { t.classList.remove('active'); });
        featurePanels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById('panel-' + tab.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // === Accordion (Safety page) ===
  var accHeaders = document.querySelectorAll('.accordion-header');
  accHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      var targetId = header.dataset.accordion;
      var body = document.getElementById(targetId);
      var icon = header.querySelector('.acc-icon');
      var isOpen = body && body.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-body').forEach(function (b) { b.classList.remove('open'); });
      document.querySelectorAll('.accordion-header').forEach(function (h) {
        h.classList.remove('active');
        var i = h.querySelector('.acc-icon');
        if (i) i.textContent = '+';
      });

      // Open clicked (if was closed)
      if (!isOpen && body) {
        body.classList.add('open');
        header.classList.add('active');
        if (icon) icon.textContent = '−';
      }
    });
  });

  // === Download buttons (Download page) ===
  var dlButtons = document.querySelectorAll('.dl-btn');
  var dlModal = document.getElementById('dlModal');
  var dlModalClose = document.getElementById('dlModalClose');
  var dlModalTitle = document.getElementById('dlModalTitle');
  var dlProgressBar = document.getElementById('dlProgressBar');

  dlButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var platform = btn.dataset.platform || 'your device';
      if (dlModal && dlModalTitle) {
        dlModalTitle.textContent = 'Downloading for ' + platform + '...';
        dlModal.style.display = 'flex';
        // Animate progress
        if (dlProgressBar) {
          dlProgressBar.style.width = '0%';
          setTimeout(function () { dlProgressBar.style.width = '100%'; }, 100);
        }
      }
    });
  });

  if (dlModalClose && dlModal) {
    dlModalClose.addEventListener('click', function () {
      dlModal.style.display = 'none';
    });
  }

  if (dlModal) {
    dlModal.addEventListener('click', function (e) {
      if (e.target === dlModal) dlModal.style.display = 'none';
    });
  }

  // === Smooth scroll for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var targetId = a.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // === Scroll animations ===
  var animateEls = document.querySelectorAll(
    '.feature-wrap, .principle-card, .tip-card, .ts-card, .platform-card, .bot-card'
  );
  if (animateEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // === Tech bar animation ===
  var techBars = document.querySelectorAll('.tech-bar-fill');
  if (techBars.length && 'IntersectionObserver' in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          bar.style.width = bar.style.getPropertyValue('--tw') || '0%';
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    techBars.forEach(function (bar) {
      var target = getComputedStyle(bar).getPropertyValue('--tw');
      bar.style.width = '0%';
      barObserver.observe(bar);
    });
  }

  // === Server icon hover effects in mockup ===
  document.querySelectorAll('.server-icon').forEach(function (icon) {
    icon.addEventListener('click', function () {
      document.querySelectorAll('.server-icon').forEach(function (i) { i.classList.remove('active'); });
      icon.classList.add('active');
    });
  });

  // === Voice control button toggles ===
  document.querySelectorAll('.vc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!btn.classList.contains('vc-hang')) {
        btn.style.opacity = btn.style.opacity === '0.5' ? '1' : '0.5';
      }
    });
  });

})();

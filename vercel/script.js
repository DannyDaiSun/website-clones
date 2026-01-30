/* ==========================================================================
   Vercel Clone — script.js
   Nav, search, dropdowns, docs sidebar, FAQ, changelog filter, copy code
   ========================================================================== */
(function () {
  'use strict';

  // Search data
  var searchItems = [
    { title: 'Documentation', url: 'docs.html', cat: 'Pages' },
    { title: 'Pricing Plans', url: 'pricing.html', cat: 'Pages' },
    { title: 'Changelog', url: 'changelog.html', cat: 'Pages' },
    { title: 'Getting Started Guide', url: 'docs.html', cat: 'Docs' },
    { title: 'Deployments', url: 'docs.html', cat: 'Docs' },
    { title: 'Next.js Framework Guide', url: 'docs.html', cat: 'Docs' },
    { title: 'Serverless Functions', url: 'docs.html', cat: 'Docs' },
    { title: 'Edge Network', url: 'docs.html', cat: 'Docs' },
    { title: 'Environment Variables', url: 'docs.html', cat: 'Docs' },
    { title: 'Custom Domains', url: 'docs.html', cat: 'Docs' },
    { title: 'Vercel CLI', url: 'docs.html', cat: 'Docs' },
    { title: 'REST API Reference', url: 'docs.html', cat: 'Docs' },
    { title: 'Hobby Plan — Free', url: 'pricing.html', cat: 'Pricing' },
    { title: 'Pro Plan — $20/month', url: 'pricing.html', cat: 'Pricing' },
    { title: 'Enterprise — Custom', url: 'pricing.html', cat: 'Pricing' },
    { title: 'Vercel AI SDK 4.0', url: 'changelog.html', cat: 'Changelog' },
    { title: 'Faster Cold Starts', url: 'changelog.html', cat: 'Changelog' },
    { title: 'Edge Config 2.0', url: 'changelog.html', cat: 'Changelog' },
    { title: 'Web Application Firewall', url: 'changelog.html', cat: 'Changelog' },
    { title: 'React Support', url: 'docs.html', cat: 'Frameworks' },
    { title: 'Vue / Nuxt Support', url: 'docs.html', cat: 'Frameworks' },
    { title: 'Svelte / SvelteKit', url: 'docs.html', cat: 'Frameworks' },
    { title: 'Astro Framework', url: 'docs.html', cat: 'Frameworks' }
  ];

  // DOM refs
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileOverlay = document.getElementById('mobileOverlay');
  var searchTrigger = document.getElementById('searchTrigger');
  var searchModal = document.getElementById('searchModal');
  var searchInput = document.getElementById('searchInput');
  var searchCloseBtn = document.getElementById('searchCloseBtn');
  var searchResults = document.getElementById('searchResults');
  var faqList = document.getElementById('faqList');
  var changelogFilter = document.getElementById('changelogFilter');
  var timeline = document.getElementById('timeline');

  // === Hamburger ===
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      if (mobileOverlay) {
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
      }
    });
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // === Dropdowns ===
  document.querySelectorAll('.has-dropdown').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var ddId = 'dd-' + this.getAttribute('data-dropdown');
      var panel = document.getElementById(ddId);
      if (!panel) return;
      document.querySelectorAll('.dropdown-panel.active').forEach(function (p) {
        if (p.id !== ddId) p.classList.remove('active');
      });
      panel.classList.toggle('active');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown-panel.active').forEach(function (p) { p.classList.remove('active'); });
  });

  // === Search Modal ===
  function openSearch() {
    if (searchModal) {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      renderSearchResults('');
    }
  }
  function closeSearch() {
    if (searchModal) searchModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  if (searchModal) {
    searchModal.addEventListener('click', function (e) { if (e.target === this) closeSearch(); });
  }

  function renderSearchResults(query) {
    if (!searchResults) return;
    var q = query.toLowerCase().trim();
    if (!q) {
      searchResults.innerHTML =
        '<div class="search-group"><p class="search-group-label">Quick Links</p>' +
        '<a href="docs.html" class="search-result">📚 Documentation</a>' +
        '<a href="pricing.html" class="search-result">💰 Pricing Plans</a>' +
        '<a href="changelog.html" class="search-result">📝 Changelog</a>' +
        '<a href="docs.html" class="search-result">🚀 Getting Started</a>' +
        '</div>';
      return;
    }
    var results = searchItems.filter(function (item) {
      return item.title.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q);
    });
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results for "' + esc(query) + '"</div>';
      return;
    }
    var grouped = {};
    results.forEach(function (r) {
      if (!grouped[r.cat]) grouped[r.cat] = [];
      grouped[r.cat].push(r);
    });
    var html = '';
    for (var cat in grouped) {
      html += '<div class="search-group"><p class="search-group-label">' + cat + '</p>';
      grouped[cat].forEach(function (r) {
        html += '<a href="' + r.url + '" class="search-result">' + r.title + '</a>';
      });
      html += '</div>';
    }
    searchResults.innerHTML = html;
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () { renderSearchResults(this.value); });
  }

  // === FAQ Accordion ===
  if (faqList) {
    faqList.querySelectorAll('.faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = this.closest('.faq-item');
        var wasOpen = item.classList.contains('open');
        faqList.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  // === Changelog Filter ===
  if (changelogFilter && timeline) {
    var filterBtns = changelogFilter.querySelectorAll('.cl-filter');
    var entries = timeline.querySelectorAll('.cl-entry');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var filter = this.getAttribute('data-filter');
        entries.forEach(function (entry) {
          if (filter === 'all' || entry.getAttribute('data-type') === filter) {
            entry.classList.remove('hidden');
          } else {
            entry.classList.add('hidden');
          }
        });
      });
    });
  }

  // === Docs Sidebar ===
  var sidebarLinks = document.querySelectorAll('.sidebar-link');
  if (sidebarLinks.length > 0) {
    sidebarLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        sidebarLinks.forEach(function (l) { l.classList.remove('active'); });
        this.classList.add('active');
      });
    });
  }

  // === Copy Code ===
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = this.getAttribute('data-code') || '';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }
      this.textContent = 'Copied!';
      var self = this;
      setTimeout(function () { self.textContent = 'Copy'; }, 2000);
    });
  });

  // === Keyboard Shortcuts ===
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearch();
      if (mobileOverlay && mobileOverlay.classList.contains('active')) {
        mobileOverlay.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  // === Smooth Scroll ===
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // === Escape HTML ===
  function esc(t) {
    var d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }
})();

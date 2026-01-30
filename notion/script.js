/* ==========================================================================
   Notion Clone — script.js
   Interactive behavior: nav, search, tabs, accordion, testimonials, pricing,
   template filtering, dropdowns
   ========================================================================== */

(function () {
  'use strict';

  // ===== Searchable Content =====
  var searchItems = [
    { title: 'Wikis — Centralize your knowledge', url: 'features.html#wikis', category: 'Product' },
    { title: 'Projects — Manage any project', url: 'features.html#projects', category: 'Product' },
    { title: 'Docs — Beautiful documents', url: 'features.html#docs', category: 'Product' },
    { title: 'Notion AI — AI assistant', url: 'features.html#ai', category: 'Product' },
    { title: 'Free Plan — $0 forever', url: 'pricing.html', category: 'Pricing' },
    { title: 'Plus Plan — $10/user/month', url: 'pricing.html', category: 'Pricing' },
    { title: 'Business Plan — $18/user/month', url: 'pricing.html', category: 'Pricing' },
    { title: 'Enterprise Plan — Custom pricing', url: 'pricing.html', category: 'Pricing' },
    { title: 'Engineering Wiki Template', url: 'templates.html', category: 'Templates' },
    { title: 'Bug Tracker Template', url: 'templates.html', category: 'Templates' },
    { title: 'Sprint Planner Template', url: 'templates.html', category: 'Templates' },
    { title: 'Design System Template', url: 'templates.html', category: 'Templates' },
    { title: 'Product Roadmap Template', url: 'templates.html', category: 'Templates' },
    { title: 'Meeting Notes Template', url: 'templates.html', category: 'Templates' },
    { title: 'Content Calendar Template', url: 'templates.html', category: 'Templates' },
    { title: 'Habit Tracker Template', url: 'templates.html', category: 'Templates' },
    { title: 'Reading List Template', url: 'templates.html', category: 'Templates' },
    { title: 'Daily Journal Template', url: 'templates.html', category: 'Templates' },
    { title: 'Integrations — Slack, GitHub, Figma', url: 'features.html', category: 'Product' },
    { title: 'Backlinks & page references', url: 'features.html#wikis', category: 'Features' },
    { title: 'Kanban boards & timeline views', url: 'features.html#projects', category: 'Features' },
    { title: '50+ content block types', url: 'features.html#docs', category: 'Features' },
    { title: 'AI summaries & drafts', url: 'features.html#ai', category: 'Features' }
  ];

  // ===== DOM References =====
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileNavOverlay = document.getElementById('mobileNavOverlay');
  var searchTrigger = document.getElementById('searchTrigger');
  var searchModal = document.getElementById('searchModal');
  var searchModalInput = document.getElementById('searchModalInput');
  var searchModalClose = document.getElementById('searchModalClose');
  var searchModalResults = document.getElementById('searchModalResults');
  var featureTabs = document.getElementById('featureTabs');
  var testimonialDots = document.getElementById('testimonialDots');
  var billingToggle = document.getElementById('billingToggle');
  var billingSwitch = document.getElementById('billingSwitch');
  var faqList = document.getElementById('faqList');
  var categoryFilters = document.getElementById('categoryFilters');
  var templatesGrid = document.getElementById('templatesGrid');
  var templateSearchInput = document.getElementById('templateSearchInput');
  var noResults = document.getElementById('noResults');

  // ===== Hamburger Menu =====
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      if (mobileNavOverlay) {
        mobileNavOverlay.classList.toggle('active');
        document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
      }
    });
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== Dropdown Menus =====
  document.querySelectorAll('.has-dropdown').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var targetId = 'dropdown-' + this.getAttribute('data-dropdown');
      var menu = document.getElementById(targetId);
      if (menu) {
        // Close other dropdowns
        document.querySelectorAll('.dropdown-menu.active').forEach(function (m) {
          if (m.id !== targetId) m.classList.remove('active');
        });
        menu.classList.toggle('active');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown-menu.active').forEach(function (m) {
      m.classList.remove('active');
    });
  });

  // ===== Search Modal =====
  if (searchTrigger) {
    searchTrigger.addEventListener('click', function () {
      if (searchModal) {
        searchModal.classList.add('active');
        if (searchModalInput) {
          searchModalInput.value = '';
          searchModalInput.focus();
        }
        document.body.style.overflow = 'hidden';
        renderSearchResults('');
      }
    });
  }

  if (searchModalClose) {
    searchModalClose.addEventListener('click', closeSearch);
  }

  if (searchModal) {
    searchModal.addEventListener('click', function (e) {
      if (e.target === this) closeSearch();
    });
  }

  function closeSearch() {
    if (searchModal) searchModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderSearchResults(query) {
    if (!searchModalResults) return;
    var q = query.toLowerCase().trim();

    if (!q) {
      searchModalResults.innerHTML =
        '<div class="search-section">' +
        '<p class="search-section-title">Quick Links</p>' +
        '<a href="features.html" class="search-result-item">📝 Features & Product Overview</a>' +
        '<a href="pricing.html" class="search-result-item">💰 Pricing Plans</a>' +
        '<a href="templates.html" class="search-result-item">📁 Template Gallery</a>' +
        '<a href="index.html" class="search-result-item">🏠 Home</a>' +
        '</div>';
      return;
    }

    var results = searchItems.filter(function (item) {
      return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    });

    if (results.length === 0) {
      searchModalResults.innerHTML =
        '<div class="search-section"><p class="search-section-title">No results for "' + escapeHtml(query) + '"</p></div>';
      return;
    }

    // Group by category
    var grouped = {};
    results.forEach(function (item) {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    var html = '';
    for (var cat in grouped) {
      html += '<div class="search-section"><p class="search-section-title">' + cat + '</p>';
      grouped[cat].forEach(function (item) {
        html += '<a href="' + item.url + '" class="search-result-item">' + item.title + '</a>';
      });
      html += '</div>';
    }
    searchModalResults.innerHTML = html;
  }

  if (searchModalInput) {
    searchModalInput.addEventListener('input', function () {
      renderSearchResults(this.value);
    });
  }

  // ===== Feature Tabs (index.html) =====
  if (featureTabs) {
    var tabBtns = featureTabs.querySelectorAll('.feature-tab');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        var tabName = this.getAttribute('data-tab');
        document.querySelectorAll('.feature-panel').forEach(function (p) { p.classList.remove('active'); });
        var panel = document.getElementById('panel-' + tabName);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ===== Testimonial Carousel =====
  if (testimonialDots) {
    var testimonials = document.querySelectorAll('.testimonial');
    var dots = testimonialDots.querySelectorAll('.dot');
    var currentIndex = 0;
    var autoSlide;

    function showTestimonial(index) {
      testimonials.forEach(function (t) { t.classList.remove('active'); });
      dots.forEach(function (d) { d.classList.remove('active'); });
      if (testimonials[index]) testimonials[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      currentIndex = index;
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'));
        showTestimonial(idx);
        clearInterval(autoSlide);
        startAutoSlide();
      });
    });

    function startAutoSlide() {
      autoSlide = setInterval(function () {
        var next = (currentIndex + 1) % testimonials.length;
        showTestimonial(next);
      }, 5000);
    }

    if (testimonials.length > 0) startAutoSlide();
  }

  // ===== Billing Toggle (pricing.html) =====
  if (billingSwitch) {
    var isAnnual = false;

    billingSwitch.addEventListener('click', function () {
      isAnnual = !isAnnual;
      this.classList.toggle('active', isAnnual);

      // Update billing option labels
      document.querySelectorAll('.billing-option').forEach(function (opt) {
        opt.classList.remove('active');
      });
      var activeBilling = isAnnual ? 'annual' : 'monthly';
      var activeOpt = document.querySelector('.billing-option[data-billing="' + activeBilling + '"]');
      if (activeOpt) activeOpt.classList.add('active');

      // Update prices
      document.querySelectorAll('.price-amount').forEach(function (el) {
        var price = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
        if (price) el.textContent = price;
      });
    });
  }

  // ===== FAQ Accordion =====
  if (faqList) {
    faqList.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = this.closest('.faq-item');
        var wasOpen = item.classList.contains('open');

        // Close all
        faqList.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('open');
        });

        // Toggle current
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  // ===== Template Category Filter =====
  if (categoryFilters && templatesGrid) {
    var catBtns = categoryFilters.querySelectorAll('.cat-btn');
    var tplCards = templatesGrid.querySelectorAll('.tpl-card');

    catBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        catBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        var cat = this.getAttribute('data-category');
        var visibleCount = filterTemplates(cat, '');
        if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      });
    });

    function filterTemplates(category, query) {
      var count = 0;
      tplCards.forEach(function (card) {
        var cardCat = card.getAttribute('data-category');
        var cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
        var matchCat = category === 'all' || cardCat === category;
        var matchQuery = !query || cardTitle.includes(query.toLowerCase());

        if (matchCat && matchQuery) {
          card.classList.remove('hidden');
          count++;
        } else {
          card.classList.add('hidden');
        }
      });
      return count;
    }

    // Template search
    if (templateSearchInput) {
      templateSearchInput.addEventListener('input', function () {
        // Reset category to all when searching
        catBtns.forEach(function (b) { b.classList.remove('active'); });
        var allBtn = categoryFilters.querySelector('[data-category="all"]');
        if (allBtn) allBtn.classList.add('active');

        var count = filterTemplates('all', this.value);
        if (noResults) noResults.style.display = count === 0 ? 'block' : 'none';
      });
    }
  }

  // ===== Keyboard Shortcuts =====
  document.addEventListener('keydown', function (e) {
    // ESC
    if (e.key === 'Escape') {
      closeSearch();
      if (mobileNavOverlay && mobileNavOverlay.classList.contains('active')) {
        mobileNavOverlay.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal) {
        searchModal.classList.add('active');
        if (searchModalInput) {
          searchModalInput.value = '';
          searchModalInput.focus();
        }
        document.body.style.overflow = 'hidden';
        renderSearchResults('');
      }
    }
  });

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== Utility =====
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

})();

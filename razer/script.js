/* ==========================================================================
   Razer Clone — script.js
   Interactivity: nav, search, product tabs/filters, cart, product detail
   ========================================================================== */
(function () {
  'use strict';

  // ===== Product Database =====
  var products = [
    { id: 'viper', cat: 'mice', name: 'Razer Viper V3 Pro', subtitle: 'Ultra-lightweight wireless esports mouse', price: '$159.99', weight: '49g' },
    { id: 'deathadder', cat: 'mice', name: 'Razer DeathAdder V3', subtitle: 'Iconic ergonomic wireless mouse', price: '$89.99', weight: '63g' },
    { id: 'basilisk', cat: 'mice', name: 'Razer Basilisk V3', subtitle: 'Customizable ergonomic gaming mouse', price: '$69.99', weight: '101g' },
    { id: 'huntsman', cat: 'keyboards', name: 'Razer Huntsman V3 Pro', subtitle: 'Analog optical switch keyboard', price: '$249.99', weight: '860g' },
    { id: 'blackwidow', cat: 'keyboards', name: 'Razer BlackWidow V4', subtitle: 'Mechanical green switch gaming keyboard', price: '$169.99', weight: '950g' }
  ];

  // ===== DOM References =====
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileNavOverlay = document.getElementById('mobileNavOverlay');
  var searchToggle = document.getElementById('searchToggle');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchInput = document.getElementById('searchInput');
  var searchClose = document.getElementById('searchClose');
  var searchResults = document.getElementById('searchResults');
  var featuredTabs = document.getElementById('featuredTabs');
  var filterBar = document.getElementById('filterBar');
  var productGrid = document.getElementById('productGrid');
  var sortSelect = document.getElementById('sortSelect');
  var cartCount = document.getElementById('cartCount');
  var cartNotification = document.getElementById('cartNotification');
  var cartNotifText = document.getElementById('cartNotifText');
  var newsletterForm = document.getElementById('newsletterForm');
  var pdSpecTabs = document.getElementById('pdSpecTabs');
  var pdColorPicker = document.getElementById('pdColorPicker');

  // ===== Cart State =====
  var cart = JSON.parse(localStorage.getItem('razerCart') || '[]');
  updateCartCount();

  function updateCartCount() {
    var els = document.querySelectorAll('.cart-count');
    els.forEach(function (el) { el.textContent = cart.length; });
  }

  function showCartNotification(name) {
    if (cartNotifText) cartNotifText.textContent = name + ' added to cart!';
    if (cartNotification) {
      cartNotification.classList.add('show');
      setTimeout(function () { cartNotification.classList.remove('show'); }, 2500);
    }
  }

  // ===== Hamburger =====
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

  // ===== Dropdowns =====
  document.querySelectorAll('.has-dropdown').forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      var panel = this.parentElement.querySelector('.dropdown-panel');
      if (panel) panel.classList.add('active');
    });
    link.parentElement.addEventListener('mouseleave', function () {
      var panel = this.querySelector('.dropdown-panel');
      if (panel) panel.classList.remove('active');
    });
  });

  // ===== Search =====
  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      if (searchOverlay) {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      }
    });
  }
  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === this) closeSearch();
    });
  }
  function closeSearch() {
    if (searchOverlay) searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = this.value.toLowerCase().trim();
      if (!q) {
        searchResults.innerHTML =
          '<div class="search-suggestions">' +
          '<p class="search-label">Popular Searches</p>' +
          '<a href="product.html?cat=mice&id=viper" class="search-suggestion">Viper V3 Pro</a>' +
          '<a href="product.html?cat=mice&id=deathadder" class="search-suggestion">DeathAdder V3</a>' +
          '<a href="product.html?cat=keyboards&id=huntsman" class="search-suggestion">Huntsman V3 Pro</a>' +
          '<a href="mice.html" class="search-suggestion">Gaming Mice</a>' +
          '<a href="keyboards.html" class="search-suggestion">Gaming Keyboards</a>' +
          '</div>';
        return;
      }
      var results = products.filter(function (p) {
        return p.name.toLowerCase().includes(q) || p.cat.includes(q) || p.subtitle.toLowerCase().includes(q);
      });
      if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No products found for "' + escapeHtml(this.value) + '"</div>';
      } else {
        var html = '<div class="search-suggestions"><p class="search-label">Products</p>';
        results.forEach(function (p) {
          html += '<a href="product.html?cat=' + p.cat + '&id=' + p.id + '" class="search-result-item"><strong>' + p.name + '</strong> — ' + p.price + '</a>';
        });
        html += '</div>';
        searchResults.innerHTML = html;
      }
    });
  }

  // ===== Featured Tabs (index) =====
  if (featuredTabs) {
    var tabs = featuredTabs.querySelectorAll('.feat-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        var tabName = this.getAttribute('data-tab');
        document.querySelectorAll('.featured-grid .product-card').forEach(function (card) {
          card.style.display = card.getAttribute('data-tab') === tabName ? '' : 'none';
        });
      });
    });
  }

  // ===== Filter Bar (mice/keyboards pages) =====
  if (filterBar && productGrid) {
    var filterBtns = filterBar.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var filter = this.getAttribute('data-filter');
        applyFilters(filter);
      });
    });
  }

  function applyFilters(filter) {
    if (!productGrid) return;
    var cards = productGrid.querySelectorAll('.product-card');
    cards.forEach(function (card) {
      var cats = (card.getAttribute('data-filter') || '').split(',');
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  // ===== Sort =====
  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', function () {
      var cards = Array.from(productGrid.querySelectorAll('.product-card'));
      var sortBy = this.value;
      cards.sort(function (a, b) {
        if (sortBy === 'price-low') return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        if (sortBy === 'price-high') return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        if (sortBy === 'rating') return parseInt(b.dataset.rating) - parseInt(a.dataset.rating);
        return 0;
      });
      cards.forEach(function (card) { productGrid.appendChild(card); });
    });
  }

  // ===== Add to Cart =====
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-add-cart')) {
      var name = e.target.getAttribute('data-name');
      var price = e.target.getAttribute('data-price');
      if (name && price) {
        cart.push({ name: name, price: price });
        localStorage.setItem('razerCart', JSON.stringify(cart));
        updateCartCount();
        showCartNotification(name);
      }
    }
  });

  // ===== Newsletter =====
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      this.style.display = 'none';
      var success = document.getElementById('newsletterSuccess');
      if (success) success.style.display = 'block';
    });
  }

  // ===== Product Detail: Spec Tabs =====
  if (pdSpecTabs) {
    var specBtns = pdSpecTabs.querySelectorAll('.spec-tab');
    specBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        specBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var tabName = this.getAttribute('data-spectab');
        document.querySelectorAll('.spec-panel').forEach(function (p) { p.classList.remove('active'); });
        var panel = document.getElementById('spectab-' + tabName);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ===== Product Detail: Color Picker =====
  if (pdColorPicker) {
    var swatches = pdColorPicker.querySelectorAll('.color-swatch');
    swatches.forEach(function (sw) {
      sw.addEventListener('click', function () {
        swatches.forEach(function (s) { s.classList.remove('active'); });
        this.classList.add('active');
      });
    });
  }

  // ===== Product Detail: Dynamic from URL =====
  function loadProductDetail() {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('cat');
    var id = params.get('id');
    if (!id) return;

    var product = products.find(function (p) { return p.id === id; });
    if (!product) return;

    var titleEl = document.getElementById('pdTitle');
    var subtitleEl = document.getElementById('pdSubtitle');
    var priceEl = document.getElementById('pdPrice');
    var breadcrumbProduct = document.getElementById('breadcrumbProduct');
    var addCartBtn = document.getElementById('pdAddCart');
    var specWeight = document.getElementById('specWeight');
    var breadcrumb = document.getElementById('breadcrumb');

    if (titleEl) titleEl.textContent = product.name;
    if (subtitleEl) subtitleEl.textContent = product.subtitle;
    if (priceEl) priceEl.textContent = product.price;
    if (breadcrumbProduct) breadcrumbProduct.textContent = product.name;
    if (addCartBtn) {
      addCartBtn.setAttribute('data-name', product.name);
      addCartBtn.setAttribute('data-price', product.price.replace('$', ''));
      addCartBtn.textContent = 'Add to Cart — ' + product.price;
    }
    if (specWeight) specWeight.textContent = product.weight;

    // Update breadcrumb category link
    if (breadcrumb && cat) {
      var catLink = breadcrumb.querySelectorAll('a')[1];
      if (catLink) {
        catLink.href = cat + '.html';
        catLink.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      }
    }

    document.title = product.name + ' – Razer';
  }
  loadProductDetail();

  // ===== Keyboard Shortcuts =====
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearch();
      if (mobileNavOverlay && mobileNavOverlay.classList.contains('active')) {
        mobileNavOverlay.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchOverlay) {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (searchInput) { searchInput.value = ''; searchInput.focus(); }
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
  function escapeHtml(t) {
    var d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

})();

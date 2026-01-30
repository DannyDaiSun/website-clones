/* ============================================
   Apple Clone — script.js
   ============================================ */

(function() {
  'use strict';

  // === Mobile Hamburger Nav ===
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      // Close search when opening nav
      closeSearch();
    });
  }

  // === Search Overlay ===
  const searchBtn   = document.getElementById('navSearchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const searchResults = document.getElementById('searchResults');

  // Searchable items index
  const searchIndex = [
    { title: 'iPhone 15 Pro', desc: 'Titanium. So strong. So light.', url: './iphone.html' },
    { title: 'iPhone 15', desc: 'New camera. New design.', url: './iphone.html#iphone15' },
    { title: 'iPhone 14', desc: 'As stunning as ever.', url: './iphone.html#iphone14' },
    { title: 'iPhone SE', desc: 'Love the power. Love the price.', url: './iphone.html#iphoneSE' },
    { title: 'MacBook Air', desc: 'Strikingly thin. Impressively big.', url: './mac.html' },
    { title: 'MacBook Pro', desc: 'Mind-blowing. Head-turning.', url: './mac.html#macbook-pro' },
    { title: 'iMac', desc: 'Say hello. All-in-one.', url: './mac.html#imac' },
    { title: 'Mac Studio', desc: 'Outrageously powerful.', url: './mac.html#mac-studio' },
    { title: 'Mac Pro', desc: 'Built for pros.', url: './mac.html#mac-pro' },
    { title: 'Apple Store', desc: 'The best way to buy.', url: './store.html' },
    { title: 'Apple Watch Series 9', desc: 'Smarter. Brighter. Mightier.', url: './store.html' },
    { title: 'AirPods Pro', desc: 'Adaptive Audio. Now playing.', url: './store.html' },
    { title: 'iPad Pro', desc: 'Supercharged by M2.', url: './store.html' },
    { title: 'Apple Card', desc: 'Get up to 3% Daily Cash back.', url: './store.html' },
    { title: 'MagSafe Charger', desc: 'Snap on. Power up.', url: './store.html' },
    { title: 'AirTag', desc: 'Keep track of your stuff.', url: './store.html' },
    { title: 'Apple Pencil', desc: 'Pixel-perfect precision.', url: './store.html' },
    { title: 'Magic Keyboard', desc: 'Comfortable typing.', url: './store.html' },
  ];

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    if (searchSuggestions) searchSuggestions.style.display = '';
    if (searchResults) searchResults.innerHTML = '';
    // Close mobile nav
    if (hamburger) hamburger.classList.remove('open');
    if (navLinks) navLinks.classList.remove('open');
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  // Search filtering
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        if (searchSuggestions) searchSuggestions.style.display = '';
        if (searchResults) searchResults.innerHTML = '';
        return;
      }
      if (searchSuggestions) searchSuggestions.style.display = 'none';

      const matches = searchIndex.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
      );

      if (searchResults) {
        if (matches.length === 0) {
          searchResults.innerHTML = '<p style="color:#999;font-size:14px;padding:8px 0">No results found.</p>';
        } else {
          searchResults.innerHTML = matches.map(m =>
            `<a href="${m.url}"><strong>${m.title}</strong> — ${m.desc}</a>`
          ).join('');
        }
      }
    });

    // Close on Escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearch();
    });
  }

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (searchOverlay && searchOverlay.classList.contains('open')) {
      if (!searchOverlay.contains(e.target) && e.target !== searchBtn) {
        closeSearch();
      }
    }
  });

  // === Smooth Scroll for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 100; // account for sticky navs
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // === Color Picker (iPhone) ===
  const colorPicker = document.getElementById('colorPicker15Pro');
  const colorLabel  = document.getElementById('colorLabel15Pro');

  if (colorPicker && colorLabel) {
    colorPicker.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        colorPicker.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        colorLabel.textContent = dot.dataset.color;
        // Animate phone color change
        const phone = document.querySelector('.iphone-color');
        if (phone) {
          const colors = {
            'Natural Titanium': 'linear-gradient(145deg, #d2ccc4, #9a918a)',
            'Blue Titanium': 'linear-gradient(145deg, #4a6580, #394e6a)',
            'White Titanium': 'linear-gradient(145deg, #f0ebe4, #e3ddd7)',
            'Black Titanium': 'linear-gradient(145deg, #4a4940, #3c3b37)',
          };
          phone.style.setProperty('--phone-bg', colors[dot.dataset.color] || colors['Natural Titanium']);
          phone.style.background = colors[dot.dataset.color] || colors['Natural Titanium'];
        }
      });
    });
  }

  // === Color Picker (Mac) ===
  const macPicker = document.getElementById('macColorPicker');
  const macLabel  = document.getElementById('macColorLabel');

  if (macPicker && macLabel) {
    macPicker.querySelectorAll('.mac-color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        macPicker.querySelectorAll('.mac-color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        macLabel.textContent = dot.dataset.color;
      });
    });
  }

  // === Spec Tabs (Mac page) ===
  const specTabs = document.querySelectorAll('.spec-tab');
  const specPanels = document.querySelectorAll('.spec-panel');

  if (specTabs.length && specPanels.length) {
    specTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        specTabs.forEach(t => t.classList.remove('active'));
        specPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById('tab-' + tab.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // === Store: Category Filter ===
  const categoryCards = document.querySelectorAll('.category-card[data-category]');
  const productCards  = document.querySelectorAll('.store-product-card[data-category]');

  if (categoryCards.length && productCards.length) {
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        categoryCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const cat = card.dataset.category;
        productCards.forEach(pc => {
          if (cat === 'all' || pc.dataset.category === cat) {
            pc.style.display = '';
          } else {
            pc.style.display = 'none';
          }
        });
      });
    });
  }

  // === Store: Add to Bag ===
  let bag = JSON.parse(localStorage.getItem('appleBag') || '[]');
  const bagModal   = document.getElementById('bagModal');
  const bagClose   = document.getElementById('bagClose');
  const bagItems   = document.getElementById('bagItems');
  const bagTotal   = document.getElementById('bagTotal');
  const navBags    = document.querySelectorAll('.nav-bag');

  function renderBag() {
    if (!bagItems || !bagTotal) return;
    if (bag.length === 0) {
      bagItems.innerHTML = '<p class="bag-empty">Your bag is empty.</p>';
      bagTotal.textContent = '$0.00';
    } else {
      bagItems.innerHTML = bag.map((item, idx) =>
        `<div class="bag-item">
          <div class="bag-item-info">
            <h4>${item.product}</h4>
            <p>$${item.price.toFixed(2)}</p>
          </div>
          <button class="bag-item-remove" data-idx="${idx}" aria-label="Remove">&times;</button>
        </div>`
      ).join('');
      const total = bag.reduce((sum, i) => sum + i.price, 0);
      bagTotal.textContent = '$' + total.toFixed(2);

      // Bind remove buttons
      bagItems.querySelectorAll('.bag-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          bag.splice(parseInt(btn.dataset.idx), 1);
          localStorage.setItem('appleBag', JSON.stringify(bag));
          renderBag();
        });
      });
    }
  }

  // Add to bag buttons
  document.querySelectorAll('[data-product][data-price]').forEach(btn => {
    btn.addEventListener('click', () => {
      bag.push({
        product: btn.dataset.product,
        price: parseFloat(btn.dataset.price)
      });
      localStorage.setItem('appleBag', JSON.stringify(bag));
      renderBag();
      if (bagModal) bagModal.classList.add('open');
    });
  });

  // Open bag from nav
  navBags.forEach(b => {
    b.addEventListener('click', (e) => {
      if (document.querySelector('.page-store') || bag.length > 0) {
        e.preventDefault();
        renderBag();
        if (bagModal) bagModal.classList.add('open');
      }
    });
  });

  // Close bag
  if (bagClose) {
    bagClose.addEventListener('click', () => {
      if (bagModal) bagModal.classList.remove('open');
    });
  }

  // Checkout button
  const checkoutBtn = document.querySelector('.bag-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (bag.length === 0) {
        alert('Your bag is empty!');
        return;
      }
      alert('Thank you! Your order has been placed. (Demo)');
      bag = [];
      localStorage.setItem('appleBag', JSON.stringify(bag));
      renderBag();
      if (bagModal) bagModal.classList.remove('open');
    });
  }

  // Init bag render
  renderBag();

  // === Scroll animations ===
  const animateElements = document.querySelectorAll('.feature-card, .compare-card, .help-card, .accessory-card');

  if (animateElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      observer.observe(el);
    });
  }

  // === Sub-nav active tracking ===
  const subNavLinks = document.querySelectorAll('.sub-nav-links a[href^="#"]');
  if (subNavLinks.length) {
    const sections = [];
    subNavLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) sections.push({ link, section });
    });

    if (sections.length) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 150;
        let current = sections[0];
        sections.forEach(s => {
          if (s.section.offsetTop <= scrollY) current = s;
        });
        subNavLinks.forEach(l => l.classList.remove('active'));
        current.link.classList.add('active');
      });
    }
  }

})();

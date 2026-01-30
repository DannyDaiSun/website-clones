/* ==========================================================================
   Airbnb Clone — Interactive Script (Round 2)
   ========================================================================== */
(function () {
  'use strict';

  // ──────────── Mobile Nav Toggle ────────────
  const navToggle = document.getElementById('nav-toggle');
  // Reuse user-dropdown as mobile menu on small screens
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const dd = document.getElementById('user-dropdown');
      if (dd) dd.classList.toggle('active');
    });
  }

  // ──────────── User Dropdown ────────────
  const userBtn = document.getElementById('user-menu-toggle');
  const userDropdown = document.getElementById('user-dropdown');
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    document.addEventListener('click', () => userDropdown.classList.remove('active'));
  }

  // ──────────── Category Tabs (index) ────────────
  const catTabs = document.querySelectorAll('.category-tab');
  const listingCards = document.querySelectorAll('#listings-grid .listing-card');

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category;
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      listingCards.forEach(card => {
        if (cat === 'all') {
          card.classList.remove('hidden');
        } else {
          const cats = card.dataset.category || '';
          card.classList.toggle('hidden', !cats.includes(cat));
        }
      });
    });
  });

  // ──────────── Favorite Hearts ────────────
  document.querySelectorAll('.listing-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('saved');
      btn.textContent = btn.classList.contains('saved') ? '♥' : '♡';
    });
  });

  // Listing page save
  const saveBtn = document.querySelector('.listing-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveBtn.classList.toggle('saved');
      saveBtn.textContent = saveBtn.classList.contains('saved') ? '♥ Saved' : '♡ Save';
    });
  }

  // ──────────── Search → Navigate ────────────
  const searchSubmit = document.getElementById('search-submit');
  if (searchSubmit) {
    // Already an <a> link to search.html
  }

  // Compact search (search page)
  const searchCompact = document.getElementById('search-compact');
  const searchGo = document.getElementById('search-go');
  if (searchCompact && searchGo) {
    searchGo.addEventListener('click', () => {
      // Filter results
      filterSearchResults(searchCompact.value);
    });
    searchCompact.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') filterSearchResults(searchCompact.value);
    });
  }

  function filterSearchResults(query) {
    const q = (query || '').toLowerCase().trim();
    const results = document.querySelectorAll('#search-results .result-card');
    results.forEach(card => {
      if (!q) { card.classList.remove('hidden'); return; }
      const text = card.textContent.toLowerCase();
      card.classList.toggle('hidden', !text.includes(q));
    });
  }

  // ──────────── Search Filter Pills ────────────
  const filterPills = document.querySelectorAll('.filter-pill');
  const resultCards = document.querySelectorAll('#search-results .result-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.dataset.filter;
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      resultCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          card.classList.toggle('hidden', card.dataset.type !== filter);
        }
      });
    });
  });

  // Price filter
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    priceFilter.addEventListener('change', () => {
      const max = parseInt(priceFilter.value);
      resultCards.forEach(card => {
        const price = parseInt(card.dataset.price);
        card.classList.toggle('hidden', price > max);
      });
      // Reset type filter
      filterPills.forEach(p => p.classList.remove('active'));
      const allPill = document.querySelector('.filter-pill[data-filter="all"]');
      if (allPill) allPill.classList.add('active');
    });
  }

  // ──────────── Reserve Button ────────────
  const reserveBtn = document.getElementById('reserve-btn');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', () => {
      reserveBtn.textContent = '✓ Reserved!';
      reserveBtn.style.opacity = '0.7';
      reserveBtn.style.pointerEvents = 'none';
      setTimeout(() => {
        reserveBtn.textContent = 'Reserve';
        reserveBtn.style.opacity = '';
        reserveBtn.style.pointerEvents = '';
      }, 2000);
    });
  }

  // ──────────── Host Earnings Calculator ────────────
  const nightsSlider = document.getElementById('nights-slider');
  const nightsVal = document.getElementById('nights-val');
  const earningsAmount = document.getElementById('earnings-amount');

  if (nightsSlider) {
    const pricePerNight = 180;
    nightsSlider.addEventListener('input', () => {
      const nights = parseInt(nightsSlider.value);
      nightsVal.textContent = nights;
      earningsAmount.textContent = `$${(nights * pricePerNight).toLocaleString()}`;
    });
  }

  // ──────────── FAQ Accordion ────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (q) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ──────────── Smooth scroll for anchor links ────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ──────────── Sticky header shadow on scroll ────────────
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 2px 8px rgba(0,0,0,0.08)' : '';
    });
  }

})();

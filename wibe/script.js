/* ==========================================================================
   WIBE Audio — Interactive Script (Round 2)
   ========================================================================== */

(function () {
  'use strict';

  // ──────────── Mobile Navigation ────────────
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle) {
    navToggle.addEventListener('click', () => navMenu.classList.add('active'));
  }
  if (navClose) {
    navClose.addEventListener('click', () => navMenu.classList.remove('active'));
  }

  // Close menu when clicking a nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
    });
  });

  // ──────────── Header scroll effect ────────────
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ──────────── Search Overlay ────────────
  const searchToggle = document.getElementById('search-toggle');
  const searchClose = document.getElementById('search-close');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const products = [
    { name: 'WIBE Pro Max', category: 'Headphones', price: '$349', url: 'products.html#pro-max' },
    { name: 'WIBE Studio', category: 'Headphones', price: '$279', url: 'products.html#studio' },
    { name: 'WIBE Sport', category: 'Headphones', price: '$199', url: 'products.html#sport' },
    { name: 'WIBE Buds Pro', category: 'Earbuds', price: '$249', url: 'products.html#buds-pro' },
    { name: 'WIBE Buds Lite', category: 'Earbuds', price: '$129', url: 'products.html#buds-lite' },
    { name: 'WIBE Boom 360', category: 'Speakers', price: '$199', url: 'products.html#boom-360' },
    { name: 'WIBE Home', category: 'Speakers', price: '$299', url: 'products.html#home' },
    { name: 'Premium Carry Case', category: 'Accessories', price: '$49', url: 'products.html#accessories' },
    { name: 'Braided Audio Cable', category: 'Accessories', price: '$29', url: 'products.html#accessories' },
    { name: 'Memory Foam Pads', category: 'Accessories', price: '$39', url: 'products.html#accessories' },
    { name: 'Aluminum Stand', category: 'Accessories', price: '$59', url: 'products.html#accessories' },
  ];

  function openSearch() {
    if (searchOverlay) {
      searchOverlay.classList.add('active');
      setTimeout(() => searchInput && searchInput.focus(), 100);
    }
  }

  function closeSearch() {
    if (searchOverlay) {
      searchOverlay.classList.remove('active');
      if (searchInput) searchInput.value = '';
      if (searchResults) searchResults.innerHTML = '';
    }
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  // Close search on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      if (!q) { searchResults.innerHTML = ''; return; }
      const matches = products.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
      } else {
        searchResults.innerHTML = matches.map(p =>
          `<a href="${p.url}" class="search-result-item">
            <span>${p.name} <small style="color:var(--gray-500)">${p.category}</small></span>
            <span class="search-result-price">${p.price}</span>
          </a>`
        ).join('');
      }
    });
  }

  // ──────────── Product Tabs (index.html) ────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('#product-grid .product-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      productCards.forEach(card => {
        card.style.display = card.dataset.category === tab ? '' : 'none';
      });
    });
  });

  // ──────────── Testimonial Slider ────────────
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let currentSlide = 0;

  function showSlide(idx) {
    if (!slides.length) return;
    currentSlide = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => showSlide(i)));

  // Auto-advance
  if (slides.length) {
    setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  // ──────────── Newsletter Form ────────────
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterMsg = document.getElementById('newsletter-msg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input').value;
      if (email) {
        newsletterMsg.textContent = `✓ Thanks! ${email} has been subscribed.`;
        newsletterForm.querySelector('input').value = '';
      }
    });
  }

  // ──────────── Contact Form ────────────
  const contactForm = document.getElementById('contact-form');
  const contactMsg = document.getElementById('contact-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactMsg.textContent = '✓ Message sent! We\'ll get back to you within 24 hours.';
      contactForm.reset();
    });
  }

  // ──────────── FAQ Accordion ────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => i.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ──────────── Shop Filters ────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const shopCards = document.querySelectorAll('#shop-grid .shop-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      shopCards.forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });

  // ──────────── Shop Sort ────────────
  const sortSelect = document.getElementById('sort-select');
  const shopGrid = document.getElementById('shop-grid');

  if (sortSelect && shopGrid) {
    sortSelect.addEventListener('change', () => {
      const cards = Array.from(shopGrid.querySelectorAll('.shop-card'));
      const sorted = cards.sort((a, b) => {
        switch (sortSelect.value) {
          case 'price-low': return Number(a.dataset.price) - Number(b.dataset.price);
          case 'price-high': return Number(b.dataset.price) - Number(a.dataset.price);
          case 'name': return a.dataset.name.localeCompare(b.dataset.name);
          default: return 0;
        }
      });
      sorted.forEach(card => shopGrid.appendChild(card));
    });
  }

  // ──────────── Cart System ────────────
  let cart = JSON.parse(localStorage.getItem('wibe-cart') || '[]');

  function updateCartUI() {
    // Update count badges on all pages
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cart.length;
    });

    // Update cart panel (shop page)
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total-price');

    if (cartItems) {
      if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      } else {
        cartItems.innerHTML = cart.map((item, idx) =>
          `<div class="cart-item">
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">$${item.price}</div>
            </div>
            <span class="cart-item-remove" data-idx="${idx}">&times;</span>
          </div>`
        ).join('');

        // Remove item handlers
        cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
          btn.addEventListener('click', () => {
            cart.splice(Number(btn.dataset.idx), 1);
            saveCart();
            updateCartUI();
          });
        });
      }
    }

    if (cartTotal) {
      const total = cart.reduce((s, i) => s + Number(i.price), 0);
      cartTotal.textContent = `$${total}`;
    }
  }

  function saveCart() {
    localStorage.setItem('wibe-cart', JSON.stringify(cart));
  }

  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.push({ name: btn.dataset.name, price: btn.dataset.price });
      saveCart();
      updateCartUI();
      // Flash button
      const orig = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.style.pointerEvents = 'none';
      setTimeout(() => { btn.textContent = orig; btn.style.pointerEvents = ''; }, 1200);
      // Open cart panel on shop page
      const overlay = document.getElementById('cart-overlay');
      if (overlay) overlay.classList.add('active');
    });
  });

  // Cart panel open/close
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCloseBtn = document.getElementById('cart-close');
  const cartCheckout = document.getElementById('cart-checkout');

  document.querySelectorAll('.nav-cart').forEach(el => {
    el.addEventListener('click', (e) => {
      if (cartOverlay) { e.preventDefault(); cartOverlay.classList.add('active'); }
    });
  });

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) cartOverlay.classList.remove('active');
    });
  }
  if (cartCheckout) {
    cartCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;
      alert('Thank you for your order! This is a demo — no payment will be processed.');
      cart = [];
      saveCart();
      updateCartUI();
      cartOverlay.classList.remove('active');
    });
  }

  // Init cart UI
  updateCartUI();

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

})();

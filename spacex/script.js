/* ==========================================================================
   SpaceX Clone — Interactive Script (Round 2)
   ========================================================================== */

(function () {
  'use strict';

  // ──────────── Mobile Navigation ────────────
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('active'));
  if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('active'));

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navMenu && navMenu.classList.remove('active'));
  });

  // ──────────── Header scroll (transparent → solid) ────────────
  const header = document.getElementById('header');
  if (header && !header.classList.contains('header-solid')) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  // ──────────── Search Overlay ────────────
  const searchToggle = document.getElementById('search-toggle');
  const searchClose = document.getElementById('search-close');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const pages = [
    { title: 'Falcon 9', desc: 'First orbital class reusable rocket', url: 'missions.html#falcon9' },
    { title: 'Starship', desc: 'Most powerful launch vehicle ever built', url: 'starship.html' },
    { title: 'Dragon', desc: 'Crew and cargo spacecraft', url: 'missions.html#dragon' },
    { title: 'Falcon Heavy', desc: 'World\'s most powerful operational rocket', url: 'missions.html#falcon-heavy' },
    { title: 'Starlink', desc: 'High-speed internet from space', url: 'about.html#starlink' },
    { title: 'Missions', desc: 'Launch manifest and history', url: 'missions.html' },
    { title: 'Upcoming Launches', desc: 'Next scheduled missions', url: 'missions.html#upcoming' },
    { title: 'About SpaceX', desc: 'Company info and history', url: 'about.html' },
    { title: 'Careers', desc: 'Join the SpaceX team', url: 'about.html#careers' },
    { title: 'Vehicle Specs', desc: 'Starship & Super Heavy specifications', url: 'starship.html#specs' },
    { title: 'Flight Tests', desc: 'Starship flight test history', url: 'starship.html' },
    { title: 'Crew-12', desc: 'ISS crew mission - January 2026', url: 'missions.html#crew-12' },
    { title: 'Contact', desc: 'Headquarters and launch sites', url: 'about.html#contact' },
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
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      if (!q) { searchResults.innerHTML = ''; return; }

      const matches = pages.filter(p =>
        p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      );

      searchResults.innerHTML = matches.length === 0
        ? '<div class="search-result-item">No results found</div>'
        : matches.map(p =>
            `<a href="${p.url}" class="search-result-item">${p.title} <small>${p.desc}</small></a>`
          ).join('');
    });
  }

  // ──────────── Stats Counter Animation ────────────
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounters() {
    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.target);
      if (el.dataset.done) return;

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.dataset.done = '1';
        let current = 0;
        const step = Math.ceil(target / 60);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = current.toLocaleString();
        }, 25);
      }
    });
  }

  if (statNumbers.length) {
    window.addEventListener('scroll', animateCounters);
    animateCounters(); // check on load
  }

  // ──────────── Mission Filter Tabs ────────────
  const missionTabs = document.querySelectorAll('.mission-tab');
  const timelineItems = document.querySelectorAll('.timeline-item');

  missionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      missionTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      timelineItems.forEach(item => {
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else {
          item.classList.toggle('hidden', item.dataset.type !== filter);
        }
      });
    });
  });

  // ──────────── Starship Spec Tabs ────────────
  const specTabs = document.querySelectorAll('.spec-tab');
  const specPanels = document.querySelectorAll('.spec-panel');

  specTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const spec = tab.dataset.spec;
      specTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      specPanels.forEach(p => {
        p.classList.toggle('active', p.id === `spec-${spec}`);
      });
    });
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

  // ──────────── Full-screen hero snap scrolling hint ────────────
  // Subtle parallax on hero backgrounds
  const heroBgs = document.querySelectorAll('.hero-bg');
  if (heroBgs.length) {
    window.addEventListener('scroll', () => {
      heroBgs.forEach(bg => {
        const section = bg.parentElement;
        const rect = section.getBoundingClientRect();
        const offset = rect.top * 0.3;
        bg.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

})();

/* ============================================
   GitCards — Script
   ============================================ */

(function () {
  'use strict';

  // ---- State ----
  let allCards = [];
  let githubData = {};
  let activeLanguage = 'all';
  let searchQuery = '';

  // Language colors (GitHub-style)
  const LANG_COLORS = {
    Python: '#3572A5',
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Rust: '#dea584',
    Go: '#00ADD8',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Shell: '#89e051',
    Ruby: '#701516',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Lua: '#000080',
    Jupyter: '#DA5B0B',
    Markdown: '#083fa1',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Vue: '#41b883',
    Svelte: '#ff3e00',
  };

  // ---- Theme ----
  function initTheme() {
    const saved = localStorage.getItem('gitcards-theme');
    const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (preferDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('gitcards-theme', next);
  }

  // ---- Fetch manifest ----
  async function loadManifest() {
    try {
      const resp = await fetch('./illustrations/manifest.json');
      const data = await resp.json();
      allCards = (data.generated || []).filter(c => c.filename && c.repo);
      return allCards;
    } catch (err) {
      console.error('Failed to load manifest:', err);
      return [];
    }
  }

  // ---- Fetch GitHub data ----
  async function fetchGitHubData(repos) {
    // Batch fetch — fire all requests together
    const promises = repos.map(async (repo) => {
      try {
        const resp = await fetch(`https://api.github.com/repos/${repo}`);
        if (!resp.ok) return null;
        return await resp.json();
      } catch {
        return null;
      }
    });

    const results = await Promise.allSettled(promises);
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && r.value) {
        githubData[repos[i]] = r.value;
      }
    });
  }

  // ---- Format numbers ----
  function formatStars(n) {
    if (n == null) return '—';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  // ---- Build language filters ----
  function buildLanguageFilters() {
    const langs = new Set();
    allCards.forEach(card => {
      const gh = githubData[card.repo];
      if (gh && gh.language) langs.add(gh.language);
    });

    const container = document.getElementById('language-filters');
    // Keep the "All" button
    const sorted = [...langs].sort();
    sorted.forEach(lang => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn';
      btn.dataset.lang = lang;
      btn.textContent = lang;
      container.appendChild(btn);
    });

    // Event delegation
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      container.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLanguage = btn.dataset.lang;
      renderCards();
    });
  }

  // ---- Render cards ----
  function renderCards() {
    const gallery = document.getElementById('gallery');
    const loading = document.getElementById('loading');
    if (loading) loading.remove();

    // Filter
    let filtered = allCards.filter(card => {
      const gh = githubData[card.repo] || {};
      const repoLower = card.repo.toLowerCase();
      const matchSearch = !searchQuery || repoLower.includes(searchQuery.toLowerCase());
      const matchLang = activeLanguage === 'all' || (gh.language === activeLanguage);
      return matchSearch && matchLang;
    });

    // Clear
    gallery.innerHTML = '';

    // Count
    const countEl = document.getElementById('card-count');
    countEl.textContent = `共 ${filtered.length} 张卡片`;

    if (filtered.length === 0) {
      gallery.innerHTML = '<div class="no-results">没有找到匹配的卡片 🍂</div>';
      return;
    }

    // Sort by stars (descending), fallback to name
    filtered.sort((a, b) => {
      const sa = (githubData[a.repo] || {}).stargazers_count || 0;
      const sb = (githubData[b.repo] || {}).stargazers_count || 0;
      return sb - sa;
    });

    filtered.forEach((card, i) => {
      const gh = githubData[card.repo] || {};
      const [author, name] = card.repo.split('/');

      const el = document.createElement('a');
      el.className = 'card fade-in';
      el.href = `https://github.com/${card.repo}`;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.style.animationDelay = `${i * 0.05}s`;

      const langColor = LANG_COLORS[gh.language] || '#888';
      const langHtml = gh.language
        ? `<span class="card-language"><span class="lang-dot" style="background:${langColor}"></span>${gh.language}</span>`
        : '';

      const descText = gh.description
        ? gh.description.substring(0, 60) + (gh.description.length > 60 ? '…' : '')
        : '';

      el.innerHTML = `
        <div class="card-image-wrapper">
          <img src="./illustrations/${card.filename}" alt="${card.repo}" loading="lazy">
          <div class="card-overlay">
            <span class="card-author">${author}</span>
            <span class="card-name">${name}</span>
          </div>
        </div>
        <div class="card-meta">
          <span class="card-stars">
            <svg viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>
            ${formatStars(gh.stargazers_count)}
          </span>
          ${langHtml}
          ${descText ? `<span class="card-desc" title="${gh.description || ''}">${descText}</span>` : ''}
        </div>
      `;

      gallery.appendChild(el);
    });
  }

  // ---- Search ----
  function initSearch() {
    const input = document.getElementById('search-input');
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        searchQuery = input.value.trim();
        renderCards();
      }, 200);
    });
  }

  // ---- Init ----
  async function init() {
    initTheme();

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Load manifest
    await loadManifest();
    if (allCards.length === 0) {
      document.getElementById('gallery').innerHTML = '<div class="no-results">暂无卡片数据</div>';
      return;
    }

    // Render immediately with what we have
    renderCards();

    // Fetch GitHub data in background
    const repos = allCards.map(c => c.repo);
    await fetchGitHubData(repos);

    // Build filters & re-render with full data
    buildLanguageFilters();
    renderCards();

    // Init search
    initSearch();
  }

  // Go
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

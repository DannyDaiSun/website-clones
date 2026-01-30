/* ==========================================================================
   Hacker News Clone — script.js
   Interactive behavior: nav, search, voting, tabs, comments, submit form
   ========================================================================== */

(function () {
  'use strict';

  // ---------- Story Data (for search) ----------
  const stories = [
    { id: 1, title: 'Rust is the most loved programming language for the 8th year in a row', domain: 'blog.rust-lang.org', user: 'rustfan', points: 421, comments: 287, category: 'top' },
    { id: 2, title: 'Show HN: I built a search engine that respects your privacy', domain: 'privatesearch.io', user: 'searchdev', points: 338, comments: 195, category: 'top,show' },
    { id: 3, title: 'Why SQLite does not use Git (2018)', domain: 'sqlite.org', user: 'drh', points: 502, comments: 341, category: 'top,best' },
    { id: 4, title: 'Linux 6.8 Released with Intel Xe driver improvements', domain: 'kernel.org', user: 'linuxfan', points: 89, comments: 42, category: 'new' },
    { id: 5, title: 'Show HN: Open-source alternative to Figma built with WebGL', domain: 'github.com/openfigma', user: 'designhacker', points: 156, comments: 73, category: 'new,show' },
    { id: 6, title: 'The Great Convergence: AI, neuroscience and the future of mind', domain: 'nature.com', user: 'neurosci', points: 267, comments: 189, category: 'top,best' },
    { id: 7, title: "Ask HN: What's the best way to learn systems programming in 2024?", user: 'newgrad', points: 173, comments: 254, category: 'ask' },
    { id: 8, title: 'Apple Vision Pro teardown reveals remarkable engineering', domain: 'ifixit.com', user: 'ifixit', points: 398, comments: 312, category: 'top' },
    { id: 9, title: 'PostgreSQL 17 beta introduces incremental backup support', domain: 'postgresql.org', user: 'pgfan', points: 67, comments: 18, category: 'new' },
    { id: 10, title: "A programmer's introduction to mathematics (2018)", domain: 'jeremykun.com', user: 'j2kun', points: 445, comments: 198, category: 'top,best' },
    { id: 11, title: 'Ask HN: Who is hiring? (January 2024)', user: 'whoishiring', points: 512, comments: 823, category: 'ask' },
    { id: 12, title: 'Show HN: Terminal-based Markdown editor with live preview', domain: 'github.com/termd', user: 'termdev', points: 211, comments: 87, category: 'show' },
    { id: 13, title: 'Stripe is hiring backend engineers (Remote US/EU)', user: '', points: 0, comments: 0, category: 'jobs' },
    { id: 14, title: 'How I reduced my Docker image size by 98%', domain: 'blog.example.com', user: 'dockerpro', points: 189, comments: 134, category: 'top' },
    { id: 15, title: 'WebAssembly is finally ready for production', domain: 'webassembly.org', user: 'wasmfan', points: 34, comments: 12, category: 'new' },
    { id: 16, title: 'YC-backed startup hiring founding engineer (SF, $180-250k)', user: '', points: 0, comments: 0, category: 'jobs' },
    { id: 17, title: 'Show HN: I reverse-engineered the Spotify algorithm', domain: 'spotifyalgo.com', user: 'musicdev', points: 301, comments: 178, category: 'top,show' },
    { id: 18, title: "Ask HN: What's your favorite under-the-radar dev tool?", user: 'toolhunter', points: 234, comments: 467, category: 'ask' },
    { id: 19, title: 'The unreasonable effectiveness of plain text', domain: 'plaintext.dev', user: 'textfiles', points: 378, comments: 256, category: 'top,best' },
    { id: 20, title: 'Show HN: SQLite-based full-text search for static sites', domain: 'github.com/sqlitesearch', user: 'sqlitedev', points: 45, comments: 23, category: 'new,show' }
  ];

  // ---------- User Profiles Data (for user page) ----------
  const users = {
    rustfan: { created: 'March 15, 2019', karma: '14,872', about: 'Systems programmer. Rust evangelist. Building safe, fast, concurrent software.' },
    searchdev: { created: 'June 2, 2021', karma: '3,421', about: 'Privacy-focused developer. Building tools that respect users.' },
    drh: { created: 'October 8, 2007', karma: '89,234', about: 'Creator of SQLite. Building software that lasts decades.' },
    linuxfan: { created: 'January 12, 2015', karma: '7,891', about: 'Linux kernel contributor. Open source enthusiast.' },
    designhacker: { created: 'April 22, 2020', karma: '5,102', about: 'Designer and developer. Making open-source design tools.' },
    neurosci: { created: 'September 3, 2018', karma: '11,456', about: 'Computational neuroscientist. AI researcher.' },
    newgrad: { created: 'December 1, 2023', karma: '456', about: 'Fresh CS graduate. Learning systems programming.' },
    ifixit: { created: 'March 8, 2010', karma: '42,789', about: 'iFixit official account. We tear things down so you can fix them.' },
    dang: { created: 'June 30, 2007', karma: '120,345', about: 'HN moderator.' }
  };

  // ---------- DOM Elements ----------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchResults = document.getElementById('searchResults');
  const searchClose = document.getElementById('searchClose');
  const footerSearch = document.getElementById('footerSearch');
  const storyList = document.getElementById('storyList');
  const sortTabs = document.getElementById('sortTabs');
  const commentThread = document.getElementById('commentThread');
  const commentForm = document.getElementById('commentForm');
  const submitForm = document.getElementById('submitForm');
  const submitModal = document.getElementById('submitModal');
  const modalClose = document.getElementById('modalClose');
  const userTabs = document.getElementById('userTabs');

  // ---------- Hamburger Menu ----------
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      mobileNavOverlay.classList.toggle('active');
      document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile nav on overlay click
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', function (e) {
      if (e.target === this) {
        hamburgerBtn.classList.remove('active');
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------- Search ----------
  function performSearch(query) {
    if (!query || query.trim().length === 0) return;
    const q = query.trim().toLowerCase();
    const results = stories.filter(function (s) {
      return s.title.toLowerCase().includes(q) ||
             (s.domain && s.domain.toLowerCase().includes(q)) ||
             (s.user && s.user.toLowerCase().includes(q));
    });

    searchResults.innerHTML = '';

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No stories found for "' + query + '"</div>';
    } else {
      results.forEach(function (story) {
        var item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML =
          '<div class="search-result-title"><a href="item.html?id=' + story.id + '">' + story.title + '</a></div>' +
          '<div class="search-result-meta">' +
          (story.points ? story.points + ' points' : '') +
          (story.user ? ' by ' + story.user : '') +
          (story.comments ? ' | ' + story.comments + ' comments' : '') +
          '</div>';
        searchResults.appendChild(item);
      });
    }

    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      performSearch(searchInput.value);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(this.value);
      }
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', function () {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Footer search
  if (footerSearch) {
    footerSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(this.value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ---------- Sort Tabs (index page) ----------
  if (sortTabs) {
    var tabs = sortTabs.querySelectorAll('.sort-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Update active tab
        tabs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');

        var sort = this.getAttribute('data-sort');
        filterStories(sort);
      });
    });
  }

  function filterStories(category) {
    if (!storyList) return;
    var items = storyList.querySelectorAll('.story-item');
    var visibleCount = 0;

    items.forEach(function (item) {
      var cats = (item.getAttribute('data-category') || '').split(',');
      if (category === 'top' || cats.includes(category)) {
        item.classList.remove('hidden');
        visibleCount++;
        item.querySelector('.story-rank').textContent = visibleCount + '.';
      } else {
        item.classList.add('hidden');
      }
    });
  }

  // Handle URL sort param
  function handleSortParam() {
    var params = new URLSearchParams(window.location.search);
    var sort = params.get('sort');
    if (sort && sortTabs) {
      var tabs = sortTabs.querySelectorAll('.sort-tab');
      tabs.forEach(function (t) { t.classList.remove('active'); });
      var target = sortTabs.querySelector('[data-sort="' + sort + '"]');
      if (target) {
        target.classList.add('active');
        filterStories(sort);
      }
    }
  }
  handleSortParam();

  // ---------- Upvoting ----------
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('upvote-btn')) {
      e.preventDefault();
      var btn = e.target;
      var id = btn.getAttribute('data-id');

      btn.classList.toggle('upvoted');

      // Update score display
      if (id && !btn.classList.contains('comment-upvote')) {
        var scoreEl = document.querySelector('.story-score[data-id="' + id + '"]');
        if (scoreEl) {
          var current = parseInt(scoreEl.textContent) || 0;
          if (btn.classList.contains('upvoted')) {
            scoreEl.textContent = (current + 1) + ' points';
            scoreEl.classList.add('bumped');
          } else {
            scoreEl.textContent = (current - 1) + ' points';
            scoreEl.classList.remove('bumped');
          }
          setTimeout(function () { scoreEl.classList.remove('bumped'); }, 1000);
        }
      }
    }
  });

  // ---------- Comment Toggle (collapse/expand) ----------
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('comment-toggle')) {
      var id = e.target.getAttribute('data-id');
      var body = document.getElementById('comment-body-' + id);
      if (body) {
        body.classList.toggle('collapsed');
        e.target.textContent = body.classList.contains('collapsed') ? '[+]' : '[–]';
      }
    }
  });

  // ---------- Reply to Comments ----------
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('reply-btn')) {
      var parentId = e.target.getAttribute('data-parent');
      // Remove any existing reply forms
      var existing = document.querySelectorAll('.reply-form');
      existing.forEach(function (f) { f.remove(); });

      var commentBody = document.getElementById('comment-body-' + parentId);
      if (!commentBody) return;

      var form = document.createElement('div');
      form.className = 'reply-form';
      form.innerHTML =
        '<textarea placeholder="Write your reply..." rows="4"></textarea>' +
        '<div class="reply-form-actions">' +
        '  <button class="reply-submit" data-parent="' + parentId + '">reply</button>' +
        '  <button class="reply-cancel">cancel</button>' +
        '</div>';

      commentBody.parentNode.insertBefore(form, commentBody.nextSibling);
      form.querySelector('textarea').focus();
    }
  });

  // Reply cancel
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('reply-cancel')) {
      var form = e.target.closest('.reply-form');
      if (form) form.remove();
    }
  });

  // Reply submit
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('reply-submit')) {
      var form = e.target.closest('.reply-form');
      var textarea = form.querySelector('textarea');
      var text = textarea.value.trim();
      if (!text) return;

      var parentId = e.target.getAttribute('data-parent');
      var parentComment = form.closest('.comment');
      var parentDepth = parseInt(parentComment.getAttribute('data-depth') || '0');
      var newDepth = Math.min(parentDepth + 1, 4);
      var newId = 'new-' + Date.now();

      var newComment = document.createElement('div');
      newComment.className = 'comment new-comment';
      newComment.setAttribute('data-id', newId);
      newComment.setAttribute('data-depth', newDepth);
      newComment.innerHTML =
        '<div class="comment-header">' +
        '  <button class="upvote-btn comment-upvote" data-id="' + newId + '" aria-label="Upvote comment">▲</button>' +
        '  <a href="user.html?id=you" class="comment-author">you</a>' +
        '  <span class="comment-time">just now</span>' +
        '  <button class="comment-toggle" aria-label="Toggle comment" data-id="' + newId + '">[–]</button>' +
        '</div>' +
        '<div class="comment-body" id="comment-body-' + newId + '">' +
        '  <p>' + escapeHtml(text) + '</p>' +
        '  <div class="comment-actions">' +
        '    <button class="reply-btn" data-parent="' + newId + '">reply</button>' +
        '  </div>' +
        '</div>';

      // Insert after parent comment's children
      var nextSibling = parentComment.nextElementSibling;
      while (nextSibling && nextSibling.classList.contains('comment') &&
             parseInt(nextSibling.getAttribute('data-depth') || '0') > parentDepth) {
        nextSibling = nextSibling.nextElementSibling;
      }

      if (nextSibling) {
        parentComment.parentNode.insertBefore(newComment, nextSibling);
      } else {
        parentComment.parentNode.appendChild(newComment);
      }

      form.remove();
    }
  });

  // ---------- Top-level Comment Form ----------
  if (commentForm) {
    commentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var textarea = document.getElementById('commentText');
      var text = textarea.value.trim();
      if (!text) return;

      var newId = 'new-' + Date.now();
      var newComment = document.createElement('div');
      newComment.className = 'comment new-comment';
      newComment.setAttribute('data-id', newId);
      newComment.setAttribute('data-depth', '0');
      newComment.innerHTML =
        '<div class="comment-header">' +
        '  <button class="upvote-btn comment-upvote" data-id="' + newId + '" aria-label="Upvote comment">▲</button>' +
        '  <a href="user.html?id=you" class="comment-author">you</a>' +
        '  <span class="comment-time">just now</span>' +
        '  <button class="comment-toggle" aria-label="Toggle comment" data-id="' + newId + '">[–]</button>' +
        '</div>' +
        '<div class="comment-body" id="comment-body-' + newId + '">' +
        '  <p>' + escapeHtml(text) + '</p>' +
        '  <div class="comment-actions">' +
        '    <button class="reply-btn" data-parent="' + newId + '">reply</button>' +
        '  </div>' +
        '</div>';

      if (commentThread) {
        commentThread.insertBefore(newComment, commentThread.firstChild);
      }
      textarea.value = '';

      // Update comment count
      var countEl = document.getElementById('itemCommentCount');
      if (countEl) {
        var current = parseInt(countEl.textContent) || 0;
        countEl.textContent = (current + 1) + ' comments';
      }
    });
  }

  // ---------- Submit Form ----------
  if (submitForm) {
    submitForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = document.getElementById('submitTitle').value.trim();
      var url = document.getElementById('submitUrl').value.trim();

      if (!title) return;

      // Show modal
      var previewTitle = document.getElementById('previewTitle');
      var previewDomain = document.getElementById('previewDomain');
      if (previewTitle) previewTitle.textContent = title;
      if (previewDomain) {
        if (url) {
          try {
            var domain = new URL(url).hostname;
            previewDomain.textContent = '(' + domain + ')';
          } catch (err) {
            previewDomain.textContent = '';
          }
        } else {
          previewDomain.textContent = '';
        }
      }

      if (submitModal) {
        submitModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', function () {
      submitModal.classList.remove('active');
      document.body.style.overflow = '';
      // Reset form
      if (submitForm) submitForm.reset();
    });
  }

  // Close modal on overlay click
  if (submitModal) {
    submitModal.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------- User Page Tabs ----------
  if (userTabs) {
    var tabBtns = userTabs.querySelectorAll('.user-tab');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        var tabName = this.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(function (content) {
          content.classList.remove('active');
        });
        var target = document.getElementById('tab-' + tabName);
        if (target) target.classList.add('active');
      });
    });
  }

  // ---------- User Page: Dynamic Profile from URL ----------
  function loadUserProfile() {
    var params = new URLSearchParams(window.location.search);
    var userId = params.get('id');
    if (!userId) return;

    var userNameEl = document.getElementById('userName');
    var profileUserEl = document.getElementById('profileUser');
    var profileCreatedEl = document.getElementById('profileCreated');
    var profileKarmaEl = document.getElementById('profileKarma');
    var profileAboutEl = document.getElementById('profileAbout');
    var profileAvatarEl = document.getElementById('profileAvatar');

    if (!userNameEl) return;

    var user = users[userId];
    if (user) {
      userNameEl.textContent = userId;
      if (profileUserEl) profileUserEl.textContent = userId;
      if (profileCreatedEl) profileCreatedEl.textContent = user.created;
      if (profileKarmaEl) profileKarmaEl.textContent = user.karma;
      if (profileAboutEl) profileAboutEl.textContent = user.about;
    } else {
      userNameEl.textContent = userId;
      if (profileUserEl) profileUserEl.textContent = userId;
    }

    // Update avatar letter
    if (profileAvatarEl) {
      var letter = userId.charAt(0).toUpperCase();
      profileAvatarEl.innerHTML =
        '<svg viewBox="0 0 80 80" width="80" height="80">' +
        '<rect width="80" height="80" rx="8" fill="#ff6600"/>' +
        '<text x="40" y="52" text-anchor="middle" fill="white" font-size="36" font-weight="bold" font-family="monospace">' + letter + '</text>' +
        '</svg>';
    }

    document.title = 'User: ' + userId + ' | Hacker News';
  }
  loadUserProfile();

  // ---------- Item Page: Dynamic Content from URL ----------
  function loadItemContent() {
    var params = new URLSearchParams(window.location.search);
    var itemId = parseInt(params.get('id'));
    if (!itemId) return;

    var story = stories.find(function (s) { return s.id === itemId; });
    if (!story) return;

    var titleEl = document.getElementById('itemTitle');
    var domainEl = document.getElementById('itemDomain');
    var scoreEl = document.getElementById('itemScore');
    var authorEl = document.getElementById('itemAuthor');

    if (titleEl) titleEl.textContent = story.title;
    if (domainEl) domainEl.textContent = story.domain ? '(' + story.domain + ')' : '';
    if (scoreEl) scoreEl.textContent = story.points + ' points';
    if (authorEl) {
      authorEl.textContent = story.user;
      authorEl.href = 'user.html?id=' + story.user;
    }

    document.title = story.title + ' | Hacker News';
  }
  loadItemContent();

  // ---------- Escape HTML Utility ----------
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Keyboard Shortcuts ----------
  document.addEventListener('keydown', function (e) {
    // ESC closes overlays
    if (e.key === 'Escape') {
      if (searchOverlay && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (mobileNavOverlay && mobileNavOverlay.classList.contains('active')) {
        hamburgerBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (submitModal && submitModal.classList.contains('active')) {
        submitModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    // Ctrl+K or / to focus search
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.target.matches('input, textarea'))) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

})();

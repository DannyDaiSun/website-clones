/* ============================================
   DEV.to Clone — script.js
   ============================================ */
(function () {
  'use strict';

  // === Search Index ===
  const articles = [
    { id: 1, title: '10 JavaScript Tips That Will Make You a Better Developer in 2024', author: 'Sarah Chen', tags: ['javascript', 'webdev', 'beginners'] },
    { id: 2, title: 'Building a Full-Stack App with React 19 and TypeScript', author: 'Alex Rivera', tags: ['react', 'typescript', 'webdev'] },
    { id: 3, title: 'How I Built an AI-Powered Code Review Tool with Python', author: 'Maya Patel', tags: ['python', 'ai', 'webdev'] },
    { id: 4, title: 'CSS Container Queries Changed Everything — Here\'s How', author: 'Jordan Lee', tags: ['css', 'webdev'] },
    { id: 5, title: 'Node.js Performance: 7 Tricks I Wish I Knew Earlier', author: 'Chris Wu', tags: ['node', 'javascript'] },
    { id: 6, title: 'From Bootcamp to Senior Dev: My 5-Year Journey', author: 'Emma Davis', tags: ['career', 'beginners'] },
    { id: 7, title: 'Why Rust is the Future of WebAssembly', author: 'Kai Nakamura', tags: ['rust', 'webdev'] },
    { id: 8, title: 'Docker + Kubernetes: The Complete Developer\'s Guide (2024)', author: 'Liam O\'Brien', tags: ['devops', 'cloud'] },
  ];

  // === Hamburger / Mobile Nav ===
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  // === Profile Dropdown ===
  const avatarBtn = document.getElementById('avatarBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (avatarBtn && profileDropdown) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('open');
      }
    });
  }

  // === Search ===
  const searchInput = document.getElementById('searchInput');
  const searchDropdown = document.getElementById('searchDropdown');
  const searchResults = document.getElementById('searchResults');

  if (searchInput && searchDropdown && searchResults) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchDropdown.classList.remove('open');
        return;
      }
      const matches = articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.tags.some(t => t.includes(q))
      );
      if (matches.length) {
        searchResults.innerHTML = matches.map(m =>
          `<a href="./article.html?id=${m.id}">
            <span class="sr-title">${m.title}</span>
            <span class="sr-meta">${m.author} · ${m.tags.map(t => '#' + t).join(', ')}</span>
          </a>`
        ).join('');
      } else {
        searchResults.innerHTML = '<p style="padding:12px;color:#737373;font-size:14px">No results found.</p>';
      }
      searchDropdown.classList.add('open');
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') searchDropdown.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (!searchDropdown.contains(e.target) && e.target !== searchInput) {
        searchDropdown.classList.remove('open');
      }
    });
  }

  // === Feed Tabs ===
  const feedTabs = document.querySelectorAll('.feed-tab');
  const cards = document.querySelectorAll('.card[data-feed]');

  if (feedTabs.length && cards.length) {
    feedTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        feedTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const feed = tab.dataset.feed;
        cards.forEach(card => {
          const feeds = card.dataset.feed.split(',');
          card.style.display = feeds.includes(feed) ? '' : 'none';
        });
      });
    });
  }

  // === Save/Bookmark ===
  const saveButtons = document.querySelectorAll('.save-btn');
  saveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('saved');
      btn.textContent = btn.classList.contains('saved') ? '🔖✓' : '🔖';
    });
  });

  // === Article Reactions ===
  const reactionBtns = document.querySelectorAll('.reaction-btn[data-reaction]');
  reactionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const countEl = btn.querySelector('.reaction-count');
      if (countEl && countEl.id) {
        let val = parseInt(countEl.textContent);
        if (!isNaN(val)) {
          countEl.textContent = btn.classList.contains('active') ? val + 1 : val - 1;
        }
      }
    });
  });

  // === Comment Submit ===
  const commentInput = document.getElementById('commentInput');
  const submitComment = document.getElementById('submitComment');
  const commentsList = document.getElementById('commentsList');
  const commentCount = document.getElementById('commentCount');

  if (submitComment && commentInput && commentsList) {
    submitComment.addEventListener('click', () => {
      const text = commentInput.value.trim();
      if (!text) return;
      const comment = document.createElement('div');
      comment.className = 'comment';
      comment.innerHTML = `
        <div class="avatar avatar-sm">🧑‍💻</div>
        <div class="comment-body">
          <div class="comment-header">
            <strong>dev_user</strong>
            <time>Just now</time>
          </div>
          <p>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          <div class="comment-actions">
            <button class="comment-react">❤️ <span>0</span></button>
            <button class="comment-reply-btn">Reply</button>
          </div>
        </div>
      `;
      commentsList.prepend(comment);
      commentInput.value = '';
      if (commentCount) {
        commentCount.textContent = parseInt(commentCount.textContent) + 1;
      }
    });
  }

  // === Comment Like ===
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('comment-react') || e.target.closest('.comment-react')) {
      const btn = e.target.classList.contains('comment-react') ? e.target : e.target.closest('.comment-react');
      const span = btn.querySelector('span');
      if (span) {
        let v = parseInt(span.textContent);
        span.textContent = isNaN(v) ? 1 : v + 1;
      }
    }
  });

  // === Tags Page: Filter ===
  const tagSearch = document.getElementById('tagSearch');
  const tagCards = document.querySelectorAll('.tag-card[data-tag]');

  if (tagSearch && tagCards.length) {
    tagSearch.addEventListener('input', () => {
      const q = tagSearch.value.trim().toLowerCase();
      tagCards.forEach(card => {
        const tag = card.dataset.tag;
        const desc = card.querySelector('.tag-card-desc');
        const match = tag.includes(q) || (desc && desc.textContent.toLowerCase().includes(q));
        card.style.display = match ? '' : 'none';
      });
    });
  }

  // === Tags Page: Follow Toggle ===
  document.querySelectorAll('.tag-follow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('following');
      btn.textContent = btn.classList.contains('following') ? 'Following' : 'Follow';
    });
  });

  // === Tags Page: Scroll to tag from hash ===
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.style.outline = '2px solid var(--accent)';
        target.style.outlineOffset = '4px';
        setTimeout(() => { target.style.outline = ''; target.style.outlineOffset = ''; }, 2000);
      }, 300);
    }
  }

  // === New Post Page ===
  const postTitle = document.getElementById('postTitle');
  const postBody = document.getElementById('postBody');
  const previewToggle = document.getElementById('previewToggle');
  const editorPreview = document.getElementById('editorPreview');
  const previewContent = document.getElementById('previewContent');
  const publishBtn = document.getElementById('publishBtn');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  const publishModal = document.getElementById('publishModal');

  // Auto-resize title
  if (postTitle) {
    postTitle.addEventListener('input', () => {
      postTitle.style.height = 'auto';
      postTitle.style.height = postTitle.scrollHeight + 'px';
    });
  }

  // Preview toggle
  if (previewToggle && postBody && editorPreview && previewContent) {
    let previewing = false;
    previewToggle.addEventListener('click', () => {
      previewing = !previewing;
      if (previewing) {
        postBody.style.display = 'none';
        editorPreview.style.display = '';
        previewToggle.textContent = 'Edit';
        const md = postBody.value || '';
        previewContent.innerHTML = simpleMarkdown(md) || '<p class="preview-placeholder">Nothing to preview yet. Start writing!</p>';
      } else {
        postBody.style.display = '';
        editorPreview.style.display = 'none';
        previewToggle.textContent = 'Preview';
      }
    });
  }

  // Simple markdown-to-HTML converter
  function simpleMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/^---$/gm, '<hr>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, (m) => {
        if (m.startsWith('<')) return m;
        return m;
      });
  }

  // Publish
  if (publishBtn && publishModal) {
    publishBtn.addEventListener('click', () => {
      const title = postTitle ? postTitle.value.trim() : '';
      if (!title) {
        alert('Please add a title for your post.');
        if (postTitle) postTitle.focus();
        return;
      }
      publishModal.style.display = '';
    });
  }

  // Close modal
  if (publishModal) {
    publishModal.addEventListener('click', (e) => {
      if (e.target === publishModal) publishModal.style.display = 'none';
    });
  }

  // Save Draft
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      const title = postTitle ? postTitle.value : '';
      const body = postBody ? postBody.value : '';
      localStorage.setItem('devto_draft', JSON.stringify({ title, body }));
      saveDraftBtn.textContent = '✓ Draft Saved';
      setTimeout(() => { saveDraftBtn.textContent = 'Save Draft'; }, 2000);
    });
  }

  // Load draft
  if (postTitle && postBody) {
    const draft = localStorage.getItem('devto_draft');
    if (draft) {
      try {
        const d = JSON.parse(draft);
        if (d.title) postTitle.value = d.title;
        if (d.body) postBody.value = d.body;
      } catch (e) {}
    }
  }

  // Cover image toggle
  const addCoverBtn = document.getElementById('addCoverBtn');
  const coverPreview = document.getElementById('coverPreview');
  const coverRemove = document.getElementById('coverRemove');

  if (addCoverBtn && coverPreview) {
    addCoverBtn.addEventListener('click', () => {
      addCoverBtn.style.display = 'none';
      coverPreview.style.display = '';
    });
  }
  if (coverRemove && addCoverBtn && coverPreview) {
    coverRemove.addEventListener('click', () => {
      coverPreview.style.display = 'none';
      addCoverBtn.style.display = '';
    });
  }

  // Tags input
  const tagInput = document.getElementById('tagInput');
  const tagChips = document.getElementById('tagChips');
  const tagSuggestions = document.getElementById('tagSuggestions');
  let postTags = [];

  if (tagInput && tagChips && tagSuggestions) {
    tagInput.addEventListener('focus', () => {
      tagSuggestions.classList.add('show');
    });
    tagInput.addEventListener('blur', () => {
      setTimeout(() => tagSuggestions.classList.remove('show'), 200);
    });

    tagInput.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ',') && tagInput.value.trim()) {
        e.preventDefault();
        addTag(tagInput.value.trim().replace(/^#/, ''));
        tagInput.value = '';
      }
      if (e.key === 'Backspace' && !tagInput.value && postTags.length) {
        removeTag(postTags[postTags.length - 1]);
      }
    });

    tagSuggestions.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        addTag(btn.dataset.tag);
      });
    });

    function addTag(name) {
      name = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!name || postTags.includes(name) || postTags.length >= 4) return;
      postTags.push(name);
      renderTagChips();
    }

    function removeTag(name) {
      postTags = postTags.filter(t => t !== name);
      renderTagChips();
    }

    function renderTagChips() {
      tagChips.innerHTML = postTags.map(t =>
        `<span class="tag-chip">#${t} <button class="tag-chip-remove" data-tag="${t}">&times;</button></span>`
      ).join('');
      tagChips.querySelectorAll('.tag-chip-remove').forEach(btn => {
        btn.addEventListener('click', () => removeTag(btn.dataset.tag));
      });
    }
  }

  // Toolbar buttons (simple inserts)
  document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!postBody) return;
      const actions = {
        bold: '**bold text**',
        italic: '*italic text*',
        link: '[link text](url)',
        ul: '\n- List item\n- List item\n',
        ol: '\n1. First item\n2. Second item\n',
        heading: '\n## Heading\n',
        code: '\n```\ncode here\n```\n',
        quote: '\n> Blockquote\n',
        image: '![alt text](image_url)',
        hr: '\n---\n',
      };
      const insert = actions[btn.dataset.action];
      if (insert) {
        const start = postBody.selectionStart;
        const end = postBody.selectionEnd;
        postBody.value = postBody.value.substring(0, start) + insert + postBody.value.substring(end);
        postBody.focus();
        postBody.selectionStart = postBody.selectionEnd = start + insert.length;
      }
    });
  });

  // === Dynamic Article Content (via URL params) ===
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  if (articleId) {
    const articleData = {
      '1': { avatar: '👩‍💻', author: 'Sarah Chen', date: 'Jan 15', readTime: '8 min read', title: '10 JavaScript Tips That Will Make You a Better Developer in 2024', tags: ['javascript', 'webdev', 'beginners'] },
      '2': { avatar: '👨‍🔬', author: 'Alex Rivera', date: 'Jan 14', readTime: '12 min read', title: 'Building a Full-Stack App with React 19 and TypeScript', tags: ['react', 'typescript', 'webdev'] },
      '3': { avatar: '👩‍🔧', author: 'Maya Patel', date: 'Jan 14', readTime: '15 min read', title: 'How I Built an AI-Powered Code Review Tool with Python', tags: ['python', 'ai', 'webdev'] },
      '4': { avatar: '🧑‍🎨', author: 'Jordan Lee', date: 'Jan 13', readTime: '6 min read', title: 'CSS Container Queries Changed Everything — Here\'s How', tags: ['css', 'webdev'] },
      '5': { avatar: '👨‍💼', author: 'Chris Wu', date: 'Jan 13', readTime: '10 min read', title: 'Node.js Performance: 7 Tricks I Wish I Knew Earlier', tags: ['node', 'javascript'] },
      '6': { avatar: '👩‍🏫', author: 'Emma Davis', date: 'Jan 12', readTime: '7 min read', title: 'From Bootcamp to Senior Dev: My 5-Year Journey', tags: ['career', 'beginners'] },
      '7': { avatar: '🧑‍🚀', author: 'Kai Nakamura', date: 'Jan 12', readTime: '20 min read', title: 'Why Rust is the Future of WebAssembly', tags: ['rust', 'webdev'] },
      '8': { avatar: '👨‍🔧', author: 'Liam O\'Brien', date: 'Jan 11', readTime: '11 min read', title: 'Docker + Kubernetes: The Complete Developer\'s Guide (2024)', tags: ['devops', 'cloud'] },
    };

    const data = articleData[articleId];
    if (data) {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('articleTitle', data.title);
      set('articleAuthorName', data.author);
      set('articleDate', data.date);
      set('articleReadTime', data.readTime);
      set('sidebarAuthorName', data.author);
      set('sidebarAuthorMore', data.author);
      document.title = data.title + ' - DEV Community';

      const avatarEls = ['articleAvatar', 'sidebarAvatar'];
      avatarEls.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = data.avatar;
      });

      const tagsEl = document.getElementById('articleTags');
      if (tagsEl) {
        tagsEl.innerHTML = data.tags.map(t =>
          `<a href="./tags.html#${t}" class="tag">#${t}</a>`
        ).join('');
      }
    }
  }

  // === Smooth Scroll ===
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

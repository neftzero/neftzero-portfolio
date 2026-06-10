/**
 * main.js — Portfolio core logic (v2)
 *
 * - Masonry grid (natural image proportions, no gaps)
 * - Page fade-out on nav link clicks
 * - Sliding nav indicator
 * - Lightbox with keyboard & swipe
 * - Scroll-reveal entrance animation
 */

(function () {
  'use strict';

  /* ── YEAR ── */
  const yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();


  /* ══════════════════════════════════════
     PAGE TRANSITIONS
     Fade out body before navigating away
  ══════════════════════════════════════ */
  document.querySelectorAll('a[href]').forEach(link => {
    // only same-origin, non-hash, non-target links
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('http') || link.target === '_blank') return;

    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { window.location.href = href; }, 320);
    });
  });


  /* ══════════════════════════════════════
     NAV INDICATOR
     Sliding underline on the active cat tab
  ══════════════════════════════════════ */
  function initNavIndicator() {
    const nav    = document.querySelector('.cat-nav');
    const active = nav && nav.querySelector('.cat-link.active');
    if (!nav || !active) return;

    function setIndicator(el) {
      const navRect = nav.getBoundingClientRect();
      const elRect  = el.getBoundingClientRect();
      nav.style.setProperty('--indicator-left',  (elRect.left - navRect.left) + 'px');
      nav.style.setProperty('--indicator-width', elRect.width + 'px');
    }

    setIndicator(active);

    // hover preview
    nav.querySelectorAll('.cat-link').forEach(link => {
      link.addEventListener('mouseenter', () => setIndicator(link));
      link.addEventListener('mouseleave', () => setIndicator(active));
    });
  }

  initNavIndicator();


  /* ══════════════════════════════════════
     HEADER SCROLL STATE
     Slightly increases header opacity once
     the page has scrolled, for readability
     over bright tiles.
  ══════════════════════════════════════ */
  (function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function update() {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  })();


  /* ══════════════════════════════════════
     GALLERY GRID
  ══════════════════════════════════════ */
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const filter      = grid.dataset.filter || 'all';
  const works       = (typeof WORKS !== 'undefined')
    ? (filter === 'all' ? WORKS : WORKS.filter(w => w.cat === filter))
    : [];
  let visibleWorks  = works;

  /* ── BUILD TILES ── */
  function buildTiles(list) {
    grid.innerHTML = '';
    list.forEach((work, idx) => {
      const tile = document.createElement('article');
      tile.className = 'tile';
      tile.dataset.cat   = work.cat;
      tile.dataset.index = idx;
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('aria-label', `View ${work.title}`);

      /* image — height: auto preserves natural proportions */
      const hasImg = work.img && work.img !== '';
      if (hasImg) {
        const img       = document.createElement('img');
        img.className   = 'tile-img';
        img.src         = work.thumb || work.img;
        img.alt         = work.title;
        img.loading     = idx < 8 ? 'eager' : 'lazy';
        img.decoding    = 'async';
        tile.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className    = 'tile-placeholder';
        ph.style.background = placeholderBg(work.cat);
        ph.textContent  = work.title.toUpperCase();
        tile.appendChild(ph);
      }

      /* hover overlay */
      const overlay = document.createElement('div');
      overlay.className = 'tile-overlay';
      overlay.innerHTML = `
        <p class="tile-cat">${work.cat.toUpperCase()}</p>
        <h2 class="tile-title">${work.title}</h2>
        <p class="tile-view">— view —</p>
      `;
      tile.appendChild(overlay);

      /* interactions */
      tile.addEventListener('click', () => openLightbox(idx));
      tile.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
      });

      grid.appendChild(tile);
    });

    initScrollReveal();
  }

  function placeholderBg(cat) {
    return cat === '2d'     ? 'rgba(200,169,110,0.08)'
         : cat === '3d'     ? 'rgba(143,184,200,0.08)'
         : cat === 'design' ? 'rgba(200,158,180,0.08)'
         : 'rgba(255,255,255,0.04)';
  }

  buildTiles(visibleWorks);


  /* ── SCROLL REVEAL ── */
  function initScrollReveal() {
    const tiles = grid.querySelectorAll('.tile');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const col = parseInt(entry.target.dataset.index, 10) % 3;
        entry.target.style.transitionDelay = `${col * 55}ms`;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    tiles.forEach(t => io.observe(t));
  }


  /* ══════════════════════════════════════
     LIGHTBOX
  ══════════════════════════════════════ */
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lbImg');
  const lbCat   = document.getElementById('lbCat');
  const lbTitle = document.getElementById('lbTitle');
  const lbDesc  = document.getElementById('lbDesc');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');
  if (!lb) return;

  let currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    renderSlide(idx);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderSlide(idx) {
    const work = visibleWorks[idx];
    if (!work) return;
    lbCat.textContent   = work.cat.toUpperCase() + (work.year ? '  ·  ' + work.year : '');
    lbTitle.textContent = work.title;
    lbDesc.textContent  = work.desc || '';

    if (work.img) {
      lbImg.classList.add('loading');
      lbImg.src = work.img;
      lbImg.alt = work.title;
      lbImg.onload  = () => lbImg.classList.remove('loading');
      lbImg.onerror = () => lbImg.classList.remove('loading');
    } else {
      lbImg.src = '';
    }
  }

  function navigate(dir) {
    const total = visibleWorks.length;
    currentIdx  = (currentIdx + dir + total) % total;
    renderSlide(currentIdx);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => navigate(-1));
  lbNext.addEventListener('click',  () => navigate(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  /* keyboard */
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  /* swipe */
  let tX = null;
  lb.addEventListener('touchstart', e => { tX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend',   e => {
    if (tX === null) return;
    const dx = e.changedTouches[0].clientX - tX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    tX = null;
  }, { passive: true });

})();

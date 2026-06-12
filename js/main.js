/**
 * main.js — Portfolio core (v4)
 *
 * - Page fade transitions
 * - Liquid glass pill nav indicator
 * - Masonry tile grid (natural image proportions)
 * - Lightbox: keyboard, swipe, fade
 * - Scroll-reveal stagger
 */

(function () {
  'use strict';

  /* ── YEAR ── */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();


  /* ══════════════════════════════
     PAGE FADE TRANSITIONS
  ══════════════════════════════ */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('http') || link.target === '_blank') return;

    link.addEventListener('click', e => {
      // don't intercept if already on this page
      const current = window.location.pathname.split('/').pop() || 'index.html';
      if (href === current) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { window.location.href = href; }, 300);
    });
  });


  /* ══════════════════════════════
     LIQUID GLASS NAV INDICATOR
     Slides a line under active tab,
     previews on hover
  ══════════════════════════════ */
  (function initNavIndicator() {
    const nav       = document.querySelector('.cat-nav');
    const indicator = document.getElementById('navIndicator');
    if (!nav || !indicator) return;

    const active = nav.querySelector('.cat-link.active');

    function setIndicator(el) {
      const navRect = nav.getBoundingClientRect();
      const elRect  = el.getBoundingClientRect();
      indicator.style.left  = (elRect.left - navRect.left) + 'px';
      indicator.style.width = elRect.width + 'px';
    }

    if (active) setIndicator(active);

    nav.querySelectorAll('.cat-link').forEach(link => {
      link.addEventListener('mouseenter', () => setIndicator(link));
      link.addEventListener('mouseleave', () => { if (active) setIndicator(active); });
    });

    // resize guard
    window.addEventListener('resize', () => {
      if (active) setIndicator(active);
    }, { passive: true });
  })();


  /* ══════════════════════════════
     GALLERY GRID
  ══════════════════════════════ */
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;   // about page — stop here

  const filter     = grid.dataset.filter || 'all';
  const works      = (typeof WORKS !== 'undefined')
    ? (filter === 'all' ? WORKS : WORKS.filter(w => w.cat === filter))
    : [];
  let visibleWorks = works;

  /* build tile DOM */
  function buildTiles(list) {
    grid.innerHTML = '';
    list.forEach((work, idx) => {
      const tile = document.createElement('article');
      tile.className = 'tile';
      tile.dataset.cat   = work.cat;
      tile.dataset.index = idx;
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('aria-label', 'View ' + work.title);

      if (work.img) {
        const img     = document.createElement('img');
        img.className = 'tile-img';
        img.src       = work.thumb || work.img;
        img.alt       = work.title;
        img.loading   = idx < 8 ? 'eager' : 'lazy';
        img.decoding  = 'async';
        tile.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'tile-placeholder';
        ph.style.background = placeholderBg(work.cat);
        ph.textContent = work.title.toUpperCase();
        tile.appendChild(ph);
      }

      const ov = document.createElement('div');
      ov.className = 'tile-overlay';
      ov.innerHTML =
        '<p class="tile-cat">' + work.cat.toUpperCase() + '</p>' +
        '<h2 class="tile-title">' + work.title + '</h2>' +
        (work.year ? '<p class="tile-year">' + work.year + '</p>' : '');
      tile.appendChild(ov);

      tile.addEventListener('click', () => openLightbox(idx));
      tile.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
      });

      grid.appendChild(tile);
    });

    initScrollReveal();
  }

  function placeholderBg(cat) {
    return cat === '2d'     ? 'rgba(200,169,110,0.07)'
         : cat === '3d'     ? 'rgba(143,184,200,0.07)'
         : cat === 'design' ? 'rgba(200,158,180,0.07)'
         : 'rgba(0,0,0,0.03)';
  }

  buildTiles(visibleWorks);


  /* ── SCROLL REVEAL ── */
  function initScrollReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const col = parseInt(entry.target.dataset.index, 10) % 3;
        entry.target.style.transitionDelay = (col * 50) + 'ms';
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });

    grid.querySelectorAll('.tile').forEach(t => io.observe(t));
  }


  /* ══════════════════════════════
     LIGHTBOX
  ══════════════════════════════ */
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
  
  // Zoom & Pan state
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function applyTransform() {
    lbImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    if (scale > 1) {
      lbImg.style.cursor = isDragging ? 'grabbing' : 'grab';
    } else {
      lbImg.style.cursor = 'zoom-in';
    }
  }

  function resetZoom() {
    scale = 1;
    panX = 0;
    panY = 0;
    lbImg.style.transition = 'opacity 0.22s, transform 0.2s';
    applyTransform();
  }

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
    resetZoom();
    const w = visibleWorks[idx];
    if (!w) return;
    lbCat.textContent   = w.cat.toUpperCase() + (w.year ? '  ·  ' + w.year : '');
    lbTitle.textContent = w.title;
    lbDesc.textContent  = w.desc || '';

    if (w.img) {
      lbImg.classList.add('loading');
      lbImg.onload  = () => lbImg.classList.remove('loading');
      lbImg.onerror = () => lbImg.classList.remove('loading');
      lbImg.src = w.img;
      lbImg.alt = w.title;
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

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  /* zoom and pan on desktop */
  const imgWrap = lbImg.parentElement;
  
  imgWrap.addEventListener('wheel', e => {
    if (!lb.classList.contains('open')) return;
    e.preventDefault();
    const zoomSpeed = 0.1;
    const delta = e.deltaY > 0 ? -1 : 1;
    
    scale = Math.max(1, Math.min(scale + delta * zoomSpeed, 5));
    if (scale === 1) {
      panX = 0;
      panY = 0;
    }
    lbImg.style.transition = 'opacity 0.22s';
    applyTransform();
  }, { passive: false });

  imgWrap.addEventListener('mousedown', e => {
    if (scale <= 1) return;
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    lbImg.style.transition = 'opacity 0.22s';
    applyTransform();
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      applyTransform();
    }
  });

  imgWrap.addEventListener('dblclick', e => {
    lbImg.style.transition = 'opacity 0.22s, transform 0.3s var(--ease)';
    if (scale > 1) {
      resetZoom();
    } else {
      scale = 2.5;
      applyTransform();
    }
  });

  /* swipe & touch pan */
  let tX = null;
  let tY = null;
  let initialPinchDist = null;
  let initialScale = 1;

  lb.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      initialPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialScale = scale;
    } else if (e.touches.length === 1) {
      tX = e.touches[0].clientX;
      tY = e.touches[0].clientY;
      if (scale > 1) {
        isDragging = true;
        startX = tX - panX;
        startY = tY - panY;
        lbImg.style.transition = 'opacity 0.22s';
      }
    }
  }, { passive: false });

  lb.addEventListener('touchmove', e => {
    if (!lb.classList.contains('open')) return;
    
    if (e.touches.length === 2 && initialPinchDist) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      scale = Math.max(1, Math.min(initialScale * (dist / initialPinchDist), 5));
      if (scale === 1) { panX = 0; panY = 0; }
      lbImg.style.transition = 'opacity 0.22s';
      applyTransform();
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      panX = e.touches[0].clientX - startX;
      panY = e.touches[0].clientY - startY;
      applyTransform();
    }
  }, { passive: false });

  lb.addEventListener('touchend', e => {
    initialPinchDist = null;
    if (isDragging) {
      isDragging = false;
      applyTransform();
      tX = null; // Prevent swipe trigger
      return;
    }
    if (tX === null || scale > 1) return;
    
    if (e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - tX;
      if (Math.abs(deltaX) > 50) {
        navigate(deltaX < 0 ? 1 : -1);
      }
    }
    tX = null;
  }, { passive: true });

  /* ══════════════════════════════
     SMOOTH SCROLLING (LENIS)
  ══════════════════════════════ */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

})();

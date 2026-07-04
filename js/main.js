/**
 * main.js — Portfolio core (v4)
 *
 * - Page fade transitions
 * - Liquid glass pill nav indicator
 * - Masonry tile grid (natural image proportions)
 * - Lightbox: keyboard, swipe, fade, modern slide transition
 * - Scroll-reveal stagger
 */

(function () {
  'use strict';
  
  let openLightbox = () => {};
  
  /* ── YEAR ── */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ══════════════════════════════
     LOADING SCREEN & PROGRESS
     ══════════════════════════════ */
  const loader = document.getElementById('loader');
  const hasLoadedBefore = sessionStorage.getItem('portfolio-loaded');

  function initLoader() {
    if (!loader) return;

    if (hasLoadedBefore) {
      loader.style.display = 'none';
      return;
    }

    document.body.classList.add('loading-active');

    const progress = { value: 0 };
    const percentageEl = document.getElementById('loaderPercentage');

    const updatePercentage = () => {
      const val = Math.floor(progress.value);
      if (percentageEl) {
        percentageEl.textContent = val.toString().padStart(2, '0') + '%';
      }
    };

    const finishLoading = () => {
      gsap.to(progress, {
        value: 100,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: updatePercentage,
        onComplete: () => {
          // Slide loader downward
          gsap.to(loader, {
            yPercent: 100,
            duration: 1.1,
            ease: 'power3.inOut',
            onComplete: () => {
              loader.style.display = 'none';
              sessionStorage.setItem('portfolio-loaded', 'true');
            }
          });

          // Trigger tile animations exactly 200ms into the transition
          setTimeout(() => {
            document.body.classList.remove('loading-active');
          }, 200);
        }
      });
    };

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      const tween = gsap.to(progress, {
        value: 85,
        duration: 1.8,
        ease: 'power1.out',
        onUpdate: updatePercentage
      });

      window.addEventListener('load', () => {
        tween.kill();
        finishLoading();
      });
    }
  }

  initLoader();


  /* ══════════════════════════════
     PAGE FADE TRANSITIONS
     ══════════════════════════════ */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('http') || link.target === '_blank') return;

    link.addEventListener('click', e => {
      const current = window.location.pathname.split('/').pop() || 'index.html';
      const targetBase = href.split('#')[0].split('/').pop() || 'index.html';
      
      // If same page navigation, let hashchange handle it (do not full reload)
      if (targetBase === current || (targetBase === 'index.html' && current === '')) {
        if (href.includes('#')) return;
      }
      
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
  let currentActiveLink = null;
  const nav       = document.querySelector('.cat-nav');
  const indicator = document.getElementById('navIndicator');

  function movePill(target, animate = true) {
    if (!indicator || !target) return;
    const x = target.offsetLeft;
    const width = target.offsetWidth;

    if (!animate) {
      gsap.set(indicator, { x, width });
      return;
    }

    gsap.timeline()
      .to(indicator, {
        scaleY: 0.55,
        scaleX: 1.08,
        rotation: -2,
        duration: 0.18,
        ease: 'power2.in',
        transformOrigin: '50% 50%'
      })
      .to(indicator, {
        x,
        width,
        duration: 0.6,
        ease: 'elastic.out(1, 0.65)'
      }, '-=0.04')
      .to(indicator, {
        scaleY: 1,
        scaleX: 1,
        rotation: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.45)'
      }, '-=0.55');
  }

  function initNavIndicator() {
    if (!nav || !indicator) return;

    // Apply magnetic hover pull to all links in the header:
    // Categories and About link
    const magneticItems = document.querySelectorAll('.cat-link, .about-link');
    magneticItems.forEach(item => {
      // gentle magnetic pull toward the cursor
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        gsap.to(item, { x: relX * 0.25, y: relY * 0.35, duration: 0.35, ease: 'power2.out' });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });

    let resizeScheduled = false;
    window.addEventListener('resize', () => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(() => {
        if (currentActiveLink) movePill(currentActiveLink, false);
        resizeScheduled = false;
      });
    }, { passive: true });
  }

  initNavIndicator();

  /* ── MAGNETIC HOVER FOR ABOUT TEXT ── */
  function initAboutTextMagnetic() {
    const aboutText = document.querySelector('.about-simple-text');
    if (!aboutText) return;

    // Dynamically wrap each word in a span to apply the magnetic effect individually
    const rawText = aboutText.textContent.trim();
    const words = rawText.split(/\s+/);
    aboutText.innerHTML = words.map(word => `<span class="about-word">${word}</span>`).join(' ');

    // Register event listeners for each word
    const wordSpans = aboutText.querySelectorAll('.about-word');
    wordSpans.forEach(span => {
      span.addEventListener('mousemove', (e) => {
        const rect = span.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        gsap.to(span, { x: relX * 0.35, y: relY * 0.45, duration: 0.3, ease: 'power2.out' });
      });

      span.addEventListener('mouseleave', () => {
        gsap.to(span, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  initAboutTextMagnetic();


  /* ══════════════════════════════
     GALLERY GRID & CLIENT-SIDE ROUTING
     ══════════════════════════════ */
  const grid = document.getElementById('galleryGrid');
  let visibleWorks = [];

  async function renderPdfThumbnail(pdfUrl, imgEl) {
    try {
      if (typeof pdfjsLib === 'undefined') return;
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      }
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      const canvas = document.createElement('canvas');
      const viewport = page.getViewport({ scale: 1.0 });
      const scale = 500 / viewport.width;
      const scaledViewport = page.getViewport({ scale: scale });
      
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      
      const ctx = canvas.getContext('2d');
      await page.render({
        canvasContext: ctx,
        viewport: scaledViewport
      }).promise;
      
      imgEl.src = canvas.toDataURL();
    } catch (err) {
      console.error("Error rendering PDF thumbnail:", err);
    }
  }

  function buildAllTiles() {
    if (!grid) return;
    grid.innerHTML = '';
    const worksList = (typeof WORKS !== 'undefined') ? WORKS : [];
    worksList.forEach((work, idx) => {
      const tile = document.createElement('article');
      tile.className = 'tile';
      tile.dataset.cat   = work.cat;
      tile.dataset.globalIndex = idx;
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('aria-label', 'View ' + work.title);
      
      // Speed up rendering by skipping off-screen layout/paint
      tile.style.contentVisibility = 'auto';
      tile.style.containIntrinsicSize = 'auto 300px';

      if (work.img) {
        const img     = document.createElement('img');
        img.className = 'tile-img';
        img.src       = work.thumb || work.img;
        img.alt       = work.title;
        // Prioritize above-the-fold image loads (first 4) for faster LCP
        if (idx < 4) {
          img.loading   = 'eager';
          img.fetchPriority = 'high';
        } else {
          img.loading   = 'lazy';
          img.fetchPriority = 'low';
        }
        img.decoding  = 'async';
        tile.appendChild(img);

        if (work.pdf) {
          renderPdfThumbnail(work.pdf, img);
        }
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

      tile.addEventListener('click', () => openLightbox(tile));
      tile.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(tile); }
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

  /* ── SCROLL REVEAL ── */
  let ioInstance = null;
  function initScrollReveal() {
    if (!grid) return;
    if (ioInstance) {
      ioInstance.disconnect();
    }
    ioInstance = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        let cols = 4;
        const w = window.innerWidth;
        if (w <= 600) cols = 1;
        else if (w <= 1024) cols = 2;

        const globalIdx = parseInt(entry.target.dataset.globalIndex, 10);
        const visibleTiles = Array.from(grid.querySelectorAll('.tile:not(.hidden-tile)'));
        const visibleIdx = visibleTiles.indexOf(entry.target);
        
        const col = (visibleIdx !== -1 ? visibleIdx : globalIdx) % cols;
        entry.target.style.transitionDelay = (col * 50) + 'ms';
        entry.target.classList.add('visible');
        ioInstance.unobserve(entry.target);
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });

    grid.querySelectorAll('.tile:not(.hidden-tile)').forEach(t => ioInstance.observe(t));
  }

  /* ── ROUTING / FILTERING ── */
  let activeFilterTimeout = null;

  function filterCategory(cat, animate = true) {
    const worksList = (typeof WORKS !== 'undefined')
      ? (cat === 'all' ? WORKS : WORKS.filter(w => w.cat === cat))
      : [];
    visibleWorks = worksList;

    if (nav) {
      nav.querySelectorAll('.cat-link').forEach(l => l.classList.remove('active'));
      const activeLink = nav.querySelector(`.cat-link[data-cat="${cat}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        currentActiveLink = activeLink;
        requestAnimationFrame(() => movePill(activeLink, animate));
      }
    }

    if (!grid) return;

    if (activeFilterTimeout) {
      clearTimeout(activeFilterTimeout);
      activeFilterTimeout = null;
    }

    const tiles = grid.querySelectorAll('.tile');

    if (animate && tiles.length > 0) {
      // Phase 1: Fade out active tiles with stagger
      tiles.forEach((t, i) => {
        if (!t.classList.contains('hidden-tile')) {
          let cols = 4;
          const w = window.innerWidth;
          if (w <= 600) cols = 1;
          else if (w <= 1024) cols = 2;

          const visibleTiles = Array.from(grid.querySelectorAll('.tile:not(.hidden-tile)'));
          const visibleIdx = visibleTiles.indexOf(t);

          const col = (visibleIdx !== -1 ? visibleIdx : i) % cols;
          t.style.transitionDelay = `${col * 40}ms`;
          t.style.transitionDuration = '0.25s';
          t.classList.add('is-exiting');
        }
      });

      activeFilterTimeout = setTimeout(() => {
        // Phase 2: Toggle hidden states and reset style classes
        tiles.forEach(t => {
          const matches = (cat === 'all' || t.dataset.cat === cat);
          if (matches) {
            t.classList.remove('hidden-tile');
          } else {
            t.classList.add('hidden-tile');
          }
          t.classList.remove('visible', 'is-exiting');
          t.style.transitionDelay = '';
          t.style.transitionDuration = '';
        });
        
        // Reinitialize scroll reveal for newly shown tiles
        initScrollReveal();
        activeFilterTimeout = null;
      }, 250);
    } else {
      // Instant change
      tiles.forEach(t => {
        const matches = (cat === 'all' || t.dataset.cat === cat);
        if (matches) {
          t.classList.remove('hidden-tile');
        } else {
          t.classList.add('hidden-tile');
        }
        t.classList.remove('visible', 'is-exiting');
        t.style.transitionDelay = '';
        t.style.transitionDuration = '';
      });
      initScrollReveal();
    }
  }

  function handleRoute() {
    const hash = window.location.hash.substring(1) || 'all';
    if (['all', '2d', '3d', 'design'].includes(hash)) {
      filterCategory(hash, true);
    }
  }

  if (grid) {
    buildAllTiles();
    const initialHash = window.location.hash.substring(1) || 'all';
    filterCategory(initialHash, false);
    
    window.addEventListener('hashchange', handleRoute);
  }


  /* ══════════════════════════════
     LIGHTBOX
  ══════════════════════════════ */
  const lb      = document.getElementById('lightbox');
  if (lb) {
    const lbImg   = document.getElementById('lbImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbDesc  = document.getElementById('lbDesc');
    const lbClose = document.getElementById('lbClose');
    const lbPrev  = document.getElementById('lbPrev');
    const lbNext  = document.getElementById('lbNext');
    
    // New left column elements
    const lbYearTop = document.getElementById('lbYearTop');
    const lbCatLeft = document.getElementById('lbCatLeft');

    const imgWrap = lbImg.parentElement;
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
        lb.classList.add('lb-zoomed');
      } else {
        lbImg.style.cursor = 'zoom-in';
        lb.classList.remove('lb-zoomed');
      }
    }

    function resetZoom() {
      scale = 1;
      panX = 0;
      panY = 0;
      lbImg.style.transition = 'opacity 0.22s, transform 0.2s';
      applyTransform();
    }

    let activeHiddenImg = null;

    function hideTileImg(img) {
      if (activeHiddenImg && activeHiddenImg !== img) {
        activeHiddenImg.classList.remove('is-lifted');
      }
      activeHiddenImg = img;
      if (activeHiddenImg) {
        activeHiddenImg.classList.add('is-lifted');
      }
    }

    function restoreTileImg() {
      if (activeHiddenImg) {
        activeHiddenImg.classList.remove('is-lifted');
        activeHiddenImg = null;
      }
    }

    openLightbox = function(tile) {
      const visibleTiles = Array.from(grid ? grid.querySelectorAll('.tile:not(.hidden-tile)') : []);
      const visibleIdx = visibleTiles.indexOf(tile);
      if (visibleIdx === -1) return;

      currentIdx = visibleIdx;
      
      const currentCat = window.location.hash.substring(1) || 'all';
      visibleWorks = (typeof WORKS !== 'undefined')
        ? (currentCat === 'all' ? WORKS : WORKS.filter(w => w.cat === currentCat))
        : [];

      const clickedWork = visibleWorks[currentIdx];
      if (clickedWork && (clickedWork.pdf || clickedWork.pages)) {
        openBookLightbox(clickedWork);
        return;
      }

      document.body.classList.add('lightbox-active');
      
      const clickedImg = tile.querySelector('.tile-img');
      
      if (clickedImg) {
        const firstRect = clickedImg.getBoundingClientRect();
        const aspect = clickedImg.naturalWidth / clickedImg.naturalHeight || (clickedImg.width / clickedImg.height);
        const naturalW = clickedImg.naturalWidth || clickedImg.width;
        const naturalH = clickedImg.naturalHeight || clickedImg.height;
        
        // Render slide structure (resets zoom, sets lbImg.src, triggers load)
        renderSlide(currentIdx);
        
        // Hide the real image initially so it doesn't show during zoom
        lbImg.style.opacity = '0';
        lbImg.style.transition = 'none';
        
        const wrap = document.querySelector('.lb-img-wrap');
        const wrapRect = wrap.getBoundingClientRect();
        
        const wrapAspect = wrapRect.width / wrapRect.height;
        let targetW, targetH, targetT, targetL;
        
        if (aspect > wrapAspect) {
          targetW = wrapRect.width;
          targetH = wrapRect.width / aspect;
        } else {
          targetH = wrapRect.height;
          targetW = wrapRect.height * aspect;
        }
        
        // If the natural dimensions are smaller than the container's contained box,
        // the browser will render it at its natural size to prevent upscaling.
        if (targetW > naturalW && targetH > naturalH) {
          targetW = naturalW;
          targetH = naturalH;
        }
        
        targetT = wrapRect.top + (wrapRect.height - targetH) / 2;
        targetL = wrapRect.left + (wrapRect.width - targetW) / 2;
        
        const flipImg = document.createElement('img');
        flipImg.src = clickedImg.src;
        flipImg.className = 'lb-flip-temp';
        flipImg.style.position = 'fixed';
        flipImg.style.top = firstRect.top + 'px';
        flipImg.style.left = firstRect.left + 'px';
        flipImg.style.width = firstRect.width + 'px';
        flipImg.style.height = firstRect.height + 'px';
        flipImg.style.borderRadius = '4px';
        flipImg.style.objectFit = 'cover';
        document.body.appendChild(flipImg);
        
        hideTileImg(clickedImg);
        
        lb.classList.add('open', 'is-zooming-open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Force reflow
        void flipImg.offsetWidth;
        
        flipImg.style.top = targetT + 'px';
        flipImg.style.left = targetL + 'px';
        flipImg.style.width = targetW + 'px';
        flipImg.style.height = targetH + 'px';
        flipImg.style.borderRadius = '2px';
        
        let zoomFinished = false;
        let imageLoaded = false;
        
        function showRealImage() {
          gsap.to(lbImg, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              if (flipImg) flipImg.remove();
              // Reset inline style so CSS classes (.loading) can control opacity during sliding transitions
              lbImg.style.opacity = '';
            }
          });
        }
        
        lbImg.onload = () => {
          imageLoaded = true;
          lbImg.classList.remove('loading');
          
          // Re-trigger standard slide render side-effects (direction resets etc)
          void lbImg.offsetWidth;
          lbImg.classList.remove('slide-in-left', 'slide-in-right');
          isTransitioning = false;
          
          if (zoomFinished) {
            showRealImage();
          }
        };
        
        lbImg.onerror = () => {
          imageLoaded = true;
          lbImg.classList.remove('loading');
          lbImg.style.opacity = '1';
          if (flipImg) flipImg.remove();
          isTransitioning = false;
        };
        
        setTimeout(() => {
          zoomFinished = true;
          lb.classList.remove('is-zooming-open');
          
          if (imageLoaded || lbImg.complete) {
            showRealImage();
          }
          lbClose.focus();
        }, 450);
        
      } else {
        renderSlide(currentIdx);
        lbImg.style.opacity = '1';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
      }
    };

    function closeLightbox() {
      document.body.classList.remove('lightbox-active');
      const visibleTiles = Array.from(grid ? grid.querySelectorAll('.tile:not(.hidden-tile)') : []);
      const tileImg = visibleTiles[currentIdx] ? visibleTiles[currentIdx].querySelector('.tile-img') : null;
      
      if (tileImg && lbImg && lbImg.getAttribute('src')) {
        if (scale > 1) {
          resetZoom();
          void lbImg.offsetWidth;
        }
        const targetRect = tileImg.getBoundingClientRect();
        const firstRect = lbImg.getBoundingClientRect();
        
        const flipImg = document.createElement('img');
        flipImg.src = lbImg.src;
        flipImg.className = 'lb-flip-temp';
        flipImg.style.position = 'fixed';
        flipImg.style.top = firstRect.top + 'px';
        flipImg.style.left = firstRect.left + 'px';
        flipImg.style.width = firstRect.width + 'px';
        flipImg.style.height = firstRect.height + 'px';
        flipImg.style.borderRadius = '2px';
        flipImg.style.objectFit = 'cover';
        document.body.appendChild(flipImg);
        
        lb.classList.add('is-zooming-close');
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Force reflow
        void flipImg.offsetWidth;
        
        flipImg.style.top = targetRect.top + 'px';
        flipImg.style.left = targetRect.left + 'px';
        flipImg.style.width = targetRect.width + 'px';
        flipImg.style.height = targetRect.height + 'px';
        flipImg.style.borderRadius = '4px';
        flipImg.style.objectFit = 'cover';
        
        setTimeout(() => {
          lb.classList.remove('is-zooming-close');
          restoreTileImg();
          flipImg.remove();
        }, 450);
        
      } else {
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        restoreTileImg();
      }
    }

    let isTransitioning = false;

    function renderSlide(idx, direction = 0) {
      const w = visibleWorks[idx];
      if (!w) {
        isTransitioning = false;
        return;
      }

      // Hide corresponding gallery tile image
      const visibleTiles = Array.from(grid ? grid.querySelectorAll('.tile:not(.hidden-tile)') : []);
      if (visibleTiles[idx]) {
        const tileImg = visibleTiles[idx].querySelector('.tile-img');
        hideTileImg(tileImg);
      } else {
        restoreTileImg();
      }

      const loadNewContent = () => {
        resetZoom();
        
        // Update new UI elements for category and year
        if (lbYearTop) lbYearTop.textContent = w.year || '';
        if (lbCatLeft) lbCatLeft.textContent = w.cat ? w.cat.toUpperCase() : '';
        
        lbTitle.textContent = w.title;
        lbDesc.textContent  = w.desc || '';

        if (w.img) {
          lbImg.classList.add('loading');
          
          // Setup initial position for entry transition
          if (direction === 1) {
            lbImg.classList.add('slide-in-right');
          } else if (direction === -1) {
            lbImg.classList.add('slide-in-left');
          }

          lbImg.onload = () => {
            lbImg.classList.remove('loading');
            // Force layout reflow
            void lbImg.offsetWidth;
            lbImg.classList.remove('slide-in-left', 'slide-in-right');
            isTransitioning = false;
          };

          lbImg.onerror = () => {
            lbImg.classList.remove('loading');
            lbImg.classList.remove('slide-in-left', 'slide-in-right');
            isTransitioning = false;
          };

          lbImg.src = w.img;
          lbImg.alt = w.title;
        } else {
          lbImg.src = '';
          lbImg.alt = '';
          isTransitioning = false;
        }
      };

      if (direction !== 0) {
        // Slide out active slide first
        if (direction === 1) {
          lbImg.classList.add('slide-out-left');
        } else if (direction === -1) {
          lbImg.classList.add('slide-out-right');
        }

        setTimeout(() => {
          lbImg.classList.remove('slide-out-left', 'slide-out-right');
          loadNewContent();
        }, 200);
      } else {
        loadNewContent();
      }
    }

    function navigate(dir) {
      if (isTransitioning) return;
      isTransitioning = true;
      const total = visibleWorks.length;
      currentIdx  = (currentIdx + dir + total) % total;
      renderSlide(currentIdx, dir);
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

    // ─── BOOK LIGHTBOX IMPLEMENTATION ───
    const bl = document.getElementById('bookLightbox');
    const blBook = document.getElementById('blBook');
    const blClose = document.getElementById('blClose');
    const blPrevBtn = document.getElementById('blPrevBtn');
    const blNextBtn = document.getElementById('blNextBtn');
    const blPageLabel = document.getElementById('blPageLabel');
    const blSlider = document.getElementById('blProgressSlider');
    const blLoader = document.getElementById('blLoader');
    const blTapLeft = document.getElementById('blTapLeft');
    const blTapRight = document.getElementById('blTapRight');

    let activeBook = null;
    let totalPages = 0;
    let totalSheets = 0;
    let activeSheetIndex = 0;
    let isDoublePageMode = window.innerWidth > 768;
    let sheets = [];
    const renderedPages = new Set();

    function buildBookDOM() {
      blBook.innerHTML = '';
      sheets = [];
      renderedPages.clear();

      for (let i = 0; i < totalSheets; i++) {
        const sheetEl = document.createElement('div');
        sheetEl.className = 'bl-sheet right-side';
        sheetEl.dataset.sheetIndex = i;
        
        // Front face
        const frontFace = document.createElement('div');
        frontFace.className = 'bl-page bl-page--front';
        const frontContent = document.createElement('div');
        frontContent.className = 'bl-page-content';
        frontFace.appendChild(frontContent);
        const frontTexture = document.createElement('div');
        frontTexture.className = 'bl-page-texture';
        frontFace.appendChild(frontTexture);
        
        // Back face
        const backFace = document.createElement('div');
        backFace.className = 'bl-page bl-page--back';
        const backContent = document.createElement('div');
        backContent.className = 'bl-page-content';
        backFace.appendChild(backContent);
        const backTexture = document.createElement('div');
        backTexture.className = 'bl-page-texture';
        backFace.appendChild(backTexture);

        sheetEl.appendChild(frontFace);
        sheetEl.appendChild(backFace);
        blBook.appendChild(sheetEl);
        sheets.push(sheetEl);
      }
    }

    function updateSheetStates() {
      for (let j = 0; j < totalSheets; j++) {
        const sheet = sheets[j];
        if (j < activeSheetIndex) {
          sheet.classList.add('flipped');
          sheet.style.zIndex = j;
        } else {
          sheet.classList.remove('flipped');
          sheet.style.zIndex = totalSheets - j;
        }
      }
      
      // Keep active sheets on top during turns
      if (activeSheetIndex > 0 && sheets[activeSheetIndex - 1]) {
        sheets[activeSheetIndex - 1].style.zIndex = totalSheets + 5;
      }
      if (activeSheetIndex < totalSheets && sheets[activeSheetIndex]) {
        sheets[activeSheetIndex].style.zIndex = totalSheets + 4;
      }
    }

    function updateControls() {
      if (isDoublePageMode) {
        blSlider.max = totalSheets;
        blSlider.value = activeSheetIndex;
        
        if (activeSheetIndex === 0) {
          blPageLabel.textContent = `Page 1 of ${totalPages} (Cover)`;
        } else if (activeSheetIndex === totalSheets) {
          blPageLabel.textContent = `Page ${totalPages} of ${totalPages} (Back)`;
        } else {
          const leftPage = activeSheetIndex * 2;
          const rightPage = activeSheetIndex * 2 + 1;
          if (rightPage <= totalPages) {
            blPageLabel.textContent = `Pages ${leftPage}-${rightPage} of ${totalPages}`;
          } else {
            blPageLabel.textContent = `Page ${leftPage} of ${totalPages}`;
          }
        }
      } else {
        blSlider.max = totalPages - 1;
        blSlider.value = activeSheetIndex;
        blPageLabel.textContent = `Page ${activeSheetIndex + 1} of ${totalPages}`;
      }
    }

    function navigateBook(direction) {
      const maxIndex = isDoublePageMode ? totalSheets : totalPages - 1;
      const newIndex = activeSheetIndex + direction;
      
      if (newIndex >= 0 && newIndex <= maxIndex) {
        activeSheetIndex = newIndex;
        updateSheetStates();
        lazyRenderPages();
        updateControls();
      }
    }

    function lazyRenderPages() {
      const pagesToRender = [];
      
      if (isDoublePageMode) {
        // Current visible page index references (1-based)
        const leftPage = activeSheetIndex * 2;
        const rightPage = activeSheetIndex * 2 + 1;
        
        if (leftPage >= 1 && leftPage <= totalPages) pagesToRender.push(leftPage);
        if (rightPage >= 1 && rightPage <= totalPages) pagesToRender.push(rightPage);
        
        // Next preload pages
        const nextLeft = (activeSheetIndex + 1) * 2;
        const nextRight = (activeSheetIndex + 1) * 2 + 1;
        if (nextLeft >= 1 && nextLeft <= totalPages) pagesToRender.push(nextLeft);
        if (nextRight >= 1 && nextRight <= totalPages) pagesToRender.push(nextRight);
        
        // Prev preload pages
        const prevLeft = (activeSheetIndex - 1) * 2;
        const prevRight = (activeSheetIndex - 1) * 2 + 1;
        if (prevLeft >= 1 && prevLeft <= totalPages) pagesToRender.push(prevLeft);
        if (prevRight >= 1 && prevRight <= totalPages) pagesToRender.push(prevRight);
      } else {
        // Current visible
        const currentPage = activeSheetIndex + 1;
        if (currentPage >= 1 && currentPage <= totalPages) pagesToRender.push(currentPage);
        
        // Next preload
        const nextPage = activeSheetIndex + 2;
        if (nextPage >= 1 && nextPage <= totalPages) pagesToRender.push(nextPage);
        
        // Prev preload
        const prevPage = activeSheetIndex;
        if (prevPage >= 1 && prevPage <= totalPages) pagesToRender.push(prevPage);
      }

      pagesToRender.forEach(pageNum => {
        if (renderedPages.has(pageNum)) return;
        renderedPages.add(pageNum);
        renderPage(pageNum);
      });
    }

    async function renderPage(pageNum) {
      let sheetIdx, faceSide;
      
      if (isDoublePageMode) {
        sheetIdx = Math.floor((pageNum - 1) / 2);
        faceSide = (pageNum % 2 === 1) ? 'front' : 'back';
      } else {
        sheetIdx = pageNum - 1;
        faceSide = 'front';
      }
      
      const sheetEl = sheets[sheetIdx];
      if (!sheetEl) return;
      
      const faceEl = sheetEl.querySelector(`.bl-page--${faceSide}`);
      if (!faceEl) return;
      
      const contentEl = faceEl.querySelector('.bl-page-content');
      contentEl.innerHTML = ''; 

      if (activeBook.type === 'pdf') {
        const canvas = document.createElement('canvas');
        contentEl.appendChild(canvas);
        
        try {
          const page = await activeBook.pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          const ctx = canvas.getContext('2d');
          await page.render({
            canvasContext: ctx,
            viewport: viewport
          }).promise;
        } catch (err) {
          console.error("Error rendering PDF page:", err);
          drawMockPage(pageNum, contentEl);
        }
      } else if (activeBook.type === 'images') {
        const img = document.createElement('img');
        img.src = activeBook.pagesList[pageNum - 1];
        img.alt = `Book page ${pageNum}`;
        contentEl.appendChild(img);
      } else {
        drawMockPage(pageNum, contentEl);
      }
    }

    function drawMockPage(pageNum, container) {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      
      ctx.fillStyle = isLight ? '#fafafa' : '#222';
      ctx.fillRect(0, 0, 600, 800);
      
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 30, 540, 740);
      
      ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`PAGE ${pageNum}`, 300, 750);
      ctx.fillText("LAM NGUYEN ART PORTFOLIO", 300, 55);
      
      ctx.fillStyle = isLight ? '#333' : '#eee';
      ctx.font = '300 24px "IBM Plex Serif", serif';
      ctx.fillText(`Section ${pageNum}`, 300, 200);
      
      ctx.fillStyle = isLight ? '#666' : '#aaa';
      ctx.font = '14px "IBM Plex Serif", serif';
      ctx.fillText("Interactive Book Showcase", 300, 240);
      
      ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(100, 320);
      ctx.lineTo(500, 320);
      ctx.moveTo(100, 360);
      ctx.lineTo(500, 360);
      ctx.moveTo(100, 400);
      ctx.lineTo(500, 400);
      ctx.moveTo(150, 440);
      ctx.lineTo(450, 440);
      ctx.stroke();

      ctx.fillStyle = '#c8a96e';
      ctx.beginPath();
      ctx.arc(300, 550, 30, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = isLight ? '#fff' : '#000';
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillText("LN", 300, 556);

      container.appendChild(canvas);
    }

    async function openBookLightbox(workItem) {
      document.body.classList.add('lightbox-active');
      bl.classList.add('open');
      bl.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      blLoader.classList.add('active');
      
      activeBook = null;
      totalPages = 0;
      activeSheetIndex = 0;
      
      if (workItem.pdf) {
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
          const loadingTask = pdfjsLib.getDocument(workItem.pdf);
          const pdfDoc = await loadingTask.promise;
          activeBook = { type: 'pdf', pdfDoc, path: workItem.pdf };
          totalPages = pdfDoc.numPages;
        } catch (err) {
          console.error("Error loading PDF:", err);
          activeBook = { type: 'mock', path: workItem.pdf };
          totalPages = 6;
        }
      } else if (workItem.pages) {
        activeBook = { type: 'images', pagesList: workItem.pages };
        totalPages = workItem.pages.length;
      }
      
      blLoader.classList.remove('active');
      
      isDoublePageMode = window.innerWidth > 768;
      totalSheets = isDoublePageMode ? Math.ceil(totalPages / 2) : totalPages;
      
      buildBookDOM();
      updateSheetStates();
      lazyRenderPages();
      updateControls();
      
      blClose.focus();
    }

    function closeBookLightbox() {
      bl.classList.remove('open');
      bl.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-active');
      document.body.style.overflow = '';
      
      setTimeout(() => {
        blBook.innerHTML = '';
        sheets = [];
        renderedPages.clear();
        activeBook = null;
      }, 500);
    }

    // Bind controls
    blClose.addEventListener('click', closeBookLightbox);
    blPrevBtn.addEventListener('click', () => navigateBook(-1));
    blNextBtn.addEventListener('click', () => navigateBook(1));
    
    blTapLeft.addEventListener('click', e => {
      e.stopPropagation();
      navigateBook(-1);
    });
    blTapRight.addEventListener('click', e => {
      e.stopPropagation();
      navigateBook(1);
    });

    blSlider.addEventListener('input', e => {
      const val = parseInt(e.target.value, 10);
      if (val !== activeSheetIndex) {
        activeSheetIndex = val;
        updateSheetStates();
        lazyRenderPages();
        updateControls();
      }
    });

    bl.addEventListener('click', e => {
      if (e.target === bl || e.target === bl.querySelector('.bl-container')) {
        closeBookLightbox();
      }
    });

    // Mobile touch gestures
    let startTouchX = null;
    let startTouchY = null;
    bl.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        startTouchX = e.touches[0].clientX;
        startTouchY = e.touches[0].clientY;
      }
    }, { passive: true });

    bl.addEventListener('touchend', e => {
      if (startTouchX === null) return;
      if (e.changedTouches.length > 0) {
        const deltaX = e.changedTouches[0].clientX - startTouchX;
        const deltaY = e.changedTouches[0].clientY - startTouchY;
        if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
          if (deltaX < 0) navigateBook(1);
          else navigateBook(-1);
        }
      }
      startTouchX = null;
    }, { passive: true });

    // Keyboard support
    document.addEventListener('keydown', e => {
      if (!bl.classList.contains('open')) return;
      if (e.key === 'Escape') closeBookLightbox();
      if (e.key === 'ArrowLeft') navigateBook(-1);
      if (e.key === 'ArrowRight') navigateBook(1);
    });

    // Resize handling
    let bookResizeTimeout = null;
    window.addEventListener('resize', () => {
      if (!bl.classList.contains('open')) return;
      if (bookResizeTimeout) clearTimeout(bookResizeTimeout);
      bookResizeTimeout = setTimeout(() => {
        const mode = window.innerWidth > 768;
        if (mode !== isDoublePageMode) {
          const currentPageNum = isDoublePageMode ? (activeSheetIndex * 2 || 1) : (activeSheetIndex + 1);
          isDoublePageMode = mode;
          totalSheets = isDoublePageMode ? Math.ceil(totalPages / 2) : totalPages;
          
          if (isDoublePageMode) {
            activeSheetIndex = Math.floor((currentPageNum - 1) / 2);
          } else {
            activeSheetIndex = currentPageNum - 1;
          }
          
          buildBookDOM();
          updateSheetStates();
          lazyRenderPages();
          updateControls();
        }
      }, 150);
    });
  }

  /* ══════════════════════════════
     THEME SWITCHER WITH TRANSITIONS
     ══════════════════════════════ */
  const themeToggle = document.getElementById('themeToggle');
  
  function toggleTheme() {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add smooth transition class temporarily
    htmlEl.classList.add('theme-transition');
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Remove smooth transition class after animation completes
    setTimeout(() => {
      htmlEl.classList.remove('theme-transition');
    }, 350);
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system preference changes (only update if user hasn't overridden theme)
  const systemPref = window.matchMedia('(prefers-color-scheme: dark)');
  systemPref.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      const htmlEl = document.documentElement;
      const newTheme = e.matches ? 'dark' : 'light';
      htmlEl.classList.add('theme-transition');
      htmlEl.setAttribute('data-theme', newTheme);
      setTimeout(() => {
        htmlEl.classList.remove('theme-transition');
      }, 350);
    }
  });

})();

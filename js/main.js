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

    window.addEventListener('resize', () => {
      if (currentActiveLink) movePill(currentActiveLink, false);
    }, { passive: true });
  }

  initNavIndicator();


  /* ══════════════════════════════
     GALLERY GRID & CLIENT-SIDE ROUTING
     ══════════════════════════════ */
  const grid = document.getElementById('galleryGrid');
  let visibleWorks = [];

  function buildTiles(list) {
    if (!grid) return;
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

  /* ── SCROLL REVEAL ── */
  function initScrollReveal() {
    if (!grid) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        // Dynamically compute layout delay based on viewport width (matching css rules)
        let cols = 4;
        const w = window.innerWidth;
        if (w <= 600) cols = 1;
        else if (w <= 1024) cols = 2;

        const col = parseInt(entry.target.dataset.index, 10) % cols;
        entry.target.style.transitionDelay = (col * 50) + 'ms';
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });

    grid.querySelectorAll('.tile').forEach(t => io.observe(t));
  }

  /* ── ROUTING / FILTERING ── */
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

    if (animate) {
      const tiles = grid.querySelectorAll('.tile');
      if (tiles.length > 0) {
        tiles.forEach((t, i) => {
          let cols = 4;
          const w = window.innerWidth;
          if (w <= 600) cols = 1;
          else if (w <= 1024) cols = 2;

          const col = parseInt(t.dataset.index || i, 10) % cols;
          t.style.transitionDelay = `${col * 40}ms`;
          t.style.transitionDuration = '0.25s';
          t.classList.add('is-exiting');
        });
        setTimeout(() => {
          buildTiles(worksList);
        }, 350);
      } else {
        buildTiles(worksList);
      }
    } else {
      buildTiles(worksList);
    }
  }

  function handleRoute() {
    const hash = window.location.hash.substring(1) || 'all';
    if (['all', '2d', '3d', 'design'].includes(hash)) {
      filterCategory(hash, true);
    }
  }

  if (grid) {
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

    openLightbox = function(idx) {
      currentIdx = idx;
      document.body.classList.add('lightbox-active');
      
      const tiles = grid ? grid.querySelectorAll('.tile') : [];
      const clickedImg = tiles[idx] ? tiles[idx].querySelector('.tile-img') : null;
      
      if (clickedImg) {
        const firstRect = clickedImg.getBoundingClientRect();
        const aspect = clickedImg.naturalWidth / clickedImg.naturalHeight || (clickedImg.width / clickedImg.height);
        const naturalW = clickedImg.naturalWidth || clickedImg.width;
        const naturalH = clickedImg.naturalHeight || clickedImg.height;
        
        // Render slide structure (resets zoom, sets lbImg.src, triggers load)
        renderSlide(idx);
        
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
        renderSlide(idx);
        lbImg.style.opacity = '1';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
      }
    };

    function closeLightbox() {
      document.body.classList.remove('lightbox-active');
      const tiles = grid ? grid.querySelectorAll('.tile') : [];
      const tileImg = tiles[currentIdx] ? tiles[currentIdx].querySelector('.tile-img') : null;
      
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
      const tiles = grid ? grid.querySelectorAll('.tile') : [];
      if (tiles[idx]) {
        const tileImg = tiles[idx].querySelector('.tile-img');
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

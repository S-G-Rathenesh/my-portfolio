(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // Neural AI Preloader Controller (Interactive & Paced)
  (() => {
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('loader-bar');
    const counter = document.getElementById('loader-counter');
    const status = document.getElementById('loader-status');
    const launchBtn = document.getElementById('preloader-skip-btn');

    if (!preloader) return;

    if (prefersReducedMotion) {
      preloader.classList.add('loaded');
      setTimeout(() => preloader.remove(), 100);
      return;
    }

    const statusTexts = [
      '[01/04] INITIALIZING NEURAL CORE...',
      '[02/04] LOADING REACT & FASTAPI MODULES...',
      '[03/04] RENDERING CYBER HUD GRAPHICS...',
      '[04/04] SYNCHRONIZING SYSTEM NODES...',
      'SYSTEM ONLINE // READY TO LAUNCH'
    ];

    let progress = 0;
    let isDismissed = false;

    function dismissPreloader() {
      if (isDismissed) return;
      isDismissed = true;
      clearInterval(interval);
      if (bar) bar.style.width = '100%';
      if (counter) counter.textContent = '100%';
      if (status) status.textContent = statusTexts[4];

      preloader.classList.add('loaded');
      setTimeout(() => {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 650);
    }

    // Allow interactive click anywhere or button to enter instantly
    preloader.addEventListener('click', dismissPreloader);
    if (launchBtn) launchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissPreloader();
    });

    const interval = setInterval(() => {
      // Smooth progress over ~2.4 seconds
      const increment = Math.floor(Math.random() * 4) + 2;
      progress = Math.min(100, progress + increment);

      if (bar) bar.style.width = progress + '%';
      if (counter) counter.textContent = progress + '%';

      if (status) {
        if (progress < 25) status.textContent = statusTexts[0];
        else if (progress < 50) status.textContent = statusTexts[1];
        else if (progress < 75) status.textContent = statusTexts[2];
        else if (progress < 100) status.textContent = statusTexts[3];
        else status.textContent = statusTexts[4];
      }

      if (progress >= 60 && launchBtn) {
        launchBtn.classList.add('visible');
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(dismissPreloader, 600);
      }
    }, 40);
  })();


  // Cursor FX (desktop only)

  (() => {
    if (prefersReducedMotion) return;
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    if (!finePointer || !canHover) return;

    const layer = document.createElement('div');
    layer.className = 'cursor-fx-layer';
    layer.setAttribute('aria-hidden', 'true');

    const trail = document.createElement('canvas');
    trail.id = 'cursor-trail';
    layer.appendChild(trail);

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    layer.appendChild(ring);

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    layer.appendChild(dot);

    document.body.appendChild(layer);
    document.body.classList.add('has-cursor-fx');

    const ctx = trail.getContext('2d', { alpha: true, desynchronized: true });
    const viewport = { w: window.innerWidth, h: window.innerHeight, dpr: 1 };

    const target = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.45 };
    const posDot = { x: target.x, y: target.y };
    const posRing = { x: target.x, y: target.y };

    const particles = [];
    const maxParticles = 44;
    let lastSpawnX = target.x;
    let lastSpawnY = target.y;

    function resize() {
      viewport.w = window.innerWidth;
      viewport.h = window.innerHeight;
      viewport.dpr = Math.min(2, window.devicePixelRatio || 1);

      trail.width = Math.floor(viewport.w * viewport.dpr);
      trail.height = Math.floor(viewport.h * viewport.dpr);
      trail.style.width = viewport.w + 'px';
      trail.style.height = viewport.h + 'px';
      ctx.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);
    }

    function onMove(e) {
      target.x = e.clientX;
      target.y = e.clientY;
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousedown', () => document.body.classList.add('cursor-fx--down'), { passive: true });
    window.addEventListener('mouseup', () => document.body.classList.remove('cursor-fx--down'), { passive: true });

    const interactiveSelector = 'a,button,.btn,[role="button"],input,textarea,select,label';
    window.addEventListener('pointerover', (e) => {
      const el = e.target && e.target.closest ? e.target.closest(interactiveSelector) : null;
      if (el) document.body.classList.add('cursor-fx--pointer');
    }, { passive: true });
    window.addEventListener('pointerout', (e) => {
      const el = e.target && e.target.closest ? e.target.closest(interactiveSelector) : null;
      if (el) document.body.classList.remove('cursor-fx--pointer');
    }, { passive: true });

    function spawnParticle(x, y, speed) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * (0.4 + speed * 0.25),
        vy: (Math.random() - 0.5) * (0.4 + speed * 0.25),
        r: 2.2 + Math.random() * 3.6,
        life: 1,
      });
      if (particles.length > maxParticles) particles.splice(0, particles.length - maxParticles);
    }

    function drawTrail() {
      ctx.clearRect(0, 0, viewport.w, viewport.h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.045;

        const a = Math.max(0, p.life);
        if (a <= 0) continue;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
        grad.addColorStop(0, `rgba(122,162,255, ${(0.20 * a).toFixed(4)})`);
        grad.addColorStop(0.45, `rgba(185,140,255, ${(0.14 * a).toFixed(4)})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // compact array
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].life <= 0) particles.splice(i, 1);
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    function tick() {
      // ease followers
      posDot.x += (target.x - posDot.x) * 0.42;
      posDot.y += (target.y - posDot.y) * 0.42;

      posRing.x += (target.x - posRing.x) * 0.18;
      posRing.y += (target.y - posRing.y) * 0.18;

      dot.style.transform = `translate3d(${posDot.x}px, ${posDot.y}px, 0)`;
      ring.style.transform = `translate3d(${posRing.x}px, ${posRing.y}px, 0)`;

      const dx = target.x - lastSpawnX;
      const dy = target.y - lastSpawnY;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        const speed = Math.min(18, dist);
        spawnParticle(posDot.x, posDot.y, speed);
        lastSpawnX = target.x;
        lastSpawnY = target.y;
      }

      drawTrail();
      requestAnimationFrame(tick);
    }

    resize();
    requestAnimationFrame(tick);
  })();

  // Footer year (if present)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Pointer parallax (CSS vars only)
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const viewport = { w: window.innerWidth, h: window.innerHeight };

  function setParallaxVars(nx, ny) {
    // nx/ny in [-0.5..0.5]
    const px = nx * 40;
    const py = ny * 40;
    root.style.setProperty('--px', `${px.toFixed(2)}px`);
    root.style.setProperty('--py', `${py.toFixed(2)}px`);
  }

  function onPointerMove(ev) {
    const x = (ev.clientX ?? viewport.w / 2);
    const y = (ev.clientY ?? viewport.h / 2);
    pointer.x = (x / viewport.w) - 0.5;
    pointer.y = (y / viewport.h) - 0.5;
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    onPointerMove({ clientX: t.clientX, clientY: t.clientY });
  }, { passive: true });

  window.addEventListener('resize', () => {
    viewport.w = window.innerWidth;
    viewport.h = window.innerHeight;
    if (constellation) constellation.resize();
  }, { passive: true });

  // Reveal (load + scroll)
  const revealEls = Array.from(document.querySelectorAll('.fade-in'));
  const baseDelay = 70;

  revealEls.forEach((el, i) => {
    const delay = Math.min(i * baseDelay, 560);
    el.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      }
    }, { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Nav active underline (anchor nav + robust scroll-spy)
  (() => {
    const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
    if (!navLinks.length) return;

    const sections = navLinks
      .map((link) => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) return null;
        const id = decodeURIComponent(href.slice(1));
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    function setActiveById(sectionId) {
      const normalized = sectionId ? `#${sectionId}` : '';
      for (const link of navLinks) {
        link.classList.toggle('is-active', link.getAttribute('href') === normalized);
      }
    }

    // Keep underline in sync with clicks / back-forward navigation
    for (const link of navLinks) {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        const id = decodeURIComponent(href.slice(1));
        if (id) setActiveById(id);
      }, { passive: true });
    }
    window.addEventListener('hashchange', () => {
      if (!location.hash.startsWith('#')) return;
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) setActiveById(id);
    }, { passive: true });

    // Initial state (use hash if present)
    if (location.hash && location.hash.startsWith('#')) {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) setActiveById(id);
    }

    // Prefer IntersectionObserver for correctness and performance.
    if (!prefersReducedMotion && 'IntersectionObserver' in window && sections.length) {
      const io = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio));
        if (visible.length) setActiveById(visible[0].target.id);
      }, {
        root: null,
        threshold: [0.22, 0.35, 0.5],
        // Account for fixed header; bias towards the upper half of the viewport
        rootMargin: '-96px 0px -55% 0px',
      });

      sections.forEach((s) => io.observe(s));
    } else {
      // Fallback scroll-spy
      const headerOffset = 110;
      const onScroll = () => {
        const y = window.scrollY + headerOffset;
        let current = '';
        for (const section of sections) {
          if (section.offsetTop <= y) current = section.id;
        }
        if (current) setActiveById(current);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  })();
  // Smooth parallax tick
  function parallaxTick() {
    // ease towards pointer
    eased.x += (pointer.x - eased.x) * 0.08;
    eased.y += (pointer.y - eased.y) * 0.08;
    setParallaxVars(eased.x, eased.y);
    if (!prefersReducedMotion) requestAnimationFrame(parallaxTick);
  }

  if (!prefersReducedMotion) requestAnimationFrame(parallaxTick);
  else setParallaxVars(0, 0);

  // Neural constellation background (optimized grid)
  const canvas = document.getElementById('neural-constellation');

  let constellation = null;
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });

    constellation = (() => {
      const state = {
        dpr: 1,
        w: 0,
        h: 0,
        particles: [],
        grid: [],
        cols: 0,
        rows: 0,
        cell: 170,
        maxLinks: 3,
        mouse: { x: -9999, y: -9999, active: false },
      };

      const COLORS = {
        lineA: [122, 162, 255],
        lineB: [185, 140, 255],
        dot: [235, 242, 255],
        mouse: [126, 240, 216],
      };

      function rand(min, max) { return min + Math.random() * (max - min); }

      function initParticles() {
        const area = state.w * state.h;
        // Keep count stable and light
        const count = Math.max(55, Math.min(110, Math.floor(area / 42000)));
        state.particles = new Array(count).fill(0).map(() => ({
          x: rand(0, state.w),
          y: rand(0, state.h),
          vx: rand(-0.18, 0.18),
          vy: rand(-0.18, 0.18),
          r: rand(1.0, 2.0),
        }));
      }

      function buildGrid() {
        state.cols = Math.ceil(state.w / state.cell);
        state.rows = Math.ceil(state.h / state.cell);
        const size = state.cols * state.rows;
        state.grid = new Array(size);
        for (let i = 0; i < size; i++) state.grid[i] = [];
      }

      function clearGrid() {
        for (let i = 0; i < state.grid.length; i++) state.grid[i].length = 0;
      }

      function cellIndexFor(x, y) {
        const cx = Math.max(0, Math.min(state.cols - 1, (x / state.cell) | 0));
        const cy = Math.max(0, Math.min(state.rows - 1, (y / state.cell) | 0));
        return cy * state.cols + cx;
      }

      function placeParticlesInGrid() {
        clearGrid();
        for (let i = 0; i < state.particles.length; i++) {
          const p = state.particles[i];
          state.grid[cellIndexFor(p.x, p.y)].push(i);
        }
      }

      function neighborsForParticle(p) {
        const cx = Math.max(0, Math.min(state.cols - 1, (p.x / state.cell) | 0));
        const cy = Math.max(0, Math.min(state.rows - 1, (p.y / state.cell) | 0));
        const out = [];
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const nx = cx + ox;
            const ny = cy + oy;
            if (nx < 0 || ny < 0 || nx >= state.cols || ny >= state.rows) continue;
            const cell = state.grid[ny * state.cols + nx];
            for (let k = 0; k < cell.length; k++) out.push(cell[k]);
          }
        }
        return out;
      }

      function resize() {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        state.dpr = dpr;
        const cssW = window.innerWidth;
        const cssH = window.innerHeight;
        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        state.w = cssW;
        state.h = cssH;
        buildGrid();
        initParticles();
      }

      function setMouse(x, y) {
        state.mouse.x = x;
        state.mouse.y = y;
        state.mouse.active = true;
      }

      window.addEventListener('mousemove', (e) => setMouse(e.clientX, e.clientY), { passive: true });
      window.addEventListener('touchmove', (e) => {
        const t = e.touches && e.touches[0];
        if (!t) return;
        setMouse(t.clientX, t.clientY);
      }, { passive: true });
      window.addEventListener('mouseleave', () => { state.mouse.active = false; }, { passive: true });

      function tick() {
        // subtle drift + wrap
        for (let i = 0; i < state.particles.length; i++) {
          const p = state.particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -20) p.x = state.w + 20;
          else if (p.x > state.w + 20) p.x = -20;

          if (p.y < -20) p.y = state.h + 20;
          else if (p.y > state.h + 20) p.y = -20;
        }
      }

      function draw() {
        ctx.clearRect(0, 0, state.w, state.h);

        placeParticlesInGrid();

        const maxDist = 170;
        const maxDist2 = maxDist * maxDist;
        const mx = state.mouse.x;
        const my = state.mouse.y;
        const mouseActive = state.mouse.active;
        const mouseLinkDist = 210;
        const mouseLinkDist2 = mouseLinkDist * mouseLinkDist;

        ctx.globalCompositeOperation = 'lighter';

        // lines
        for (let i = 0; i < state.particles.length; i++) {
          const p = state.particles[i];
          const neighborIdxs = neighborsForParticle(p);
          let links = 0;

          for (let n = 0; n < neighborIdxs.length; n++) {
            const j = neighborIdxs[n];
            if (j <= i) continue;
            const q = state.particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const d2 = dx * dx + dy * dy;
            if (d2 > maxDist2) continue;

            const t = 1 - (d2 / maxDist2);
            const a = 0.18 * t;

            // subtle gradient between A and B
            const mix = 0.25 + 0.75 * t;
            const r = (COLORS.lineA[0] * mix + COLORS.lineB[0] * (1 - mix)) | 0;
            const g = (COLORS.lineA[1] * mix + COLORS.lineB[1] * (1 - mix)) | 0;
            const b = (COLORS.lineA[2] * mix + COLORS.lineB[2] * (1 - mix)) | 0;

            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a.toFixed(4)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();

            links++;
            if (links >= state.maxLinks) break;
          }
        }

        // mouse links (connect to nearest few particles)
        if (mouseActive) {
          const nearest = [];
          for (let i = 0; i < state.particles.length; i++) {
            const p = state.particles[i];
            const dx = p.x - mx;
            const dy = p.y - my;
            const d2 = dx * dx + dy * dy;
            if (d2 > mouseLinkDist2) continue;

            nearest.push({ i, d2 });
          }

          nearest.sort((a, b) => a.d2 - b.d2);
          const count = Math.min(7, nearest.length);

          for (let k = 0; k < count; k++) {
            const p = state.particles[nearest[k].i];
            const t = 1 - (nearest[k].d2 / mouseLinkDist2);
            const a = 0.28 * t;
            ctx.strokeStyle = `rgba(${COLORS.mouse[0]}, ${COLORS.mouse[1]}, ${COLORS.mouse[2]}, ${a.toFixed(4)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }

        // dots
        for (let i = 0; i < state.particles.length; i++) {
          const p = state.particles[i];
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6.0);
          glow.addColorStop(0, `rgba(${COLORS.dot[0]}, ${COLORS.dot[1]}, ${COLORS.dot[2]}, 0.95)`);
          glow.addColorStop(0.28, `rgba(${COLORS.lineA[0]}, ${COLORS.lineA[1]}, ${COLORS.lineA[2]}, 0.24)`);
          glow.addColorStop(0.6, `rgba(${COLORS.lineB[0]}, ${COLORS.lineB[1]}, ${COLORS.lineB[2]}, 0.10)`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 6.0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(${COLORS.dot[0]}, ${COLORS.dot[1]}, ${COLORS.dot[2]}, 0.88)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // mouse node
        if (mouseActive) {
          const r = 2.4;
          const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 26);
          glow.addColorStop(0, `rgba(${COLORS.mouse[0]}, ${COLORS.mouse[1]}, ${COLORS.mouse[2]}, 0.55)`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(mx, my, 26, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(${COLORS.mouse[0]}, ${COLORS.mouse[1]}, ${COLORS.mouse[2]}, 0.90)`;
          ctx.beginPath();
          ctx.arc(mx, my, r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
      }

      let raf = 0;
      function loop() {
        tick();
        draw();
        raf = requestAnimationFrame(loop);
      }

      function start() {
        resize();
        if (!prefersReducedMotion) loop();
      }

      function stop() {
        cancelAnimationFrame(raf);
      }

      return { start, stop, resize };
    })();

    constellation.start();
  }

  // Secret Hotkey (Ctrl + X), PIN Verification, Ben-10 Omnitrix & Developer Mode Controller
  (() => {
    const SECRET_PIN = "1315";
    let enteredPin = "";


    const pinModal = document.getElementById('secret-pin-modal');
    const pinCloseBtn = document.getElementById('pin-modal-close');
    const pinErrorMsg = document.getElementById('pin-error-msg');
    const keypadBtns = document.querySelectorAll('.keypad-btn');
    const pinDots = [
      document.getElementById('pin-dot-1'),
      document.getElementById('pin-dot-2'),
      document.getElementById('pin-dot-3'),
      document.getElementById('pin-dot-4')
    ];

    const omnitrixOverlay = document.getElementById('omnitrix-overlay');
    const devAdminPanel = document.getElementById('dev-admin-panel');
    const devPanelClose = document.getElementById('dev-panel-close');

    // 1. Detect Hotkey: Ctrl + X
    window.addEventListener('keydown', (e) => {
      const hasCtrl = e.ctrlKey || e.metaKey;
      const isX = e.key.toLowerCase() === 'x';

      if (hasCtrl && isX) {
        e.preventDefault();
        openPinModal();
      }
    });


    function openPinModal() {
      if (!pinModal) return;
      enteredPin = "";
      updatePinDisplay();
      if (pinErrorMsg) pinErrorMsg.textContent = "";
      pinModal.classList.add('active');
    }

    function closePinModal() {
      if (pinModal) pinModal.classList.remove('active');
    }

    if (pinCloseBtn) pinCloseBtn.addEventListener('click', closePinModal);

    // Keypad entry logic
    keypadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        handlePinInput(key);
      });
    });

    // Hardware keyboard entry for PIN modal
    window.addEventListener('keydown', (e) => {
      if (!pinModal || !pinModal.classList.contains('active')) return;
      if (e.key >= '0' && e.key <= '9') {
        handlePinInput(e.key);
      } else if (e.key === 'Backspace') {
        handlePinInput('back');
      } else if (e.key === 'Escape') {
        closePinModal();
      }
    });

    function handlePinInput(key) {
      if (key === 'clear') {
        enteredPin = "";
      } else if (key === 'back') {
        enteredPin = enteredPin.slice(0, -1);
      } else if (enteredPin.length < 4 && key >= '0' && key <= '9') {
        enteredPin += key;
      }

      updatePinDisplay();

      if (enteredPin.length === 4) {
        if (enteredPin === SECRET_PIN) {
          closePinModal();
          triggerOmnitrixTransformation();
        } else {
          if (pinErrorMsg) pinErrorMsg.textContent = "INCORRECT PIN - ACCESS DENIED";
          setTimeout(() => {
            enteredPin = "";
            updatePinDisplay();
          }, 600);
        }
      }
    }

    function updatePinDisplay() {
      pinDots.forEach((dot, index) => {
        if (dot) {
          if (index < enteredPin.length) dot.classList.add('filled');
          else dot.classList.remove('filled');
        }
      });
    }

    // 2. Transformation & Developer Mode Activation
    function triggerOmnitrixTransformation() {
      if (!omnitrixOverlay) {
        launchDeveloperMode();
        return;
      }

      omnitrixOverlay.classList.add('active');
      setTimeout(() => {
        omnitrixOverlay.classList.remove('active');
        launchDeveloperMode();
      }, 2600);
    }

    function launchDeveloperMode() {
      if (!window.location.search.includes('mode=developer')) {
        const devUrl = window.location.pathname + '?mode=developer' + window.location.hash;
        window.open(devUrl, '_blank');
        showToast('🚀 Developer Mode opened in a new tab!');
      } else {
        enableVisualDeveloperMode();
      }
    }

    // Toast Notification helper
    function showToast(message) {
      const toast = document.getElementById('cms-toast');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // 3. Visual Developer CMS Mode Controller
    function enableVisualDeveloperMode() {
      document.body.classList.add('dev-mode-active');
      sessionStorage.setItem('dev_mode', 'true');

      // Make all text elements editable
      const editableSelectors = [
        '.hero-text h2', '.hero-text .highlight', '.hero-subtitle', '.hero-desc',
        '.contact-link', '.section-card h2', '.section-card h3', '.about-grid p',
        '.skills li span', '.core-item span', '.project-card h3', '.project-card p',
        '.project-bullet-list li', '.intern-card h3', '.intern-card p',
        '.intern-bullet-list li', '.cert-list li span', '.project-impact'
      ];

      editableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.setAttribute('contenteditable', 'true');
          el.setAttribute('spellcheck', 'false');
        });
      });

      // Enable link URL editing on all buttons via double click
      document.querySelectorAll('a.btn, .cert-list a, .hero-actions a, .project-card a').forEach(link => {
        makeLinkEditable(link);
      });

      // Real-time Tech Icon symbol update for project cards
      document.querySelectorAll('.project-card').forEach(card => {
        const techLine = card.querySelector('p.small');
        if (techLine) {
          techLine.addEventListener('blur', () => {
            const text = techLine.innerText.replace(/^Tech:\s*/i, '');
            const updatedIcons = getTechIconsHtml(text);
            const oldIcons = card.querySelector('.project-tech-icons');
            if (oldIcons) {
              oldIcons.outerHTML = updatedIcons;
            } else {
              const h3 = card.querySelector('h3');
              if (h3) h3.insertAdjacentHTML('afterend', updatedIcons);
            }
          });
        }
      });

      // Attach Card Delete & Add Link Buttons
      attachDevCardControls();
      showToast('⚡ Visual Developer Mode Active! Click text to edit, double-click buttons to edit URL.');
    }

    function makeLinkEditable(linkEl) {
      if (!linkEl) return;
      linkEl.setAttribute('contenteditable', 'true');
      linkEl.setAttribute('title', `Click text to edit label. Double-click to edit URL (${linkEl.getAttribute('href') || '#'})`);
      
      linkEl.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentUrl = linkEl.getAttribute('href') || 'https://';
        const newUrl = prompt(`Edit Redirect URL for button "${linkEl.innerText.trim()}":`, currentUrl);
        if (newUrl !== null && newUrl.trim() !== '') {
          linkEl.setAttribute('href', newUrl.trim());
          linkEl.setAttribute('title', `Click text to edit label. Double-click to edit URL (${newUrl.trim()})`);
          showToast(`🔗 Updated button URL to: ${newUrl.trim()}`);
        }
      });
    }

    function createCustomButton(label, url) {
      const btn = document.createElement('a');
      btn.className = 'btn secondary-btn custom-dev-link';
      btn.href = url || 'https://';
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.textContent = label || 'Custom Link';
      makeLinkEditable(btn);
      return btn;
    }

    function disableVisualDeveloperMode() {
      document.body.classList.remove('dev-mode-active');
      sessionStorage.removeItem('dev_mode');

      document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        el.removeAttribute('contenteditable');
      });

      document.querySelectorAll('.dev-card-controls').forEach(el => el.remove());

      // Clean URL query param
      if (window.location.search.includes('mode=developer')) {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      showToast('👁️ Exited Developer Mode. Preview mode active.');
    }

    function attachDevCardControls() {
      const cardSelectors = ['.project-card', '.intern-card', '.cert-list li', '.skills li'];
      
      cardSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(card => {
          if (card.querySelector('.dev-card-controls')) return;

          const controls = document.createElement('div');
          controls.className = 'dev-card-controls';
          controls.setAttribute('contenteditable', 'false');

          // For project and internship cards, append "➕ Button" control
          if (selector === '.project-card' || selector === '.intern-card') {
            const addBtn = document.createElement('button');
            addBtn.className = 'dev-add-btn';
            addBtn.innerHTML = '➕ Button';
            addBtn.title = 'Add custom button (e.g. View Source Code, Live Demo, Try App, View Specs) to this card';
            addBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const label = prompt('Enter Custom Button Text (e.g. View Source Code, Live Demo, Try App, Download PDF):', 'Live Demo');
              if (!label) return;
              const url = prompt('Enter Target Redirect URL (e.g. https://...):', 'https://');
              if (!url) return;

              // Ensure card has a flex button container
              let btnGroup = card.querySelector('.project-btn-group');
              if (!btnGroup) {
                btnGroup = document.createElement('div');
                btnGroup.className = 'project-btn-group';
                const existingBtns = card.querySelectorAll('a.btn');
                existingBtns.forEach(btn => btnGroup.appendChild(btn));
                card.appendChild(btnGroup);
              }

              const newBtn = createCustomButton(label, url);
              btnGroup.appendChild(newBtn);
              showToast(`🔘 Added button "${label}" to card!`);
            });
            controls.appendChild(addBtn);
          }

          const delBtn = document.createElement('button');
          delBtn.className = 'dev-del-btn';
          delBtn.innerHTML = selector === '.skills li' ? '✕' : '🗑️ Delete';
          delBtn.title = 'Remove this element';
          delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this element?')) {
              card.remove();
              showToast('🗑️ Element removed from portfolio.');
            }
          });

          controls.appendChild(delBtn);
          card.appendChild(controls);
        });
      });
    }

    // Check if URL has ?mode=developer
    if (window.location.search.includes('mode=developer')) {
      enableVisualDeveloperMode();
    }

    // Toolbar Action Handlers
    const btnAddProj = document.getElementById('dev-btn-add-proj');
    const btnAddCert = document.getElementById('dev-btn-add-cert');
    const btnAddSkill = document.getElementById('dev-btn-add-skill');
    const btnAddBtn = document.getElementById('dev-btn-add-btn');
    const btnSaveLocal = document.getElementById('dev-btn-save-local');
    const btnSyncGithub = document.getElementById('dev-btn-sync-github');
    const btnExit = document.getElementById('dev-btn-exit');

    // Technology to DevIcon Symbol Parser & Generator
    function getTechIconsHtml(techString) {
      if (!techString) return '<div class="project-tech-icons" aria-label="Technologies used"><i class="devicon-code-plain colored" aria-hidden="true"></i></div>';

      const iconMap = {
        'react': 'devicon-react-original colored',
        'python': 'devicon-python-plain colored',
        'flutter': 'devicon-flutter-plain colored',
        'firebase': 'devicon-firebase-plain colored',
        'fastapi': 'devicon-fastapi-plain colored',
        'mongodb': 'devicon-mongodb-plain colored',
        'mongo': 'devicon-mongodb-plain colored',
        'sqlite': 'devicon-sqlite-plain colored',
        'postgres': 'devicon-postgresql-plain colored',
        'postgresql': 'devicon-postgresql-plain colored',
        'mysql': 'devicon-mysql-original colored',
        'php': 'devicon-php-plain colored',
        'html': 'devicon-html5-plain colored',
        'css': 'devicon-css3-plain colored',
        'javascript': 'devicon-javascript-plain colored',
        'js': 'devicon-javascript-plain colored',
        'typescript': 'devicon-typescript-plain colored',
        'ts': 'devicon-typescript-plain colored',
        'node': 'devicon-nodejs-plain colored',
        'nodejs': 'devicon-nodejs-plain colored',
        'arduino': 'devicon-arduino-plain colored',
        'docker': 'devicon-docker-plain colored',
        'tensorflow': 'devicon-tensorflow-line colored',
        'git': 'devicon-git-plain colored',
        'figma': 'devicon-figma-plain colored',
        'c++': 'devicon-cplusplus-plain colored',
        'cpp': 'devicon-cplusplus-plain colored',
        'java': 'devicon-java-plain colored',
        'aws': 'devicon-amazonwebservices-original colored'
      };

      const tokens = techString.toLowerCase().split(/[\s,+/]+/);
      const matchedClasses = new Set();

      tokens.forEach(t => {
        const clean = t.replace(/[^a-z0-9+#]/g, '');
        if (iconMap[clean]) {
          matchedClasses.add(iconMap[clean]);
        }
      });

      if (matchedClasses.size === 0) {
        return '<div class="project-tech-icons" aria-label="Technologies used"><i class="devicon-code-plain colored" aria-hidden="true"></i></div>';
      }

      let html = '<div class="project-tech-icons" aria-label="Technologies used">';
      matchedClasses.forEach(cls => {
        html += `<i class="${cls}" aria-hidden="true"></i>`;
      });
      html += '</div>';
      return html;
    }

    function getSkillIconHtml(skillName) {
      if (!skillName) return '<span class="skill-icon">⚡</span>';
      const name = skillName.toLowerCase().trim();
      const iconMap = {
        'react': '<i class="devicon-react-original colored skill-icon"></i>',
        'python': '<i class="devicon-python-plain colored skill-icon"></i>',
        'flutter': '<i class="devicon-flutter-plain colored skill-icon"></i>',
        'firebase': '<i class="devicon-firebase-plain colored skill-icon"></i>',
        'fastapi': '<i class="devicon-fastapi-plain colored skill-icon"></i>',
        'mongodb': '<i class="devicon-mongodb-plain colored skill-icon"></i>',
        'docker': '<i class="devicon-docker-plain colored skill-icon"></i>',
        'git': '<i class="devicon-git-plain colored skill-icon"></i>',
        'html': '<i class="devicon-html5-plain colored skill-icon"></i>',
        'css': '<i class="devicon-css3-plain colored skill-icon"></i>',
        'javascript': '<i class="devicon-javascript-plain colored skill-icon"></i>',
        'typescript': '<i class="devicon-typescript-plain colored skill-icon"></i>',
        'java': '<i class="devicon-java-plain colored skill-icon"></i>',
        'c++': '<i class="devicon-cplusplus-plain colored skill-icon"></i>',
        'mysql': '<i class="devicon-mysql-original colored skill-icon"></i>',
        'figma': '<i class="devicon-figma-plain colored skill-icon"></i>'
      };

      for (const key in iconMap) {
        if (name.includes(key)) {
          return iconMap[key];
        }
      }
      return '<span class="skill-icon">⚡</span>';
    }

    if (btnAddProj) {
      btnAddProj.addEventListener('click', () => {
        const title = prompt('Enter Project Title:', 'New AI Project');
        if (!title) return;
        const tech = prompt('Enter Technologies (e.g. React, Python, FastAPI, Docker):', 'React, Python, FastAPI');
        const url = prompt('Enter GitHub Repository Link:', 'https://github.com/S-G-Rathenesh/');
        const bullet1 = prompt('Enter Key Feature/Bullet Point 1:', 'Developed scalable full stack solution with real-time analytics.');

        const projectGrid = document.querySelector('.project-grid');
        if (!projectGrid) return;

        const techIconsHtml = getTechIconsHtml(tech);

        const newCard = document.createElement('div');
        newCard.className = 'project-card featured-project';
        newCard.innerHTML = `
          <span class="project-badge ai">⭐ Featured Project</span>
          <h3 contenteditable="true">${title}</h3>
          ${techIconsHtml}
          <p class="small"><b>Tech:</b> <span class="dev-tech-text" contenteditable="true">${tech || 'Full Stack'}</span></p>
          <ul class="project-bullet-list">
            <li contenteditable="true">${bullet1 || 'Key project achievement and feature implementation.'}</li>
          </ul>
          <a href="${url || '#'}" class="btn" target="_blank" rel="noopener">View Source Code</a>
        `;

        projectGrid.insertBefore(newCard, projectGrid.firstChild);
        attachDevCardControls();

        // Listen for live tech text edits to update symbols in real-time
        const techSpan = newCard.querySelector('.dev-tech-text');
        if (techSpan) {
          techSpan.addEventListener('blur', () => {
            const updatedIcons = getTechIconsHtml(techSpan.innerText);
            const oldIcons = newCard.querySelector('.project-tech-icons');
            if (oldIcons) oldIcons.outerHTML = updatedIcons;
          });
        }

        showToast(`➕ Added project "${title}" with tech stack symbols!`);
      });
    }

    if (btnAddCert) {
      btnAddCert.addEventListener('click', () => {
        const title = prompt('Enter Certificate Title:', 'AWS Certified Solutions Architect');
        if (!title) return;
        const pdf = prompt('Enter PDF Link / Filename:', 'aws-certificate.pdf');

        const certList = document.querySelector('.cert-list');
        if (!certList) return;

        const newLi = document.createElement('li');
        newLi.innerHTML = `
          <span contenteditable="true">${title}</span>
          <a class="btn" href="${pdf || '#'}" target="_blank" rel="noopener">View Certificate</a>
        `;

        certList.insertBefore(newLi, certList.firstChild);
        attachDevCardControls();
        showToast(`📜 Added certificate "${title}"!`);
      });
    }

    if (btnAddSkill) {
      btnAddSkill.addEventListener('click', () => {
        const skillName = prompt('Enter New Skill Name (e.g. Docker, TypeScript):', 'Docker');
        if (!skillName) return;

        const skillsLists = document.querySelectorAll('.skills');
        if (!skillsLists.length) return;

        const targetList = skillsLists[0];
        const iconHtml = getSkillIconHtml(skillName);
        const newLi = document.createElement('li');
        newLi.innerHTML = `${iconHtml}<span contenteditable="true">${skillName}</span>`;

        targetList.appendChild(newLi);
        attachDevCardControls();
        showToast(`💡 Added skill "${skillName}" with tech icon!`);
      });
    }

    if (btnAddBtn) {
      btnAddBtn.addEventListener('click', () => {
        const label = prompt('Enter Custom Button Text (e.g. View Source Code, Live Demo, Try App, Download PDF):', 'Live Demo');
        if (!label) return;
        const url = prompt('Enter Target Redirect URL (e.g. https://...):', 'https://');
        if (!url) return;

        const targetCard = document.querySelector('.project-card');
        const heroActions = document.querySelector('.hero-actions');
        
        const loc = prompt('Where to add custom button?\n1: First Project Card\n2: Hero Action Area\n(Enter 1 or 2):', '1');

        if (loc === '2' && heroActions) {
          const newBtn = createCustomButton(label, url);
          heroActions.appendChild(newBtn);
          showToast(`🔘 Added button "${label}" to Hero section!`);
        } else if (targetCard) {
          let btnGroup = targetCard.querySelector('.project-btn-group');
          if (!btnGroup) {
            btnGroup = document.createElement('div');
            btnGroup.className = 'project-btn-group';
            const existingBtns = targetCard.querySelectorAll('a.btn');
            existingBtns.forEach(btn => btnGroup.appendChild(btn));
            targetCard.appendChild(btnGroup);
          }
          const newBtn = createCustomButton(label, url);
          btnGroup.appendChild(newBtn);
          showToast(`🔘 Added custom button "${label}" to Project card!`);
        }
      });
    }

    if (btnSaveLocal) {
      btnSaveLocal.addEventListener('click', () => {
        localStorage.setItem('portfolio_dom_backup', document.documentElement.outerHTML);
        showToast('💾 Local portfolio edits saved to browser storage!');
      });
    }

    if (btnExit) {
      btnExit.addEventListener('click', disableVisualDeveloperMode);
    }

    // 4. GitHub Auto-Commit & Deploy
    const repoPath = "S-G-Rathenesh/my-portfolio";

    function getPatToken(forceReset = false) {
      if (forceReset) {
        localStorage.removeItem('gh_pat_token');
      }
      let token = localStorage.getItem('gh_pat_token') || '';
      if (!token) {
        token = prompt('Enter your GitHub Personal Access Token (PAT) with "repo" write access for 1-click deploy:') || '';
        if (token) localStorage.setItem('gh_pat_token', token.trim());
      }
      return token.trim();
    }

    async function syncAndDeployToGithub(e) {
      const isShift = e && e.shiftKey;
      const patToken = getPatToken(isShift);
      if (!patToken) {
        showToast('❌ GitHub Deploy Cancelled: No PAT token provided.');
        return;
      }

      showToast('⏳ Preparing HTML bundle & committing to GitHub...');

      // Clone DOM & clean dev artifacts for export
      const clone = document.documentElement.cloneNode(true);
      
      // Clean editable attributes & dev elements from clone
      clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
      clone.querySelectorAll('.dev-card-controls').forEach(el => el.remove());
      clone.querySelectorAll('#preloader').forEach(el => el.remove());
      
      const devToolbarEl = clone.querySelector('#dev-top-toolbar');
      if (devToolbarEl) devToolbarEl.remove();

      const cmsToastEl = clone.querySelector('#cms-toast');
      if (cmsToastEl) cmsToastEl.remove();

      const devModalEl = clone.querySelector('#dev-admin-panel');
      if (devModalEl) devModalEl.remove();

      const pinModalEl = clone.querySelector('#secret-pin-modal');
      if (pinModalEl) pinModalEl.remove();

      const omnitrixEl = clone.querySelector('#omnitrix-overlay');
      if (omnitrixEl) omnitrixEl.remove();

      // Ensure clean body class
      const cloneBody = clone.querySelector('body');
      if (cloneBody) cloneBody.classList.remove('dev-mode-active');

      const cleanHtml = '<!DOCTYPE html>\n' + clone.outerHTML;

      try {
        const contentUrl = `https://api.github.com/repos/${repoPath}/contents/index.html`;

        // 1. Get current SHA
        const getRes = await fetch(contentUrl, {
          headers: {
            'Authorization': `token ${patToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!getRes.ok) {
          const errObj = await getRes.json().catch(() => ({}));
          throw new Error(errObj.message || getRes.statusText || `HTTP ${getRes.status}`);
        }

        const getJson = await getRes.json();
        const sha = getJson.sha;

        // 2. Commit clean HTML
        const encodedContent = btoa(unescape(encodeURIComponent(cleanHtml)));

        const putRes = await fetch(contentUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${patToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: 'Visual CMS Auto-Deploy via Developer Mode',
            content: encodedContent,
            sha: sha
          })
        });

        if (putRes.ok) {
          showToast('🚀 SUCCESS! Portfolio committed & deployed live to GitHub!');
        } else {
          const errJson = await putRes.json().catch(() => ({}));
          throw new Error(errJson.message || `Push failed (HTTP ${putRes.status})`);
        }
      } catch (err) {
        if (err.message && (err.message.includes('Resource not accessible') || err.message.includes('Bad credentials') || err.message.includes('403') || err.message.includes('401'))) {
          localStorage.removeItem('gh_pat_token');
          showToast(`❌ PAT Token Error: ${err.message}. Token cleared! Click Deploy again to enter a PAT with 'repo' write access.`);
        } else {
          showToast(`❌ GitHub Deploy Failed: ${err.message}`);
        }
      }
    }

    if (btnSyncGithub) {
      btnSyncGithub.addEventListener('click', syncAndDeployToGithub);
    }
  })();
})();



(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

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

  // Nav active underline
  const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"], .nav-links a[href^="#"]'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href === `#${id}`) a.classList.add('is-active');
      else a.classList.remove('is-active');
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const navIO = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio - a.intersectionRatio));
      if (!visible.length) return;
      setActiveLink(visible[0].target.id);
    }, { threshold: [0.35, 0.5, 0.65], rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(s => navIO.observe(s));
  }

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
})();

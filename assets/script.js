(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.4,
    tx: window.innerWidth * 0.5,
    ty: window.innerHeight * 0.4,
    vx: 0,
    vy: 0
  };

  const onPointer = (e) => {
    const p = e.touches ? e.touches[0] : e;
    if (!p) return;
    pointer.tx = p.clientX;
    pointer.ty = p.clientY;
  };

  window.addEventListener('mousemove', onPointer, { passive: true });
  window.addEventListener('touchstart', onPointer, { passive: true });
  window.addEventListener('touchmove', onPointer, { passive: true });

  const setRootVars = () => {
    document.documentElement.style.setProperty('--cursor-x', `${pointer.x}px`);
    document.documentElement.style.setProperty('--cursor-y', `${pointer.y}px`);

    const dx = (pointer.x / window.innerWidth - 0.5) * 2;
    const dy = (pointer.y / window.innerHeight - 0.5) * 2;
    const px = clamp(dx * 18, -18, 18);
    const py = clamp(dy * 14, -14, 14);
    document.documentElement.style.setProperty('--parx-x', `${px}px`);
    document.documentElement.style.setProperty('--parx-y', `${py}px`);
  };

  const ensureCanvas = () => {
    let canvas = document.getElementById('neural-constellation');
    if (canvas) return canvas;
    canvas = document.createElement('canvas');
    canvas.id = 'neural-constellation';
    document.body.appendChild(canvas);
    return canvas;
  };

  const reveal = () => {
    const els = Array.from(document.querySelectorAll('.fade-in'));
    if (!els.length) return;

    if (reduceMotion) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }

    els.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i * 70, 420)}ms`);
      el.style.transitionDelay = `var(--reveal-delay)`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    els.forEach((el) => io.observe(el));
  };

  const navActive = () => {
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    if (!navLinks.length) return;

    const sections = navLinks
      .map((a) => {
        const id = a.getAttribute('href');
        if (!id || id.length < 2) return null;
        const el = document.querySelector(id);
        return el ? { a, el, id } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const setActive = (id) => {
      navLinks.forEach((a) => a.classList.remove('is-active'));
      const match = navLinks.find((a) => a.getAttribute('href') === id);
      if (match) match.classList.add('is-active');
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!visible) return;
        const sec = sections.find((s) => s.el === visible.target);
        if (sec) setActive(sec.id);
      },
      { threshold: [0.2, 0.35, 0.55], rootMargin: '-20% 0px -55% 0px' }
    );

    sections.forEach((s) => io.observe(s.el));
  };

  const constellation = () => {
    if (reduceMotion) return () => {};

    const canvas = ensureCanvas();
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const density = clamp(Math.round((w * h) / 52000), 60, 140);
    const particles = [];
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.0 + Math.random() * 1.2
      });
    }

    const linkDist = 128;
    const linkDist2 = linkDist * linkDist;
    const repelDist = 140;
    const repelDist2 = repelDist * repelDist;
    const gridSize = linkDist;

    let raf = 0;

    const step = () => {
      raf = requestAnimationFrame(step);

      pointer.x += (pointer.tx - pointer.x) * 0.085;
      pointer.y += (pointer.ty - pointer.y) * 0.085;
      setRootVars();

      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / gridSize);
      const rows = Math.ceil(h / gridSize);
      const grid = new Array(cols * rows);
      for (let i = 0; i < grid.length; i++) grid[i] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const cx = clamp(Math.floor(p.x / gridSize), 0, cols - 1);
        const cy = clamp(Math.floor(p.y / gridSize), 0, rows - 1);
        grid[cy * cols + cx].push(i);
      }

      const px = pointer.x;
      const py = pointer.y;

      ctx.lineWidth = 1;
      ctx.globalCompositeOperation = 'lighter';

      for (let gi = 0; gi < grid.length; gi++) {
        const cell = grid[gi];
        if (!cell.length) continue;

        const gx = gi % cols;
        const gy = Math.floor(gi / cols);

        for (const idx of cell) {
          const p = particles[idx];

          const dxp = p.x - px;
          const dyp = p.y - py;
          const dp2 = dxp * dxp + dyp * dyp;
          if (dp2 < repelDist2 && dp2 > 0.001) {
            const dp = Math.sqrt(dp2);
            const force = (1 - dp / repelDist) * 0.65;
            p.x += (dxp / dp) * force;
            p.y += (dyp / dp) * force;
          }

          for (let oy = -1; oy <= 1; oy++) {
            const ny = gy + oy;
            if (ny < 0 || ny >= rows) continue;
            for (let ox = -1; ox <= 1; ox++) {
              const nx = gx + ox;
              if (nx < 0 || nx >= cols) continue;
              const neighbor = grid[ny * cols + nx];
              for (const jdx of neighbor) {
                if (jdx <= idx) continue;
                const q = particles[jdx];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d2 = dx * dx + dy * dy;
                if (d2 > linkDist2) continue;

                const d = Math.sqrt(d2);
                const t = 1 - d / linkDist;
                const glow = clamp(t * 0.22, 0, 0.22);
                ctx.strokeStyle = `rgba(150, 170, 255, ${glow})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dxp = p.x - px;
        const dyp = p.y - py;
        const dp2 = dxp * dxp + dyp * dyp;
        const a = dp2 < 240000 ? 0.78 : 0.55;
        ctx.fillStyle = `rgba(235, 242, 255, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    step();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  };

  const year = () => {
    const el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  };

  year();
  reveal();
  navActive();
  const stop = constellation();

  window.addEventListener('beforeunload', () => {
    if (typeof stop === 'function') stop();
  });
})();

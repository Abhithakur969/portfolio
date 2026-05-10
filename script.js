/* ═══════════════════════════════════════════
   ABHISHEK THAKUR — Portfolio Script
═══════════════════════════════════════════ */

/* ── CURSOR ──────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function loop() {
    // dot follows immediately
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    // ring lerps smoothly
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(loop);
  }
  loop();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll(
    'a, button, .skill-card, .info-card, .project-card, .cert-card, .contact-link, .value-tags span'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();


/* ── PARTICLES ───────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r:  Math.random() * 1.4 + 0.4,
      a:  Math.random() * 0.35 + 0.08,
      life: Math.random() * 280 + 180,
      age: 0
    };
  }

  for (let i = 0; i < 110; i++) particles.push(makeParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.age++;

      if (p.age > p.life || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
        Object.assign(p, makeParticle());
        return;
      }

      const fade = Math.min(p.age / 30, (p.life - p.age) / 30, 1);
      ctx.globalAlpha = p.a * fade;
      ctx.fillStyle   = '#63d7ff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 115) {
          ctx.globalAlpha = (1 - d / 115) * 0.055;
          ctx.strokeStyle = '#63d7ff';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ── NAVBAR SCROLL ───────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


/* ── HAMBURGER / MOBILE MENU ─────────────── */
(function initMobileMenu() {
  const btn     = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileOverlay');
  if (!btn || !overlay) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    btn.classList.add('open');
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    btn.classList.remove('open');
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => isOpen ? closeMenu() : openMenu());

  // Close on any link click
  overlay.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
})();


/* ── TYPEWRITER ──────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const phrases = [
    'Game Developer',
    'UX Designer',
    'C++ Engineer',
    'Unity Creator',
    'Backend Developer',
    'Creative Technologist'
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 50 : 92);
  }
  type();
})();


/* ── SCROLL REVEAL ───────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Optional: stop observing once visible
        // observer.unobserve(e.target);
      }
    }),
    { threshold: 0.1 }
  );

  els.forEach(el => observer.observe(el));
})();


/* ── STAT COUNTERS ───────────────────────── */
(function initCounters() {
  const statsRow = document.querySelector('.hero-stats');
  if (!statsRow) return;

  function animateCount(el, target, suffix) {
    const step = Math.max(1, Math.ceil(target / 40));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 40);
  }

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-num').forEach(num => {
          animateCount(num, parseInt(num.dataset.target), num.dataset.suffix || '');
        });
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.5 }
  );
  observer.observe(statsRow);
})();


/* ── SKILL CARD SPOTLIGHT ────────────────── */
(function initSpotlight() {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      card.style.setProperty('--mx', x);
      card.style.setProperty('--my', y);
    });
  });
})();


/* ── PROFILE CARD 3-D TILT ───────────────── */
(function initTilt() {
  const card = document.getElementById('profileCard');
  if (!card) return;

  document.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    if (rect.width === 0) return;  // card hidden on mobile
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (window.innerWidth  / 2);
    const dy = (e.clientY - cy) / (window.innerHeight / 2);
    card.style.transform = `perspective(1000px) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
})();


/* ── CONTACT FORM ────────────────────────── */
(function initForm() {
  const form = document.getElementById('contact-form');
  const fb   = document.getElementById('form-feedback');
  if (!form || !fb) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    fb.textContent = '✓ Message sent! I\'ll get back to you soon.';
    fb.style.color  = 'var(--green)';
    form.reset();
    setTimeout(() => { fb.textContent = ''; }, 5000);
  });
})();


/* ── LEETCODE LIVE STATS ─────────────────── */
(function initLeetCode() {
  // ── SET YOUR USERNAME HERE ──────────────────
  const DEFAULT_USERNAME = 'your-leetcode-username';
  // ────────────────────────────────────────────

  const API = 'https://leetcode-stats-api.herokuapp.com/';

  const elLoading  = document.getElementById('lcLoading');
  const elBody     = document.getElementById('lcBody');
  const elError    = document.getElementById('lcError');
  const elDot      = document.getElementById('lcDot');
  const elUsername = document.getElementById('lcUsernameText');
  const elTotal    = document.getElementById('lcTotal');
  const elEasy     = document.getElementById('lcEasy');
  const elMed      = document.getElementById('lcMed');
  const elHard     = document.getElementById('lcHard');
  const elAccept   = document.getElementById('lcAccept');
  const elRank     = document.getElementById('lcRank');
  const elEasyBar  = document.getElementById('lcEasyBar');
  const elMedBar   = document.getElementById('lcMedBar');
  const elHardBar  = document.getElementById('lcHardBar');
  const elLink     = document.getElementById('lcProfileLink');
  const dsaLink    = document.getElementById('dsaLeetcodeLink');
  const input      = document.getElementById('lcInput');
  const fetchBtn   = document.getElementById('lcFetch');

  if (!elLoading) return;

  function setLoading() {
    elLoading.style.display = 'flex';
    elBody.style.display    = 'none';
    elError.style.display   = 'none';
    elDot.className = 'lc-status-dot';
  }

  function setError() {
    elLoading.style.display = 'none';
    elBody.style.display    = 'none';
    elError.style.display   = 'block';
    elDot.className = 'lc-status-dot err';
  }

  function animBar(el, pct) {
    setTimeout(() => { el.style.width = Math.min(pct, 100) + '%'; }, 300);
  }

  function fmtRank(n) {
    if (!n || n === 0) return '—';
    if (n > 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n > 1000)    return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }

  async function fetchStats(username) {
    username = username.trim();
    if (!username || username === 'your-leetcode-username') { setError(); return; }

    setLoading();
    elUsername.textContent = username;
    if (elLink)    elLink.href    = `https://leetcode.com/${username}`;
    if (dsaLink)   dsaLink.href   = `https://leetcode.com/${username}`;

    try {
      const res = await fetch(API + username, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) { setError(); return; }
      const d = await res.json();
      if (d.status !== 'success') { setError(); return; }

      // Populate
      elTotal.textContent  = d.totalSolved ?? '—';
      elEasy.textContent   = d.easySolved  ?? '—';
      elMed.textContent    = d.mediumSolved ?? '—';
      elHard.textContent   = d.hardSolved  ?? '—';
      elAccept.textContent = d.acceptanceRate ? d.acceptanceRate.toFixed(1) + '%' : '—';
      elRank.textContent   = fmtRank(d.ranking);

      // Progress bars
      const easyPct   = d.totalEasy   ? (d.easySolved   / d.totalEasy   * 100) : 0;
      const medPct    = d.totalMedium ? (d.mediumSolved  / d.totalMedium * 100) : 0;
      const hardPct   = d.totalHard   ? (d.hardSolved   / d.totalHard   * 100) : 0;
      animBar(elEasyBar, easyPct);
      animBar(elMedBar,  medPct);
      animBar(elHardBar, hardPct);

      elLoading.style.display = 'none';
      elBody.style.display    = 'block';
      elDot.className = 'lc-status-dot live';
    } catch {
      setError();
    }
  }

  // Load default on init
  fetchStats(DEFAULT_USERNAME);

  // Manual fetch via input
  if (fetchBtn && input) {
    fetchBtn.addEventListener('click', () => fetchStats(input.value));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') fetchStats(input.value); });
  }
})();


(function initCV() {
  const btn = document.getElementById('cv-btn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    const original = btn.textContent;
    btn.textContent = '⏳  Preparing...';
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
})();
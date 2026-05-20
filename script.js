/* ═══════════════════════════════════════
   ABHISHEK THAKUR — Portfolio Script
   All bugs fixed:
   - Cursor always works
   - Smooth nav scroll (no jump, no flash)
   - Hamburger properly opens/closes fullscreen
   - Floating icons sized to page height
   - CV download
   - Form feedback
═══════════════════════════════════════ */

/* ── CURSOR ─────────────────────────── */
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll(
    'a, button, .skill-card, .info-card, .project-card, .cert-card, .social-btn, .value-tags span'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();


/* ── FLOATING TECH FIELD HEIGHT ──────── */
/* Icons use position:absolute top:Npx — we need the wrapper
   to be as tall as the whole page so they land in the right spots */
(function () {
  function setFieldHeight() {
    const field = document.querySelector('.tech-float-field');
    if (!field) return;
    field.style.height = document.documentElement.scrollHeight + 'px';
  }
  setFieldHeight();
  window.addEventListener('resize', setFieldHeight);
  // Re-run after fonts/images load
  window.addEventListener('load', setFieldHeight);
})();


/* ── PARTICLES ───────────────────────── */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pts = Array.from({ length: 90 }, () => mkPt());
  function mkPt() {
    return {
      x: Math.random() * (W || window.innerWidth),
      y: Math.random() * (H || window.innerHeight),
      vx: (Math.random() - .5) * .25,
      vy: (Math.random() - .5) * .25,
      r:  Math.random() * 1.3 + .4,
      a:  Math.random() * .3  + .08,
      life: Math.random() * 260 + 180,
      age: 0
    };
  }

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.age++;
      if (p.age > p.life || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
        Object.assign(p, mkPt()); return;
      }
      const f = Math.min(p.age / 30, (p.life - p.age) / 30, 1);
      ctx.globalAlpha = p.a * f;
      ctx.fillStyle = '#63d7ff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 110) {
          ctx.globalAlpha = (1 - d / 110) * .05;
          ctx.strokeStyle = '#63d7ff';
          ctx.lineWidth = .5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
})();


/* ── NAVBAR SCROLL EFFECT ─────────────── */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


/* ── SMOOTH NAV SCROLL — professional transition ──
   No page flash. Instant section switch like
   Amazon/Flipkart: smooth ease-in-out, navbar
   stays fixed and visible throughout.
─────────────────────────────────────────────── */
(function () {
  // Intercept ALL anchor clicks that point to #section
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href');
    if (!id || id === '#') return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    // Close mobile menu if open
    closeMobileMenu();

    // Smooth scroll — native, but with a custom duration via JS
    const start    = window.scrollY;
    const end      = target.getBoundingClientRect().top + window.scrollY - 70; // 70 = nav height offset
    const distance = end - start;
    const duration = Math.min(Math.max(Math.abs(distance) * 0.5, 400), 900); // 400–900ms
    let startTime  = null;

    function easeInOutCubic(t) {
      return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
})();


/* ── HAMBURGER / MOBILE MENU ─────────── */
let menuOpen = false;

function closeMobileMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  const btn = document.getElementById('hamburger');
  const ov  = document.getElementById('mobileOverlay');
  if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
  if (ov)  { ov.classList.remove('open');  ov.setAttribute('aria-hidden','true'); }
  document.body.style.overflow = '';
}

(function () {
  const btn  = document.getElementById('hamburger');
  const ov   = document.getElementById('mobileOverlay');
  const cls  = document.getElementById('mobClose');
  if (!btn || !ov) return;

  btn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    btn.classList.toggle('open', menuOpen);
    ov.classList.toggle('open',  menuOpen);
    btn.setAttribute('aria-expanded', String(menuOpen));
    ov.setAttribute('aria-hidden',    String(!menuOpen));
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });

  if (cls) cls.addEventListener('click', closeMobileMenu);

  // mob-links close the menu (smooth scroll handled by the global listener above)
  ov.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMobileMenu));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
})();


/* ── TYPEWRITER ──────────────────────── */
(function () {
  const el = document.getElementById('typed-role');
  if (!el) return;
  const phrases = ['Game Developer','UX Designer','C++ Engineer','Unity Creator','Backend Developer','Creative Technologist'];
  let pi = 0, ci = 0, del = false;

  function type() {
    const w = phrases[pi];
    el.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
    if (!del && ci === w.length) { del = true; setTimeout(type, 1800); return; }
    if (del  && ci === 0)       { del = false; pi = (pi+1) % phrases.length; }
    setTimeout(type, del ? 48 : 90);
  }
  type();
})();


/* ── SCROLL REVEAL ───────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  els.forEach(el => obs.observe(el));
})();


/* ── STAT COUNTERS ───────────────────── */
(function () {
  const row = document.querySelector('.hero-stats');
  if (!row) return;
  function count(el, target, suffix) {
    let c = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const t = setInterval(() => {
      c = Math.min(c + step, target);
      el.textContent = c + suffix;
      if (c >= target) clearInterval(t);
    }, 40);
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-num').forEach(n =>
          count(n, parseInt(n.dataset.target), n.dataset.suffix || ''));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  obs.observe(row);
})();


/* ── SKILL CARD SPOTLIGHT ─────────────── */
(function () {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });
  });
})();


/* ── PROFILE CARD TILT ───────────────── */
(function () {
  const card = document.getElementById('profileCard');
  if (!card) return;
  document.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    if (r.width === 0) return;
    const dx = (e.clientX - (r.left + r.width/2))  / (window.innerWidth/2);
    const dy = (e.clientY - (r.top  + r.height/2)) / (window.innerHeight/2);
    card.style.transform = `perspective(1000px) rotateY(${dx*7}deg) rotateX(${-dy*7}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
})();


/* ── CONTACT FORM ────────────────────── */
(function () {
  const form = document.getElementById('contact-form');
  const fb   = document.getElementById('form-feedback');
  if (!form || !fb) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFormLocked(true);
    Swal.fire({
      title: 'Sending...',
      text: 'Please wait a moment',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      background: '#080d16',
      color: '#d0dcea'
    });

    const data = {
      name: document.getElementById('fc-name').value,
      email: document.getElementById('fc-email').value,
      message: document.getElementById('fc-message').value
    };

    try {
      const response = await fetch('https://portfolio-yg2a.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: result.message || 'Thanks for reaching out. I will reply soon.',
        background: '#080d16',
        color: '#d0dcea',
        confirmButtonColor: '#63d7ff'
      });
      form.reset();
      fb.textContent = '';
    } catch (error) {
      console.error('Form submit error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Delivery Failed',
        text: 'Could not send message. Please email me directly at abhishekthakur99050@gmail.com',
        background: '#080d16',
        color: '#d0dcea',
        confirmButtonColor: '#63d7ff'
      });
      fb.textContent = 'Server error – please try again later';
    } finally {
      setFormLocked(false);
    }
  });
})();
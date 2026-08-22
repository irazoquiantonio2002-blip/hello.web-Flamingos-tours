// ══════════════════════════════════════════════════════
// FLAMINGOS TOURS — main.js
// ══════════════════════════════════════════════════════

// TODO: reemplaza con el número real de WhatsApp de Flamingos Tours (con lada país, sin + ni espacios)
const WHATSAPP_NUMBER = '529860000000';
// TODO: reemplaza con el usuario real de Instagram (sin @)
const INSTAGRAM_HANDLE = 'flamingostours';

document.addEventListener('DOMContentLoaded', () => {
  wireWhatsAppLinks();
  wireInstagramLinks();
  initLoader();
  initNavbar();
  initHamburger();
  initReveal();
  initMarquee();
  initHeroCanvas();
  initScrollCue();
  initContactForm();
  initYear();
});

// ── WhatsApp / Instagram link wiring ─────────────────────
function wireWhatsAppLinks() {
  document.querySelectorAll('.js-wa').forEach((el) => {
    const text = el.getAttribute('data-wa-text') || '';
    el.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`);
  });
}

function wireInstagramLinks() {
  document.querySelectorAll('.js-ig').forEach((el) => {
    el.setAttribute('href', `https://instagram.com/${INSTAGRAM_HANDLE}`);
  });
}

// ── Loader ────────────────────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.querySelector('.loader-bar-fill');
  if (!loader) return;

  let progress = 0;
  const tick = setInterval(() => {
    progress = Math.min(progress + Math.random() * 22, 92);
    if (fill) fill.style.width = `${progress}%`;
  }, 160);

  window.addEventListener('load', () => {
    clearInterval(tick);
    if (fill) fill.style.width = '100%';
    setTimeout(() => loader.classList.add('loaded'), 280);
  });

  // Safety net in case 'load' already fired or takes too long
  setTimeout(() => {
    clearInterval(tick);
    if (fill) fill.style.width = '100%';
    loader.classList.add('loaded');
  }, 4000);
}

// ── Navbar scroll state ──────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Hamburger / mobile menu ──────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mob-menu');
  if (!btn || !menu) return;

  const closeMenu = () => {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
}

// ── Scroll reveal (IntersectionObserver) ─────────────────
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

// ── Marquee content ───────────────────────────────────────
function initMarquee() {
  const track = document.getElementById('marquee');
  if (!track) return;

  const items = [
    'Flamencos Rosados',
    'Manglares',
    'Zona de Cocodrilos',
    'Laguna Rosa · Las Coloradas',
    'Cenotes de Chiquilá y Petén Mac',
    'Playa Virgen',
    'Tour Privado en Lancha',
    'Turismo de Conservación',
  ];

  const renderSet = () =>
    items
      .map((label) => `<span><i class="fa-solid fa-water"></i>${label}</span>`)
      .join('');

  // Duplicate the set so the CSS -50% translateX loop is seamless
  track.innerHTML = renderSet() + renderSet();
}

// ── Hero canvas particles ────────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, orbs;
  const colors = ['rgba(243,97,125,0.5)', 'rgba(155,207,71,0.4)', 'rgba(255,180,196,0.35)'];

  function resize() {
    width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  }

  function makeOrbs() {
    const count = Math.max(14, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 90000));
    orbs = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 2 + 1) * window.devicePixelRatio,
      vy: (Math.random() * 0.3 + 0.08) * window.devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.15 * window.devicePixelRatio,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    orbs.forEach((o) => {
      o.y -= o.vy;
      o.x += o.vx;
      if (o.y < -10) o.y = height + 10;
      if (o.x < -10) o.x = width + 10;
      if (o.x > width + 10) o.x = -10;

      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = o.color;
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  makeOrbs();
  draw();

  window.addEventListener('resize', () => {
    resize();
    makeOrbs();
    if (reduceMotion) draw();
  });
}

// ── Scroll cue fade-out ───────────────────────────────────
function initScrollCue() {
  const cue = document.querySelector('.scroll-cue');
  if (!cue) return;
  window.addEventListener(
    'scroll',
    () => {
      cue.style.opacity = window.scrollY > 80 ? '0' : '1';
    },
    { passive: true }
  );
}

// ── Contact form → WhatsApp ──────────────────────────────
function initContactForm() {
  const form = document.getElementById('wa-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('f-name').value.trim();
    const interest = document.getElementById('f-interest').value;
    const msg = document.getElementById('f-msg').value.trim();

    const lines = [
      'Hola, quiero reservar un tour con Flamingos Tours.',
      `Nombre: ${name}`,
      `Tour de interés: ${interest}`,
      `Detalles: ${msg}`,
    ];

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

// ── Footer year ───────────────────────────────────────────
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

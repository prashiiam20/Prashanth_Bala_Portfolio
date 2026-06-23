/* ============================================================
   PRASHANTH BALA PORTFOLIO — JavaScript
   Typewriter | Scroll Reveal | Particles | Nav | Counters
   ============================================================ */

'use strict';

// ─── TYPEWRITER EFFECT ───────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter-el');
  if (!el) return;

  const phrases = [
    'Software Engineer',
    'Full-Stack Developer',
    'Blockchain Developer',
    'React.js Enthusiast',
    'MCA Graduate @ CBIT'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    el.textContent = current.substring(0, charIndex);

    let delay = isDeleting ? 55 : 90;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isPaused = true;
      setTimeout(() => {
        isDeleting = true;
        isPaused = false;
        setTimeout(type, 55);
      }, delay);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1200);
})();

// ─── PARTICLE SYSTEM ────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const colors = [
    'rgba(255, 133, 102, 0.3)',
    'rgba(43, 43, 43, 0.2)',
    'rgba(100, 116, 139, 0.3)'
  ];

  const PARTICLE_COUNT = 20;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    createParticle(container, colors, i * (6000 / PARTICLE_COUNT));
  }

  function createParticle(parent, colorList, delay) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    const leftPct = Math.random() * 100;
    const duration = Math.random() * 12 + 10;
    const color = colorList[Math.floor(Math.random() * colorList.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${leftPct}%;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}ms;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    parent.appendChild(p);

    p.addEventListener('animationend', () => {
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 12 + 10}s`;
      p.style.animationDelay = '0ms';
    });
  }
})();

// ─── NAVBAR SCROLL EFFECT ────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ─── HAMBURGER MENU ──────────────────────────────────────────
(function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ─── SCROLL REVEAL ───────────────────────────────────────────
(function initScrollReveal() {
  const selectors = ['.reveal', '.reveal-left', '.reveal-right'];
  const elements = document.querySelectorAll(selectors.join(', '));

  if (!elements.length) return;

  // Stagger delay for grouped elements
  const staggerParents = [
    '#skills-grid',
    '#projects-grid',
    '#certs-grid',
    '#achievements-grid',
    '#education-timeline',
    '.contact-links-wrap'
  ];

  staggerParents.forEach(sel => {
    const parent = document.querySelector(sel);
    if (!parent) return;
    const children = parent.querySelectorAll('.reveal, .reveal-left, .reveal-right, .timeline-item');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));

  // Also observe timeline items
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.classList.add('reveal');
    observer.observe(item);
  });
})();

// ─── SHINY CARD HOVER EFFECT ─────────────────────────────────
(function initCardShine() {
  const cards = document.querySelectorAll('.stat-card, .skill-category, .project-card, .cert-card, .achievement-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
})();

// ─── ANIMATED COUNTERS ────────────────────────────────────────
(function initCounters() {
  const statCards = document.querySelectorAll('.stat-card');
  if (!statCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target.querySelector('.stat-number');
      if (!el || el.dataset.animated) return;

      el.dataset.animated = 'true';
      const raw = el.textContent.trim();
      const hasPlus = raw.includes('+');
      const numStr = raw.replace(/[^0-9.]/g, '');
      const target = parseFloat(numStr);
      const isDecimal = numStr.includes('.');
      const duration = 1800;
      const startTime = performance.now();

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = (isDecimal ? current.toFixed(2) : Math.floor(current)) + (hasPlus ? '+' : '');
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => observer.observe(card));
})();

// ─── SMOOTH ACTIVE NAV HIGHLIGHTING ──────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          link.style.color = 'var(--color-accent)';
        } else {
          link.style.color = '';
        }
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

// ─── SCROLL INDICATOR HIDE ────────────────────────────────────
(function initScrollIndicator() {
  const indicator = document.getElementById('scroll-indicator');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      indicator.style.opacity = '0';
      indicator.style.pointerEvents = 'none';
    } else {
      indicator.style.opacity = '1';
      indicator.style.pointerEvents = 'auto';
    }
  }, { passive: true });
})();

// ─── CURSOR GLOW EFFECT (desktop only) ───────────────────────
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,133,102,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(updateGlow);
    }
  });

  function updateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    rafId = requestAnimationFrame(updateGlow);
  }

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });
})();

// ─── PROJECT CARD TILT ───────────────────────────────────────
(function initTiltEffect() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 6;
      const tiltY = ((cx - x) / cx) * 6;
      card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

console.log('%c👋 Hey there, developer! Prashanth Bala\'s portfolio is open source!', 'color: #ff8566; font-size: 14px; font-weight: bold; padding: 8px 0;');

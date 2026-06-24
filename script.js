/* ============================================================
   HIGH-LEVEL SCROLL ANIMATIONS — injected first
   ============================================================ */

// ─── 1. SCROLL PROGRESS BAR ───────────────────────────────────
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress-bar';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(scrollTop / docHeight) * 100}%`;
  }, { passive: true });
})();

// ─── 2. SIDE SCROLL SPY DOTS ──────────────────────────────────
(function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!sections.length) return;

  const spy = document.createElement('nav');
  spy.id = 'scroll-spy';
  spy.setAttribute('aria-label', 'Page sections');

  const dots = sections.map(section => {
    const dot = document.createElement('a');
    dot.classList.add('spy-dot');
    dot.href = `#${section.id}`;
    dot.setAttribute('data-label', section.querySelector('h2')?.textContent.trim() || section.id);
    dot.setAttribute('aria-label', section.id);
    dot.addEventListener('click', e => {
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth' });
    });
    spy.appendChild(dot);
    return { dot, section };
  });

  document.body.appendChild(spy);

  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const match = dots.find(d => d.section === entry.target);
      if (match) match.dot.classList.toggle('active', entry.isIntersecting);
    });
  }, { threshold: 0.4 });

  sections.forEach(s => spyObserver.observe(s));
})();

// ─── 3. SECTION IN-VIEW (glow separator + label) ──────────────
(function initSectionInView() {
  const sections = document.querySelectorAll('.section');
  const labels = document.querySelectorAll('.section-label');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(s => obs.observe(s));

  const labelObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('label-visible');
        labelObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  labels.forEach(l => labelObs.observe(l));
})();

// ─── 4. SPLIT-WORD SECTION TITLE ANIMATION ────────────────────
(function initSplitTitles() {
  const titles = document.querySelectorAll('.section-title');

  titles.forEach(title => {
    const words = title.textContent.trim().split(' ');
    title.textContent = '';
    title.style.overflow = 'visible';

    words.forEach((word, i) => {
      const wrapper = document.createElement('span');
      wrapper.classList.add('split-word');

      const inner = document.createElement('span');
      inner.classList.add('split-word-inner');
      inner.textContent = word;
      inner.style.transitionDelay = `${i * 120}ms`;

      wrapper.appendChild(inner);
      title.appendChild(wrapper);

      if (i < words.length - 1) {
        title.appendChild(document.createTextNode('\u00a0'));
      }
    });

    const titleObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          title.querySelectorAll('.split-word-inner').forEach(inner => {
            inner.classList.add('word-visible');
          });
          titleObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    titleObs.observe(title);
  });
})();

// ─── 5. PARALLAX HERO ─────────────────────────────────────────
(function initParallax() {
  const hero = document.querySelector('.hero-content');
  const heroBadge = document.querySelector('.hero-badge');
  if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    lastY = window.scrollY;
    requestAnimationFrame(() => {
      hero.style.transform = `translateY(${lastY * 0.15}px)`;
      if (heroBadge) heroBadge.style.transform = `translateY(${lastY * 0.08}px)`;
    });
  }, { passive: true });
})();

// ─── 6. STAGGERED GRID CARD WIPE-IN ───────────────────────────
(function initStaggeredGrids() {
  const grids = document.querySelectorAll('#skills-grid, #projects-grid, #certs-grid, #achievements-grid, .contact-links-wrap');

  grids.forEach(grid => {
    const items = Array.from(grid.children);
    items.forEach((item, i) => {
      item.classList.add('stagger-item');
      item.style.transitionDelay = `${i * 90}ms`;
    });

    const gridObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stagger-item').forEach(item => {
            item.classList.add('stagger-visible');
          });
          gridObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    gridObs.observe(grid);
  });
})();

/* ============================================================
   PRASHANTH BALA PORTFOLIO — JavaScript
   Matrix Rain | Particles | Typewriter | Reveal | Cards
   ============================================================ */

'use strict';

// ─── MATRIX RAIN EFFECT ───────────────────────────────────────
(function initMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*><{}[]ΩΨΦΛΔπ∑∫≠≤≥±∞';
  const fontSize = 13;
  let columns, drops;

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px JetBrains Mono, monospace`;

    for (let i = 0; i < columns; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Lead character is brighter
      const alpha = Math.random() > 0.95 ? 1 : Math.random() * 0.4 + 0.1;
      ctx.fillStyle = `rgba(255, 133, 102, ${alpha})`;
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  const interval = setInterval(draw, 60);

  // Stop animation when hero is out of view
  const heroObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) clearInterval(interval);
  });
  heroObserver.observe(hero);
})();

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

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) charIndex--;
    else charIndex++;
    el.textContent = current.substring(0, charIndex);

    let delay = isDeleting ? 50 : 85;

    if (!isDeleting && charIndex === current.length) {
      setTimeout(() => {
        isDeleting = true;
        setTimeout(type, 55);
      }, 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1000);
})();

// ─── ENHANCED PARTICLE SYSTEM ────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const PARTICLE_COUNT = 25;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1.5;
    const leftPct = Math.random() * 100;
    const duration = Math.random() * 15 + 12;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${leftPct}%;
      animation-duration: ${duration}s;
      animation-delay: ${i * (duration * 1000 / PARTICLE_COUNT)}ms;
    `;
    container.appendChild(p);

    p.addEventListener('animationend', () => {
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = '0ms';
    });
  }
})();

// ─── NAVBAR SCROLL EFFECT ────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

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

  const staggerParents = [
    '#skills-grid', '#projects-grid', '#certs-grid',
    '#achievements-grid', '#education-timeline', '.contact-links-wrap'
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
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(el => observer.observe(el));

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
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
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
        const progress = Math.min((now - startTime) / duration, 1);
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

// ─── ACTIVE NAV HIGHLIGHT ────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--color-accent)' : '';
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
    indicator.style.opacity = window.scrollY > 80 ? '0' : '1';
    indicator.style.pointerEvents = window.scrollY > 80 ? 'none' : 'auto';
  }, { passive: true });
})();

// ─── CURSOR GLOW (desktop only) ───────────────────────────────
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(updateGlow);
  }
  updateGlow();

  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  document.addEventListener('mouseenter', () => glow.style.opacity = '1');
})();

// ─── PROJECT CARD TILT ───────────────────────────────────────
(function initTiltEffect() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 5;
      const tiltY = ((cx - x) / cx) * 5;
      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'var(--transition)';
    });
  });
})();

// ─── ANIMATE SECTION BORDERS ─────────────────────────────────
(function initSectionGlow() {
  // Add a subtle glowing line at the top of each section on scroll-in
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--section-visible', '1');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(s => observer.observe(s));
})();

console.log('%c// Prashanth Bala — Portfolio', 'color: #ff8566; font-family: JetBrains Mono, monospace; font-size: 14px; font-weight: bold;');
console.log('%c// Full-Stack • Blockchain • MCA @ CBIT', 'color: #8e8e9a; font-family: JetBrains Mono, monospace; font-size: 12px;');

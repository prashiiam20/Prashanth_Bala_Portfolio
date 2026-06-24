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

// ─── MAGNETIC CURSOR & BUTTONS ────────────────────────────────
(function initMagneticCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows exactly
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Ring follows with a slight delay (lerp)
  function renderRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover states for links and buttons
  const interactables = document.querySelectorAll('a, button, input, .project-card, .term-btn');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });

  // Magnetic Pull for .magnetic-btn
  const magnetBtns = document.querySelectorAll('.magnetic-btn');
  magnetBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Pull button towards cursor
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
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

// ─── PROJECT FILTERING (VIEW TRANSITIONS API) ─────────────────
(function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Update DOM inside startViewTransition for smooth morphing
      if (document.startViewTransition) {
        document.startViewTransition(() => updateCards(filterValue));
      } else {
        updateCards(filterValue);
      }
    });
  });

  function updateCards(filter) {
    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
})();

// ─── INTERACTIVE TERMINAL ─────────────────────────────────────
(function initTerminal() {
  const input = document.getElementById('term-input');
  const outputArea = document.querySelector('.term-output');
  if (!input || !outputArea) return;

  const commands = {
    'help': `<p>Available commands: <br>
      <span class="term-cmd">whoami</span> - Display quick bio<br>
      <span class="term-cmd">skills</span> - List primary skills<br>
      <span class="term-cmd">clear</span> - Clear the terminal output</p>`,
    'whoami': `<p>I'm a <strong>recent MCA graduate</strong> from CBIT, Hyderabad with a CGPA of <strong>8.70</strong>.</p>
               <p>My journey spans Full-Stack Web Development, Blockchain Engineering, and Database Security.</p>`,
    'skills': `<p><strong>Core:</strong> Python, Java, JavaScript, React.js, Node.js, SQL</p>
               <p><strong>DB & Security:</strong> PostgreSQL, MySQL, RBAC, Stored Procedures</p>`,
    'clear': ''
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase();
      if (!val) return;

      if (val === 'clear') {
        outputArea.innerHTML = '';
      } else {
        // Echo command
        const echo = document.createElement('div');
        echo.className = 'term-line';
        echo.innerHTML = `<span class="term-prompt">prashanth@portfolio:~$</span><span class="term-cmd">${val}</span>`;
        outputArea.appendChild(echo);

        // Echo response
        const response = document.createElement('div');
        response.innerHTML = commands[val] || `<p>Command not found: ${val}. Type 'help' for a list of commands.</p>`;
        outputArea.appendChild(response);
      }
      
      input.value = '';
      const body = document.getElementById('terminal-body');
      body.scrollTop = body.scrollHeight; // Auto-scroll
      if (window.playClickSound) window.playClickSound();
    }
  });
})();

// ─── HIGH-TECH SYNTHESIZED SOUNDS ─────────────────────────────
(function initSounds() {
  const toggleBtn = document.getElementById('sound-toggle');
  if (!toggleBtn) return;

  let audioCtx = null;
  let soundEnabled = false;

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    toggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
    
    // Initialize AudioContext on first user gesture
    if (soundEnabled && !audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (soundEnabled && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  });

  // Short, muted sine wave for hovering
  window.playHoverSound = function() {
    if (!soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  // Sharp, high-pitched pop for clicking
  window.playClickSound = function() {
    if (!soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  };

  // Attach to UI
  document.querySelectorAll('a, button, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => window.playHoverSound());
    el.addEventListener('click', () => window.playClickSound());
  });
})();

// ─── INTERACTIVE 3D HERO (THREE.JS) ───────────────────────────
(function initThreeJSHero() {
  if (typeof THREE === 'undefined') return;
  const container = document.getElementById('hero-3d-canvas');
  if (!container) return;

  const scene = new THREE.Scene();
  // Adjust camera to fit the right side of the hero
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Create a high-tech glowing wireframe sphere (represents a node/globe)
  const geometry = new THREE.IcosahedronGeometry(2, 2);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0xff8566, // Peach accent
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Position it slightly to the right so it doesn't block text
  sphere.position.x = window.innerWidth > 768 ? 2 : 0;
  sphere.position.y = window.innerWidth > 768 ? 0 : 1;

  // Track mouse for 3D parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX);
    mouseY = (e.clientY - windowHalfY);
  });

  function animate() {
    requestAnimationFrame(animate);

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Smoothly interpolate rotation towards target
    sphere.rotation.y += 0.005 + (targetX - sphere.rotation.y) * 0.05;
    sphere.rotation.x += 0.002 + (targetY - sphere.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }
  
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sphere.position.x = window.innerWidth > 768 ? 2 : 0;
    sphere.position.y = window.innerWidth > 768 ? 0 : 1;
  });
})();

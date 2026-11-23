/* ============================================================
   index.js — Portfolio Interactivity for Reggie Niño Zafra Pelesores
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. PRELOADER ───────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  let progress = 0;

  const fillInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(fillInterval);
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 300);
    }
    preloaderFill.style.width = progress + '%';
  }, 80);


  // ─── 2. CUSTOM CURSOR ───────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();


  // ─── 3. NAVBAR ──────────────────────────────────────────────
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    backToTop.classList.toggle('show', window.scrollY > 400);

    // Active nav link on scroll
    highlightActiveNav();
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navLinkItems.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinkItems.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }


  // ─── 4. TYPED TEXT HERO ─────────────────────────────────────
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'My Favorite Person',
    'The Prettiest Girl Alive',
    'Reggie\'s Girlfriend 💕',
    'Kilig Overload',
    'Forever & Always'
  ];
  let pIndex = 0, cIndex = 0, isDeleting = false;

  function type() {
    const phrase = phrases[pIndex];
    if (!isDeleting) {
      typedEl.textContent = phrase.slice(0, cIndex + 1);
      cIndex++;
      if (cIndex === phrase.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = phrase.slice(0, cIndex - 1);
      cIndex--;
      if (cIndex === 0) {
        isDeleting = false;
        pIndex = (pIndex + 1) % phrases.length;
      }
    }
    setTimeout(type, isDeleting ? 50 : 90);
  }
  setTimeout(type, 1200);


  // ─── 5. COUNT-UP STATS ──────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');
  let statsTriggered = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-count'));
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 40);
  }

  function checkStats() {
    if (statsTriggered) return;
    const hero = document.getElementById('home');
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      statsTriggered = true;
      statNums.forEach(el => countUp(el));
    }
  }
  window.addEventListener('scroll', checkStats);
  setTimeout(checkStats, 1500);


  // ─── 6. SCROLL REVEAL ───────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.classList.contains('delay-1') ? 100
          : entry.target.classList.contains('delay-2') ? 200
          : entry.target.classList.contains('delay-3') ? 300
          : entry.target.classList.contains('delay-4') ? 400
          : entry.target.classList.contains('delay-5') ? 500
          : 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay + 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ─── 7. SKILL BARS ──────────────────────────────────────────
  function animateSkillBars(panel) {
    const bars = panel.querySelectorAll('.skill-fill');
    bars.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      }, i * 100);
    });
  }

  // Trigger bars for active panel initially
  const initialPanel = document.querySelector('.skills-panel.active');
  if (initialPanel) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBars(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(initialPanel);
  }


  // ─── 8. SKILLS TABS ─────────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.skills-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');

      // Update buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panels
      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === `tab-${tabId}`) {
          p.classList.add('active');

          // Animate bars on switch + re-trigger reveal
          const reveals = p.querySelectorAll('.reveal-up');
          reveals.forEach((r, i) => {
            r.classList.remove('revealed');
            setTimeout(() => r.classList.add('revealed'), i * 80 + 50);
          });

          setTimeout(() => animateSkillBars(p), 100);
        }
      });
    });
  });


  // ─── 9. CONTACT FORM ────────────────────────────────────────
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    const btnText = btn.querySelector('.btn-text');

    // Loading state
    btnText.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btnText.textContent = 'Send Message';
      btn.disabled = false;
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }, 1800);
  });


  // ─── 10. BACK TO TOP ────────────────────────────────────────
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ─── 11. SMOOTH SCROLL for anchor links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ─── 12. SKILL CARDS TILT ───────────────────────────────────
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 6;
      const tiltY = -(x / rect.width) * 6;
      card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ─── 13. PROJECT CARDS TILT ─────────────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 4;
      const tiltY = -(x / rect.width) * 4;
      card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ─── 14. PARALLAX HERO SHAPES ───────────────────────────────
  window.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    shapes.forEach((shape, i) => {
      const factor = (i + 1) * 8;
      shape.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });


  // ─── 15. HERO GRID MOUSE EFFECT ─────────────────────────────
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      heroGrid.style.backgroundPosition = `${e.clientX * 0.02}px ${e.clientY * 0.02}px`;
    });
  }


  // ─── 16. SECTION PROGRESS INDICATOR ────────────────────────
  function createProgressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
      background: linear-gradient(90deg, #e11d74, #fb7185);
      width: 0%; transition: width 0.1s ease;
      pointer-events: none;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      bar.style.width = progress + '%';
    });
  }
  createProgressBar();


  // ─── 17. ACTIVE SECTION HIGHLIGHT ───────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));


  // ─── 18. DYNAMIC YEAR IN FOOTER ─────────────────────────────
  const yearEls = document.querySelectorAll('.footer-text');
  yearEls.forEach(el => {
    el.innerHTML = el.innerHTML.replace('2024', new Date().getFullYear());
  });



  // ─── 19. BACKGROUND MUSIC ───────────────────────────────────
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const MUSIC_VOLUME = 0.35;
  let userMuted = false;
  try { userMuted = localStorage.getItem('musicMuted') === '1'; } catch (e) {}

  bgMusic.volume = 0;

  function fadeTo(target, ms = 1200) {
    const start = bgMusic.volume;
    const t0 = performance.now();
    (function tick(now) {
      const k = Math.min((now - t0) / ms, 1);
      bgMusic.volume = start + (target - start) * k;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function setMusicUI(on) {
    musicToggle.classList.toggle('playing', on);
    musicToggle.setAttribute('aria-pressed', String(on));
  }

  function playMusic() {
    return bgMusic.play().then(() => {
      fadeTo(MUSIC_VOLUME);
      setMusicUI(true);
      removeUnlockListeners();
    });
  }

  function pauseMusic() {
    fadeTo(0, 500);
    setTimeout(() => bgMusic.pause(), 500);
    setMusicUI(false);
  }

  // Browsers block sound until the visitor interacts, so start on first click/tap/key
  const unlockEvents = ['pointerdown', 'keydown', 'touchend'];
  function unlock() { if (!userMuted) playMusic().catch(() => {}); }
  function removeUnlockListeners() {
    unlockEvents.forEach(ev => document.removeEventListener(ev, unlock));
  }

  if (!userMuted) {
    // Try autoplay first (works if the browser allows it)
    playMusic().catch(() => {
      unlockEvents.forEach(ev => document.addEventListener(ev, unlock));
    });
  }

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      userMuted = false;
      playMusic().catch(() => {});
    } else {
      userMuted = true;
      pauseMusic();
    }
    try { localStorage.setItem('musicMuted', userMuted ? '1' : '0'); } catch (err) {}
  });

  // Pause when the tab is hidden, resume when back
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) bgMusic.pause();
    else if (!userMuted && bgMusic.volume > 0) bgMusic.play().catch(() => {});
  });

}); // end DOMContentLoaded

/* ============================================================
   GIRLFRIEND EDITION — edit this block, then drop her photos
   into the /images folder as gf1.jpg … gf6.jpg
   ============================================================ */
const GF = {
  name: 'My Girlfriend',        // ← her name
  since: '2023-01-22',          // ← your anniversary (YYYY-MM-DD)
  photos: [
    { src: 'images/Girlfriend.png', cap: 'My favorite person' },
    { src: 'images/Image1.png', cap: 'Mine 💕' },
    { src: 'images/Image2.png', cap: 'Pretty as always' },
    { src: 'images/Image3.png', cap: 'Kilig overload' },
    { src: 'images/Image4.png', cap: 'Forever & always' },
    { src: 'images/Image5.png', cap: 'Best thing that happened to me' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);

  // Time-based greeting + live clock
  function greeting(h) {
    if (h >= 5 && h < 12) return 'Goodmorning';
    if (h === 12) return 'Goodnoon';
    if (h > 12 && h < 18) return 'Goodafternoon';
    return 'Goodevening';
  }
  function tick() {
    const n = new Date();
    $('greetWord').textContent = greeting(n.getHours());
    $('clockTime').textContent = n.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    $('clockDate').textContent = n.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
  tick();
  setInterval(tick, 1000);

  // Stats + her name
  const days = Math.max(1, Math.floor((Date.now() - new Date(GF.since)) / 864e5));
  $('statDays').setAttribute('data-count', days);
  $('statPhotos').setAttribute('data-count', GF.photos.length);
  $('gfNameHero').textContent = GF.name.toLowerCase();

  // Preload photos, keep only the ones that exist
  const found = new Array(GF.photos.length);
  let pending = GF.photos.length;
  GF.photos.forEach((p, i) => {
    const im = new Image();
    im.onload = () => { found[i] = p; if (!--pending) build(found.filter(Boolean)); };
    im.onerror = () => { if (!--pending) build(found.filter(Boolean)); };
    im.src = p.src;
  });

  function build(list) {
    const grid = $('galleryGrid');
    if (!list.length) {
      grid.innerHTML = '<div class="gallery-empty">📸 Put her photos in the <b>images</b> folder as gf1.jpg, gf2.jpg … and refresh.</div>';
      return;
    }

    // Fullscreen slideshow background
    const bg = $('gfBg');
    const slides = list.map(p => {
      const s = document.createElement('div');
      s.className = 'slide';
      s.style.backgroundImage = `url("${p.src}")`;
      bg.appendChild(s);
      return s;
    });
    let cur = 0;
    slides[0].classList.add('on');
    if (slides.length > 1) setInterval(() => {
      slides[cur].classList.remove('on');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('on');
    }, 6000);
    buildFrame(list);

    // Gallery grid + lightbox
    const lb = $('lightbox'), lbImg = lb.querySelector('img');
    list.forEach(p => {
      const f = document.createElement('figure');
      f.className = 'g-item';
      f.innerHTML = `<img src="${p.src}" alt="${GF.name}" loading="lazy" /><figcaption>${p.cap}</figcaption>`;
      f.addEventListener('click', () => { lbImg.src = p.src; lb.classList.add('open'); });
      grid.appendChild(f);
    });
    const close = () => lb.classList.remove('open');
    lb.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // Live "together since" counter
  const pad = n => String(n).padStart(2, '0');
  const sinceD = new Date(GF.since + 'T00:00:00');
  $('sinceDate').textContent = sinceD.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  function loveTick() {
    const n = new Date();
    let y = n.getFullYear() - sinceD.getFullYear();
    let m = n.getMonth() - sinceD.getMonth();
    let d = n.getDate() - sinceD.getDate();
    if (d < 0) { m--; d += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    $('loveCounter').textContent = `${y} yrs · ${m} mos · ${d} days · ${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
  }
  loveTick();
  setInterval(loveTick, 1000);

  // 3D tilt + glare on the hero frame
  const frame = $('tiltFrame');
  const wrap = frame.parentElement;
  wrap.addEventListener('mousemove', e => {
    const r = frame.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    frame.style.transform = `rotateY(${(px - 0.5) * 18}deg) rotateX(${(0.5 - py) * 18}deg) scale(1.03)`;
    frame.style.setProperty('--gx', px * 100 + '%');
    frame.style.setProperty('--gy', py * 100 + '%');
  });
  wrap.addEventListener('mouseleave', () => { frame.style.transform = ''; });

  // Heart burst on click
  function burst(x, y) {
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      s.className = 'burst';
      s.textContent = ['💗', '💖', '💕', '❤️'][i % 4];
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.fontSize = 16 + Math.random() * 16 + 'px';
      const a = Math.random() * Math.PI * 2, dist = 70 + Math.random() * 90;
      s.style.setProperty('--dx', Math.cos(a) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(a) * dist - 40 + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }

  // Photo carousel inside the frame
  function buildFrame(list) {
    $('frameEmpty').style.display = 'none';
    const box = $('frameSlides'), dots = $('frameDots');
    const slides = list.map((p, i) => {
      const s = document.createElement('div');
      s.className = 'fs';
      s.style.backgroundImage = `url("${p.src}")`;
      box.appendChild(s);
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Photo ' + (i + 1));
      b.addEventListener('click', e => { e.stopPropagation(); go(i); });
      dots.appendChild(b);
      return s;
    });
    const dotEls = dots.querySelectorAll('button');
    let idx = 0, timer;
    function go(i) {
      slides[idx].classList.remove('on'); dotEls[idx].classList.remove('on');
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add('on'); dotEls[idx].classList.add('on');
      clearInterval(timer);
      if (slides.length > 1) timer = setInterval(() => go(idx + 1), 4500);
    }
    go(0);
    frame.addEventListener('click', e => { burst(e.clientX, e.clientY); go(idx + 1); });
  }
  frame.addEventListener('click', e => { if (!$('frameSlides').children.length) burst(e.clientX, e.clientY); });

  // Copy email button
  const copyBtn = $('copyEmail');
  copyBtn.addEventListener('click', () => {
    const mail = 'reggieninozafrapelesores@gmail.com';
    (navigator.clipboard ? navigator.clipboard.writeText(mail) : Promise.reject()).then(() => {
      copyBtn.classList.add('done');
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => { copyBtn.classList.remove('done'); copyBtn.innerHTML = '<i class="far fa-copy"></i>'; }, 1800);
    }).catch(() => { window.location.href = 'mailto:' + mail; });
  });

  // Floating hearts
  setInterval(() => {
    if (document.hidden) return;
    const s = document.createElement('span');
    s.className = 'float-heart';
    s.textContent = ['💗', '💖', '💕', '🌸'][Math.floor(Math.random() * 4)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 14 + Math.random() * 18 + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 7000);
  }, 1200);
});
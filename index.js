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
    'IT Fresh Graduate',
    'Frontend Developer',
    'React Enthusiast',
    'Backend Learner',
    'Full-Stack Explorer',
    'Tech Builder'
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
      background: linear-gradient(90deg, #1a56db, #0ea5e9);
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

}); // end DOMContentLoaded
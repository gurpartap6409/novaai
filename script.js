/* ============================================================
   NovaAI — Interactive Scripts
   Particles, Scroll Reveal, Pricing Toggle, Stats Counter,
   Navbar, Newsletter, Smooth Scrolling, Micro-interactions
   ============================================================ */

(function () {
  'use strict';

  // ---- Particle Background ----
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrame;
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 190 : 268; // blue or purple
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction — gentle repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 0.8;
          this.y += (dy / dist) * force * 0.8;
        }
      }

      // Wrap around screen
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const opacity = (1 - dist / 140) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    animationFrame = requestAnimationFrame(animateParticles);
  }

  // Init particles
  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---- Mobile Toggle ----
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    mobileToggle.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      mobileToggle.classList.remove('active');
    });
  });

  // ---- Scroll Reveal ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Stats Counter Animation ----
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(num => {
      const target = parseInt(num.dataset.target);
      const duration = 2000;
      const start = performance.now();

      function updateCount(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        num.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      }

      requestAnimationFrame(updateCount);
    });
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats();
          statsObserver.unobserve(statsSection);
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // ---- Pricing Toggle ----
  const toggleSwitch = document.getElementById('toggle-switch');
  const toggleMonthly = document.getElementById('toggle-monthly');
  const toggleYearly = document.getElementById('toggle-yearly');
  const priceAmounts = document.querySelectorAll('.price-amount[data-monthly]');
  let isYearly = false;

  toggleMonthly.classList.add('active');

  toggleSwitch.addEventListener('click', () => {
    isYearly = !isYearly;
    toggleSwitch.classList.toggle('yearly', isYearly);
    toggleMonthly.classList.toggle('active', !isYearly);
    toggleYearly.classList.toggle('active', isYearly);

    priceAmounts.forEach(el => {
      const target = isYearly ? el.dataset.yearly : el.dataset.monthly;
      // Animate the price change
      el.style.transform = 'translateY(-10px)';
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = target;
        el.style.transform = 'translateY(10px)';
        setTimeout(() => {
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        }, 50);
      }, 150);
    });
  });

  // ---- Newsletter Form ----
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterSubmit = document.getElementById('newsletter-submit');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterEmail.value.trim();
    if (!email) return;

    // Simulate submission
    const originalHTML = newsletterSubmit.innerHTML;
    newsletterSubmit.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite">
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
      </svg>
      <span>Submitting...</span>
    `;
    newsletterSubmit.disabled = true;

    setTimeout(() => {
      newsletterSubmit.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>You're on the list!</span>
      `;
      newsletterSubmit.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
      newsletterEmail.value = '';

      setTimeout(() => {
        newsletterSubmit.innerHTML = originalHTML;
        newsletterSubmit.style.background = '';
        newsletterSubmit.disabled = false;
      }, 3000);
    }, 1500);
  });

  // ---- Smooth scroll for all anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Button Ripple Effect ----
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        top: ${e.clientY - rect.top - size / 2}px;
        left: ${e.clientX - rect.left - size / 2}px;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 0;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes rippleEffect {
      to { transform: scale(2.5); opacity: 0; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);

  // ---- Tilt Effect on Cards ----
  function addTiltEffect(cards) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  addTiltEffect(document.querySelectorAll('.feature-card'));
  addTiltEffect(document.querySelectorAll('.product-card'));
  addTiltEffect(document.querySelectorAll('.testimonial-card'));

  // ---- Magnetic Effect on CTA Buttons ----
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translateY(-2px) translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

})();

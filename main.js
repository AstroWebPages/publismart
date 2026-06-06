// =============================================
// PubliSmart — Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ── HAMBURGER ──
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      })
    );
  }

  // ── BACK TO TOP ──
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── ANIMATED COUNTERS ──
  function animateCount(el, target, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
      else { el.textContent = Math.floor(start).toLocaleString(); }
    }, 16);
  }

  const counters = document.querySelectorAll('.count');
  if (counters.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.animated) {
          e.target.dataset.animated = '1';
          animateCount(e.target, +e.target.dataset.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  // ── FADE UP ON SCROLL ──
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const fadeObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          fadeObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
      fadeObs.observe(el);
    });
  }

  // ── TESTIMONIAL SLIDER ──
  const track  = document.getElementById('testiTrack');
  const dots   = document.querySelectorAll('.dot');
  const prev   = document.getElementById('testiPrev');
  const next   = document.getElementById('testiNext');
  if (track) {
    let current = 0;
    const cards = track.querySelectorAll('.testi-card');
    const total = cards.length;
    let isMobile = window.innerWidth <= 768;

    function goTo(idx) {
      current = (idx + total) % total;
      const pct = isMobile ? current * 100 : current * 50;
      track.style.transform = `translateX(-${pct}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    window.addEventListener('resize', () => { isMobile = window.innerWidth <= 768; goTo(current); });
    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));

    setInterval(() => goTo(current + 1), 5000);
  }

  // ── PRODUCT FILTERS ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        productCards.forEach(card => {
          const match = cat === 'all' || card.dataset.cat === cat;
          card.style.display = match ? 'block' : 'none';
        });
      });
    });
  }

  // ── CONTACT FORM VALIDATION ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const fields = contactForm.querySelectorAll('[required]');
      fields.forEach(field => {
        const group = field.closest('.form-group');
        const empty = !field.value.trim();
        const emailBad = field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        if (empty || emailBad) { group.classList.add('error'); valid = false; }
        else { group.classList.remove('error'); }
      });
      if (valid) {
        contactForm.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }
    });
    contactForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => field.closest('.form-group').classList.remove('error'));
    });
  }

  // ── SMOOTH SCROLL ANCHOR ──
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      const [page, hash] = href.split('#');
      const sameOrEmpty = !page || page === window.location.pathname.split('/').pop();
      if (hash && sameOrEmpty) {
        const target = document.getElementById(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
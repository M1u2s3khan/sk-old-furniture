
  /* ============ CONFIG ============ */
  const WHATSAPP_NUMBER = '919876543210';  // ⚠️ change to your number

  /* ============ YEAR ============ */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ============ NAVBAR SCROLL & PADDING ============ */
  const navWrap = document.querySelector('.nav-wrap');
  
  // Auto adjust body padding based on header height
  function setBodyPadding() {
    if (!navWrap) return;
    var h = navWrap.offsetHeight;
    document.body.style.paddingTop = h + 'px';
  }
  window.addEventListener('load', setBodyPadding);
  window.addEventListener('resize', setBodyPadding);
  window.addEventListener('orientationchange', setBodyPadding);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setBodyPadding();
  }
  setTimeout(setBodyPadding, 300);
  setTimeout(setBodyPadding, 1000);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navWrap.classList.add('scrolled');
    else navWrap.classList.remove('scrolled');
  }, { passive:true });

  /* ============ MOBILE MENU ============ */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu(){
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    const icon = menuBtn.querySelector('i');
    icon.classList.add('bi-list');
    icon.classList.remove('bi-x-lg');
  }

  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    const icon = menuBtn.querySelector('i');
    icon.classList.toggle('bi-list', !open);
    icon.classList.toggle('bi-x-lg', open);
    // Recalculate padding after menu animation
    setTimeout(setBodyPadding, 410);
  });

  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ============ REVEAL ============ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ============ COUNTERS ============ */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.count;
        const start = performance.now();
        const duration = 1800;
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ============ GALLERY FILTER ============ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const matches = filter === 'all' || item.dataset.cat === filter;
        item.style.transition = 'opacity .35s ease, transform .35s ease';
        if (matches) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 350);
        }
      });
    });
  });

  /* ============ CONTACT FORM ============ */
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  let toastTimer;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      intent: document.getElementById('intent').value,
      message: document.getElementById('message').value.trim() || '—',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    console.group('%c📦 New Furniture Enquiry', 'color:#b8512e; font-weight:bold;');
    console.log(data);
    console.groupEnd();

    const waText =
      `*New Enquiry — Heritage Furnishers*\n\n` +
      `*Name:* ${data.name}\n` +
      `*Phone:* ${data.phone}\n` +
      `*Email:* ${data.email || '—'}\n` +
      `*Intent:* ${data.intent}\n` +
      `*Details:* ${data.message}\n\n` +
      `_Sent via website contact form_`;

    clearTimeout(toastTimer);
    toast.classList.add('show');
    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank', 'noopener');
    }, 550);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
    form.reset();
  });

  /* ============ SMOOTH SCROLL ============ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior:'smooth', block:'start' });
        closeMenu();
      }
    });
  });

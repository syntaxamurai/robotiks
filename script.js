/* =========================================================
   NexaBot Labs — main.js
   ========================================================= */

(function() {
  'use strict';

  /* ---- THEME TOGGLE ---- */
  const html    = document.documentElement;
  const toggle  = document.getElementById('theme-toggle');
  const THEME_KEY = 'nexabot-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Load saved preference, fall back to dark
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }


  /* ---- NAVBAR SCROLL BEHAVIOR ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 40);
      lastScroll = y;
    }, { passive: true });
  }


  /* ---- MOBILE BURGER MENU ---- */
  const burger   = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
    });

    // Close on nav link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
      }
    });
  }


  /* ---- GALLERY FILTER ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.cat === filter) {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            // Stagger reveal
            requestAnimationFrame(() => {
              setTimeout(() => {
                item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, 30);
            });
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }


  /* ---- GALLERY LIGHTBOX ---- */
  const lightbox    = document.getElementById('lightbox');
  const lbClose     = document.getElementById('lightbox-close');
  const lbImg       = document.getElementById('lightbox-img');
  const lbCaption   = document.getElementById('lightbox-caption');

  if (lightbox) {
    document.querySelectorAll('.gallery-img-wrap').forEach(wrap => {
      wrap.addEventListener('click', () => {
        const placeholder = wrap.querySelector('.gallery-placeholder');
        const overlay     = wrap.querySelector('.gallery-overlay span');
        const label = placeholder ? placeholder.dataset.label : '';
        const caption = overlay ? overlay.textContent : label;

        // Show a styled placeholder in the lightbox
        const img = placeholder?.style.backgroundImage;

        const imageUrl = img
          ? img.slice(5, -2)
          : '';

        lbImg.innerHTML = `
          <img src="${imageUrl}" style="
            max-width: 90vw;
            max-height: 80vh;
            border-radius: 10px;
            object-fit: contain;
          ">
        `;
        lbCaption.textContent = caption;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    lbClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  }


  /* ---- CONTACT FORM ---- */
  const form        = document.getElementById('contact-form');
  const formSubmit  = document.getElementById('form-submit');
  const formSuccess = document.getElementById('form-success');
  const formError   = document.getElementById('form-error');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--red)';
          field.addEventListener('input', () => {
            field.style.borderColor = '';
          }, { once: true });
        }
      });

      if (!valid) return;

      // Show loading
      const btnText    = formSubmit.querySelector('.btn-text');
      const btnLoading = formSubmit.querySelector('.btn-loading');
      formSubmit.disabled = true;
      btnText.style.display    = 'none';
      btnLoading.style.display = 'inline';
      formSuccess.style.display = 'none';
      formError.style.display   = 'none';

      // Simulate form submission (replace with actual endpoint)
      try {
        await new Promise(res => setTimeout(res, 1200));
        // In production: await fetch('/api/contact', { method: 'POST', body: new FormData(form) });

        form.reset();
        formSuccess.style.display = 'flex';
        formSubmit.disabled = false;
        btnText.style.display    = 'inline';
        btnLoading.style.display = 'none';

        // Scroll success into view
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (err) {
        formError.style.display = 'flex';
        formSubmit.disabled = false;
        btnText.style.display    = 'inline';
        btnLoading.style.display = 'none';
      }
    });
  }


  /* ---- SCROLL REVEAL ---- */
  if ('IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll(
      '.why-card, .program-card, .testi-card, .team-card, .value-item, .service-block, .big-stat, .bootcamp-item, .gallery-item'
    );

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  }


  /* ---- ACTIVE NAV LINK (highlight current page) ---- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else if (currentPath === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

})();
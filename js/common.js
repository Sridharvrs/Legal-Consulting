/* ========================================
   LEGAL CONSULTING - COMMON JAVASCRIPT
   Navigation, scroll effects, animations
   ======================================== */

(function () {
  'use strict';

  /* ===== PAGE LOADER ===== */
  window.addEventListener('load', function () {
    var loader = document.querySelector('.page-loader');
    if (loader) {
      setTimeout(function () {
        loader.classList.add('hidden');
      }, 800);
    }
  });

  /* ===== NAV SCROLL EFFECT ===== */
  var navWrapper = document.querySelector('.nav-wrapper');
  var scrollProgress = document.querySelector('.scroll-progress');
  var backToTop = document.querySelector('.back-to-top');

  function handleScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (navWrapper) {
      if (scrollTop > 50) {
        navWrapper.classList.add('scrolled');
      } else {
        navWrapper.classList.remove('scrolled');
      }
    }

    if (scrollProgress) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    }

    if (backToTop) {
      if (scrollTop > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ===== MOBILE MENU TOGGLE ===== */
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  var mobileOverlay = document.querySelector('.mobile-menu-overlay');
  var mobileClose = document.querySelector('.mobile-menu-close');

  function openMobileMenu() {
    if (hamburger) hamburger.classList.add('open');
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  var mobileLinks = document.querySelectorAll('.mobile-menu-link');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ===== BACK TO TOP ===== */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== SCROLL REVEAL — Intersection Observer ===== */
  var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ===== COUNTER ANIMATION ===== */
  var counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(easeOut * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counters.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) {
      counterObserver.observe(c);
    });
  }

  /* ===== ACTIVE NAV LINK based on current page ===== */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ===== PARALLAX EFFECT for hero images ===== */
  var parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.pageYOffset;
      parallaxElements.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        el.style.transform = 'translateY(' + scrollTop * speed + 'px)';
      });
    }, { passive: true });
  }

  /* ===== SMOOTH SCROLL for anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = navWrapper ? navWrapper.offsetHeight : 80;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ===== TYPING EFFECT ===== */
  var typeElements = document.querySelectorAll('[data-type]');

  typeElements.forEach(function (el) {
    var phrases = el.getAttribute('data-type').split('|');
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 80;

    function typeLoop() {
      var currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typeSpeed = 40;
      } else {
        charIndex++;
        typeSpeed = 80;
      }

      el.textContent = currentPhrase.substring(0, charIndex);

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 300;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    if ('IntersectionObserver' in window) {
      var typeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            typeLoop();
            typeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      typeObserver.observe(el);
    } else {
      typeLoop();
    }
  });

  /* ===== IMAGE LAZY FADE-IN ===== */
  var lazyImages = document.querySelectorAll('img.lazy-img');

  lazyImages.forEach(function (img) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.8s ease';
    img.addEventListener('load', function () {
      img.style.opacity = '1';
    });
    if (img.complete) {
      img.style.opacity = '1';
    }
  });

})();

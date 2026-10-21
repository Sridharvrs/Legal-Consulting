/* ========================================
   HOME PAGE — JAVASCRIPT
   Particles, testimonials, progress bars
   ======================================== */

(function () {
  'use strict';

  /* ===== HERO PARTICLES ===== */
  var particleContainer = document.getElementById('heroParticles');

  if (particleContainer) {
    var particleCount = 25;

    for (var i = 0; i < particleCount; i++) {
      var particle = document.createElement('div');
      particle.className = 'hero-particle';

      var size = Math.random() * 4 + 2;
      var left = Math.random() * 100;
      var duration = Math.random() * 15 + 10;
      var delay = Math.random() * 10;

      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = left + '%';
      particle.style.animationDuration = duration + 's';
      particle.style.animationDelay = delay + 's';
      particle.style.opacity = Math.random() * 0.3 + 0.1;

      particleContainer.appendChild(particle);
    }
  }

  /* ===== TESTIMONIALS SLIDER ===== */
  var testimonialCards = document.querySelectorAll('.testimonial-card');
  var dotsContainer = document.getElementById('testDots');
  var prevBtn = document.getElementById('testPrev');
  var nextBtn = document.getElementById('testNext');
  var currentIndex = 0;
  var autoSlideInterval;

  if (testimonialCards.length > 0 && dotsContainer) {
    // Create dots
    testimonialCards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'testimonials-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', function () {
        showTestimonial(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.testimonials-dot');

    function showTestimonial(index) {
      testimonialCards.forEach(function (card, i) {
        if (i === index) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      dots.forEach(function (dot, i) {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      currentIndex = index;
    }

    function nextTestimonial() {
      var next = (currentIndex + 1) % testimonialCards.length;
      showTestimonial(next);
    }

    function prevTestimonial() {
      var prev = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
      showTestimonial(prev);
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextTestimonial, 5000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    if (nextBtn) nextBtn.addEventListener('click', function () {
      nextTestimonial();
      resetAutoSlide();
    });

    if (prevBtn) prevBtn.addEventListener('click', function () {
      prevTestimonial();
      resetAutoSlide();
    });

    startAutoSlide();
  }

  /* ===== NEWSLETTER FORM ===== */
  var newsletterForm = document.getElementById('newsletterForm');
  var newsletterMsg = document.getElementById('newsletterMsg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = this.querySelector('input').value;

      if (email && email.indexOf('@') > -1) {
        newsletterMsg.textContent = 'Thank you for subscribing! Check your inbox for confirmation.';
        newsletterMsg.style.color = 'var(--gold-300)';
        this.querySelector('input').value = '';

        setTimeout(function () {
          newsletterMsg.textContent = '';
        }, 4000);
      }
    });
  }

  /* ===== ANIMATE PROGRESS BARS on reveal ===== */
  var whyLeft = document.querySelector('.why-left');

  if (whyLeft && 'IntersectionObserver' in window) {
    var progressObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fills = entry.target.querySelectorAll('.why-progress-fill');
          fills.forEach(function (fill) {
            var width = fill.style.getPropertyValue('--w');
            if (width) {
              fill.style.width = width;
            }
          });
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    progressObserver.observe(whyLeft);
  }

})();

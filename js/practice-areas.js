/* ========================================
   PRACTICE AREAS PAGE — JAVASCRIPT
   Tab filtering
   ======================================== */

(function () {
  'use strict';

  /* ===== FILTER TABS ===== */
  var filters = document.querySelectorAll('.pa-filter');
  var cards = document.querySelectorAll('.pa-card');

  filters.forEach(function (filter) {
    filter.addEventListener('click', function () {
      var category = this.getAttribute('data-filter');

      filters.forEach(function (f) {
        f.classList.remove('active');
      });
      this.classList.add('active');

      cards.forEach(function (card) {
        var cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
          card.classList.remove('hide');
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'paCardIn 0.5s ease forwards';
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

})();

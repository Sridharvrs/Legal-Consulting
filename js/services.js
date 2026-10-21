/* ========================================
   SERVICES PAGE — JAVASCRIPT
   FAQ accordion
   ======================================== */

(function () {
  'use strict';

  /* ===== FAQ ACCORDION ===== */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();

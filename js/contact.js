/* ========================================
   CONTACT PAGE — JAVASCRIPT
   Form validation, newsletter
   ======================================== */

(function () {
  'use strict';

  /* ===== CONTACT FORM ===== */
  var contactForm = document.getElementById('contactForm');
  var contactMsg = document.getElementById('contactFormMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('cf-name').value.trim();
      var email = document.getElementById('cf-email').value.trim();
      var message = document.getElementById('cf-message').value.trim();
      var consent = document.getElementById('cf-consent').checked;

      if (!name || !email || !message) {
        contactMsg.textContent = 'Please fill in all required fields.';
        contactMsg.style.color = 'var(--error)';
        return;
      }

      if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        contactMsg.textContent = 'Please enter a valid email address.';
        contactMsg.style.color = 'var(--error)';
        return;
      }

      if (!consent) {
        contactMsg.textContent = 'Please acknowledge the consent checkbox.';
        contactMsg.style.color = 'var(--error)';
        return;
      }

      var submitBtn = contactForm.querySelector('.contact-form-submit');
      var originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      setTimeout(function () {
        contactMsg.textContent = 'Thank you, ' + name + '! Your message has been sent. We will contact you within 24 hours.';
        contactMsg.style.color = 'var(--success)';
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        setTimeout(function () {
          contactMsg.textContent = '';
        }, 6000);
      }, 1200);
    });
  }

  /* ===== CONTACT NEWSLETTER ===== */
  var newsletter = document.getElementById('contactNewsletter');
  var newsletterMsg = document.getElementById('contactNewsletterMsg');

  if (newsletter) {
    newsletter.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = this.querySelector('input').value;

      if (email && email.indexOf('@') > -1) {
        newsletterMsg.textContent = 'You are subscribed! Watch for our next issue.';
        newsletterMsg.style.color = 'var(--gold-300)';
        this.querySelector('input').value = '';

        setTimeout(function () {
          newsletterMsg.textContent = '';
        }, 4000);
      }
    });
  }

  /* ===== FORM INPUT FOCUS ANIMATION ===== */
  var formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');

  formInputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('focused');
    });
  });

})();

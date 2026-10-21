/* ========================================
   ABOUT PAGE — JAVASCRIPT
   Milestone scroll, team card interactions
   ======================================== */

(function () {
  'use strict';

  /* ===== MILESTONE DRAG SCROLL ===== */
  var timeline = document.querySelector('.milestones-timeline');

  if (timeline) {
    var isDown = false;
    var startX;
    var scrollLeft;

    timeline.addEventListener('mousedown', function (e) {
      isDown = true;
      timeline.style.cursor = 'grabbing';
      startX = e.pageX - timeline.offsetLeft;
      scrollLeft = timeline.scrollLeft;
    });

    timeline.addEventListener('mouseleave', function () {
      isDown = false;
      timeline.style.cursor = 'grab';
    });

    timeline.addEventListener('mouseup', function () {
      isDown = false;
      timeline.style.cursor = 'grab';
    });

    timeline.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - timeline.offsetLeft;
      var walk = (x - startX) * 2;
      timeline.scrollLeft = scrollLeft - walk;
    });

    timeline.style.cursor = 'grab';
  }

  /* ===== TEAM CARD 3D TILT ===== */
  var teamCards = document.querySelectorAll('.team-card');

  teamCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = (y - centerY) / 20;
      var rotateY = (centerX - x) / 20;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

})();

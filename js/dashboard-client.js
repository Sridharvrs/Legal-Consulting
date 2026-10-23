
// Get the logged-in user
const currentUser = JSON.parse(
  localStorage.getItem("stacklyCurrentUser") ||
  sessionStorage.getItem("stacklyCurrentUser") ||
  "null"
);

if (currentUser?.name) {
  // Display dynamic name
  document.querySelectorAll(".profileName").forEach((element) => {
    element.textContent = currentUser.name;
  });

  // Display first letter in avatar
  const firstLetter = currentUser.name.trim().charAt(0).toUpperCase();

  document.querySelectorAll(".avatar").forEach((element) => {
    element.textContent = firstLetter;
  });
}


/* ========================================
   CLIENT DASHBOARD — JAVASCRIPT
   Module switching, sidebar toggle, calendar,
   document filters, messages, upload zone
   ======================================== */

(function () {
  'use strict';

  /* ===== MODULE SWITCHING ===== */
  var navItems = document.querySelectorAll('.dash-nav-item');
  var modules = document.querySelectorAll('.dash-module');
  var topbarTitle = document.getElementById('topbarTitle');
  var titleMap = {
    overview: 'Overview',
    cases: 'My Cases',
    documents: 'Documents',
    appointments: 'Appointments',
    invoices: 'Invoices & Billing',
    messages: 'Messages'
  };

  function switchModule(moduleName) {
    navItems.forEach(function (item) {
      if (item.getAttribute('data-module') === moduleName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    modules.forEach(function (mod) {
      if (mod.id === 'module-' + moduleName) {
        mod.classList.add('active');
      } else {
        mod.classList.remove('active');
      }
    });

    if (topbarTitle && titleMap[moduleName]) {
      topbarTitle.textContent = titleMap[moduleName];
    }

    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      switchModule(this.getAttribute('data-module'));
    });
  });

  /* Quick action links that switch modules */
  document.querySelectorAll('[data-module-link]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      switchModule(this.getAttribute('data-module-link'));
    });
  });

  /* ===== SIDEBAR TOGGLE (mobile) ===== */
  var sidebar = document.getElementById('dashSidebar');
  var overlay = document.getElementById('dashOverlay');
  var toggle = document.getElementById('dashToggle');
  var closeBtn = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }

  if (toggle) toggle.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* ===== TOPBAR DATE ===== */
  var dateEl = document.getElementById('topbarDate');
  if (dateEl) {
    var now = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  /* ===== DOCUMENT FILTERS ===== */
  var docFilters = document.querySelectorAll('.dash-doc-filter');
  var docCards = document.querySelectorAll('.dash-doc-card');

  docFilters.forEach(function (filter) {
    filter.addEventListener('click', function () {
      var type = this.getAttribute('data-doc-filter');

      docFilters.forEach(function (f) { f.classList.remove('active'); });
      this.classList.add('active');

      docCards.forEach(function (card) {
        var cardType = card.getAttribute('data-doc-type');
        if (type === 'all' || cardType === type) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ===== UPLOAD ZONE ===== */
  var uploadZone = document.getElementById('uploadZone');
  var fileInput = document.getElementById('fileInput');

  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', function () {
      fileInput.click();
    });

    uploadZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      this.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', function () {
      this.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', function (e) {
      e.preventDefault();
      this.classList.remove('dragover');
      var files = e.dataTransfer.files;
      if (files.length > 0) {
        showUploadToast(files.length + ' file(s) uploaded successfully');
      }
    });

    fileInput.addEventListener('change', function () {
      if (this.files.length > 0) {
        showUploadToast(this.files.length + ' file(s) selected');
      }
    });
  }

  function showUploadToast(msg) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:var(--navy-800);color:var(--gold-400);padding:14px 24px;border-radius:8px;font-size:0.85rem;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(10,22,40,0.3);border:1px solid rgba(200,155,60,0.3);opacity:0;transform:translateY(20px);transition:all 0.3s ease;';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  /* ===== MINI CALENDAR ===== */
  var calDays = document.getElementById('calDays');
  var calMonthLabel = document.getElementById('calMonthLabel');
  var calPrev = document.getElementById('calPrev');
  var calNext = document.getElementById('calNext');
  var calDate = new Date(2026, 9, 1);
  var eventDays = [15, 28];

  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function renderCalendar() {
    if (!calDays) return;

    var year = calDate.getFullYear();
    var month = calDate.getMonth();
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var daysInPrev = new Date(year, month, 0).getDate();
    var today = new Date();

    calMonthLabel.textContent = monthNames[month] + ' ' + year;
    calDays.innerHTML = '';

    for (var i = 0; i < firstDay; i++) {
      var day = daysInPrev - firstDay + i + 1;
      var cell = document.createElement('div');
      cell.className = 'dash-cal-day other-month';
      cell.textContent = day;
      calDays.appendChild(cell);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var cell2 = document.createElement('div');
      cell2.className = 'dash-cal-day';
      cell2.textContent = d;

      if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d) {
        cell2.classList.add('today');
      }

      if (eventDays.indexOf(d) !== -1) {
        cell2.classList.add('has-event');
      }

      calDays.appendChild(cell2);
    }

    var totalCells = firstDay + daysInMonth;
    var remaining = (7 - (totalCells % 7)) % 7;
    for (var r = 1; r <= remaining; r++) {
      var cell3 = document.createElement('div');
      cell3.className = 'dash-cal-day other-month';
      cell3.textContent = r;
      calDays.appendChild(cell3);
    }
  }

  if (calPrev) calPrev.addEventListener('click', function () {
    calDate.setMonth(calDate.getMonth() - 1);
    renderCalendar();
  });

  if (calNext) calNext.addEventListener('click', function () {
    calDate.setMonth(calDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();

  /* ===== MESSAGES ===== */
  var msgConvs = document.querySelectorAll('.dash-msg-conv');
  var msgThread = document.getElementById('msgThread');
  var msgInput = document.getElementById('msgInput');
  var msgSend = document.getElementById('msgSend');

  msgConvs.forEach(function (conv) {
    conv.addEventListener('click', function () {
      msgConvs.forEach(function (c) { c.classList.remove('active'); });
      this.classList.add('active');

      var badge = this.querySelector('.dash-msg-conv-badge');
      if (badge) badge.remove();
    });
  });

  function sendMessage() {
    if (!msgInput || !msgThread) return;
    var text = msgInput.value.trim();
    if (!text) return;

    var bubble = document.createElement('div');
    bubble.className = 'dash-msg-bubble sent';
    var p = document.createElement('p');
    p.textContent = text;
    var time = document.createElement('span');
    time.className = 'dash-msg-time';
    var now = new Date();
    time.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    bubble.appendChild(p);
    bubble.appendChild(time);
    msgThread.appendChild(bubble);
    msgThread.scrollTop = msgThread.scrollHeight;
    msgInput.value = '';
  }

  if (msgSend) msgSend.addEventListener('click', sendMessage);
  if (msgInput) msgInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sendMessage();
  });

  /* ===== INVOICE PAY BUTTONS ===== */
  document.querySelectorAll('.dash-mini-btn.pay').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showUploadToast('Payment processed successfully');
      var row = this.closest('tr');
      var statusCell = row.querySelector('.dash-status');
      if (statusCell) {
        statusCell.className = 'dash-status completed';
        statusCell.textContent = 'Paid';
      }
      this.className = 'dash-mini-btn download';
      this.textContent = 'Download';
    });
  });

})();

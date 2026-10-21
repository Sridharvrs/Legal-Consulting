/* ========================================
   ATTORNEY DASHBOARD — INTERACTIONS
   Module switching, sidebar toggle, calendar,
   case filters, timer, messages
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== MODULE SWITCHING ===== */
  const navItems = document.querySelectorAll('.dash-nav-item');
  const modules = document.querySelectorAll('.dash-module');
  const topbarTitle = document.getElementById('topbarTitle');
  const titleMap = {
    overview: 'Dashboard',
    caseload: 'Caseload',
    clients: 'Clients',
    schedule: 'Schedule',
    billing: 'Time & Billing',
    messages: 'Messages'
  };

  function switchModule(name) {
    navItems.forEach(n => n.classList.toggle('active', n.dataset.module === name));
    modules.forEach(m => m.classList.toggle('active', m.id === 'module-' + name));
    if (topbarTitle && titleMap[name]) topbarTitle.textContent = titleMap[name];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      switchModule(this.dataset.module);
      if (window.innerWidth <= 1024) closeSidebar();
    });
  });

  document.querySelectorAll('[data-module-link]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      switchModule(this.dataset.moduleLink);
    });
  });

  /* ===== SIDEBAR TOGGLE ===== */
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('dashOverlay');
  const toggleBtn = document.getElementById('dashToggle');
  const closeBtn = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* ===== TOPBAR DATE ===== */
  const dateEl = document.getElementById('topbarDate');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  /* ===== CASE FILTERS ===== */
  const caseFilters = document.querySelectorAll('[data-case-filter]');
  const caseRows = document.querySelectorAll('[data-case-status]');

  caseFilters.forEach(btn => {
    btn.addEventListener('click', function () {
      caseFilters.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.caseFilter;
      caseRows.forEach(row => {
        if (filter === 'all' || row.dataset.caseStatus === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  /* ===== MINI CALENDAR ===== */
  const calDays = document.getElementById('attCalDays');
  const calLabel = document.getElementById('attCalMonthLabel');
  const calPrev = document.getElementById('attCalPrev');
  const calNext = document.getElementById('attCalNext');
  let calDate = new Date(2026, 9, 1); // October 2026
  const eventsMap = {
    21: 'event',
    28: 'event',
    14: 'event',
    5: 'event'
  };

  function renderCal() {
    if (!calDays || !calLabel) return;
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    calLabel.textContent = monthNames[month] + ' ' + year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    let html = '';

    for (let i = 0; i < firstDay; i++) html += '<span class="dash-cal-day empty"></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const hasEvent = eventsMap[d] && month === 9;
      html += '<span class="dash-cal-day' +
        (isToday ? ' today' : '') +
        (hasEvent ? ' has-event' : '') +
        '">' + d + (hasEvent ? '<span class="dash-cal-dot"></span>' : '') + '</span>';
    }
    calDays.innerHTML = html;
  }

  if (calPrev) calPrev.addEventListener('click', () => { calDate.setMonth(calDate.getMonth() - 1); renderCal(); });
  if (calNext) calNext.addEventListener('click', () => { calDate.setMonth(calDate.getMonth() + 1); renderCal(); });
  renderCal();

  /* ===== BILLING TIMER ===== */
  const timerBtn = document.getElementById('startTimer');
  let timerActive = false;
  let timerInterval = null;
  let timerSeconds = 0;

  if (timerBtn) {
    timerBtn.addEventListener('click', function () {
      timerActive = !timerActive;
      if (timerActive) {
        this.classList.add('active');
        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.563A.562.562 0 019 14.437V9.564z"/></svg> Stop Timer';
        timerInterval = setInterval(() => {
          timerSeconds++;
          const h = Math.floor(timerSeconds / 3600);
          const m = Math.floor((timerSeconds % 3600) / 60);
          const s = timerSeconds % 60;
          timerBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.563A.562.562 0 019 14.437V9.564z"/></svg> Stop (' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0') + ')';
        }, 1000);
      } else {
        this.classList.remove('active');
        clearInterval(timerInterval);
        const h = (timerSeconds / 3600).toFixed(2);
        timerBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Start Timer';
        showToast('Time entry logged: ' + h + ' hours');
        timerSeconds = 0;
      }
    });
  }

  /* ===== TOAST ===== */
  function showToast(msg) {
    let toast = document.querySelector('.dash-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'dash-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ===== MESSAGES ===== */
  const convItems = document.querySelectorAll('.dash-msg-conv');
  const msgThread = document.getElementById('attMsgThread');
  const msgInput = document.getElementById('attMsgInput');
  const msgSend = document.getElementById('attMsgSend');

  const conversations = {
    0: [
      { text: 'Good morning James, I wanted to let you know that the discovery documents are now ready for review.', sent: false, time: 'Oct 14, 9:32 AM' },
      { text: 'Thank you, John. I\'ll review them this afternoon. Are there any specific sections I should focus on?', sent: true, time: 'Oct 14, 10:15 AM' },
      { text: 'Yes, please pay special attention to Section 3 — the email correspondence. It\'s critical to our argument.', sent: false, time: 'Oct 14, 10:28 AM' }
    ],
    1: [
      { text: 'Hi James, can we reschedule our meeting to next week?', sent: false, time: 'Oct 13, 2:00 PM' },
      { text: 'I have a conflict come up unexpectedly.', sent: false, time: 'Oct 13, 2:01 PM' }
    ],
    2: [
      { text: 'The due diligence report looks great, thank you for the thorough work.', sent: false, time: 'Oct 12, 4:15 PM' },
      { text: 'My team is reviewing it now. We may have a few follow-up questions.', sent: false, time: 'Oct 12, 4:16 PM' },
      { text: 'I\'m glad it meets expectations. Happy to address any questions your team has.', sent: true, time: 'Oct 12, 5:00 PM' }
    ],
    3: [
      { text: 'Can you cover my court date on Friday? I have a family emergency.', sent: false, time: 'Oct 15, 8:00 AM' }
    ]
  };

  function renderMessages(convIdx) {
    if (!msgThread) return;
    const msgs = conversations[convIdx] || [];
    msgThread.innerHTML = msgs.map(m =>
      '<div class="dash-msg-bubble ' + (m.sent ? 'sent' : 'received') + '">' +
      '<p>' + m.text + '</p>' +
      '<span class="dash-msg-time">' + m.time + '</span></div>'
    ).join('');
    msgThread.scrollTop = msgThread.scrollHeight;
  }

  convItems.forEach(item => {
    item.addEventListener('click', function () {
      convItems.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const badge = this.querySelector('.dash-msg-conv-badge');
      if (badge) badge.remove();
      renderMessages(parseInt(this.dataset.conv));
    });
  });

  function sendMessage() {
    if (!msgInput || !msgInput.value.trim()) return;
    const activeConv = document.querySelector('.dash-msg-conv.active');
    const convIdx = activeConv ? parseInt(activeConv.dataset.conv) : 0;
    if (!conversations[convIdx]) conversations[convIdx] = [];
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    conversations[convIdx].push({ text: msgInput.value.trim(), sent: true, time: now });
    renderMessages(convIdx);
    msgInput.value = '';
  }

  if (msgSend) msgSend.addEventListener('click', sendMessage);
  if (msgInput) msgInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

  /* ===== CLIENT CARD QUICK ACTIONS ===== */
  document.querySelectorAll('.dash-att-client-actions .dash-mini-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.textContent.trim() === 'Message') {
        switchModule('messages');
      } else {
        switchModule('caseload');
      }
    });
  });

});

/**
 * CAMPUSFLOW MAIN APPLICATION ENTRYPOINT
 * Module: frontend/src/scripts/app.js
 */

// User Actions
// User Actions
  function handleUserComplaintSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('report-title').value;
    const dept = document.getElementById('report-dept').value;
    const loc = document.getElementById('report-location').value;
    const desc = document.getElementById('report-desc').value;

    const newTicketId = 'CF-2026-00' + (124 + Math.floor(Math.random() * 80));
    document.getElementById('success-ticket-id').textContent = newTicketId;

    showModal('modal-submit-success');
    showToast(`Complaint ${newTicketId} logged! Warden notified.`, 'success');
  }

  function handleMockFileSelect(input) {
    if (input.files && input.files[0]) {
      const pill = document.getElementById('file-preview-pill');
      const name = document.getElementById('file-preview-name');
      if (pill && name) {
        name.textContent = `${input.files[0].name} (${(input.files[0].size / 1024 / 1024).toFixed(1)}MB)`;
        pill.classList.remove('hidden');
      }
    }
  }

  function removeMockFile() {
    const pill = document.getElementById('file-preview-pill');
    if (pill) pill.classList.add('hidden');
  }

// Authority Verification Handlers
// Authority Actions
  function approveComplaint(ticketId) {
    document.getElementById('approved-ticket-id').textContent = ticketId;
    showModal('modal-approve-confirm');
    showToast(`Ticket ${ticketId} verified! Automated dispatch running.`, 'success');
  }

  let activeRejectTicketId = null;
  function openRejectModal(ticketId) {
    activeRejectTicketId = ticketId;
    showModal('modal-reject-reason');
  }

  function confirmRejectSubmit() {
    closeModal('modal-reject-reason');
    showToast(`Ticket ${activeRejectTicketId} rejected with stated reason.`, 'error');
  }

  function openRequestInfoModal(ticketId) {
    showModal('modal-request-info');
  }

  function confirmRequestInfoSubmit() {
    closeModal('modal-request-info');
    showToast(`Clarification request sent to student.`, 'info');
  }

// Admin Maintenance Intervention Handlers
// Admin Actions
  function openInterventionModal(ticketId) {
    showModal('modal-admin-intervention');
  }

  function confirmInterventionSubmit() {
    const w = document.getElementById('override-worker-select').value;
    closeModal('modal-admin-intervention');
    showToast(`Administrative override: Reassigned to ${w}.`, 'success');
  }

  function handleCreateWorkerSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('cw-name').value;
    showToast(`Worker account provisioned for ${name}. SMS invitation sent.`, 'success');
    navigateTo('admin-workers', 'admin');
  }

// System States QA Inspector
// System States QA Inspector
  function openSystemStatesModal() {
    showModal('modal-system-states');
  }

  function renderSystemState(type) {
    const container = document.getElementById('system-state-output');
    if (!container) return;

    if (type === 'empty') {
      container.innerHTML = `
        <div class="py-4">
          <span class="material-symbols-outlined text-[32px] text-slate-400">inbox</span>
          <h4 class="font-bold text-slate-800 text-xs mt-1">No Active Maintenance Requests</h4>
          <p class="text-[11px] text-slate-500">All campus facility work orders in this block are currently resolved.</p>
        </div>
      `;
    } else if (type === 'loading') {
      container.innerHTML = `
        <div class="w-full space-y-2 py-2 animate-pulse">
          <div class="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
          <div class="h-3 bg-slate-200 rounded w-1/2 mx-auto"></div>
          <div class="h-8 bg-slate-200 rounded w-full"></div>
        </div>
      `;
    } else if (type === 'timeout') {
      container.innerHTML = `
        <div class="py-2 text-red-700">
          <span class="material-symbols-outlined text-[28px]">timer_off</span>
          <h4 class="font-bold text-xs mt-1">30-Minute SLA Acceptance Expired</h4>
          <p class="text-[11px] text-slate-600">Candidate technician WRK-0018 failed to respond within 30m window. Autonomous cascading engaged → Dispatched to standby unit WRK-0019.</p>
        </div>
      `;
    } else if (type === 'unauthorized') {
      container.innerHTML = `
        <div class="py-2 text-amber-700">
          <span class="material-symbols-outlined text-[28px]">shield</span>
          <h4 class="font-bold text-xs mt-1">403 Forbidden: Jurisdiction Boundary</h4>
          <p class="text-[11px] text-slate-600">You are assigned as Warden of Academic Block B. You cannot verify complaints lodged in Residential Hostel Block C.</p>
        </div>
      `;
    } else if (type === 'offline') {
      container.innerHTML = `
        <div class="py-2 text-blue-700">
          <span class="material-symbols-outlined text-[28px]">wifi_off</span>
          <h4 class="font-bold text-xs mt-1">Offline Cached Mode Active</h4>
          <p class="text-[11px] text-slate-600">Underground Plant Room detected. Work order stored locally and will sync telemetry once back on campus Wi-Fi.</p>
        </div>
      `;
    } else if (type === 'completed') {
      container.innerHTML = `
        <div class="py-2 text-emerald-700">
          <span class="material-symbols-outlined text-[28px]">verified</span>
          <h4 class="font-bold text-xs mt-1">Job Sealed & Cryptographically Hashed</h4>
          <p class="text-[11px] text-slate-600">Proof photo watermarked with timestamp Nov 10 2026 10:14 AM. Hash SHA-256 e3b0c44298fc1c149afbf4c8996fb924.</p>
        </div>
      `;
    }
  }

  // Modal Helpers
  function showModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  }

  // Toast System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const colors = {
      success: 'bg-emerald-950 text-emerald-100 border-emerald-700',
      error: 'bg-red-950 text-red-100 border-red-700',
      info: 'bg-slate-950 text-slate-100 border-slate-700'
    }[type] || 'bg-slate-950 text-slate-100 border-slate-700';

    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-xl border text-xs shadow-xl flex items-center gap-2 pointer-events-auto fade-in font-medium ${colors}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function toggleNotificationDropdown() {
    const drop = document.getElementById('notif-dropdown');
    if (drop) drop.classList.toggle('hidden');
  }

  function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  }

// Hash Change & Router Listener
// Handle Hash Changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
        if (hash && hash !== AppState.currentView) {
      if (hash === 'signup') {
        navigateTo('login', 'public');
        setTimeout(() => setAuthMode('signup'), 50);
        return;
      }
      // Determine role from hash or preserve
      if (['home', 'about', 'platform', 'how-it-works', 'departments', 'department-details', 'analytics', 'login', 'signup', 'otp-verify', 'account-recovery'].includes(hash)) {
        navigateTo(hash, 'public');
      } else if (hash.startsWith('user-')) {
        navigateTo(hash, 'user');
      } else if (hash.startsWith('authority-')) {
        navigateTo(hash, 'authority');
      } else if (hash.startsWith('worker-')) {
        navigateTo(hash, 'worker');
      } else if (hash.startsWith('admin-')) {
        navigateTo(hash, 'admin');
      } else if (hash.startsWith('super-')) {
        navigateTo(hash, 'super');
      }
    }
  });

// Application Bootstrap
// Initialization
  document.addEventListener('DOMContentLoaded', () => {
    const initialHash = window.location.hash.replace('#', '') || 'home';
    if (initialHash.startsWith('user-')) navigateTo(initialHash, 'user');
    else if (initialHash.startsWith('authority-')) navigateTo(initialHash, 'authority');
    else if (initialHash.startsWith('worker-')) navigateTo(initialHash, 'worker');
    else if (initialHash.startsWith('admin-')) navigateTo(initialHash, 'admin');
    else if (initialHash.startsWith('super-')) navigateTo(initialHash, 'super');
    else navigateTo(initialHash, 'public');
  });


/**
 * CampusFlow Shared Client Utilities & Navigation Engine
 * High-performance, anti-AI slop application controller
 */

// Route mapping for all 57 screens across all 5 roles and public site
const ROUTE_MAP = {
  // Public
  'home': 'public/landing.html',
  'landing': 'public/landing.html',
  'about': 'public/about.html',
  'platform': 'public/platform.html',
  'how-it-works': 'public/how-it-works.html',
  'departments': 'public/departments.html',
  'department-details': 'public/department-details.html',
  'analytics': 'public/analytics.html',
  'login': 'public/login.html?mode=signin',
  'signup': 'public/login.html?mode=signup',
  'otp-verify': 'public/otp-verify.html',
  'account-recovery': 'public/account-recovery.html',

  // User / Student / Complainant
  'user-overview': 'user/overview.html',
  'user-report': 'user/report-issue.html',
  'user-complaints': 'user/my-complaints.html',
  'user-complaint-details': 'user/complaint-details.html',
  'user-tracker': 'user/complaint-details.html',
  'user-history': 'user/history.html',
  'user-notifications': 'user/notifications.html',
  'user-profile': 'user/profile.html',

  // Authority / HOD / Warden
  'authority-overview': 'authority/overview.html',
  'authority-queue': 'authority/verification-queue.html',
  'authority-review': 'authority/complaint-review.html',
  'authority-approved': 'authority/approved-requests.html',
  'authority-rejected': 'authority/rejected-requests.html',
  'authority-active': 'authority/active-maintenance.html',
  'authority-workers': 'authority/worker-monitoring.html',
  'authority-analytics': 'authority/analytics.html',
  'authority-notifications': 'authority/notifications.html',
  'authority-settings': 'authority/settings.html',

  // Worker / Technician
  'worker-overview': 'worker/overview.html',
  'worker-incoming': 'worker/incoming-dispatch.html',
  'worker-assignment': 'worker/assignment-details.html',
  'worker-active': 'worker/active-job.html',
  'worker-progress': 'worker/work-progress.html',
  'worker-complete': 'worker/job-complete.html',
  'worker-completed': 'worker/completed-jobs.html',
  'worker-history': 'worker/history.html',
  'worker-notifications': 'worker/notifications.html',
  'worker-profile': 'worker/profile.html',

  // Facilities Admin
  'admin-overview': 'admin/overview.html',
  'admin-complaints': 'admin/complaints-master.html',
  'admin-workers': 'admin/workers-directory.html',
  'admin-create-worker': 'admin/create-worker.html',
  'admin-worker-details': 'admin/worker-details.html',
  'admin-departments': 'admin/departments.html',
  'admin-assignments': 'admin/assignment-telemetry.html',
  'admin-telemetry': 'admin/assignment-telemetry.html',
  'admin-assignment-details': 'admin/assignment-details.html',
  'admin-reports': 'admin/reports.html',
  'admin-notifications': 'admin/notifications.html',
  'admin-settings': 'admin/settings.html',

  // Super Admin
  'super-overview': 'super/overview.html',
  'super-users': 'super/user-directory.html',
  'super-user-details': 'super/user-details.html',
  'super-roles': 'super/role-management.html',
  'super-permissions': 'super/permission-matrix.html',
  'super-hierarchy': 'super/department-hierarchy.html',
  'super-assignment-engine': 'super/assignment-engine-config.html',
  'super-settings': 'super/platform-settings.html',
  'super-audit-logs': 'super/audit-logs.html',
  'super-activity': 'super/system-activity.html',
  'super-analytics': 'super/global-analytics.html'
};

/**
 * Universal Navigation Dispatcher
 * Seamlessly handles single-page prototype views AND decomposed standalone pages
 */
function navigateTo(viewId, roleId) {
  // Normalize input
  if (!viewId) return;
  const cleanId = viewId.replace(/^#/, '');

  // 1. If running in SPA mode where view container exists in DOM
  const targetEl = document.getElementById('view-' + cleanId);
  const authViews = document.querySelectorAll('.auth-view, .public-view');
  if (targetEl && authViews.length > 1) {
    authViews.forEach(el => el.classList.add('hidden'));
    targetEl.classList.remove('hidden');
    window.location.hash = '#' + cleanId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // 2. Standalone Page Navigation
  const targetRoute = ROUTE_MAP[cleanId];
  if (!targetRoute) {
    console.warn(`[CampusFlow] Route destination not found for: ${cleanId}`);
    return;
  }

  const pathname = window.location.pathname || '';
  let targetUrl = '';

  if (pathname.includes('/frontend/pages/')) {
    if (cleanId === 'home' || cleanId === 'landing') {
      targetUrl = '../../index.html';
    } else {
      targetUrl = '../' + targetRoute;
    }
  } else if (pathname.includes('/pages/')) {
    if (cleanId === 'home' || cleanId === 'landing') {
      targetUrl = '../../index.html';
    } else {
      targetUrl = '../' + targetRoute;
    }
  } else if (pathname.includes('/frontend/')) {
    if (cleanId === 'home' || cleanId === 'landing') {
      targetUrl = 'index.html';
    } else {
      targetUrl = 'pages/' + targetRoute;
    }
  } else {
    // Root level (index.html or /)
    if (cleanId === 'home' || cleanId === 'landing') {
      targetUrl = 'index.html';
    } else {
      targetUrl = 'pages/' + targetRoute;
    }
  }

  window.location.href = targetUrl;
}

/**
 * Quick Role Switcher
 */
function loginAs(role) {
  const roleLanding = {
    user: 'user-overview',
    authority: 'authority-overview',
    worker: 'worker-overview',
    admin: 'admin-overview',
    super: 'super-overview'
  };
  const targetView = roleLanding[role] || 'home';
  navigateTo(targetView, role);
  showToast(`Switched persona to: ${role.toUpperCase()}`, 'success');
}

function handleJumpSelect(val) {
  if (!val) return;
  const [viewId, roleId] = val.split(',');
  navigateTo(viewId, roleId);
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full';
    document.body.appendChild(container);
  }

  const colors = {
    info: 'bg-slate-900 text-white border-slate-700',
    success: 'bg-emerald-600 text-white border-emerald-500',
    warning: 'bg-amber-600 text-white border-amber-500',
    error: 'bg-red-600 text-white border-red-500'
  };

  const icons = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error'
  };

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl text-xs font-semibold transition-all transform duration-300 ' + (colors[type] || colors.info);
  toast.innerHTML = `<span class="material-symbols-outlined text-[18px]">${icons[type] || 'info'}</span><span class="flex-1">${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

/**
 * Modal Dialog Controls
 */
function showModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    el.classList.add('flex');
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    el.classList.remove('flex');
  }
}

/**
 * Layout & Navigation Toggles
 */
function toggleMobileSidebar() {
  const aside = document.getElementById('auth-sidebar');
  if (aside) aside.classList.toggle('hidden');
}

function toggleNotificationDropdown() {
  const drop = document.getElementById('notif-dropdown');
  if (drop) drop.classList.toggle('hidden');
}

function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

/**
 * Complainant / User Portal Actions
 */
function handleUserComplaintSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const titleEl = document.getElementById('report-title');
  const title = titleEl ? titleEl.value : 'Facility Issue';
  
  const newTicketId = 'CF-2026-00' + (124 + Math.floor(Math.random() * 80));
  const successEl = document.getElementById('success-ticket-id');
  if (successEl) successEl.textContent = newTicketId;

  showModal('modal-submit-success');
  showToast(`Complaint ${newTicketId} logged! Warden notified.`, 'success');
}

function handleMockFileSelect(input) {
  if (input && input.files && input.files[0]) {
    const pill = document.getElementById('file-preview-pill');
    const name = document.getElementById('file-preview-name');
    if (pill && name) {
      name.textContent = `${input.files[0].name} (${(input.files[0].size / 1024 / 1024).toFixed(1)}MB)`;
      pill.classList.remove('hidden');
      pill.classList.add('flex');
    }
  }
}

function removeMockFile() {
  const pill = document.getElementById('file-preview-pill');
  if (pill) {
    pill.classList.add('hidden');
    pill.classList.remove('flex');
  }
  const fileInput = document.getElementById('file-upload-mock');
  if (fileInput) fileInput.value = '';
}

/**
 * Authority Verification & Review Actions
 */
let activeRejectTicketId = 'CF-2026-00124';

function approveComplaint(ticketId) {
  const approvedEl = document.getElementById('approved-ticket-id');
  if (approvedEl) approvedEl.textContent = ticketId;
  showModal('modal-approve-confirm');
  showToast(`Ticket ${ticketId} verified! Automated dispatch running.`, 'success');
}

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
  showToast('Clarification request sent to student.', 'info');
}

/**
 * Worker / Field Technician Actions
 */
let isWorkerOnline = true;

function acceptJobWorker(ticketId) {
  showToast(`Job ${ticketId || 'CF-2026-00124'} accepted! Locked into shift queue.`, 'success');
  setTimeout(() => {
    navigateTo('worker-active', 'worker');
  }, 600);
}

function openWorkerDeclineModal(ticketId) {
  showModal('modal-worker-decline');
}

function confirmWorkerDeclineSubmit() {
  closeModal('modal-worker-decline');
  showToast('Job declined. System auto-reassigning to standby worker (WRK-0019).', 'info');
  setTimeout(() => {
    navigateTo('worker-overview', 'worker');
  }, 600);
}

function handleWorkerProgressSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  showToast('Progress milestone broadcasted to complainant & warden.', 'info');
  setTimeout(() => {
    navigateTo('worker-active', 'worker');
  }, 600);
}

function handleWorkerPhotoSelect(input) {
  const preview = document.getElementById('worker-photo-preview');
  if (preview) {
    preview.classList.remove('hidden');
    preview.classList.add('flex');
  }
}

function handleWorkerCompleteSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  showToast('Job completed & photo proof cryptographically signed into audit log!', 'success');
  setTimeout(() => {
    navigateTo('worker-completed', 'worker');
  }, 600);
}

function toggleWorkerAvailability() {
  isWorkerOnline = !isWorkerOnline;
  const label = document.getElementById('worker-status-label');
  const btn = document.getElementById('worker-status-btn');
  if (isWorkerOnline) {
    if (label) {
      label.textContent = 'ONLINE & AVAILABLE';
      label.className = 'font-mono text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300';
    }
    if (btn) {
      btn.textContent = 'Go Offline';
      btn.className = 'px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400 transition-colors';
    }
    showToast('Worker terminal is online for dispatches.', 'success');
  } else {
    if (label) {
      label.textContent = 'STATUS: OFFLINE';
      label.className = 'font-mono text-xs px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 font-bold border border-slate-300';
    }
    if (btn) {
      btn.textContent = 'Go Online';
      btn.className = 'px-3 py-1 bg-slate-700 text-white font-bold rounded-lg text-xs hover:bg-slate-600 transition-colors';
    }
    showToast('Status set to OFFLINE. Incoming dispatches paused.', 'warning');
  }
}

/**
 * Admin Operations & Dispatch Override
 */
function openInterventionModal(ticketId) {
  showModal('modal-admin-intervention');
}

function confirmInterventionSubmit() {
  const select = document.getElementById('override-worker-select');
  const worker = select ? select.value : 'WRK-0019';
  closeModal('modal-admin-intervention');
  showToast(`Administrative override: Reassigned to ${worker}.`, 'success');
}

function handleCreateWorkerSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const nameEl = document.getElementById('cw-name');
  const name = nameEl ? nameEl.value : 'Technician';
  showToast(`Worker account provisioned for ${name}. SMS invitation sent.`, 'success');
  setTimeout(() => {
    navigateTo('admin-workers', 'admin');
  }, 600);
}

/**
 * Super Admin Engine Tuning Controls
 */
function updateWeights() {
  const deptEl = document.getElementById('weight-dept');
  const skillEl = document.getElementById('weight-skill');
  const proxEl = document.getElementById('weight-prox');
  const fairEl = document.getElementById('weight-fair');

  const deptVal = document.getElementById('weight-dept-val');
  const skillVal = document.getElementById('weight-skill-val');
  const proxVal = document.getElementById('weight-prox-val');
  const fairVal = document.getElementById('weight-fair-val');

  if (deptEl && deptVal) deptVal.textContent = deptEl.value + '%';
  if (skillEl && skillVal) skillVal.textContent = skillEl.value + '%';
  if (proxEl && proxVal) proxVal.textContent = proxEl.value + '%';
  if (fairEl && fairVal) fairVal.textContent = fairEl.value + '%';
}

function updateTimeoutVal(val) {
  const el = document.getElementById('sla-timeout-val');
  if (el) el.textContent = `${val} Minutes (${val == 30 ? 'Standard' : 'Custom'})`;
}

function saveAssignmentWeights() {
  showToast('Algorithm weights updated! Dispatch engine re-balanced.', 'success');
}

/**
 * System States QA Inspector
 */
function openSystemStatesModal() {
  showModal('modal-system-states');
}

function renderSystemState(type) {
  const container = document.getElementById('system-state-output');
  if (!container) return;

  const states = {
    empty: `
      <div class="py-4 text-center">
        <span class="material-symbols-outlined text-[32px] text-slate-400">inbox</span>
        <h4 class="font-bold text-slate-800 text-xs mt-1">No Active Maintenance Requests</h4>
        <p class="text-[11px] text-slate-500">All campus facility work orders in this block are currently resolved.</p>
      </div>`,
    loading: `
      <div class="w-full space-y-2 py-2 animate-pulse">
        <div class="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
        <div class="h-3 bg-slate-200 rounded w-1/2 mx-auto"></div>
        <div class="h-8 bg-slate-200 rounded w-full"></div>
      </div>`,
    timeout: `
      <div class="py-2 text-center text-red-700">
        <span class="material-symbols-outlined text-[28px]">timer_off</span>
        <h4 class="font-bold text-xs mt-1">30-Minute SLA Acceptance Expired</h4>
        <p class="text-[11px] text-slate-600">Candidate technician WRK-0018 failed to respond within 30m window. Autonomous cascading engaged → Dispatched to standby unit WRK-0019.</p>
      </div>`,
    unauthorized: `
      <div class="py-2 text-center text-amber-700">
        <span class="material-symbols-outlined text-[28px]">shield</span>
        <h4 class="font-bold text-xs mt-1">403 Forbidden: Jurisdiction Boundary</h4>
        <p class="text-[11px] text-slate-600">You are assigned as Warden of Academic Block B. You cannot verify complaints lodged in Residential Hostel Block C.</p>
      </div>`,
    offline: `
      <div class="py-2 text-center text-blue-700">
        <span class="material-symbols-outlined text-[28px]">wifi_off</span>
        <h4 class="font-bold text-xs mt-1">Offline Cached Mode Active</h4>
        <p class="text-[11px] text-slate-600">Underground Plant Room detected. Work order stored locally and will sync telemetry once back on campus Wi-Fi.</p>
      </div>`,
    completed: `
      <div class="py-2 text-center text-emerald-700">
        <span class="material-symbols-outlined text-[28px]">verified</span>
        <h4 class="font-bold text-xs mt-1">Job Sealed & Cryptographically Hashed</h4>
        <p class="text-[11px] text-slate-600">Proof photo watermarked with timestamp Nov 18 2026. Hash SHA-256 e3b0c44298fc1c149afbf4c8996fb924.</p>
      </div>`
  };

  container.innerHTML = states[type] || '<div class="text-xs text-slate-500">State rendered</div>';
}

/**
 * 30-Minute SLA Ticking Countdown Engine
 */
let countdownSeconds = 1694; // ~28 min 14 sec
function startSLACountdown() {
  const timer = setInterval(() => {
    if (countdownSeconds > 0) {
      countdownSeconds--;
      const m = Math.floor(countdownSeconds / 60);
      const s = countdownSeconds % 60;
      const str = `${m}m ${s < 10 ? '0' : ''}${s}s`;
      const el = document.getElementById('sla-countdown-timer');
      if (el) el.textContent = str;
      document.querySelectorAll('.countdown-display').forEach(d => { d.textContent = str; });
      const progress = document.getElementById('sla-progress-bar');
      if (progress) progress.style.width = ((countdownSeconds / 1800) * 100) + '%';
    } else {
      clearInterval(timer);
      const el = document.getElementById('sla-countdown-timer');
      if (el) el.textContent = '00m 00s (EXPIRED)';
      document.querySelectorAll('.countdown-display').forEach(d => { d.textContent = '00m 00s (EXPIRED)'; });
      showToast('30-Minute SLA expired! Auto-reassigning secondary worker...', 'error');
    }
  }, 1000);
}

/**
 * Client-side Search & Dynamic Filter Engine
 */
function initInteractiveFilters() {
  // Wire all search inputs to filter tables on page
  document.querySelectorAll('input[type="text"]').forEach(input => {
    const isSearch = (input.placeholder && input.placeholder.toLowerCase().includes('search')) ||
                     (input.id && input.id.toLowerCase().includes('search'));
    if (isSearch) {
      input.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        document.querySelectorAll('table tbody').forEach(tbody => {
          tbody.querySelectorAll('tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = query === '' || text.includes(query) ? '' : 'none';
          });
        });
      });
    }
  });

  // Wire select dropdown filters
  document.querySelectorAll('select').forEach(sel => {
    const firstOpt = sel.options[0] ? sel.options[0].text.toLowerCase() : '';
    if (firstOpt.includes('all departments') || firstOpt.includes('all statuses')) {
      sel.addEventListener('change', function() {
        const val = this.value.toLowerCase();
        const isAll = val.includes('all');
        document.querySelectorAll('table tbody').forEach(tbody => {
          tbody.querySelectorAll('tr').forEach(row => {
            if (isAll) {
              row.style.display = '';
            } else {
              const text = row.textContent.toLowerCase();
              row.style.display = text.includes(val) ? '' : 'none';
            }
          });
        });
      });
    }
  });

  // Make topbar search box interactive if it is a styled div
  const topbarSearchDiv = document.querySelector('header .hidden.sm\\:flex.items-center.gap-2');
  if (topbarSearchDiv && !topbarSearchDiv.querySelector('input')) {
    topbarSearchDiv.style.cursor = 'text';
    topbarSearchDiv.addEventListener('click', function() {
      // Find existing search input on page if available
      const pageSearch = document.querySelector('main input[placeholder*="Search"], main input[placeholder*="search"]');
      if (pageSearch) {
        pageSearch.focus();
        pageSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const query = prompt('Search campus maintenance records:');
        if (query !== null) {
          const q = query.toLowerCase().trim();
          document.querySelectorAll('table tbody tr').forEach(row => {
            row.style.display = q === '' || row.textContent.toLowerCase().includes(q) ? '' : 'none';
          });
          if (q) showToast(`Filtered records for: "${query}"`, 'info');
        }
      }
    });
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  startSLACountdown();
  initInteractiveFilters();
});

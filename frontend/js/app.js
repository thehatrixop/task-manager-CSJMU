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
 * =========================================================================
 * REAL-TIME MULTI-ROLE SYNCHRONIZATION & SHARED STATE ENGINE
 * Automatically synchronizes complaints, warden verifications, technician
 * dispatches, and administrative oversight across all role portals.
 * =========================================================================
 */

const CF_STORAGE_KEY = 'campusflow_complaints_v3';
const CF_AUDIT_KEY = 'campusflow_audit_logs_v3';

const BASELINE_COMPLAINTS = [
  {
    id: 'CF-2026-00124',
    title: 'Switchboard Malfunction & Sparking',
    department: 'Electrical',
    category: 'Hazardous / Sparking',
    location: 'Academic Block B, Rm 204',
    priority: 'High',
    description: 'Main laboratory switchboard in Room 204 experienced intermittent sparking when high-draw oscilloscopes were activated.',
    status: 'ACTIVE_IN_PROGRESS',
    complainant: 'Aarav Patel (Student)',
    complainantId: '2024-ENG-UG-0142',
    warden: 'Dr. Ramesh Sharma',
    worker: 'Rajesh Kumar (WRK-0018)',
    submittedTime: '18 min ago',
    timestamp: Date.now() - 18 * 60 * 1000
  },
  {
    id: 'CF-2026-00125',
    title: 'HVAC Chiller Condensate Leak',
    department: 'HVAC',
    category: 'Leakage / Burst',
    location: 'Academic Block B, Server Rm 102',
    priority: 'High',
    description: 'Condensate pan overflowing in Server Room 102. Moisture detected near floor raceways.',
    status: 'PENDING_VERIFICATION',
    complainant: 'Prof. Ananya Sen (Faculty)',
    complainantId: 'FAC-ENG-089',
    warden: 'Dr. Ramesh Sharma',
    worker: 'Pending Dispatch Engine',
    submittedTime: '45 min ago',
    timestamp: Date.now() - 45 * 60 * 1000
  },
  {
    id: 'CF-2026-00126',
    title: 'Water Pressure Loss in Common Restrooms',
    department: 'Plumbing',
    category: 'Equipment Failure',
    location: 'Hostel Block C, Ground Floor Washrooms',
    priority: 'Medium',
    description: 'Water pressure dropped completely in ground floor washrooms during peak morning hours.',
    status: 'PENDING_VERIFICATION',
    complainant: 'Kabir Mehta (Student)',
    complainantId: '2023-CIV-UG-0081',
    warden: 'Dr. Ramesh Sharma',
    worker: 'Pending Dispatch Engine',
    submittedTime: '1 hr ago',
    timestamp: Date.now() - 60 * 60 * 1000
  },
  {
    id: 'CF-2026-00122',
    title: 'Library 3rd Floor Water Cooler Low Pressure',
    department: 'Plumbing',
    category: 'Routine Maintenance',
    location: 'Central Library, 3F',
    priority: 'Low',
    description: 'Filter replacement and flow valve tuning required.',
    status: 'COMPLETED_RESOLVED',
    complainant: 'Aarav Patel (Student)',
    complainantId: '2024-ENG-UG-0142',
    warden: 'Dr. Ramesh Sharma',
    worker: 'Vikram Singh (WRK-0019)',
    submittedTime: 'Nov 07, 2026',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
  }
];

function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(CF_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('[CampusStore] Error reading complaints:', e);
  }
  localStorage.setItem(CF_STORAGE_KEY, JSON.stringify(BASELINE_COMPLAINTS));
  return BASELINE_COMPLAINTS;
}

function saveStoredComplaints(complaints) {
  try {
    localStorage.setItem(CF_STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('[CampusStore] Error saving complaints:', e);
  }

  // Cross-tab broadcast
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('campusflow_bus');
      bc.postMessage({ type: 'STATE_CHANGED', timestamp: Date.now() });
      bc.close();
    } catch (err) {}
  }
  window.dispatchEvent(new CustomEvent('campusflow:state_changed', { detail: { complaints } }));
}

function getStoredAuditLogs() {
  try {
    const raw = localStorage.getItem(CF_AUDIT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const defaults = [
    { id: 'EVT-90412', actor: 'Rajesh Kumar', role: 'Worker', action: 'ACCEPT_DISPATCH', entity: 'CF-2026-00124', transition: 'DISPATCHED → ACTIVE', time: '09:44:12 AM' },
    { id: 'EVT-90411', actor: 'SYSTEM_ENGINE', role: 'Autonomous', action: 'DISPATCH_WORKER', entity: 'CF-2026-00124', transition: 'VERIFIED → DISPATCHED', time: '09:42:26 AM' },
    { id: 'EVT-90410', actor: 'Dr. Ramesh Sharma', role: 'Authority', action: 'APPROVE_TICKET', entity: 'CF-2026-00124', transition: 'PENDING → VERIFIED', time: '09:42:15 AM' }
  ];
  localStorage.setItem(CF_AUDIT_KEY, JSON.stringify(defaults));
  return defaults;
}

function addAuditLog(actor, role, action, entity, transition) {
  const logs = getStoredAuditLogs();
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const eventId = 'EVT-' + Math.floor(90413 + logs.length);
  logs.unshift({ id: eventId, actor, role, action, entity, transition, time: timeStr });
  localStorage.setItem(CF_AUDIT_KEY, JSON.stringify(logs.slice(0, 50)));
}

function getStatusBadgeHtml(status, workerName) {
  switch (status) {
    case 'PENDING_VERIFICATION':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-mono text-[10px] font-semibold border border-amber-200">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending Authority
      </span>`;
    case 'VERIFIED_DISPATCHED':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-semibold border border-indigo-200">
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> Dispatched (Searching...)
      </span>`;
    case 'ACTIVE_IN_PROGRESS':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold border border-blue-200">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> In Progress (${workerName || 'Rajesh K.'})
      </span>`;
    case 'COMPLETED_RESOLVED':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-[10px] font-semibold border border-emerald-200">
        <span class="material-symbols-outlined text-[12px] text-emerald-600">check</span> Resolved
      </span>`;
    case 'REJECTED':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 font-mono text-[10px] font-semibold border border-red-200">
        <span class="material-symbols-outlined text-[12px] text-red-600">cancel</span> Rejected
      </span>`;
    default:
      return `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px]">${status}</span>`;
  }
}

function getPriorityBadgeHtml(priority) {
  const p = (priority || 'Medium').toLowerCase();
  if (p === 'emergency' || p === 'critical') {
    return `<span class="px-2 py-0.5 bg-red-100 text-red-800 rounded font-mono text-[10px] font-bold border border-red-200 animate-pulse">Emergency</span>`;
  } else if (p === 'high') {
    return `<span class="px-2 py-0.5 bg-red-50 text-red-700 rounded font-mono text-[10px] font-bold border border-red-200">High</span>`;
  } else if (p === 'medium') {
    return `<span class="px-2 py-0.5 bg-amber-50 text-amber-700 rounded font-mono text-[10px] font-semibold border border-amber-200">Medium</span>`;
  }
  return `<span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[10px]">Low</span>`;
}

function getDeptBadgeHtml(dept) {
  const d = (dept || 'General').toLowerCase();
  let color = 'bg-slate-100 text-slate-700';
  if (d.includes('elect')) color = 'bg-amber-50 text-amber-800 border-amber-200';
  else if (d.includes('plumb')) color = 'bg-blue-50 text-blue-800 border-blue-200';
  else if (d.includes('hvac')) color = 'bg-teal-50 text-teal-800 border-teal-200';
  else if (d.includes('civil')) color = 'bg-stone-50 text-stone-800 border-stone-200';
  else if (d.includes('carpent')) color = 'bg-orange-50 text-orange-800 border-orange-200';
  return `<span class="px-2 py-0.5 ${color} rounded font-mono text-[10px] border">${dept || 'General'}</span>`;
}

/**
 * Complainant / User Portal Actions
 */
function handleUserComplaintSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const titleEl = document.getElementById('report-title');
  const deptEl = document.getElementById('report-dept');
  const catEl = document.getElementById('report-category');
  const locEl = document.getElementById('report-location');
  const descEl = document.getElementById('report-desc');
  const prioEl = document.querySelector('input[name="report-priority"]:checked');

  const title = titleEl && titleEl.value.trim() ? titleEl.value.trim() : 'Facility Issue';
  const dept = deptEl ? deptEl.value : 'General';
  const category = catEl ? catEl.value : 'Hazardous / Sparking';
  const location = locEl && locEl.value.trim() ? locEl.value.trim() : 'Academic Block B, Rm 204';
  const description = descEl && descEl.value.trim() ? descEl.value.trim() : 'Reported issue by student.';
  const priority = prioEl ? prioEl.value : 'High';

  const complaints = getStoredComplaints();
  let maxNum = 126;
  complaints.forEach(c => {
    const match = c.id && c.id.match(/CF-2026-00(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxNum) maxNum = n;
    }
  });
  const newTicketId = `CF-2026-00${maxNum + 1}`;

  const newTicket = {
    id: newTicketId,
    title,
    department: dept,
    category,
    location,
    priority,
    description,
    status: 'PENDING_VERIFICATION',
    complainant: 'Aarav Patel (Student)',
    complainantId: '2024-ENG-UG-0142',
    warden: 'Dr. Ramesh Sharma',
    worker: 'Pending Authority Verification',
    submittedTime: 'Just now',
    timestamp: Date.now()
  };

  complaints.unshift(newTicket);
  saveStoredComplaints(complaints);
  addAuditLog('Aarav Patel', 'Complainant', 'CREATE_TICKET', newTicketId, 'NONE → PENDING_VERIFICATION');

  // Asynchronously notify backend gateway
  try {
    fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newTicketId,
        title,
        department: dept,
        locationDesc: location,
        priority,
        description,
        complainant: 'Aarav Patel (Student)'
      })
    }).catch(() => {});
  } catch (err) {}

  const successEl = document.getElementById('success-ticket-id');
  if (successEl) successEl.textContent = newTicketId;

  showModal('modal-submit-success');
  showToast(`Complaint ${newTicketId} logged! Warden and Director dashboards updated in real time.`, 'success');

  // Reset inputs
  if (titleEl) titleEl.value = '';
  if (locEl) locEl.value = '';
  if (descEl) descEl.value = '';
  removeMockFile();

  renderActiveDashboard();
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
  const targetId = ticketId || 'CF-2026-00124';
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === targetId);

  if (ticket) {
    ticket.status = 'VERIFIED_DISPATCHED';
    ticket.worker = 'Rajesh Kumar (WRK-0018)';
    ticket.submittedTime = 'Just now';
    saveStoredComplaints(complaints);
    addAuditLog('Dr. Ramesh Sharma', 'Authority', 'APPROVE_TICKET', targetId, 'PENDING → VERIFIED_DISPATCHED');
  }

  // Update backend gateway
  try {
    fetch('/api/dispatch/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: targetId, workerId: 'WRK-0018' })
    }).catch(() => {});
  } catch (err) {}

  const approvedEl = document.getElementById('approved-ticket-id');
  if (approvedEl) approvedEl.textContent = targetId;

  showModal('modal-approve-confirm');
  showToast(`Ticket ${targetId} approved & verified! Dispatched to Rajesh Kumar.`, 'success');

  renderActiveDashboard();
}

function openRejectModal(ticketId) {
  activeRejectTicketId = ticketId || 'CF-2026-00124';
  showModal('modal-reject-reason');
}

function confirmRejectSubmit() {
  const reasonEl = document.getElementById('reject-reason-text');
  const reason = reasonEl && reasonEl.value.trim() ? reasonEl.value.trim() : 'Duplicate report or out of jurisdiction.';

  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === activeRejectTicketId);
  if (ticket) {
    ticket.status = 'REJECTED';
    ticket.rejectReason = reason;
    ticket.submittedTime = 'Just now';
    saveStoredComplaints(complaints);
    addAuditLog('Dr. Ramesh Sharma', 'Authority', 'REJECT_TICKET', activeRejectTicketId, 'PENDING → REJECTED');
  }

  closeModal('modal-reject-reason');
  if (reasonEl) reasonEl.value = '';
  showToast(`Ticket ${activeRejectTicketId} rejected with administrative reason.`, 'error');

  renderActiveDashboard();
}

function openRequestInfoModal(ticketId) {
  showModal('modal-request-info');
}

function confirmRequestInfoSubmit() {
  closeModal('modal-request-info');
  showToast('Clarification request sent to complainant.', 'info');
}

/**
 * Worker / Field Technician Actions
 */
let isWorkerOnline = true;

function acceptJobWorker(ticketId) {
  const targetId = ticketId || 'CF-2026-00124';
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === targetId);
  if (ticket) {
    ticket.status = 'ACTIVE_IN_PROGRESS';
    ticket.worker = 'Rajesh Kumar (WRK-0018)';
    ticket.submittedTime = 'Just now';
    saveStoredComplaints(complaints);
    addAuditLog('Rajesh Kumar', 'Worker', 'ACCEPT_JOB', targetId, 'DISPATCHED → ACTIVE_IN_PROGRESS');
  }

  showToast(`Job ${targetId} accepted! Locked into Active Work Order.`, 'success');
  renderActiveDashboard();
  setTimeout(() => {
    navigateTo('worker-active', 'worker');
  }, 600);
}

function openWorkerDeclineModal(ticketId) {
  showModal('modal-worker-decline');
}

function confirmWorkerDeclineSubmit() {
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.status === 'VERIFIED_DISPATCHED' || c.id === 'CF-2026-00124') || complaints[0];
  const targetId = ticket ? ticket.id : 'CF-2026-00124';
  if (ticket) {
    ticket.worker = 'Vikram Singh (WRK-0019)';
    ticket.submittedTime = 'Just now';
    saveStoredComplaints(complaints);
    addAuditLog('Rajesh Kumar', 'Worker', 'DECLINE_CASCADE', targetId, 'REASSIGNED → WRK-0019');
  }
  closeModal('modal-worker-decline');
  showToast('Job declined. Cascaded autonomously to secondary standby unit WRK-0019.', 'info');
  renderActiveDashboard();
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
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.status === 'ACTIVE_IN_PROGRESS') || complaints[0];
  if (ticket) {
    ticket.status = 'COMPLETED_RESOLVED';
    ticket.submittedTime = 'Just now';
    saveStoredComplaints(complaints);
    addAuditLog('Rajesh Kumar', 'Worker', 'SEAL_COMPLETION', ticket.id, 'ACTIVE → COMPLETED_RESOLVED');
  }
  showToast('Job completed & photo proof cryptographically signed into audit log!', 'success');
  renderActiveDashboard();
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
  const worker = select ? select.value : 'WRK-0019 (Vikram Singh)';
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === 'CF-2026-00124') || complaints[0];
  if (ticket) {
    ticket.worker = worker;
    ticket.submittedTime = 'Just now';
    saveStoredComplaints(complaints);
    addAuditLog('Vikramaditya Rao', 'Admin', 'MANUAL_OVERRIDE', ticket.id, `REASSIGNED → ${worker}`);
  }
  closeModal('modal-admin-intervention');
  showToast(`Administrative override: Reassigned ${ticket ? ticket.id : ''} to ${worker}.`, 'success');
  renderActiveDashboard();
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
 * Master Cross-Role Real-Time Rendering Engine
 */
function renderActiveDashboard() {
  const path = window.location.pathname.toLowerCase();
  const complaints = getStoredComplaints();
  const pendingTickets = complaints.filter(c => c.status === 'PENDING_VERIFICATION');
  const activeTickets = complaints.filter(c => c.status === 'ACTIVE_IN_PROGRESS' || c.status === 'VERIFIED_DISPATCHED');
  const resolvedTickets = complaints.filter(c => c.status === 'COMPLETED_RESOLVED');

  // 1. STUDENT - My Complaints (user/my-complaints.html)
  const userFullTable = document.getElementById('user-complaints-full-table') ||
    (path.includes('my-complaints') ? document.querySelector('main table tbody') : null);
  if (userFullTable) {
    userFullTable.innerHTML = complaints.map(c => `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3.5 px-4 font-mono font-bold text-slate-900">${c.id}</td>
        <td class="py-3.5 px-4 font-semibold text-slate-900">${c.title}</td>
        <td class="py-3.5 px-4">${getDeptBadgeHtml(c.department)}</td>
        <td class="py-3.5 px-4 text-slate-600">${c.location}</td>
        <td class="py-3.5 px-4">${getPriorityBadgeHtml(c.priority)}</td>
        <td class="py-3.5 px-4">${getStatusBadgeHtml(c.status, c.worker)}</td>
        <td class="py-3.5 px-4 font-mono text-slate-500">${c.submittedTime || 'Recently'}</td>
        <td class="py-3.5 px-4 text-right">
          <button onclick="navigateTo('user-complaint-details', 'user')" class="px-3 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-emerald-600 transition-colors">
            Inspect
          </button>
        </td>
      </tr>
    `).join('');
  }

  // 2. STUDENT - Overview (user/overview.html)
  const userRecentTable = document.getElementById('user-recent-table') ||
    (path.includes('user/overview') ? document.querySelector('main table tbody') : null);
  if (userRecentTable) {
    userRecentTable.innerHTML = complaints.slice(0, 5).map(c => `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 font-mono font-bold text-slate-900">${c.id}</td>
        <td class="py-3 font-medium text-slate-900">${c.title}</td>
        <td class="py-3">${getDeptBadgeHtml(c.department)}</td>
        <td class="py-3 text-slate-600">${c.location}</td>
        <td class="py-3 text-slate-500 font-mono">${c.submittedTime || 'Recently'}</td>
        <td class="py-3">${getStatusBadgeHtml(c.status, c.worker)}</td>
        <td class="py-3 text-right">
          <button onclick="navigateTo('user-complaint-details', 'user')" class="text-blue-600 hover:underline font-semibold">Inspect</button>
        </td>
      </tr>
    `).join('');

    const kpiCards = document.querySelectorAll('main .grid.grid-cols-2.lg\\:grid-cols-4 > div');
    if (kpiCards.length >= 4) {
      const totalNum = kpiCards[0].querySelector('.text-2xl');
      if (totalNum) totalNum.textContent = complaints.length;
      const pendingNum = kpiCards[1].querySelector('.text-2xl');
      if (pendingNum) pendingNum.textContent = pendingTickets.length;
      const activeNum = kpiCards[2].querySelector('.text-2xl');
      if (activeNum) activeNum.textContent = activeTickets.length;
      const resolvedNum = kpiCards[3].querySelector('.text-2xl');
      if (resolvedNum) resolvedNum.textContent = resolvedTickets.length;
    }
  }

  // 3. AUTHORITY / WARDEN - Verification Queue (authority/verification-queue.html)
  if (path.includes('verification-queue')) {
    const queueTbody = document.querySelector('main table tbody');
    if (queueTbody) {
      if (pendingTickets.length === 0) {
        queueTbody.innerHTML = `
          <tr>
            <td colspan="8" class="py-8 text-center text-slate-500 font-mono text-xs">
              <span class="material-symbols-outlined text-[28px] text-emerald-500 block mb-1">task_alt</span>
              No pending requests awaiting verification. All jurisdiction items verified.
            </td>
          </tr>
        `;
      } else {
        queueTbody.innerHTML = pendingTickets.map(c => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-4 px-4 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-4 px-4">
              <div class="font-semibold text-slate-900">${c.complainant || 'Student'}</div>
              <div class="text-[10px] text-slate-400 font-mono">${c.complainantId || '2024-ENG-UG'}</div>
            </td>
            <td class="py-4 px-4 font-semibold text-slate-900">${c.title}</td>
            <td class="py-4 px-4">${getDeptBadgeHtml(c.department)}</td>
            <td class="py-4 px-4 text-slate-600">${c.location}</td>
            <td class="py-4 px-4">${getPriorityBadgeHtml(c.priority)}</td>
            <td class="py-4 px-4 font-mono text-slate-500">${c.submittedTime || 'Just now'}</td>
            <td class="py-4 px-4 text-right space-x-2">
              <button onclick="approveComplaint('${c.id}')" class="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 shadow-sm transition-colors">
                Approve & Dispatch
              </button>
              <button onclick="openRejectModal('${c.id}')" class="px-2.5 py-1.5 bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors">
                Reject
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // 4. AUTHORITY / WARDEN - Overview (authority/overview.html)
  if (path.includes('authority/overview')) {
    const kpiCards = document.querySelectorAll('main .grid.grid-cols-2.lg\\:grid-cols-4 > div');
    if (kpiCards.length >= 4) {
      const totalEl = kpiCards[0].querySelector('.text-2xl');
      if (totalEl) totalEl.textContent = 24 + complaints.length;
      const pendingEl = kpiCards[1].querySelector('.text-2xl');
      if (pendingEl) pendingEl.textContent = pendingTickets.length;
      const activeEl = kpiCards[2].querySelector('.text-2xl');
      if (activeEl) activeEl.textContent = 4 + activeTickets.length;
      const resolvedEl = kpiCards[3].querySelector('.text-2xl');
      if (resolvedEl) resolvedEl.textContent = 20 + resolvedTickets.length;
    }

    const reviewBtnSpan = document.querySelector('button[onclick*="authority-queue"] span:last-child');
    if (reviewBtnSpan) {
      reviewBtnSpan.textContent = `Review Queue (${pendingTickets.length} Pending)`;
    }

    const tableTbody = document.querySelector('main table tbody');
    if (tableTbody) {
      if (pendingTickets.length === 0) {
        tableTbody.innerHTML = `
          <tr>
            <td colspan="7" class="py-6 text-center text-slate-500 font-mono text-xs">
              All jurisdiction requests verified. Zero pending sign-offs.
            </td>
          </tr>
        `;
      } else {
        tableTbody.innerHTML = pendingTickets.map(c => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3.5 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-3.5 text-slate-700">${c.complainant || 'Student'}</td>
            <td class="py-3.5 font-semibold text-slate-900">${c.title}</td>
            <td class="py-3.5">${getDeptBadgeHtml(c.department)}</td>
            <td class="py-3.5 text-slate-600">${c.location}</td>
            <td class="py-3.5">${getPriorityBadgeHtml(c.priority)}</td>
            <td class="py-3.5 text-right space-x-2">
              <button onclick="approveComplaint('${c.id}')" class="px-3 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700 shadow-sm transition-colors">
                Approve & Dispatch
              </button>
              <button onclick="openRejectModal('${c.id}')" class="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors">
                Reject
              </button>
              <button onclick="openRequestInfoModal('${c.id}')" class="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold hover:bg-slate-200 transition-colors">
                Info
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // 5. FACILITIES ADMIN / DIRECTOR - Complaints Master (admin/complaints-master.html)
  if (path.includes('complaints-master')) {
    const adminTbody = document.querySelector('main table tbody');
    if (adminTbody) {
      adminTbody.innerHTML = complaints.map(c => `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3.5 px-4 font-mono font-bold text-slate-900">${c.id}</td>
          <td class="py-3.5 px-4 text-slate-700">${c.complainant || 'Complainant'}</td>
          <td class="py-3.5 px-4">${getDeptBadgeHtml(c.department)}</td>
          <td class="py-3.5 px-4 text-slate-600 font-mono">${c.location}</td>
          <td class="py-3.5 px-4">${getPriorityBadgeHtml(c.priority)}</td>
          <td class="py-3.5 px-4">${getStatusBadgeHtml(c.status, c.worker)}</td>
          <td class="py-3.5 px-4 font-semibold text-slate-900">${c.worker || 'Pending'}</td>
          <td class="py-3.5 px-4 text-right">
            <button onclick="navigateTo('admin-assignment-details', 'admin')" class="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-emerald-600 transition-colors">
              Inspect
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  // 6. FACILITIES ADMIN / DIRECTOR - Overview (admin/overview.html)
  if (path.includes('admin/overview')) {
    const kpiCards = document.querySelectorAll('main .grid.grid-cols-2.lg\\:grid-cols-4 > div');
    if (kpiCards.length >= 8) {
      const totalEl = kpiCards[0].querySelector('.text-2xl');
      if (totalEl) totalEl.textContent = (1424 + complaints.length).toLocaleString();
      const pendingEl = kpiCards[1].querySelector('.text-2xl');
      if (pendingEl) pendingEl.textContent = pendingTickets.length;
      const activeEl = kpiCards[2].querySelector('.text-2xl');
      if (activeEl) activeEl.textContent = 40 + activeTickets.length;
    }

    const telemetryTbody = document.querySelector('main table tbody');
    if (telemetryTbody) {
      const telemetryRows = complaints.slice(0, 6);
      telemetryTbody.innerHTML = telemetryRows.map(c => `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3.5 font-mono font-bold text-slate-900">${c.id}</td>
          <td class="py-3.5">${getDeptBadgeHtml(c.department)}</td>
          <td class="py-3.5 text-slate-700 font-mono">${c.location}</td>
          <td class="py-3.5 font-semibold text-slate-900">${c.worker || 'Pending Assignment'}</td>
          <td class="py-3.5 font-mono text-slate-500">${c.submittedTime || 'Recent'}</td>
          <td class="py-3.5">${getStatusBadgeHtml(c.status, c.worker)}</td>
          <td class="py-3.5 font-mono text-slate-600">SLA Active</td>
          <td class="py-3.5 text-right">
            <button onclick="openInterventionModal('${c.id}')" class="text-blue-600 hover:underline font-semibold font-mono">Override</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // 7. WORKER - Incoming Dispatch (worker/incoming-dispatch.html)
  if (path.includes('incoming-dispatch')) {
    const latestDispatched = complaints.find(c => c.status === 'VERIFIED_DISPATCHED') ||
      complaints.find(c => c.status === 'ACTIVE_IN_PROGRESS') || complaints[0];
    if (latestDispatched) {
      const idEl = document.querySelector('.text-lg.font-bold.font-mono.text-slate-900');
      if (idEl) idEl.textContent = latestDispatched.id;
      const deptEl = document.querySelector('.text-sm.font-bold.text-amber-700');
      if (deptEl) deptEl.textContent = latestDispatched.department;
      const titleEl = document.querySelector('h3.text-xs.font-bold.uppercase.text-slate-500 + p.text-base.font-bold');
      if (titleEl) titleEl.textContent = latestDispatched.title;
      const locEl = document.querySelector('.p-3.bg-slate-50.border.border-slate-200.rounded-xl.font-mono');
      if (locEl) locEl.textContent = latestDispatched.location;
      const descEl = document.querySelector('p.text-xs.text-slate-600.leading-relaxed.bg-slate-50');
      if (descEl) descEl.textContent = latestDispatched.description;

      const acceptBtn = document.querySelector('button[onclick*="acceptJobWorker"]');
      if (acceptBtn) acceptBtn.setAttribute('onclick', `acceptJobWorker('${latestDispatched.id}')`);
      const declineBtn = document.querySelector('button[onclick*="openWorkerDeclineModal"]');
      if (declineBtn) declineBtn.setAttribute('onclick', `openWorkerDeclineModal('${latestDispatched.id}')`);
    }
  }

  // 8. SUPER ADMIN - Audit Logs (super/audit-logs.html)
  if (path.includes('audit-logs')) {
    const auditTbody = document.querySelector('main table tbody');
    if (auditTbody) {
      const logs = getStoredAuditLogs();
      auditTbody.innerHTML = logs.map(l => `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-4 font-bold text-slate-900">${l.id}</td>
          <td class="py-3 px-4 text-slate-800">${l.actor}</td>
          <td class="py-3 px-4 text-slate-500">${l.role}</td>
          <td class="py-3 px-4 text-emerald-600 font-bold">${l.action}</td>
          <td class="py-3 px-4 font-mono font-bold">${l.entity}</td>
          <td class="py-3 px-4 text-slate-600">${l.transition}</td>
          <td class="py-3 px-4 text-slate-400 font-mono">${l.time}</td>
        </tr>
      `).join('');
    }
  }
}

// Cross-tab real-time sync listeners
if (typeof BroadcastChannel !== 'undefined') {
  try {
    const bc = new BroadcastChannel('campusflow_bus');
    bc.onmessage = (event) => {
      if (event.data && event.data.type === 'STATE_CHANGED') {
        renderActiveDashboard();
      }
    };
  } catch (e) {}
}

window.addEventListener('storage', (e) => {
  if (e.key === CF_STORAGE_KEY || e.key === CF_AUDIT_KEY) {
    renderActiveDashboard();
  }
});

window.addEventListener('campusflow:state_changed', () => {
  renderActiveDashboard();
});

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
  renderActiveDashboard();
  startSLACountdown();
  initInteractiveFilters();
});

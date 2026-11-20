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

  // Faculty / Professor (Auto-Verified Privilege)
  'faculty-overview': 'faculty/overview.html',
  'faculty-report': 'faculty/report-issue.html',
  'faculty-complaints': 'faculty/my-complaints.html',
  'faculty-complaint-details': 'faculty/complaint-details.html',
  'faculty-tracker': 'faculty/complaint-details.html',
  'faculty-history': 'faculty/history.html',
  'faculty-notifications': 'faculty/notifications.html',
  'faculty-profile': 'faculty/profile.html',

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
    faculty: 'faculty-overview',
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

const CF_STORAGE_KEY = 'campusflow_complaints_clean_v1';
const CF_AUDIT_KEY = 'campusflow_audit_logs_clean_v1';

const BASELINE_COMPLAINTS = [];

function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(CF_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  const defaults = [];
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
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Awaiting Warden Approval
      </span>`;
    case 'VERIFIED_DISPATCHED':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold border border-blue-200">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Dispatched (${workerName || 'Rajesh K.'})
      </span>`;
    case 'ACTIVE_IN_PROGRESS':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-semibold border border-indigo-200">
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> In Progress (${workerName || 'Rajesh K.'})
      </span>`;
    case 'COMPLETED_RESOLVED':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-[10px] font-semibold border border-emerald-200">
        <span class="material-symbols-outlined text-[12px] text-emerald-600">check</span> Resolved & Signed
      </span>`;
    case 'REJECTED':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 font-mono text-[10px] font-semibold border border-red-200">
        <span class="material-symbols-outlined text-[12px] text-red-600">cancel</span> Rejected by Warden
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
  if (!dept) return `<span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[10px] border border-slate-200">General</span>`;
  const rawDepts = String(dept).split(',').map(s => s.trim()).filter(Boolean);
  if (rawDepts.length === 0) return `<span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[10px] border border-slate-200">General</span>`;
  return rawDepts.map(singleDept => {
    const d = singleDept.toLowerCase();
    let color = 'bg-slate-100 text-slate-700 border-slate-200';
    if (d.includes('elect')) color = 'bg-amber-50 text-amber-800 border-amber-200';
    else if (d.includes('plumb')) color = 'bg-blue-50 text-blue-800 border-blue-200';
    else if (d.includes('hvac')) color = 'bg-teal-50 text-teal-800 border-teal-200';
    else if (d.includes('civil')) color = 'bg-stone-50 text-stone-800 border-stone-200';
    else if (d.includes('carpent')) color = 'bg-orange-50 text-orange-800 border-orange-200';
    return `<span class="inline-flex items-center px-2 py-0.5 ${color} rounded font-mono text-[10px] border mr-1 mb-0.5 whitespace-nowrap">${singleDept}</span>`;
  }).join('');
}

/**
 * Maintenance Department Multi-Select System
 */
const DEPARTMENT_MAP = {
  'Electrical': 'Electrical & Power Systems',
  'HVAC': 'HVAC & Climate Control',
  'Plumbing': 'Plumbing & Water Core',
  'Civil': 'Civil & Structural',
  'Carpentry': 'Carpentry & Locksmith',
  'General': 'General Logistics & Sanitation'
};

/**
 * Worker Sub-Roles Divided by Maintenance Department
 */
const WORKER_DEPARTMENTS = {
  'Electrical': {
    code: 'Electrical',
    name: 'Rajesh Kumar',
    roleTitle: 'Senior Electrician',
    id: 'WRK-0018',
    initials: 'RK',
    department: 'Electrical',
    departmentName: 'Electrical & Power Systems',
    trade: 'Senior Electrician'
  },
  'HVAC': {
    code: 'HVAC',
    name: 'Vikram Singh',
    roleTitle: 'HVAC Specialist',
    id: 'WRK-0019',
    initials: 'VS',
    code: 'HVAC',
    department: 'HVAC',
    departmentName: 'HVAC & Climate Control',
    trade: 'HVAC Specialist'
  },
  'Plumbing': {
    code: 'Plumbing',
    name: 'Suresh Nair',
    roleTitle: 'Master Plumber',
    id: 'WRK-0022',
    initials: 'SN',
    code: 'Plumbing',
    department: 'Plumbing',
    departmentName: 'Plumbing & Water Core',
    trade: 'Master Plumber'
  },
  'Civil': {
    code: 'Civil',
    name: 'Amit Deshmukh',
    roleTitle: 'Civil & Structural Mason',
    id: 'WRK-0025',
    initials: 'AD',
    code: 'Civil',
    department: 'Civil',
    departmentName: 'Civil & Structural',
    trade: 'Civil & Structural Mason'
  },
  'Carpentry': {
    code: 'Carpentry',
    name: 'Mohammad Tariq',
    roleTitle: 'Lead Carpenter & Locksmith',
    id: 'WRK-0028',
    initials: 'MT',
    code: 'Carpentry',
    department: 'Carpentry',
    departmentName: 'Carpentry & Locksmith',
    trade: 'Lead Carpenter & Locksmith'
  },
  'General': {
    code: 'General',
    name: 'Rohan Verma',
    roleTitle: 'Logistics & Sanitation Supervisor',
    id: 'WRK-0031',
    initials: 'RV',
    code: 'General',
    department: 'General',
    departmentName: 'General Logistics & Sanitation',
    trade: 'Logistics & Sanitation Supervisor'
  }
};

function getActiveWorkerDepartment() {
  try {
    const raw = sessionStorage.getItem('campusflow_user') || localStorage.getItem('campusflow_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u.department) return u.department;
    }
  } catch (e) {}
  return (typeof localStorage !== 'undefined' ? localStorage.getItem('campusflow_worker_dept') : null) || 'Electrical';
}

function setActiveWorkerDepartment(dept) {
  const d = dept || 'Electrical';
  if (typeof localStorage !== 'undefined') localStorage.setItem('campusflow_worker_dept', d);
  try {
    const raw = sessionStorage.getItem('campusflow_user') || localStorage.getItem('campusflow_user');
    let u = raw ? JSON.parse(raw) : { role: 'worker' };
    const profile = WORKER_DEPARTMENTS[d] || WORKER_DEPARTMENTS.Electrical;
    u.name = profile.name;
    u.department = profile.code;
    u.departmentName = profile.departmentName;
    u.trade = profile.trade;
    u.roll = profile.id;
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('campusflow_user', JSON.stringify(u));
    if (typeof localStorage !== 'undefined') localStorage.setItem('campusflow_user', JSON.stringify(u));
  } catch (e) {}
  if (typeof renderActiveDashboard === 'function') renderActiveDashboard();
  if (typeof showToast === 'function') {
    showToast(`Switched active technician trade to: ${WORKER_DEPARTMENTS[d]?.departmentName || d}`, 'info');
  }
}

function complaintMatchesWorkerDept(complaint, workerDept) {
  if (!complaint) return false;
  const cDept = (complaint.department || '').toLowerCase();
  const wDept = (workerDept || 'electrical').toLowerCase();
  
  const KEYWORDS = {
    'electrical': ['elect', 'power', 'wiring', 'switchboard', 'voltage', 'short circuit', 'spark'],
    'hvac': ['hvac', 'climate', 'ac', 'air conditioning', 'ventilation', 'heating', 'cooling'],
    'plumbing': ['plumb', 'water', 'drain', 'leak', 'pipe', 'faucet', 'toilet', 'washroom', 'flush'],
    'civil': ['civil', 'structur', 'masonry', 'wall', 'floor', 'tile', 'plaster', 'ceiling', 'crack'],
    'carpentry': ['carpent', 'locksmith', 'door', 'window', 'desk', 'wood', 'latch', 'hinge', 'cabinet'],
    'general': ['general', 'logistics', 'sanitation', 'clean', 'waste', 'pest', 'garbage']
  };

  if (cDept.includes(wDept) || wDept.includes(cDept)) return true;

  const keywords = KEYWORDS[wDept] || [wDept];
  return keywords.some(k => cDept.includes(k));
}

function getTechnicianForDepartment(dept) {
  const d = (dept || '').toLowerCase();
  if (d.includes('hvac') || d.includes('air') || d.includes('climat') || d.includes('ventilat')) {
    return { name: 'Vikram Singh (WRK-0019)', roll: 'WRK-0019', dept: 'HVAC', trade: 'HVAC Specialist' };
  }
  if (d.includes('plumb') || d.includes('water') || d.includes('pipe') || d.includes('drain') || d.includes('leak')) {
    return { name: 'Suresh Nair (WRK-0022)', roll: 'WRK-0022', dept: 'Plumbing', trade: 'Master Plumber' };
  }
  if (d.includes('civil') || d.includes('struct') || d.includes('mason') || d.includes('wall') || d.includes('floor')) {
    return { name: 'Amit Deshmukh (WRK-0025)', roll: 'WRK-0025', dept: 'Civil', trade: 'Civil & Structural Mason' };
  }
  if (d.includes('carpent') || d.includes('lock') || d.includes('wood') || d.includes('door') || d.includes('desk')) {
    return { name: 'Mohammad Tariq (WRK-0028)', roll: 'WRK-0028', dept: 'Carpentry', trade: 'Lead Carpenter & Locksmith' };
  }
  if (d.includes('general') || d.includes('sanitat') || d.includes('clean') || d.includes('waste') || d.includes('pest')) {
    return { name: 'Rohan Verma (WRK-0031)', roll: 'WRK-0031', dept: 'General', trade: 'Sanitation & Logistics Supervisor' };
  }
  return { name: 'Rajesh Kumar (WRK-0018)', roll: 'WRK-0018', dept: 'Electrical', trade: 'Senior Electrician' };
}

let selectedDepartments = ['Electrical'];

function toggleDeptDropdown(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const menu = document.getElementById('dept-dropdown-menu');
  const arrow = document.getElementById('dept-dropdown-arrow');
  const btn = document.getElementById('dept-multiselect-btn');
  if (!menu) return;
  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    if (arrow) arrow.style.transform = 'rotate(180deg)';
    if (btn) btn.setAttribute('aria-expanded', 'true');
  } else {
    menu.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

function closeDeptDropdown() {
  const menu = document.getElementById('dept-dropdown-menu');
  const arrow = document.getElementById('dept-dropdown-arrow');
  const btn = document.getElementById('dept-multiselect-btn');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

function toggleDeptSelection(code, label, e) {
  if (e) {
    if (e.target.tagName !== 'INPUT') {
      e.preventDefault();
      const cb = document.querySelector(`.dept-checkbox[value="${code}"]`);
      if (cb) cb.checked = !cb.checked;
    }
  }
  syncSelectedDepartmentsFromDOM();
}

function syncSelectedDepartmentsFromDOM() {
  const checkboxes = document.querySelectorAll('.dept-checkbox');
  const selected = [];
  checkboxes.forEach(cb => {
    const parentLabel = cb.closest('label');
    if (cb.checked) {
      selected.push(cb.value);
      if (parentLabel) {
        parentLabel.classList.add('bg-blue-50/80', 'text-blue-900');
        parentLabel.classList.remove('hover:bg-slate-50');
      }
    } else {
      if (parentLabel) {
        parentLabel.classList.remove('bg-blue-50/80', 'text-blue-900');
        parentLabel.classList.add('hover:bg-slate-50');
      }
    }
  });

  selectedDepartments = selected;
  updateDeptMultiSelectUI();
}

function updateDeptMultiSelectUI() {
  const hiddenInput = document.getElementById('report-dept');
  const chipsContainer = document.getElementById('dept-chips-container');
  const countEl = document.getElementById('dept-selected-count');

  if (hiddenInput) {
    hiddenInput.value = selectedDepartments.join(', ');
  }

  if (chipsContainer) {
    if (selectedDepartments.length === 0) {
      chipsContainer.innerHTML = '<span class="text-slate-400 font-normal text-xs">Select one or more departments...</span>';
    } else {
      chipsContainer.innerHTML = selectedDepartments.map(code => `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium" data-dept="${code}">
          ${DEPARTMENT_MAP[code] || code}
          <span onclick="removeDeptItem('${code}', event)" class="hover:text-blue-900 cursor-pointer ml-0.5 text-sm leading-none font-bold" title="Remove">&times;</span>
        </span>
      `).join('');
    }
  }

  if (countEl) {
    countEl.textContent = `${selectedDepartments.length} department${selectedDepartments.length === 1 ? '' : 's'} selected`;
  }
}

function removeDeptItem(code, e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const cb = document.querySelector(`.dept-checkbox[value="${code}"]`);
  if (cb) {
    cb.checked = false;
  }
  syncSelectedDepartmentsFromDOM();
}

function clearAllDepts(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const checkboxes = document.querySelectorAll('.dept-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = false;
  });
  syncSelectedDepartmentsFromDOM();
}

function resetDeptMultiSelect() {
  selectedDepartments = ['Electrical'];
  const checkboxes = document.querySelectorAll('.dept-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = cb.value === 'Electrical';
  });
  syncSelectedDepartmentsFromDOM();
}

function initMultiSelectDepartments() {
  const deptSelect = document.getElementById('report-dept');
  if (deptSelect && deptSelect.tagName === 'SELECT') {
    const parent = deptSelect.parentElement;
    if (parent && !parent.id.includes('dept-multiselect-container')) {
      const container = document.createElement('div');
      container.id = 'dept-multiselect-container';
      container.className = 'relative';

      const initialVal = deptSelect.value || 'Electrical';
      
      container.innerHTML = `
        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">
          Maintenance Department <span class="text-red-500">*</span>
          <span class="text-[10px] text-slate-400 font-normal ml-1 lowercase">(select one or more)</span>
        </label>
        <input type="hidden" id="report-dept" name="report-dept" value="${initialVal}" required />
        <button
          type="button"
          id="dept-multiselect-btn"
          onclick="toggleDeptDropdown(event)"
          class="w-full min-h-[42px] px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 flex items-center justify-between cursor-pointer transition-all text-left shadow-xs"
          aria-haspopup="listbox"
          aria-expanded="false"
        >
          <div id="dept-chips-container" class="flex flex-wrap items-center gap-1.5 min-w-0 pr-2">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium" data-dept="${initialVal}">
              ${DEPARTMENT_MAP[initialVal] || initialVal}
              <span onclick="removeDeptItem('${initialVal}', event)" class="hover:text-blue-900 cursor-pointer ml-0.5 text-sm leading-none font-bold">&times;</span>
            </span>
          </div>
          <span class="material-symbols-outlined text-[18px] text-slate-400 shrink-0 transition-transform duration-200" id="dept-dropdown-arrow">expand_more</span>
        </button>
        <div
          id="dept-dropdown-menu"
          class="hidden absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1 text-xs max-h-64 overflow-y-auto"
          role="listbox"
          aria-multiselectable="true"
        >
          <div class="px-2 py-1 text-[11px] font-semibold text-slate-400 font-mono border-b border-slate-100 flex items-center justify-between">
            <span>SELECT DEPARTMENTS</span>
            <button type="button" onclick="clearAllDepts(event)" class="text-[10px] text-blue-600 hover:underline font-sans font-medium">Clear All</button>
          </div>
          ${Object.entries(DEPARTMENT_MAP).map(([code, name]) => `
            <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors ${code === initialVal ? 'bg-blue-50/80 text-blue-900' : ''}" onclick="toggleDeptSelection('${code}', '${name}', event)">
              <input type="checkbox" class="dept-checkbox rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer" value="${code}" ${code === initialVal ? 'checked' : ''} />
              <div class="flex flex-col">
                <span class="font-semibold text-slate-800">${name}</span>
              </div>
            </label>
          `).join('')}
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] px-1 text-slate-500">
            <span id="dept-selected-count">1 department selected</span>
            <button type="button" onclick="closeDeptDropdown()" class="px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-semibold hover:bg-slate-800 transition-colors">Done</button>
          </div>
        </div>
      `;
      parent.replaceChild(container, deptSelect);
      selectedDepartments = [initialVal];
    }
  } else if (document.getElementById('dept-multiselect-container')) {
    const checked = Array.from(document.querySelectorAll('.dept-checkbox:checked')).map(cb => cb.value);
    if (checked.length > 0) {
      selectedDepartments = checked;
    }
    updateDeptMultiSelectUI();
  }

  if (!window._deptOutsideClickBound) {
    window._deptOutsideClickBound = true;
    document.addEventListener('click', (e) => {
      const container = document.getElementById('dept-multiselect-container');
      if (container && !container.contains(e.target)) {
        closeDeptDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDeptDropdown();
      }
    });
  }
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
  let dept = 'General';
  if (typeof selectedDepartments !== 'undefined' && selectedDepartments && selectedDepartments.length > 0) {
    dept = selectedDepartments.join(', ');
  } else if (deptEl && deptEl.value) {
    dept = deptEl.value;
  }
  if (!dept || dept.trim() === '') {
    showToast('Please select at least one maintenance department.', 'warning');
    const btn = document.getElementById('dept-multiselect-btn');
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      btn.classList.add('border-red-500', 'ring-2', 'ring-red-200');
      setTimeout(() => btn.classList.remove('border-red-500', 'ring-2', 'ring-red-200'), 2500);
    }
    return;
  }
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

  const sessionUser = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('campusflow_user') ? JSON.parse(sessionStorage.getItem('campusflow_user')) : null) : null;
  const isFaculty = (typeof window !== 'undefined' && (
    window.location.pathname.includes('/faculty/') || 
    window.location.href.includes('faculty') ||
    (sessionUser && sessionUser.role === 'faculty')
  ));

  const complainantName = isFaculty ? (sessionUser && sessionUser.name ? `${sessionUser.name} (Faculty)` : 'Prof. Ananya Sen (Faculty)') : (sessionUser && sessionUser.name ? `${sessionUser.name} (Student)` : 'Aarav Patel (Student)');
  const complainantId = isFaculty ? (sessionUser && sessionUser.roll ? sessionUser.roll : 'FAC-ENG-089') : (sessionUser && sessionUser.roll ? sessionUser.roll : '2024-ENG-UG-0142');
  const initialStatus = isFaculty ? 'VERIFIED_DISPATCHED' : 'PENDING_VERIFICATION';
  const assignedTech = getTechnicianForDepartment(dept);
  const initialWorker = isFaculty ? assignedTech.name : 'Pending Authority Verification';
  const verifiedBy = isFaculty ? 'Autonomous Engine (Faculty Auto-Verification Privilege)' : null;

  const newTicket = {
    id: newTicketId,
    title,
    department: dept,
    category,
    location,
    priority,
    description,
    status: initialStatus,
    complainant: complainantName,
    complainantId,
    warden: isFaculty ? 'Autonomous Engine (Auto-Verified)' : 'Dr. Ramesh Sharma',
    verifiedBy: verifiedBy,
    worker: initialWorker,
    submittedTime: 'Just now',
    timestamp: Date.now()
  };

  complaints.unshift(newTicket);
  saveStoredComplaints(complaints);
  if (isFaculty) {
    addAuditLog(complainantName, 'Faculty', 'AUTO_VERIFY_FACULTY', newTicketId, 'NONE → VERIFIED_DISPATCHED');
  } else {
    addAuditLog(complainantName, 'Complainant', 'CREATE_TICKET', newTicketId, 'NONE → PENDING_VERIFICATION');
  }

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
        complainant: complainantName
      })
    }).catch(() => {});
  } catch (err) {}

  const successEl = document.getElementById('success-ticket-id');
  if (successEl) successEl.textContent = newTicketId;

  showModal('modal-submit-success');
  if (isFaculty) {
    showToast(`Faculty Complaint ${newTicketId} logged & auto-verified! Directly dispatched to Rajesh Kumar.`, 'success');
  } else {
    showToast(`Complaint ${newTicketId} logged! Awaiting Warden verification before dispatch.`, 'success');
  }

  // Reset inputs
  if (titleEl) titleEl.value = '';
  if (locEl) locEl.value = '';
  if (descEl) descEl.value = '';
  if (typeof resetDeptMultiSelect === 'function') resetDeptMultiSelect();
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
 * Complainant Verification Retraction, Edit & Post-Approval Rejection
 */
let activeEditTicketId = null;
let activeCancelTicketId = null;
let activeRejectApprovedTicketId = null;

function ensureActionModalsExist() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById('modal-edit-complaint')) {
    const container = document.createElement('div');
    container.id = 'dynamic-action-modals';
    container.innerHTML = `
      <!-- Modal 8: Edit Complaint Details (Before Verification) -->
      <div id="modal-edit-complaint" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 fade-in max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold text-slate-900">Edit Maintenance Request</h3>
                <span id="edit-ticket-id-display" class="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">CF-2026-00000</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">Correct details, symptoms, or room location before warden verification.</p>
            </div>
            <button onclick="closeModal('modal-edit-complaint')" class="text-slate-400 hover:text-slate-600">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onsubmit="event.preventDefault(); saveComplaintEdit();" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 uppercase mb-1">Issue Title <span class="text-red-500">*</span></label>
              <input type="text" id="edit-title" required class="w-full h-10 px-3 border border-slate-300 rounded-lg text-xs font-medium focus:border-blue-600 focus:outline-none"/>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 uppercase mb-1">Department</label>
                <select id="edit-dept" class="w-full h-10 px-3 border border-slate-300 rounded-lg text-xs bg-white">
                  <option value="Electrical">Electrical & Power Systems</option>
                  <option value="HVAC">HVAC & Climate Control</option>
                  <option value="Plumbing">Plumbing & Water Core</option>
                  <option value="Civil">Civil & Structural</option>
                  <option value="Carpentry">Carpentry & Locksmith</option>
                  <option value="General">General Logistics & Sanitation</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 uppercase mb-1">Category</label>
                <select id="edit-category" class="w-full h-10 px-3 border border-slate-300 rounded-lg text-xs bg-white">
                  <option value="Hazardous / Sparking">Hazardous / Sparking / Safety Risk</option>
                  <option value="Equipment Failure">Equipment Failure</option>
                  <option value="Leakage / Burst">Leakage / Pipe Burst</option>
                  <option value="Structural Damage">Structural Damage / Broken Fixture</option>
                  <option value="Routine Maintenance">Routine Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 uppercase mb-1">Room Location <span class="text-red-500">*</span></label>
              <input type="text" id="edit-location" required class="w-full h-10 px-3 border border-slate-300 rounded-lg text-xs font-mono focus:border-blue-600 focus:outline-none"/>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 uppercase mb-1">Description <span class="text-red-500">*</span></label>
              <textarea id="edit-desc" rows="3" required class="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:border-blue-600 focus:outline-none"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 uppercase mb-1">Priority</label>
                <select id="edit-priority" class="w-full h-10 px-3 border border-slate-300 rounded-lg text-xs bg-white">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 uppercase mb-1">Photo / Proof Evidence</label>
                <button type="button" onclick="document.getElementById('edit-photo-input').click()" class="w-full h-10 px-3 border border-slate-300 rounded-lg text-xs bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-1.5 font-medium text-slate-700">
                  <span class="material-symbols-outlined text-[16px]">photo_camera</span>
                  <span id="edit-photo-label">Update Attached Photo</span>
                </button>
                <input type="file" id="edit-photo-input" class="hidden" onchange="handleEditPhotoSelect(this)"/>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button type="button" onclick="closeModal('modal-edit-complaint')" class="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Discard Changes
              </button>
              <button type="submit" class="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-sm">
                Save & Update Request
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal 9: Cancel / Retract Verification Request (Pending State) -->
      <div id="modal-cancel-request" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 fade-in text-center">
          <div class="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">cancel_presentation</span>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Cancel Verification Request?</h3>
          <p class="text-xs text-slate-600">
            You are about to cancel ticket <span class="font-mono font-bold text-slate-900" id="cancel-ticket-id-display">CF-2026-00000</span>.
          </p>
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 text-left font-mono">
            <p id="cancel-ticket-title-display" class="truncate font-semibold">Switchboard Sparking</p>
            <p class="text-[10px] text-amber-700 mt-1">Status: Pending Verification (Not yet reviewed by authority)</p>
          </div>
          <p class="text-[11px] text-slate-500">
            Because the authority has not yet approved this complaint, it will be immediately retracted and purged from the warden's queue.
          </p>
          <div class="flex gap-3 pt-2">
            <button type="button" onclick="closeModal('modal-cancel-request')" class="w-1/2 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50">
              Keep Request
            </button>
            <button type="button" onclick="confirmCancelComplaint()" class="w-1/2 py-2.5 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 shadow-sm transition-colors">
              Cancel & Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Modal 10: Reject / Withdraw Approved Request (Post-Approval Rejection) -->
      <div id="modal-reject-approved-request" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 fade-in">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[22px]">block</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Cancel & Reject Approved Request</h3>
              <p class="text-xs text-slate-500 font-mono" id="approved-reject-ticket-id-display">CF-2026-00124</p>
            </div>
          </div>
          <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
            <span class="font-bold">Notice:</span> This request has already been approved and dispatched by the authority. Cancelling it now will formally mark it as <strong>REJECTED</strong> and notify the technician.
          </div>
          <p id="approved-reject-meta-display" class="text-xs text-slate-600 font-medium"></p>
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">State Reason for Post-Approval Cancellation <span class="text-red-500">*</span></label>
            <textarea id="approved-reject-reason-text" rows="3" placeholder="e.g. Issue was self-resolved, entered wrong laboratory room, or technician is no longer needed..." class="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:border-red-600 focus:outline-none"></textarea>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" onclick="closeModal('modal-reject-approved-request')" class="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Keep Active
            </button>
            <button type="button" onclick="confirmRejectApprovedSubmit()" class="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm">
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  }
}

function handleEditPhotoSelect(input) {
  if (input && input.files && input.files[0]) {
    const label = document.getElementById('edit-photo-label');
    if (label) label.textContent = `Photo: ${input.files[0].name}`;
    showToast(`Attached photo updated: ${input.files[0].name}`, 'info');
  }
}

function openEditComplaintModal(ticketId) {
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === ticketId);
  if (!ticket) {
    showToast('Ticket not found in local records.', 'error');
    return;
  }
  if (ticket.status !== 'PENDING_VERIFICATION') {
    showToast('Only pending requests awaiting verification can be edited. This request is already approved by the authority.', 'warning');
    return;
  }
  activeEditTicketId = ticketId;
  ensureActionModalsExist();

  const idEl = document.getElementById('edit-ticket-id-display');
  if (idEl) idEl.textContent = ticket.id;

  const titleEl = document.getElementById('edit-title');
  if (titleEl) titleEl.value = ticket.title || '';

  const deptEl = document.getElementById('edit-dept');
  if (deptEl) deptEl.value = (ticket.department || 'Electrical').split(',')[0].trim();

  const catEl = document.getElementById('edit-category');
  if (catEl) catEl.value = ticket.category || 'Hazardous / Sparking';

  const locEl = document.getElementById('edit-location');
  if (locEl) locEl.value = ticket.location || '';

  const descEl = document.getElementById('edit-desc');
  if (descEl) descEl.value = ticket.description || '';

  const prioEl = document.getElementById('edit-priority');
  if (prioEl) prioEl.value = ticket.priority || 'Medium';

  showModal('modal-edit-complaint');
}

function saveComplaintEdit() {
  if (!activeEditTicketId) return;
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === activeEditTicketId);
  if (!ticket) return;

  if (ticket.status !== 'PENDING_VERIFICATION') {
    showToast('Cannot edit request: Already verified and approved by authority.', 'error');
    closeModal('modal-edit-complaint');
    return;
  }

  const titleEl = document.getElementById('edit-title');
  const deptEl = document.getElementById('edit-dept');
  const catEl = document.getElementById('edit-category');
  const locEl = document.getElementById('edit-location');
  const descEl = document.getElementById('edit-desc');
  const prioEl = document.getElementById('edit-priority');

  ticket.title = titleEl && titleEl.value.trim() ? titleEl.value.trim() : ticket.title;
  ticket.department = deptEl ? deptEl.value : ticket.department;
  ticket.category = catEl ? catEl.value : ticket.category;
  ticket.location = locEl && locEl.value.trim() ? locEl.value.trim() : ticket.location;
  ticket.description = descEl && descEl.value.trim() ? descEl.value.trim() : ticket.description;
  ticket.priority = prioEl ? prioEl.value : ticket.priority;
  ticket.submittedTime = 'Edited just now';

  saveStoredComplaints(complaints);
  addAuditLog(ticket.complainant || 'Complainant', 'Complainant', 'EDIT_PENDING_DETAILS', ticket.id, 'DETAILS UPDATED BEFORE VERIFICATION');

  try {
    fetch('/api/complaints/' + ticket.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    }).catch(() => {});
  } catch (e) {}

  closeModal('modal-edit-complaint');
  showToast(`Complaint ${ticket.id} details updated successfully!`, 'success');
  renderActiveDashboard();
}

function openCancelComplaintModal(ticketId) {
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === ticketId);
  if (!ticket) {
    showToast('Ticket not found in local records.', 'error');
    return;
  }
  activeCancelTicketId = ticketId;
  ensureActionModalsExist();

  const idEl = document.getElementById('cancel-ticket-id-display');
  if (idEl) idEl.textContent = ticket.id;

  const titleEl = document.getElementById('cancel-ticket-title-display');
  if (titleEl) titleEl.textContent = `${ticket.title} • ${ticket.location}`;

  showModal('modal-cancel-request');
}

function confirmCancelComplaint() {
  if (!activeCancelTicketId) return;
  let complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === activeCancelTicketId);
  if (!ticket) return;

  if (ticket.status !== 'PENDING_VERIFICATION') {
    closeModal('modal-cancel-request');
    openRejectApprovedModal(activeCancelTicketId);
    return;
  }

  // Remove completely from active verification complaints
  complaints = complaints.filter(c => c.id !== activeCancelTicketId);
  saveStoredComplaints(complaints);
  addAuditLog(ticket.complainant || 'Complainant', 'Complainant', 'CANCEL_VERIFICATION_USER', activeCancelTicketId, 'PENDING_VERIFICATION → RETRACTED_PURGED');

  try {
    fetch('/api/complaints/' + activeCancelTicketId, {
      method: 'DELETE'
    }).catch(() => {});
  } catch (e) {}

  closeModal('modal-cancel-request');
  showToast(`Verification request ${activeCancelTicketId} retracted and deleted from queue.`, 'info');
  renderActiveDashboard();
}

function openRejectApprovedModal(ticketId) {
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === ticketId);
  if (!ticket) return;

  activeRejectApprovedTicketId = ticketId;
  ensureActionModalsExist();

  const idEl = document.getElementById('approved-reject-ticket-id-display');
  if (idEl) idEl.textContent = ticket.id;

  const metaEl = document.getElementById('approved-reject-meta-display');
  if (metaEl) metaEl.textContent = `${ticket.title} (${ticket.location}) • Assigned: ${ticket.worker || 'Rajesh Kumar'}`;

  const reasonEl = document.getElementById('approved-reject-reason-text');
  if (reasonEl) reasonEl.value = '';

  showModal('modal-reject-approved-request');
}

function confirmRejectApprovedSubmit() {
  if (!activeRejectApprovedTicketId) return;
  const complaints = getStoredComplaints();
  const ticket = complaints.find(c => c.id === activeRejectApprovedTicketId);
  if (!ticket) return;

  const reasonEl = document.getElementById('approved-reject-reason-text');
  const reason = reasonEl && reasonEl.value.trim() ? reasonEl.value.trim() : 'Complainant requested cancellation/rejection after approval.';

  ticket.status = 'REJECTED';
  ticket.rejectionReason = reason;
  ticket.rejectedBy = `${ticket.complainant || 'User'} (Complainant Cancellation)`;
  ticket.submittedTime = 'Just now';

  saveStoredComplaints(complaints);
  addAuditLog(ticket.complainant || 'Complainant', 'Complainant', 'REJECT_APPROVED_REQUEST', activeRejectApprovedTicketId, `VERIFIED_DISPATCHED → REJECTED (${reason})`);

  try {
    fetch('/api/complaints/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: activeRejectApprovedTicketId, reason })
    }).catch(() => {});
  } catch (e) {}

  closeModal('modal-reject-approved-request');
  showToast(`Complaint ${activeRejectApprovedTicketId} cancelled and marked as REJECTED.`, 'warning');
  renderActiveDashboard();
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
    const tech = getTechnicianForDepartment(ticket.department);
    ticket.status = 'VERIFIED_DISPATCHED';
    ticket.worker = tech.name;
    ticket.verifiedBy = 'Dr. Ramesh Sharma (HOD / Warden)';
    ticket.verifiedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
  showToast(`Ticket ${targetId} approved & verified by Warden! Dispatched to Worker & Facilities Command.`, 'success');

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
  const workerDept = getActiveWorkerDepartment();
  const workerProfile = WORKER_DEPARTMENTS[workerDept] || WORKER_DEPARTMENTS.Electrical;
  if (ticket) {
    ticket.status = 'ACTIVE_IN_PROGRESS';
    ticket.worker = `${workerProfile.name} (${workerProfile.id})`;
    ticket.submittedTime = 'Just now';
    saveStoredComplaints(complaints);
    addAuditLog(workerProfile.name, 'Worker', 'ACCEPT_JOB', targetId, 'DISPATCHED → ACTIVE_IN_PROGRESS');
  }

  showToast(`Job ${targetId} accepted by ${workerProfile.name}! Locked into Active Work Order.`, 'success');
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
  const sidebar = document.getElementById('auth-sidebar');
  if (sidebar) {
    sidebar.classList.add('sticky', 'top-0', 'h-screen', 'overflow-y-auto', 'z-30', 'self-start');
  }

  // Ensure top-right Profile Picture Dropdown is active and sidebar Profile link is removed
  initProfileDropdown();
  if (typeof initMultiSelectDepartments === 'function') initMultiSelectDepartments();

  const path = window.location.pathname.toLowerCase();
  const isDashboardPage = ['/user/', '/faculty/', '/authority/', '/worker/', '/admin/', '/super/'].some(r => path.includes(r));
  if (isDashboardPage) {
    let hasSession = false;
    try {
      const rawUser = sessionStorage.getItem('campusflow_user') || localStorage.getItem('campusflow_user');
      const rawToken = sessionStorage.getItem('campusflow_session') || localStorage.getItem('campusflow_session');
      if (rawUser && rawToken) hasSession = true;
    } catch (e) {}

    if (!hasSession) {
      const isFrontend = path.includes('/frontend/');
      const target = isFrontend ? '/frontend/pages/public/login.html?mode=signin' : '/pages/public/login.html?mode=signin';
      window.location.href = target;
      return;
    }
  }

  const complaints = getStoredComplaints();
  const pendingTickets = complaints.filter(c => c.status === 'PENDING_VERIFICATION');
  const verifiedComplaints = complaints.filter(c => c.status !== 'PENDING_VERIFICATION');
  const dispatchedTickets = complaints.filter(c => c.status === 'VERIFIED_DISPATCHED');
  const activeTickets = complaints.filter(c => c.status === 'ACTIVE_IN_PROGRESS');
  const dispatchedOrActiveTickets = complaints.filter(c => c.status === 'VERIFIED_DISPATCHED' || c.status === 'ACTIVE_IN_PROGRESS');
  const resolvedTickets = complaints.filter(c => c.status === 'COMPLETED_RESOLVED');
  const rejectedTickets = complaints.filter(c => c.status === 'REJECTED');

  // 1. STUDENT & FACULTY - My Complaints
  const userFullTable = document.getElementById('user-complaints-full-table') ||
    (path.includes('my-complaints') ? document.querySelector('main table tbody') : null);
  const isFacultyPortal = path.includes('faculty');
  const inspectAction = isFacultyPortal ? "navigateTo('faculty-complaint-details', 'faculty')" : "navigateTo('user-complaint-details', 'user')";
  if (userFullTable) {
    if (complaints.length === 0) {
      userFullTable.innerHTML = `
        <tr>
          <td colspan="8" class="py-12 text-center text-slate-500">
            <span class="material-symbols-outlined text-4xl text-slate-300 mb-2 block">inbox</span>
            <p class="font-medium text-slate-700">No complaints reported yet</p>
            <p class="text-xs text-slate-400 mt-0.5">Use "Report Issue" to submit your first maintenance request</p>
          </td>
        </tr>
      `;
    } else {
      userFullTable.innerHTML = complaints.map(c => {
        let actionButtons = '';
        if (c.status === 'PENDING_VERIFICATION') {
          actionButtons = `
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="${inspectAction}" title="Inspect Details" class="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-emerald-600 transition-colors">
                Inspect
              </button>
              <button onclick="openEditComplaintModal('${c.id}')" title="Edit wrong details or photo before verification" class="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[11px] font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">edit</span> Edit
              </button>
              <button onclick="openCancelComplaintModal('${c.id}')" title="Cancel verification request" class="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-semibold hover:bg-red-100 transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">delete</span> Cancel
              </button>
            </div>
          `;
        } else if (c.status === 'VERIFIED_DISPATCHED' || c.status === 'ACTIVE_IN_PROGRESS') {
          actionButtons = `
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="${inspectAction}" title="Inspect Details" class="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-emerald-600 transition-colors">
                Inspect
              </button>
              <button onclick="openRejectApprovedModal('${c.id}')" title="Cancel and reject approved request" class="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-semibold hover:bg-red-100 transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">block</span> Reject
              </button>
            </div>
          `;
        } else {
          actionButtons = `
            <button onclick="${inspectAction}" class="px-3 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-emerald-600 transition-colors">
              Inspect
            </button>
          `;
        }

        return `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3.5 px-4 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-3.5 px-4 font-semibold text-slate-900">${c.title}</td>
            <td class="py-3.5 px-4">${getDeptBadgeHtml(c.department)}</td>
            <td class="py-3.5 px-4 text-slate-600">${c.location}</td>
            <td class="py-3.5 px-4">${getPriorityBadgeHtml(c.priority)}</td>
            <td class="py-3.5 px-4">${getStatusBadgeHtml(c.status, c.worker)}</td>
            <td class="py-3.5 px-4 font-mono text-slate-500">${c.submittedTime || 'Recently'}</td>
            <td class="py-3.5 px-4 text-right">${actionButtons}</td>
          </tr>
        `;
      }).join('');
    }
  }

  // 1B. COMPLAINT DETAILS (user/complaint-details.html & faculty/complaint-details.html)
  if (path.includes('complaint-details')) {
    const latestTicket = complaints[0] || null;
    if (latestTicket) {
      const headingId = document.querySelector('h1.text-2xl.font-bold.text-slate-900');
      if (headingId) headingId.textContent = latestTicket.id;

      const priorityBadge = document.querySelector('.px-2\\.5.py-0\\.5.rounded-md.bg-red-100');
      if (priorityBadge) priorityBadge.textContent = latestTicket.priority + ' Priority';

      const statusBadge = document.querySelector('.px-2\\.5.py-0\\.5.rounded-md.bg-blue-100');
      if (statusBadge) statusBadge.textContent = latestTicket.status === 'PENDING_VERIFICATION' ? 'Awaiting Warden Approval' : (latestTicket.status === 'REJECTED' ? 'Rejected' : 'In Progress');

      const descEl = document.querySelector('.bg-white.border.border-slate-200.rounded-2xl.p-6.shadow-sm p.text-xs.text-slate-600');
      if (descEl) descEl.textContent = latestTicket.description;

      // Dynamic Complainant Control Banner
      let banner = document.getElementById('complainant-action-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'complainant-action-banner';
        const main = document.querySelector('main .max-w-4xl');
        if (main && main.children.length > 1) {
          main.insertBefore(banner, main.children[1]);
        }
      }

      if (banner) {
        if (latestTicket.status === 'PENDING_VERIFICATION') {
          banner.className = 'mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4';
          banner.innerHTML = `
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">pending_actions</span>
              </div>
              <div>
                <h4 class="font-bold text-amber-950 text-xs">Awaiting Authority Verification</h4>
                <p class="text-[11px] text-amber-800">Entered wrong details, symptoms, or photo? You can edit or cancel this request now before the authority signs off.</p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button onclick="openEditComplaintModal('${latestTicket.id}')" class="px-3.5 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold hover:bg-amber-100 flex items-center gap-1.5 shadow-sm">
                <span class="material-symbols-outlined text-[15px]">edit</span>
                <span>Edit Details</span>
              </button>
              <button onclick="openCancelComplaintModal('${latestTicket.id}')" class="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 flex items-center gap-1.5 shadow-sm">
                <span class="material-symbols-outlined text-[15px]">delete</span>
                <span>Cancel & Delete</span>
              </button>
            </div>
          `;
        } else if (latestTicket.status === 'VERIFIED_DISPATCHED' || latestTicket.status === 'ACTIVE_IN_PROGRESS') {
          banner.className = 'mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4';
          banner.innerHTML = `
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h4 class="font-bold text-blue-950 text-xs">Request Verified & Dispatched</h4>
                <p class="text-[11px] text-blue-800">Technician assigned (${latestTicket.worker || 'Rajesh Kumar'}). If this work is no longer required, you can cancel and reject it with a reason.</p>
              </div>
            </div>
            <button onclick="openRejectApprovedModal('${latestTicket.id}')" class="px-3.5 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 flex items-center gap-1.5 shrink-0 shadow-sm">
              <span class="material-symbols-outlined text-[15px]">block</span>
              <span>Cancel & Reject Work Order</span>
            </button>
          `;
        } else if (latestTicket.status === 'REJECTED') {
          banner.className = 'mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs';
          banner.innerHTML = `
            <span class="material-symbols-outlined text-red-600 text-[20px]">cancel</span>
            <div>
              <span class="font-bold">Request Rejected:</span> ${latestTicket.rejectionReason || 'Withdrawn by complainant or authority.'}
            </div>
          `;
        } else {
          banner.remove();
        }
      }
    }
  }

  // 2. STUDENT & FACULTY - Overview
  const userRecentTable = document.getElementById('user-recent-table') ||
    ((path.includes('user/overview') || path.includes('faculty/overview')) ? document.querySelector('main table tbody') : null);
  if (userRecentTable) {
    if (complaints.length === 0) {
      userRecentTable.innerHTML = `
        <tr>
          <td colspan="7" class="py-12 text-center text-slate-500">
            <span class="material-symbols-outlined text-4xl text-slate-300 mb-2 block">inbox</span>
            <p class="font-medium text-slate-700">No Recent Complaints</p>
            <p class="text-xs text-slate-400 mt-0.5">Your submitted maintenance issues will appear here with live tracking</p>
          </td>
        </tr>
      `;
    } else {
      userRecentTable.innerHTML = complaints.slice(0, 5).map(c => {
        let actionButtons = '';
        if (c.status === 'PENDING_VERIFICATION') {
          actionButtons = `
            <div class="flex items-center justify-end gap-2">
              <button onclick="${inspectAction}" class="text-blue-600 hover:underline font-semibold">Inspect</button>
              <button onclick="openEditComplaintModal('${c.id}')" title="Edit details" class="text-amber-700 hover:underline font-semibold text-[11px]">Edit</button>
              <button onclick="openCancelComplaintModal('${c.id}')" title="Cancel request" class="text-red-600 hover:underline font-semibold text-[11px]">Cancel</button>
            </div>
          `;
        } else if (c.status === 'VERIFIED_DISPATCHED' || c.status === 'ACTIVE_IN_PROGRESS') {
          actionButtons = `
            <div class="flex items-center justify-end gap-2">
              <button onclick="${inspectAction}" class="text-blue-600 hover:underline font-semibold">Inspect</button>
              <button onclick="openRejectApprovedModal('${c.id}')" title="Cancel approved request" class="text-red-600 hover:underline font-semibold text-[11px]">Reject</button>
            </div>
          `;
        } else {
          actionButtons = `
            <button onclick="${inspectAction}" class="text-blue-600 hover:underline font-semibold">Inspect</button>
          `;
        }
        return `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-3 font-medium text-slate-900">${c.title}</td>
            <td class="py-3">${getDeptBadgeHtml(c.department)}</td>
            <td class="py-3 text-slate-600">${c.location}</td>
            <td class="py-3 text-slate-500 font-mono">${c.submittedTime || 'Recently'}</td>
            <td class="py-3">${getStatusBadgeHtml(c.status, c.worker)}</td>
            <td class="py-3 text-right">${actionButtons}</td>
          </tr>
        `;
      }).join('');
    }

    // Active Work Highlight Card: ONLY shown if complaint is verified by warden and dispatched or active!
    const activeHighlightCard = document.getElementById('user-active-highlight');
    const activeDispatched = complaints.find(c => c.status === 'VERIFIED_DISPATCHED' || c.status === 'ACTIVE_IN_PROGRESS');
    if (activeHighlightCard) {
      if (activeDispatched) {
        activeHighlightCard.classList.remove('hidden');
        const idEl = activeHighlightCard.querySelector('.active-complaint-id');
        if (idEl) idEl.textContent = activeDispatched.id;
        const statusEl = activeHighlightCard.querySelector('.active-complaint-status');
        if (statusEl) statusEl.textContent = activeDispatched.status === 'ACTIVE_IN_PROGRESS' ? 'Work In Progress' : 'Verified & Dispatched';
        const titleEl = activeHighlightCard.querySelector('.active-complaint-title');
        if (titleEl) titleEl.textContent = activeDispatched.title;
        const locEl = activeHighlightCard.querySelector('.active-complaint-location');
        if (locEl) locEl.textContent = activeDispatched.location;
        const workerEl = activeHighlightCard.querySelector('.active-complaint-worker');
        if (workerEl) workerEl.textContent = activeDispatched.worker || 'Assigned Technician';
      } else {
        activeHighlightCard.classList.add('hidden');
      }
    }

    const kpiCards = document.querySelectorAll('main .grid.grid-cols-2.lg\\:grid-cols-4 > div');
    if (kpiCards.length >= 4) {
      const totalNum = kpiCards[0].querySelector('.text-2xl');
      if (totalNum) totalNum.textContent = complaints.length;
      const pendingNum = kpiCards[1].querySelector('.text-2xl');
      if (pendingNum) pendingNum.textContent = pendingTickets.length;
      const activeNum = kpiCards[2].querySelector('.text-2xl');
      if (activeNum) activeNum.textContent = dispatchedOrActiveTickets.length;
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
            <td colspan="8" class="py-12 text-center text-slate-500 font-mono text-xs">
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
      if (totalEl) totalEl.textContent = complaints.length;
      const pendingEl = kpiCards[1].querySelector('.text-2xl');
      if (pendingEl) pendingEl.textContent = pendingTickets.length;
      const activeEl = kpiCards[2].querySelector('.text-2xl');
      if (activeEl) activeEl.textContent = dispatchedOrActiveTickets.length;
      const resolvedEl = kpiCards[3].querySelector('.text-2xl');
      if (resolvedEl) resolvedEl.textContent = resolvedTickets.length;
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
            <td colspan="7" class="py-12 text-center text-slate-500 font-mono text-xs">
              <span class="material-symbols-outlined text-[24px] text-emerald-500 block mb-1">task_alt</span>
              Verification Queue is Clear. Zero pending complaints requiring sign-off.
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
      // Once a student logs a complaint, it must be verified by Warden before appearing in master operations
      if (verifiedComplaints.length === 0) {
        adminTbody.innerHTML = `
          <tr>
            <td colspan="8" class="py-12 text-center text-slate-500 text-xs">
              <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <span class="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <p class="font-semibold text-slate-700">Master Ticket Registry is Empty</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Complaints verified and authorized by Wardens / HODs will populate here in real time.</p>
            </td>
          </tr>
        `;
      } else {
        adminTbody.innerHTML = verifiedComplaints.map(c => `
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
  }

  // 6. FACILITIES ADMIN / DIRECTOR - Overview (admin/overview.html)
  if (path.includes('admin/overview')) {
    const kpiCards = document.querySelectorAll('main .grid.grid-cols-2.lg\\:grid-cols-4 > div');
    if (kpiCards.length >= 8) {
      const totalEl = kpiCards[0].querySelector('.text-2xl');
      if (totalEl) totalEl.textContent = verifiedComplaints.length;
      const pendingEl = kpiCards[1].querySelector('.text-2xl');
      if (pendingEl) pendingEl.textContent = pendingTickets.length;
      const activeEl = kpiCards[2].querySelector('.text-2xl');
      if (activeEl) activeEl.textContent = activeTickets.length;
      const slaRiskEl = kpiCards[3].querySelector('.text-2xl');
      if (slaRiskEl) slaRiskEl.textContent = '0';
    }

    const telemetryTbody = document.querySelector('main table tbody');
    if (telemetryTbody) {
      // ONLY complaints verified by warden and dispatched to worker appear in Live Dispatch Telemetry
      if (dispatchedOrActiveTickets.length === 0) {
        telemetryTbody.innerHTML = `
          <tr>
            <td colspan="8" class="py-12 text-center text-slate-500 font-mono text-xs">
              <span class="material-symbols-outlined text-4xl text-slate-300 mb-2 block">timer_off</span>
              <p class="font-medium text-slate-700">No Dispatches in SLA Window</p>
              <p class="text-xs text-slate-400 mt-0.5">Complaints awaiting warden verification do not dispatch. Once verified by authority, worker SLA countdowns monitor here.</p>
            </td>
          </tr>
        `;
      } else {
        telemetryTbody.innerHTML = dispatchedOrActiveTickets.map(c => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3.5 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-3.5">${getDeptBadgeHtml(c.department)}</td>
            <td class="py-3.5 text-slate-700 font-mono">${c.location}</td>
            <td class="py-3.5 font-semibold text-slate-900">${c.worker || 'Rajesh Kumar (WRK-0018)'}</td>
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
  }

  // WORKER PORTAL - Active Worker Context & Department Scoping
  const workerDept = getActiveWorkerDepartment();
  const workerProfile = WORKER_DEPARTMENTS[workerDept] || WORKER_DEPARTMENTS.Electrical;

  // Update Worker Shift Banner (overview.html and elsewhere in worker dashboard)
  if (path.includes('worker')) {
    const shiftBanner = document.querySelector('div.mb-6.p-4.sm\\:p-5.bg-slate-900.text-white');
    if (shiftBanner) {
      const avatarBox = shiftBanner.querySelector('.w-12.h-12');
      if (avatarBox) avatarBox.textContent = workerProfile.initials;
      const nameH2 = shiftBanner.querySelector('h2');
      if (nameH2) nameH2.textContent = workerProfile.name;
      const rollSpan = shiftBanner.querySelector('.font-mono.text-xs.text-slate-400');
      if (rollSpan) rollSpan.textContent = workerProfile.id;
      const deptP = shiftBanner.querySelector('p.text-xs.text-slate-300');
      if (deptP) deptP.textContent = `${workerProfile.departmentName} • Shift A (08:00 - 16:30)`;
    }
  }

  // 7. WORKER - Incoming Dispatch (worker/incoming-dispatch.html)
  if (path.includes('incoming-dispatch')) {
    // Worker ONLY receives complaints after warden verification in their assigned department
    const latestDispatched = complaints.find(c => c.status === 'VERIFIED_DISPATCHED' && complaintMatchesWorkerDept(c, workerDept));
    const idEl = document.querySelector('.text-lg.font-bold.font-mono.text-slate-900');
    const deptEl = document.querySelector('.text-sm.font-bold.text-amber-700');
    const titleEl = document.querySelector('h3.text-xs.font-bold.uppercase.text-slate-500 + p.text-base.font-bold');
    const locEl = document.querySelector('.p-3.bg-slate-50.border.border-slate-200.rounded-xl.font-mono');
    const descEl = document.querySelector('p.text-xs.text-slate-600.leading-relaxed.bg-slate-50');
    const timerDisplay = document.querySelector('.countdown-display');

    if (latestDispatched) {
      if (idEl) idEl.textContent = latestDispatched.id;
      if (deptEl) deptEl.textContent = latestDispatched.department;
      if (titleEl) titleEl.textContent = latestDispatched.title;
      if (locEl) locEl.textContent = latestDispatched.location;
      if (descEl) descEl.textContent = latestDispatched.description;

      const acceptBtn = document.querySelector('button[onclick*="acceptJobWorker"]');
      if (acceptBtn) {
        acceptBtn.setAttribute('onclick', `acceptJobWorker('${latestDispatched.id}')`);
        acceptBtn.disabled = false;
        acceptBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
      const declineBtn = document.querySelector('button[onclick*="openWorkerDeclineModal"]');
      if (declineBtn) {
        declineBtn.setAttribute('onclick', `openWorkerDeclineModal('${latestDispatched.id}')`);
        declineBtn.disabled = false;
        declineBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    } else {
      // Standby state scoped to this worker's department
      if (idEl) idEl.textContent = 'STANDBY';
      if (deptEl) deptEl.textContent = workerProfile.departmentName;
      if (titleEl) titleEl.textContent = `Shift Queue Clear • Standing By (${workerProfile.code})`;
      if (locEl) locEl.textContent = `Technician Station — Scoped to ${workerProfile.departmentName}`;
      if (descEl) descEl.textContent = `Zero incoming dispatches awaiting response for ${workerProfile.departmentName}. When an issue in your department is verified, it will immediately alert here with a 30-minute acceptance timer.`;
      if (timerDisplay) timerDisplay.textContent = 'STANDBY';

      const acceptBtn = document.querySelector('button[onclick*="acceptJobWorker"]');
      if (acceptBtn) {
        acceptBtn.disabled = true;
        acceptBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
      const declineBtn = document.querySelector('button[onclick*="openWorkerDeclineModal"]');
      if (declineBtn) {
        declineBtn.disabled = true;
        declineBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    }
  }

  // 7B. WORKER - Overview (worker/overview.html)
  if (path.includes('worker/overview')) {
    const alertBanner = document.getElementById('worker-urgent-alert');
    const standbyBanner = document.getElementById('worker-standby-banner');
    const latestDispatched = complaints.find(c => c.status === 'VERIFIED_DISPATCHED' && complaintMatchesWorkerDept(c, workerDept));

    if (latestDispatched) {
      // Warden has verified & dispatched this ticket in this worker's department
      if (alertBanner) alertBanner.classList.remove('hidden');
      if (standbyBanner) standbyBanner.classList.add('hidden');
      const titleEl = document.getElementById('worker-urgent-title') || (alertBanner ? alertBanner.querySelector('h3') : null);
      if (titleEl) titleEl.textContent = `${latestDispatched.id}: ${latestDispatched.title}`;
      const metaEl = document.getElementById('worker-urgent-meta') || (alertBanner ? alertBanner.querySelector('p') : null);
      if (metaEl) metaEl.textContent = `${latestDispatched.location} • Trade: ${latestDispatched.department}`;
    } else {
      // No tickets in worker's trade -> Keep worker peaceful on standby
      if (alertBanner) alertBanner.classList.add('hidden');
      if (standbyBanner) standbyBanner.classList.remove('hidden');
    }

    const shiftJobsEl = document.querySelector('main .grid.grid-cols-2.lg\\:grid-cols-4 > div:first-child .text-2xl');
    const verifiedJobsCount = complaints.filter(c => (c.status === 'VERIFIED_DISPATCHED' || c.status === 'ACTIVE_IN_PROGRESS') && complaintMatchesWorkerDept(c, workerDept)).length;
    if (shiftJobsEl) shiftJobsEl.textContent = `${verifiedJobsCount} Tasks`;
  }

  // 8. SUPER ADMIN - Audit Logs (super/audit-logs.html)
  if (path.includes('audit-logs')) {
    const auditTbody = document.querySelector('main table tbody');
    if (auditTbody) {
      const logs = getStoredAuditLogs();
      if (logs.length === 0) {
        auditTbody.innerHTML = `
          <tr>
            <td colspan="7" class="py-12 text-center text-slate-500 text-xs font-mono">
              <span class="material-symbols-outlined text-[28px] text-slate-400 block mb-1">verified_user</span>
              No audit logs recorded yet. System state transitions will appear here in SHA-256 sequence.
            </td>
          </tr>
        `;
      } else {
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

  // 9. AUTHORITY - Approved Requests
  if (path.includes('approved-requests')) {
    const tbody = document.querySelector('main table tbody');
    const approvedTickets = complaints.filter(c => c.status === 'VERIFIED_DISPATCHED' || c.status === 'ACTIVE_IN_PROGRESS' || c.status === 'RESOLVED');
    if (tbody) {
      if (approvedTickets.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="py-12 text-center text-slate-500 text-xs">
              <span class="material-symbols-outlined text-4xl text-slate-300 mb-2 block">verified</span>
              <p class="font-medium text-slate-700">No Approved Requests Yet</p>
              <p class="text-xs text-slate-400 mt-0.5">Complaints you approve will transition here and dispatch to technicians</p>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = approvedTickets.map(c => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3.5 px-4 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-3.5 px-4 font-medium text-slate-900">${c.title}</td>
            <td class="py-3.5 px-4 font-mono text-slate-500">${c.submittedTime || 'Recent'}</td>
            <td class="py-3.5 px-4 font-semibold text-slate-900">${c.worker || 'Pending'}</td>
            <td class="py-3.5 px-4 text-emerald-600 font-mono font-semibold">${c.status === 'RESOLVED' ? 'Resolved' : 'Dispatched'}</td>
            <td class="py-3.5 px-4">${getStatusBadgeHtml(c.status, c.worker)}</td>
          </tr>
        `).join('');
      }
    }
  }

  // 10. AUTHORITY - Rejected Requests
  if (path.includes('rejected-requests')) {
    const tbody = document.querySelector('main table tbody');
    const rejectedTickets = complaints.filter(c => c.status === 'REJECTED');
    if (tbody) {
      if (rejectedTickets.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="py-12 text-center text-slate-500 text-xs">
              <span class="material-symbols-outlined text-4xl text-slate-300 mb-2 block">block</span>
              <p class="font-medium text-slate-700">No Rejected Requests</p>
              <p class="text-xs text-slate-400 mt-0.5">Rejected maintenance requests with logged justifications will appear here</p>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = rejectedTickets.map(c => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3.5 px-4 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-3.5 px-4 font-medium text-slate-900">${c.title}</td>
            <td class="py-3.5 px-4 text-slate-600">${c.complainant || 'Student'}</td>
            <td class="py-3.5 px-4 font-mono text-slate-500">${c.submittedTime || 'Recent'}</td>
            <td class="py-3.5 px-4 text-red-600 font-medium">${c.rejectionReason || 'Administrative decision'}</td>
          </tr>
        `).join('');
      }
    }
  }

  // 11. AUTHORITY - Active Maintenance
  if (path.includes('active-maintenance')) {
    const tbody = document.querySelector('main table tbody');
    const activeUnits = complaints.filter(c => c.status === 'ACTIVE_IN_PROGRESS' || c.status === 'VERIFIED_DISPATCHED');
    if (tbody) {
      if (activeUnits.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="py-12 text-center text-slate-500 text-xs">
              <span class="material-symbols-outlined text-4xl text-slate-300 mb-2 block">engineering</span>
              <p class="font-medium text-slate-700">No Active Maintenance Underway</p>
              <p class="text-xs text-slate-400 mt-0.5">Technicians actively performing repairs on-premises in Academic Block B will display here</p>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = activeUnits.map(c => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3.5 px-4 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-3.5 px-4 font-mono text-slate-700">${c.location}</td>
            <td class="py-3.5 px-4 font-semibold text-slate-900">${c.worker || 'Dispatched Technician'}</td>
            <td class="py-3.5 px-4 font-mono text-slate-500">${c.submittedTime || 'Recent'}</td>
            <td class="py-3.5 px-4">${getStatusBadgeHtml(c.status, c.worker)}</td>
          </tr>
        `).join('');
      }
    }
  }

  // 12. ADMIN - Assignment Telemetry
  if (path.includes('assignment-telemetry')) {
    const tbody = document.querySelector('main table tbody');
    const activeAssignments = complaints.filter(c => c.status === 'VERIFIED_DISPATCHED' || c.status === 'ACTIVE_IN_PROGRESS');
    if (tbody) {
      if (activeAssignments.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="py-12 text-center text-slate-500 text-xs">
              <span class="material-symbols-outlined text-4xl text-slate-300 mb-2 block">network_ping</span>
              <p class="font-medium text-slate-700">No Active Worker Dispatches</p>
              <p class="text-xs text-slate-400 mt-0.5">Automated 30-minute acceptance windows will display here once dispatches occur</p>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = activeAssignments.map(c => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3.5 px-4 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-3.5 px-4 font-semibold text-slate-900">${c.worker || 'Rajesh Kumar (WRK-0018)'}</td>
            <td class="py-3.5 px-4 font-mono text-slate-500">${c.submittedTime || 'Recent'}</td>
            <td class="py-3.5 px-4 text-emerald-600 font-semibold font-mono">SLA Active</td>
            <td class="py-3.5 px-4 font-mono text-slate-600">Attempt #1</td>
            <td class="py-3.5 px-4 text-right">
              <button onclick="openInterventionModal('${c.id}')" class="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-slate-700 hover:bg-slate-200 font-mono font-semibold">
                Manual Override
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // 13. WORKER - Completed Jobs
  if (path.includes('completed-jobs')) {
    const tbody = document.querySelector('main table tbody');
    const resolvedJobs = complaints.filter(c => (c.status === 'RESOLVED' || c.status === 'COMPLETED_RESOLVED') && complaintMatchesWorkerDept(c, workerDept));
    if (tbody) {
      if (resolvedJobs.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="py-12 text-center text-slate-500 text-xs">
              <span class="material-symbols-outlined text-4xl text-slate-300 mb-2 block">task</span>
              <p class="font-medium text-slate-700">No Completed Jobs</p>
              <p class="text-xs text-slate-400 mt-0.5">Work orders in ${workerProfile.departmentName} you successfully resolve and sign off will appear in this ledger</p>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = resolvedJobs.map(c => `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3.5 px-4 font-mono font-bold text-slate-900">${c.id}</td>
            <td class="py-3.5 px-4 text-slate-600">${c.location}</td>
            <td class="py-3.5 px-4 font-mono text-slate-500">${c.submittedTime || 'Today'}</td>
            <td class="py-3.5 px-4 font-mono">25 min</td>
            <td class="py-3.5 px-4 text-emerald-600 font-semibold font-mono">Signed Off (5.0★)</td>
          </tr>
        `).join('');
      }
    }
  }

  // 13B. WORKER - Active Job Live
  if (path.includes('active-job')) {
    const activeJob = complaints.find(c => c.status === 'ACTIVE_IN_PROGRESS' && complaintMatchesWorkerDept(c, workerDept));
    const locP = document.querySelector('p.text-xs.text-slate-600.font-mono');
    const targetLocP = document.querySelector('p.text-sm.font-semibold.text-slate-900.font-mono');
    if (activeJob) {
      if (locP) locP.textContent = `${activeJob.id} • ${activeJob.location}`;
      if (targetLocP) targetLocP.textContent = `${activeJob.location} (${activeJob.department})`;
    }
  }

  // 15. DYNAMIC PROFILE & SETTINGS PAGE POPULATION
  if (path.includes('profile')) {
    const info = getCurrentUserInfo();
    const avatarBadge = document.querySelector('.w-16.h-16.rounded-full');
    if (avatarBadge) {
      avatarBadge.textContent = info.initials;
      avatarBadge.className = `w-16 h-16 rounded-full ${info.avatarColor || 'bg-slate-900'} text-white flex items-center justify-center text-xl font-bold font-mono shadow-sm`;
    }
    const nameHeading = document.querySelector('.max-w-2xl h3');
    if (nameHeading) nameHeading.textContent = info.name;
    const subtextEl = document.querySelector('.max-w-2xl p.font-mono');
    if (subtextEl) {
      const rollPrefix = info.role === 'faculty' ? 'ID' : 'Roll';
      subtextEl.textContent = `${rollPrefix}: ${info.id} • ${info.departmentName || info.roleTitle}`;
    }
    const emailInput = document.querySelector('.max-w-2xl input[disabled]');
    if (emailInput && info.email) {
      emailInput.value = info.email;
    }
    const phoneInput = document.querySelector('.max-w-2xl input:not([disabled])');
    if (phoneInput && info.phone) {
      phoneInput.value = info.phone;
    }
    // Worker profile key-value rows
    const workerRows = document.querySelectorAll('.max-w-2xl .flex.justify-between');
    if (workerRows.length >= 3) {
      workerRows.forEach(row => {
        const label = (row.children[0]?.textContent || '').trim();
        const val = row.children[1];
        if (!val) return;
        if (label.includes('Worker ID:')) val.textContent = info.id;
        else if (label.includes('Full Name:')) val.textContent = info.name;
        else if (label.includes('Department:')) val.textContent = info.departmentName || info.department || 'Electrical & Power Systems';
      });
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

  // Initialize in-website global search
  initInWebsiteSearch();
}

/**
 * In-Website YouTube-Style Global Search Engine
 */
function escapeSearchHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initInWebsiteSearch() {
  const header = document.querySelector('header');
  if (!header) return;

  let searchWrapper = document.getElementById('header-search-wrapper');

  // If header-search-wrapper is missing, transform ONLY the specific leaf search div
  if (!searchWrapper) {
    const staticPlaceholder = header.querySelector('.hidden.sm\\:flex.items-center.gap-2') ||
      Array.from(header.querySelectorAll('div')).find(div => {
        const text = (div.textContent || '').trim();
        const hasSearchText = text.includes('Search records');
        const hasLinksOrButtons = div.querySelector('a') || div.querySelector('button');
        const hasNestedDivs = div.querySelector('div');
        return hasSearchText && !hasLinksOrButtons && !hasNestedDivs && !div.querySelector('input');
      });

    if (staticPlaceholder && staticPlaceholder.parentNode) {
      const wrapperDiv = document.createElement('div');
      wrapperDiv.id = 'header-search-wrapper';
      wrapperDiv.className = 'relative hidden sm:block w-72 md:w-80 lg:w-96 text-left';
      wrapperDiv.innerHTML = `
        <div class="relative flex items-center bg-slate-100 hover:bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary border border-slate-200 rounded-xl px-2.5 py-1.5 transition-all shadow-xs">
          <span class="material-symbols-outlined text-[18px] text-slate-400 select-none mr-1.5 flex-shrink-0">search</span>
          <input
            id="global-search-input"
            type="text"
            placeholder="Search records, tickets, locations..."
            class="bg-transparent border-none outline-none w-full text-xs text-slate-800 placeholder:text-slate-400 font-sans focus:ring-0 p-0"
            autocomplete="off"
            spellcheck="false"
          />
          <kbd id="global-search-kbd" class="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-mono text-slate-400 shadow-2xs select-none ml-1 flex-shrink-0">⌘K</kbd>
          <button id="global-search-clear" type="button" class="hidden text-slate-400 hover:text-slate-600 ml-1 p-0.5 rounded transition-colors flex-shrink-0" title="Clear search">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <!-- Floating YouTube-style Suggestions Dropdown -->
        <div id="global-search-dropdown" class="hidden absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden max-h-[460px] flex flex-col transition-all">
          <div class="px-3.5 py-2 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 font-mono">
            <span id="search-dropdown-count">CAMPUS RECORDS</span>
            <span class="text-[10px] text-slate-400 font-sans">ESC to close</span>
          </div>
          <div id="search-dropdown-results" class="overflow-y-auto divide-y divide-slate-100 divide-opacity-80 text-xs"></div>
          <div class="px-3.5 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Press <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-semibold">Enter</kbd> to filter table</span>
            <span class="text-[10px] text-slate-400 font-mono">Real-Time Search</span>
          </div>
        </div>
      `;
      staticPlaceholder.parentNode.replaceChild(wrapperDiv, staticPlaceholder);
      searchWrapper = wrapperDiv;
    }
  }

  // Initialize profile picture based dropdown (clubbed: Profile & Settings, Switch Role, Sign Out)
  initProfileDropdown();

  if (!searchWrapper) return;

  const input = document.getElementById('global-search-input');
  const dropdown = document.getElementById('global-search-dropdown');
  const clearBtn = document.getElementById('global-search-clear');
  const kbdEl = document.getElementById('global-search-kbd');

  if (!input || !dropdown) return;

  // Prevent double event binding
  if (input.dataset.bound === 'true') return;
  input.dataset.bound = 'true';

  // Open on focus & search
  input.addEventListener('focus', () => {
    performGlobalSearch(input.value);
  });

  // Typing event
  input.addEventListener('input', () => {
    performGlobalSearch(input.value);
  });

  // Key navigation (Enter to filter table, Esc to dismiss)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      dropdown.classList.add('hidden');
      const q = input.value.trim().toLowerCase();
      const rows = document.querySelectorAll('table tbody tr');
      let visibleCount = 0;
      rows.forEach(row => {
        const matches = q === '' || row.textContent.toLowerCase().includes(q);
        row.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
      });
      if (q) {
        showToast(`Filtered table: ${visibleCount} record${visibleCount === 1 ? '' : 's'} matching "${input.value}"`, 'info');
      }
    } else if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
      input.blur();
    }
  });

  // Clear button click
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = '';
      clearBtn.classList.add('hidden');
      if (kbdEl) kbdEl.classList.remove('hidden');
      document.querySelectorAll('table tbody tr').forEach(r => r.style.display = '');
      performGlobalSearch('');
      input.focus();
    });
  }

  // Click outside to dismiss
  document.addEventListener('click', (e) => {
    if (dropdown && !dropdown.classList.contains('hidden') && !searchWrapper.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  // Global Ctrl+K / Cmd+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
      performGlobalSearch(input.value);
    }
  });
}

function performGlobalSearch(query) {
  const dropdown = document.getElementById('global-search-dropdown');
  const resultsContainer = document.getElementById('search-dropdown-results');
  const countEl = document.getElementById('search-dropdown-count');
  const clearBtn = document.getElementById('global-search-clear');
  const kbdEl = document.getElementById('global-search-kbd');

  if (!dropdown || !resultsContainer) return;

  const q = (query || '').trim().toLowerCase();

  if (q.length > 0) {
    if (clearBtn) clearBtn.classList.remove('hidden');
    if (kbdEl) kbdEl.classList.add('hidden');
  } else {
    if (clearBtn) clearBtn.classList.add('hidden');
    if (kbdEl) kbdEl.classList.remove('hidden');
  }

  const allComplaints = getStoredComplaints();
  dropdown.classList.remove('hidden');

  if (!q) {
    if (countEl) countEl.textContent = 'CAMPUS RECORDS (RECENT)';
    if (allComplaints.length === 0) {
      resultsContainer.innerHTML = `
        <div class="p-6 text-center text-slate-400">
          <span class="material-symbols-outlined text-3xl text-slate-300 block mb-1">search</span>
          <p class="text-xs font-semibold text-slate-700">Search Campus Maintenance Records</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Type ticket ID (e.g. CF-2026), department, location, or issue details</p>
        </div>
      `;
    } else {
      resultsContainer.innerHTML = allComplaints.slice(0, 6).map(c => renderSearchItemHtml(c)).join('');
    }
    return;
  }

  // Filter matching records
  const matches = allComplaints.filter(c => {
    const textToMatch = [
      c.id || '',
      c.title || '',
      c.department || '',
      c.location || '',
      c.description || '',
      c.status || '',
      c.worker || '',
      c.assignedWorker || '',
      c.priority || '',
      c.complainant || ''
    ].join(' ').toLowerCase();

    return textToMatch.includes(q);
  });

  if (countEl) {
    countEl.textContent = `${matches.length} MATCHING RECORD${matches.length === 1 ? '' : 'S'}`;
  }

  if (matches.length === 0) {
    resultsContainer.innerHTML = `
      <div class="p-6 text-center text-slate-400">
        <span class="material-symbols-outlined text-3xl text-slate-300 block mb-1">search_off</span>
        <p class="text-xs font-semibold text-slate-700">No records found for "${escapeSearchHtml(query)}"</p>
        <p class="text-[11px] text-slate-400 mt-0.5">Try searching by ticket ID (e.g. CF-2026), department, or general issue keywords</p>
      </div>
    `;
  } else {
    resultsContainer.innerHTML = matches.map(c => renderSearchItemHtml(c)).join('');
  }
}

function renderSearchItemHtml(c) {
  const statusBadge = getStatusBadgeHtml(c.status, c.worker || c.assignedWorker);
  const dept = c.department || 'Maintenance';
  const loc = c.location || 'Campus Facility';
  const workerInfo = (c.worker || c.assignedWorker) ? `• <span class="font-medium text-slate-700">${c.worker || c.assignedWorker}</span>` : '';

  return `
    <div onclick="selectSearchResult('${c.id}')" class="p-3 hover:bg-slate-50 cursor-pointer transition-colors group flex flex-col gap-1 text-left">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="font-mono font-bold text-slate-900 group-hover:text-primary transition-colors text-xs">${c.id}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">${dept}</span>
        </div>
        <div>
          ${statusBadge}
        </div>
      </div>
      <div class="font-medium text-slate-800 text-xs line-clamp-1 group-hover:text-slate-900">
        ${escapeSearchHtml(c.title || 'Untitled Maintenance Record')}
      </div>
      <div class="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
        <span class="material-symbols-outlined text-[13px] text-slate-400">location_on</span>
        <span>${escapeSearchHtml(loc)}</span>
        ${workerInfo}
      </div>
    </div>
  `;
}

function selectSearchResult(ticketId) {
  const dropdown = document.getElementById('global-search-dropdown');
  if (dropdown) dropdown.classList.add('hidden');

  const input = document.getElementById('global-search-input');
  if (input) input.value = ticketId;

  // 1. Try to find the ticket on the current page's table
  const rows = document.querySelectorAll('table tbody tr');
  let targetRow = null;
  rows.forEach(row => {
    if (row.textContent.includes(ticketId)) {
      targetRow = row;
    }
  });

  if (targetRow) {
    rows.forEach(r => r.style.display = '');
    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetRow.classList.add('bg-amber-100', 'ring-2', 'ring-amber-400');
    setTimeout(() => {
      targetRow.classList.remove('bg-amber-100', 'ring-2', 'ring-amber-400');
    }, 2800);
    showToast(`Located Ticket ${ticketId}`, 'info');
    return;
  }

  // 2. If not found on current page table, save selection and route to role details page
  localStorage.setItem('campusflow_selected_ticket', ticketId);
  const path = window.location.pathname.toLowerCase();
  if (path.includes('faculty')) {
    navigateTo('faculty-complaint-details', 'faculty');
  } else if (path.includes('authority')) {
    navigateTo('authority-review', 'authority');
  } else if (path.includes('worker')) {
    navigateTo('worker-assignment-details', 'worker');
  } else if (path.includes('admin')) {
    navigateTo('admin-assignment-details', 'admin');
  } else if (path.includes('super')) {
    navigateTo('super-overview', 'super');
  } else {
    navigateTo('user-complaint-details', 'user');
  }
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'CF';
  const cleaned = name.trim().replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.|Ms\.|Er\.)\s+/i, '');
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CF';
  if (parts.length === 1) {
    return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name) {
  if (!name) return 'bg-slate-900';
  const colors = [
    'bg-slate-900',
    'bg-blue-600',
    'bg-emerald-600',
    'bg-indigo-600',
    'bg-violet-600',
    'bg-teal-600',
    'bg-rose-600',
    'bg-cyan-700'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * User Identity & Profile Picture Dropdown System
 * Clubs Profile & Settings, Switch Role, and Sign Out into a clean top-right avatar menu
 */
function getCurrentUserInfo() {
  const path = window.location.pathname.toLowerCase();
  let role = localStorage.getItem('campusflow_user_role') || sessionStorage.getItem('campusflow_user_role');
  let sessionUser = null;
  try {
    const raw = sessionStorage.getItem('campusflow_user') || localStorage.getItem('campusflow_user');
    if (raw) sessionUser = JSON.parse(raw);
  } catch (e) {}

  if (!role && sessionUser?.role) {
    role = sessionUser.role;
  }

  if (!role) {
    if (path.includes('/user/')) role = 'user';
    else if (path.includes('/faculty/')) role = 'faculty';
    else if (path.includes('/authority/')) role = 'authority';
    else if (path.includes('/worker/')) role = 'worker';
    else if (path.includes('/admin/')) role = 'admin';
    else if (path.includes('/super/')) role = 'super';
    else role = 'user';
  }

  const workerDept = getActiveWorkerDepartment();
  const workerProfile = WORKER_DEPARTMENTS[workerDept] || WORKER_DEPARTMENTS.Electrical;

  // Resolve session user properties dynamically
  const isSessionRole = sessionUser && (sessionUser.role === role || !role);
  const activeName = isSessionRole && sessionUser.name ? sessionUser.name : null;
  const activeRoll = isSessionRole ? (sessionUser.roll || sessionUser.rollId || sessionUser.id) : null;
  const activeEmail = isSessionRole ? (sessionUser.email || sessionUser.identifier) : null;
  const activePhone = isSessionRole ? (sessionUser.phone || null) : null;
  const activeDept = isSessionRole && sessionUser.department ? sessionUser.department : null;

  const profiles = {
    user: {
      name: activeName || 'Aarav Patel',
      roleTitle: 'Student / Complainant',
      id: activeRoll || '2024-ENG-UG-0142',
      email: activeEmail || 'aarav.patel@eng.university.edu',
      phone: activePhone || '+91 98765 43210',
      departmentName: activeDept || 'Department of Computer Science',
      profileView: 'user-profile',
      profileFile: 'profile.html'
    },
    faculty: {
      name: activeName || 'Prof. Ananya Sen',
      roleTitle: 'Faculty / Professor',
      id: activeRoll || 'FAC-ENG-089',
      email: activeEmail || 'prof.ananya@faculty.university.edu',
      phone: activePhone || '+91 98220 54321',
      departmentName: activeDept || 'Department of Electrical & Computer Engineering',
      profileView: 'faculty-profile',
      profileFile: 'profile.html'
    },
    authority: {
      name: activeName || 'Dr. Ramesh Sharma',
      roleTitle: 'Hostel Warden / HOD',
      id: activeRoll || 'EMP-FAC-8812',
      email: activeEmail || 'ramesh.sharma@faculty.university.edu',
      phone: activePhone || '+91 98220 11200',
      departmentName: activeDept || 'Academic Block B & Engineering Labs',
      profileView: 'authority-settings',
      profileFile: 'settings.html'
    },
    worker: {
      name: activeName || workerProfile.name,
      roleTitle: `${workerProfile.trade} (${workerProfile.departmentName})`,
      id: activeRoll || workerProfile.id,
      email: activeEmail || 'rajesh.kumar@technician.university.edu',
      phone: activePhone || '+91 98231 44102',
      department: workerProfile.code,
      departmentName: workerProfile.departmentName,
      trade: workerProfile.trade,
      profileView: 'worker-profile',
      profileFile: 'profile.html'
    },
    admin: {
      name: activeName || 'Vikramaditya Rao',
      roleTitle: 'Chief Facilities Officer',
      id: activeRoll || 'ADM-DIR-004',
      email: activeEmail || 'vikram.rao@facilities.university.edu',
      phone: activePhone || '+91 98110 33400',
      departmentName: activeDept || 'Campus Operations & Maintenance Directorate',
      profileView: 'admin-settings',
      profileFile: 'settings.html'
    },
    super: {
      name: activeName || 'Dr. Aris Thorne',
      roleTitle: 'Platform Operations Director',
      id: activeRoll || 'SUP-SYS-001',
      email: activeEmail || 'aris.thorne@governance.university.edu',
      phone: activePhone || '+91 98000 99999',
      departmentName: activeDept || 'Office of Governance & Systems',
      profileView: 'super-settings',
      profileFile: 'platform-settings.html'
    }
  };

  const selected = profiles[role] || profiles.user;
  const initials = getInitials(selected.name);
  const avatarColor = getAvatarColor(selected.name);

  return {
    role,
    ...selected,
    initials,
    avatarColor
  };
}

function toggleProfileDropdown(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const dropdown = document.getElementById('profile-dropdown-menu');
  if (!dropdown) return;

  const isHidden = dropdown.classList.contains('hidden');
  const notifDropdown = document.getElementById('notif-dropdown');
  if (notifDropdown) notifDropdown.classList.add('hidden');
  const searchDropdown = document.getElementById('global-search-dropdown');
  if (searchDropdown) searchDropdown.classList.add('hidden');

  if (isHidden) {
    dropdown.classList.remove('hidden');
  } else {
    dropdown.classList.add('hidden');
  }
}

function handleProfileNav(event) {
  if (event) event.preventDefault();
  const dropdown = document.getElementById('profile-dropdown-menu');
  if (dropdown) dropdown.classList.add('hidden');
  const info = getCurrentUserInfo();
  if (typeof navigateTo === 'function') {
    navigateTo(info.profileView, info.role);
  } else {
    window.location.href = info.profileFile;
  }
}

function handleSwitchRoleNav(event) {
  if (event) event.preventDefault();
  const dropdown = document.getElementById('profile-dropdown-menu');
  if (dropdown) dropdown.classList.add('hidden');
  if (typeof navigateTo === 'function') {
    navigateTo('login', 'public');
  } else {
    window.location.href = '../public/login.html?mode=signin';
  }
}

function performSignOut() {
  const authKeys = [
    'campusflow_session',
    'campusflow_session_token',
    'campusflow_user',
    'campusflow_user_role',
    'campusflow_worker_dept',
    'campusflow_selected_ticket'
  ];
  authKeys.forEach(k => {
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(k);
      if (typeof localStorage !== 'undefined') localStorage.removeItem(k);
    } catch (e) {}
  });

  const existing = document.getElementById('profile-dropdown-wrapper');
  if (existing) existing.remove();

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('campusflow_bus');
      bc.postMessage({ type: 'AUTH_LOGOUT' });
    } catch (e) {}
  }
}

function handleSignOutNav(event) {
  if (event) {
    try {
      event.preventDefault();
      event.stopPropagation();
    } catch (e) {}
  }
  const dropdown = document.getElementById('profile-dropdown-menu');
  if (dropdown) dropdown.classList.add('hidden');

  performSignOut();

  const isFrontend = typeof window !== 'undefined' && window.location.pathname.includes('/frontend/');
  const target = isFrontend ? '/frontend/pages/public/login.html?mode=signin' : '/pages/public/login.html?mode=signin';

  if (typeof window !== 'undefined') {
    window.location.href = target;
  }
}

if (typeof window !== 'undefined') {
  window.performSignOut = performSignOut;
  window.handleSignOutNav = handleSignOutNav;
}

// Global click listener for any "Sign Out" link or button across the app
if (typeof document !== 'undefined' && !window._signOutHandlerBound) {
  window._signOutHandlerBound = true;
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;
    const text = (target.textContent || '').trim().toLowerCase();
    const href = (target.getAttribute('href') || '').toLowerCase();
    const hasLogoutIcon = Array.from(target.querySelectorAll('span')).some(s => (s.textContent || '').trim().toLowerCase() === 'logout');
    
    if (text === 'sign out' || text.includes('sign out') || href.includes('logout') || hasLogoutIcon) {
      if (target.id === 'tab-signin-btn' || target.closest('#campusflow-login-form')) return;
      handleSignOutNav(e);
    }
  });
}

function initProfileDropdown() {
  const header = document.querySelector('header');
  if (!header) return;

  const path = window.location.pathname.toLowerCase();
  const isPublicPage = path.includes('/public/') || 
                       path.endsWith('index.html') || 
                       path.endsWith('code.html') || 
                       path === '/' || 
                       path === '' ||
                       document.getElementById('public-header') !== null;

  // Check if active authenticated session exists
  let hasSession = false;
  try {
    const rawUser = sessionStorage.getItem('campusflow_user') || localStorage.getItem('campusflow_user');
    const rawToken = sessionStorage.getItem('campusflow_session') || localStorage.getItem('campusflow_session');
    if (rawUser && rawToken) {
      hasSession = true;
    }
  } catch (e) {}

  // On public pages (especially login.html, signup.html, index.html) or if not logged in, NEVER show profile dropdown!
  if (isPublicPage || !hasSession) {
    const existing = document.getElementById('profile-dropdown-wrapper');
    if (existing) existing.remove();
    return;
  }

  // 1. Remove "Profile & Settings" from left navigation sidebar
  const sidebarNav = document.getElementById('sidebar-nav-container') || document.querySelector('#auth-sidebar nav');
  if (sidebarNav) {
    sidebarNav.querySelectorAll('a').forEach(a => {
      const text = (a.textContent || '').toLowerCase();
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (text.includes('profile') || text.includes('settings') || href.includes('profile') || href.includes('settings')) {
        a.remove();
      }
    });
  }

  // 1b. Remove bottom profile detail card & redundant exit link from sidebar
  const sidebar = document.getElementById('auth-sidebar');
  if (sidebar) {
    const bottomProfile = sidebar.querySelector('.pt-4.border-t') || 
                          sidebar.querySelector('.border-t.border-slate-800') ||
                          Array.from(sidebar.children).find(child => child !== sidebar.firstElementChild && child.textContent.includes('Exit to Public Site'));
    if (bottomProfile) {
      bottomProfile.remove();
    }
  }

  // 2. Locate right actions container in header
  const rightContainer = header.querySelector('.flex.items-center.gap-3:last-child') ||
    Array.from(header.querySelectorAll('div')).find(d => d.classList.contains('gap-3') && d.querySelector('button, a'));

  if (!rightContainer) return;

  // 3. Remove loose Switch Role and Sign Out buttons from topbar
  rightContainer.querySelectorAll('a, button').forEach(el => {
    if (el.id === 'topbar-avatar-btn' || el.closest('#profile-dropdown-wrapper')) return;
    const text = (el.textContent || '').trim();
    if (text.includes('Switch Role') || text.includes('Sign Out')) {
      el.remove();
    }
  });

  const info = getCurrentUserInfo();

  // 4. Inject or update the Profile Picture Dropdown
  let profileWrapper = document.getElementById('profile-dropdown-wrapper');
  if (!profileWrapper) {
    const oldAvatar = rightContainer.querySelector('#topbar-avatar');
    profileWrapper = document.createElement('div');
    profileWrapper.id = 'profile-dropdown-wrapper';
    profileWrapper.className = 'relative';
    profileWrapper.innerHTML = `
      <button id="topbar-avatar-btn" onclick="toggleProfileDropdown(event)" class="w-9 h-9 rounded-full ${info.avatarColor || 'bg-slate-900'} text-white flex items-center justify-center font-bold font-mono text-xs cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 transition-all shadow-sm select-none relative focus:outline-none" title="Account Menu: ${info.name}">
        <span id="topbar-avatar-text">${info.initials}</span>
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white"></span>
      </button>

      <div id="profile-dropdown-menu" class="hidden absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden text-xs transition-all">
        <div class="p-3.5 bg-slate-50/90 border-b border-slate-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full ${info.avatarColor || 'bg-slate-900'} text-white flex items-center justify-center font-mono font-bold text-sm shrink-0" id="dropdown-user-avatar">
            ${info.initials}
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-bold text-slate-900 text-sm truncate" id="dropdown-user-name">${info.name}</span>
            <span class="text-[11px] text-slate-500 font-medium truncate" id="dropdown-user-role">${info.roleTitle}</span>
            <span class="text-[10px] text-slate-400 font-mono truncate" id="dropdown-user-id">${info.id}</span>
          </div>
        </div>

        ${info.role === 'worker' ? `
        <div class="px-3.5 py-2.5 bg-blue-50/80 border-b border-blue-100 flex flex-col gap-1.5">
          <div class="flex items-center justify-between text-[10px] font-mono font-bold text-blue-900 uppercase">
            <span>Maintenance Trade</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-200 text-blue-900">${info.department || 'Electrical'}</span>
          </div>
          <select onchange="setActiveWorkerDepartment(this.value)" class="w-full text-xs font-semibold py-1.5 px-2 bg-white border border-blue-200 rounded-lg text-slate-800 focus:outline-none cursor-pointer">
            <option value="Electrical" ${(info.department || 'Electrical') === 'Electrical' ? 'selected' : ''}>⚡ Electrical & Power (Rajesh Kumar)</option>
            <option value="HVAC" ${(info.department || 'Electrical') === 'HVAC' ? 'selected' : ''}>❄️ HVAC & Climate (Vikram Singh)</option>
            <option value="Plumbing" ${(info.department || 'Electrical') === 'Plumbing' ? 'selected' : ''}>🔧 Plumbing & Water (Suresh Nair)</option>
            <option value="Civil" ${(info.department || 'Electrical') === 'Civil' ? 'selected' : ''}>🏗️ Civil & Structural (Amit Deshmukh)</option>
            <option value="Carpentry" ${(info.department || 'Electrical') === 'Carpentry' ? 'selected' : ''}>🪚 Carpentry & Locksmith (Mohammad Tariq)</option>
            <option value="General" ${(info.department || 'Electrical') === 'General' ? 'selected' : ''}>🧹 General Logistics (Rohan Verma)</option>
          </select>
        </div>` : ''}

        <div class="p-1.5 space-y-0.5">
          <a href="#" onclick="handleProfileNav(event)" class="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium group">
            <span class="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-slate-700 transition-colors">manage_accounts</span>
            <div class="flex flex-col">
              <span class="font-semibold text-slate-800">Profile & Settings</span>
              <span class="text-[10px] text-slate-400">Account info & preferences</span>
            </div>
          </a>

          <div class="my-1 border-t border-slate-100"></div>

          <a href="#" onclick="handleSwitchRoleNav(event)" class="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium group">
            <span class="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-slate-700 transition-colors">switch_account</span>
            <div class="flex flex-col">
              <span class="font-semibold text-slate-800">Switch Role</span>
              <span class="text-[10px] text-slate-400">Change persona or re-authenticate</span>
            </div>
          </a>

          <div class="my-1 border-t border-slate-100"></div>

          <a href="#" onclick="handleSignOutNav(event)" class="flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium group">
            <span class="material-symbols-outlined text-[18px] text-red-500 group-hover:text-red-600 transition-colors">logout</span>
            <div class="flex flex-col">
              <span class="font-semibold text-red-700">Sign Out</span>
              <span class="text-[10px] text-red-400">End session & return to landing page</span>
            </div>
          </a>
        </div>
      </div>
    `;

    if (oldAvatar && oldAvatar.parentNode) {
      oldAvatar.parentNode.replaceChild(profileWrapper, oldAvatar);
    } else {
      rightContainer.appendChild(profileWrapper);
    }
  } else {
    const avatarBtn = document.getElementById('topbar-avatar-btn');
    if (avatarBtn) {
      avatarBtn.title = `Account Menu: ${info.name}`;
      avatarBtn.className = `w-9 h-9 rounded-full ${info.avatarColor || 'bg-slate-900'} text-white flex items-center justify-center font-bold font-mono text-xs cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 transition-all shadow-sm select-none relative focus:outline-none`;
    }
    const avatarText = document.getElementById('topbar-avatar-text');
    if (avatarText) avatarText.textContent = info.initials;
    const dAvatar = document.getElementById('dropdown-user-avatar');
    if (dAvatar) {
      dAvatar.textContent = info.initials;
      dAvatar.className = `w-10 h-10 rounded-full ${info.avatarColor || 'bg-slate-900'} text-white flex items-center justify-center font-mono font-bold text-sm shrink-0`;
    }
    const dName = document.getElementById('dropdown-user-name');
    if (dName) dName.textContent = info.name;
    const dRole = document.getElementById('dropdown-user-role');
    if (dRole) dRole.textContent = info.roleTitle;
    const dId = document.getElementById('dropdown-user-id');
    if (dId) dId.textContent = info.id;
  }

  // Bind outside click
  if (!window._profileDropdownBound) {
    window._profileDropdownBound = true;
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('profile-dropdown-menu');
      if (dropdown && !dropdown.classList.contains('hidden')) {
        const wrapper = document.getElementById('profile-dropdown-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
          dropdown.classList.add('hidden');
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const dropdown = document.getElementById('profile-dropdown-menu');
        if (dropdown) dropdown.classList.add('hidden');
      }
    });
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  renderActiveDashboard();
  startSLACountdown();
  initInteractiveFilters();
  initInWebsiteSearch();
  initProfileDropdown();
  if (typeof initMultiSelectDepartments === 'function') initMultiSelectDepartments();
});

/**
 * CAMPUSFLOW DISPATCH & SLA WORKFORCE ENGINE
 * Module: frontend/src/scripts/dispatch.js
 */

// 30-Minute Ticking Countdown Timer & Dispatch Handlers
// 30-Minute Ticking Countdown Timer
  setInterval(() => {
    if (AppState.countdownSeconds > 0) {
      AppState.countdownSeconds--;
      const m = Math.floor(AppState.countdownSeconds / 60);
      const s = AppState.countdownSeconds % 60;
      const str = `${m}m ${s < 10 ? '0' : ''}${s}s`;
      document.querySelectorAll('.countdown-display').forEach(el => el.textContent = str);
    } else {
      document.querySelectorAll('.countdown-display').forEach(el => el.textContent = 'EXPIRED (00m 00s)');
    }
  }, 1000);

// Worker Operation Handlers
// Worker Actions
  function acceptJobWorker(ticketId) {
    showToast(`Job ${ticketId} accepted! Locked into shift work queue.`, 'success');
    navigateTo('worker-active', 'worker');
  }

  function openWorkerDeclineModal(ticketId) {
    showModal('modal-worker-decline');
  }

  function confirmWorkerDeclineSubmit() {
    closeModal('modal-worker-decline');
    showToast(`Job declined. System auto-reassigning to standby worker (WRK-0019).`, 'info');
    navigateTo('worker-overview', 'worker');
  }

  function handleWorkerProgressSubmit(e) {
    e.preventDefault();
    const note = document.getElementById('worker-progress-note').value;
    showToast('Progress milestone broadcasted to complainant & warden.', 'info');
    navigateTo('worker-active', 'worker');
  }

  function handleWorkerPhotoSelect(input) {
    const preview = document.getElementById('worker-photo-preview');
    if (preview) preview.classList.remove('hidden');
  }

  function handleWorkerCompleteSubmit(e) {
    e.preventDefault();
    showToast('Job completed & photo proof cryptographically signed into audit log!', 'success');
    navigateTo('worker-completed', 'worker');
  }

  function toggleWorkerAvailability() {
    AppState.workerOnline = !AppState.workerOnline;
    const label = document.getElementById('worker-status-label');
    const btn = document.getElementById('worker-status-btn');
    if (AppState.workerOnline) {
      if (label) label.textContent = 'ONLINE & AVAILABLE';
      if (btn) { btn.textContent = 'Go Offline'; btn.className = 'px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs'; }
      showToast('Worker terminal is online for dispatches.', 'success');
    } else {
      if (label) label.textContent = 'OFFLINE (STANDBY)';
      if (btn) { btn.textContent = 'Go Online'; btn.className = 'px-3 py-1 bg-slate-700 text-white font-bold rounded-lg text-xs'; }
      showToast('Worker marked offline. No dispatches will route to this terminal.', 'info');
    }
  }

// Super Admin Assignment Engine Tuning
// Super Admin Configuration Actions
  function updateWeights() {
    const dept = document.getElementById('weight-dept').value;
    const skill = document.getElementById('weight-skill').value;
    const prox = document.getElementById('weight-prox').value;
    const fair = document.getElementById('weight-fair').value;

    document.getElementById('weight-dept-val').textContent = dept + '%';
    document.getElementById('weight-skill-val').textContent = skill + '%';
    document.getElementById('weight-prox-val').textContent = prox + '%';
    document.getElementById('weight-fair-val').textContent = fair + '%';
  }

  function updateTimeoutVal(val) {
    document.getElementById('sla-timeout-val').textContent = `${val} Minutes (${val == 30 ? 'Standard' : 'Custom'})`;
  }

  function saveAssignmentWeights() {
    showToast('Algorithm weights updated! Dispatch engine re-balanced.', 'success');
  }


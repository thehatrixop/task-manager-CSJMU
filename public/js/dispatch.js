/**
 * CampusFlow 30-Minute SLA Timer & Dispatch Controls
 */
let dispatchCountdownSeconds = 1694; // ~28 min 14 sec

function startSLACountdown() {
  const timer = setInterval(() => {
    if (dispatchCountdownSeconds > 0) {
      dispatchCountdownSeconds--;
      const m = Math.floor(dispatchCountdownSeconds / 60);
      const s = dispatchCountdownSeconds % 60;
      const str = `${m}m ${s < 10 ? '0' : ''}${s}s`;
      const el = document.getElementById('sla-countdown-timer');
      if (el) el.textContent = str;
      document.querySelectorAll('.countdown-display').forEach(d => { d.textContent = str; });
      const progress = document.getElementById('sla-progress-bar');
      if (progress) progress.style.width = ((dispatchCountdownSeconds / 1800) * 100) + '%';
    } else {
      clearInterval(timer);
      const el = document.getElementById('sla-countdown-timer');
      if (el) el.textContent = '00m 00s (EXPIRED)';
      document.querySelectorAll('.countdown-display').forEach(d => { d.textContent = '00m 00s (EXPIRED)'; });
      showToast('30-Minute SLA expired! Auto-reassigning secondary worker...', 'error');
    }
  }, 1000);
}

function acceptJobWorker(ticketId) {
  showToast(`Job ${ticketId || 'CF-2026-00124'} accepted! Locked into shift queue.`, 'success');
  setTimeout(() => {
    if (typeof navigateTo === 'function') {
      navigateTo('worker-active', 'worker');
    } else {
      window.location.href = 'active-job.html';
    }
  }, 600);
}

function toggleWorkerAvailability() {
  const label = document.getElementById('worker-status-label');
  const btn = document.getElementById('worker-status-btn');
  if (label && (label.textContent.includes('ONLINE') || label.textContent.includes('AVAILABLE'))) {
    label.textContent = 'STATUS: OFFLINE';
    label.className = 'font-mono text-xs px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 font-bold border border-slate-300';
    if (btn) {
      btn.textContent = 'Go Online';
      btn.className = 'px-3 py-1 bg-slate-700 text-white font-bold rounded-lg text-xs hover:bg-slate-600 transition-colors';
    }
    showToast('Status set to OFFLINE. Incoming dispatches paused.', 'warning');
  } else if (label) {
    label.textContent = 'STATUS: ONLINE (ACCEPTING JOBS)';
    label.className = 'font-mono text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300';
    if (btn) {
      btn.textContent = 'Go Offline';
      btn.className = 'px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400 transition-colors';
    }
    showToast('Status set to ONLINE. Ready for dispatch.', 'success');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  startSLACountdown();
});

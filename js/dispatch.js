
/**
 * CampusFlow 30-Minute SLA Timer & Dispatch Controls
 */
let countdownSeconds = 1694; // ~28 min 14 sec

function startSLACountdown() {
  const timer = setInterval(() => {
    if (countdownSeconds > 0) {
      countdownSeconds--;
      const m = Math.floor(countdownSeconds / 60);
      const s = countdownSeconds % 60;
      const str = m + 'm ' + (s < 10 ? '0' : '') + s + 's';
      const el = document.getElementById('sla-countdown-timer');
      if (el) el.textContent = str;
      const progress = document.getElementById('sla-progress-bar');
      if (progress) progress.style.width = ((countdownSeconds / 1800) * 100) + '%';
    } else {
      clearInterval(timer);
      const el = document.getElementById('sla-countdown-timer');
      if (el) el.textContent = '00m 00s (EXPIRED)';
      showToast('30-Minute SLA expired! Auto-reassigning secondary worker...', 'error');
    }
  }, 1000);
}

function acceptJobWorker(ticketId) {
  showToast('Job Accepted! Locked into CF-2026-00124.', 'success');
  setTimeout(() => {
    window.location.href = 'active-job.html';
  }, 600);
}

function toggleWorkerAvailability() {
  const label = document.getElementById('worker-status-label');
  const btn = document.getElementById('worker-status-btn');
  if (label && label.textContent.includes('ONLINE')) {
    label.textContent = 'STATUS: OFFLINE';
    label.className = 'font-mono text-xs px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold';
    if (btn) btn.textContent = 'Go Online';
    showToast('Status set to OFFLINE. Incoming dispatches paused.', 'warning');
  } else if (label) {
    label.textContent = 'STATUS: ONLINE (ACCEPTING JOBS)';
    label.className = 'font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold';
    if (btn) btn.textContent = 'Go Offline';
    showToast('Status set to ONLINE. Ready for dispatch.', 'success');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  startSLACountdown();
});

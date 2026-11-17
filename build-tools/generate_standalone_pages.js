const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const SRC_DIR = path.join(FRONTEND_DIR, 'src');

console.log('Generating standalone page files with fixed lower layout & footer...');

// Read base assets from src
const appCss = fs.readFileSync(path.join(SRC_DIR, 'styles/app.css'), 'utf8');
const modalsHtml = fs.readFileSync(path.join(SRC_DIR, 'components/modals.html'), 'utf8');

// Shared CSS file
const enhancedCss = `html, body {
  background-color: #f8fafc !important;
  color: #0f172a;
}
${appCss}
`;

const cssDir = path.join(ROOT_DIR, 'css');
const frontendCssDir = path.join(FRONTEND_DIR, 'css');
[cssDir, frontendCssDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'style.css'), enhancedCss, 'utf8');
});
console.log('Saved css/style.css with solid surface background');

// Shared JS files
const jsDir = path.join(ROOT_DIR, 'js');
const frontendJsDir = path.join(FRONTEND_DIR, 'js');
[jsDir, frontendJsDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Create app.js
const appJsContent = `
/**
 * CampusFlow Shared Client Utilities
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }
  const colors = {
    info: 'bg-slate-900 text-white border-slate-700',
    success: 'bg-emerald-600 text-white border-emerald-500',
    warning: 'bg-amber-600 text-white border-amber-500',
    error: 'bg-red-600 text-white border-red-500'
  };
  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-xs font-medium animate-bounce ' + (colors[type] || colors.info);
  toast.innerHTML = '<span class="material-symbols-outlined text-[18px]">info</span><span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function showModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

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
`;

// Read auth.js from canonical js/auth.js
const authJsContent = fs.readFileSync(path.join(ROOT_DIR, 'js/auth.js'), 'utf8');

// Create dispatch.js
const dispatchJsContent = `
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
    label.className = 'font-mono text-xs px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 font-bold border border-slate-300';
    if (btn) btn.textContent = 'Go Online';
    showToast('Status set to OFFLINE. Incoming dispatches paused.', 'warning');
  } else if (label) {
    label.textContent = 'STATUS: ONLINE (ACCEPTING JOBS)';
    label.className = 'font-mono text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300';
    if (btn) btn.textContent = 'Go Offline';
    showToast('Status set to ONLINE. Ready for dispatch.', 'success');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  startSLACountdown();
});
`;

[jsDir, frontendJsDir].forEach(d => {
  fs.writeFileSync(path.join(d, 'app.js'), appJsContent, 'utf8');
  fs.writeFileSync(path.join(d, 'auth.js'), authJsContent, 'utf8');
  fs.writeFileSync(path.join(d, 'dispatch.js'), dispatchJsContent, 'utf8');
});
console.log('Saved js/app.js, js/auth.js, js/dispatch.js');

// HTML Head Generator
function getHtmlHead(title, relativeCssPath) {
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth" style="background-color: #f8fafc;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — CampusFlow</title>

  <!-- Typography & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669', 700: '#047857', 900: '#064e3b' },
            surface: { DEFAULT: '#f8fafc', container: '#f1f5f9', 'container-lowest': '#ffffff', 'container-high': '#e2e8f0', 'container-highest': '#cbd5e1' },
            'on-surface': '#0f172a',
            'on-surface-variant': '#475569',
            outline: '#cbd5e1',
            'outline-variant': '#e2e8f0',
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          }
        }
      }
    };
  </script>
  <link rel="stylesheet" href="${relativeCssPath}">
  <style>
    html, body {
      background-color: #f8fafc !important;
      color: #0f172a;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body class="bg-surface text-on-surface antialiased flex flex-col min-h-screen relative w-full" style="background-color: #f8fafc;">
`;
}

// -------------------------------------------------------------
// 1. GENERATE PUBLIC PAGES
// -------------------------------------------------------------
const publicPages = [
  { file: 'landing.html', title: 'Intelligent Campus Operations', isLanding: true },
  { file: 'about.html', title: 'About CampusFlow' },
  { file: 'platform.html', title: 'Platform Architecture' },
  { file: 'how-it-works.html', title: 'How It Works' },
  { file: 'departments.html', title: 'Departments Directory' },
  { file: 'department-details.html', title: 'Department Details' },
  { file: 'analytics.html', title: 'Operational Analytics Preview' },
  { file: 'login.html', title: 'Sign In to CampusFlow' },
  { file: 'signup.html', title: 'Get Started with CampusFlow' },
  { file: 'otp-verify.html', title: 'Two-Factor Verification' },
  { file: 'account-recovery.html', title: 'Account Recovery' }
];

function getPublicHeader(activeFile, isRoot = false) {
  const homeLink = isRoot ? 'index.html' : '../../index.html';
  const aboutLink = isRoot ? 'pages/public/about.html' : 'about.html';
  const platformLink = isRoot ? 'pages/public/platform.html' : 'platform.html';
  const howLink = isRoot ? 'pages/public/how-it-works.html' : 'how-it-works.html';
  const deptLink = isRoot ? 'pages/public/departments.html' : 'departments.html';
  const analyticsLink = isRoot ? 'pages/public/analytics.html' : 'analytics.html';

  const signinLink = isRoot ? 'pages/public/login.html?mode=signin' : 'login.html?mode=signin';
  const signupLink = isRoot ? 'pages/public/login.html?mode=signup' : 'login.html?mode=signup';

  const isActive = (f) => activeFile === f ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-emerald-600';

  return `
<!-- Public Header -->
<header id="public-header" class="fixed top-0 inset-x-0 z-50 py-3 transition-all duration-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="h-16 px-6 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05),0_2px_4px_-2px_rgba(15,23,42,0.05)] flex items-center justify-between">
      <a href="${homeLink}" class="flex items-center gap-3 group">
        <div class="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-600 transition-colors">
          <span class="material-symbols-outlined text-[20px]">account_balance</span>
        </div>
        <div class="flex flex-col">
          <span class="text-lg font-bold tracking-tight text-on-surface">CampusFlow</span>
          <span class="font-mono text-[9px] text-slate-500 uppercase tracking-widest leading-none">University Operations OS</span>
        </div>
      </a>
      
      <nav class="hidden lg:flex items-center gap-6 text-sm font-medium">
        <a href="${homeLink}" class="${isActive('landing.html')} transition-colors">Home</a>
        <a href="${aboutLink}" class="${isActive('about.html')} transition-colors">About</a>
        <a href="${platformLink}" class="${isActive('platform.html')} transition-colors">Platform</a>
        <a href="${howLink}" class="${isActive('how-it-works.html')} transition-colors">How It Works</a>
        <a href="${deptLink}" class="${isActive('departments.html')} transition-colors">Departments</a>
        <a href="${analyticsLink}" class="${isActive('analytics.html')} transition-colors">Analytics</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="${signinLink}" class="font-semibold text-sm px-4 py-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-all" title="Sign In to Portal">Sign In</a>
        <a href="${signupLink}" class="font-semibold text-sm px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-sm border border-slate-950/20 transition-all flex items-center gap-1.5 active:translate-y-[0.5px]" title="Create Institutional Account">
          <span>Get Started</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>
    </div>
  </div>
</header>
`;
}

function getPublicFooter(isRoot = false) {
  const homeLink = isRoot ? 'index.html' : 'landing.html';
  const aboutLink = isRoot ? 'pages/public/about.html' : 'about.html';
  const platformLink = isRoot ? 'pages/public/platform.html' : 'platform.html';
  const howLink = isRoot ? 'pages/public/how-it-works.html' : 'how-it-works.html';
  const deptLink = isRoot ? 'pages/public/departments.html' : 'departments.html';
  const analyticsLink = isRoot ? 'pages/public/analytics.html' : 'analytics.html';
  const signinLink = isRoot ? 'pages/public/login.html?mode=signin' : 'login.html?mode=signin';
  const signupLink = isRoot ? 'pages/public/login.html?mode=signup' : 'login.html?mode=signup';

  return `
<!-- Public Footer -->
<footer id="public-footer" class="w-full text-slate-400 py-16 border-t border-slate-900 mt-auto relative z-30" style="background-color: #020617 !important;">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <!-- Col 1: Institutional Seal & Campus Security -->
      <div class="flex flex-col justify-between space-y-6">
        <div class="flex flex-col items-start">
          <div class="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl flex flex-col items-center justify-center p-4 relative group">
            <div class="absolute inset-1 rounded-full border border-emerald-500/20"></div>
            <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 shadow-sm">
              <span class="material-symbols-outlined text-[26px]">account_balance</span>
            </div>
            <span class="font-bold text-white text-xs tracking-wider uppercase font-mono text-center">CampusFlow</span>
            <span class="text-[10px] text-slate-400 font-mono tracking-widest">VERIFIED CORE</span>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-bold font-mono text-white uppercase tracking-widest mb-3">Campus Security</h4>
          <p class="text-xs text-slate-400 leading-relaxed mb-3">
            SOC2 Type II Certified, FERPA Compliant, SHA-256 Tamper-Proof Audit Logging.
          </p>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>99.98% System Uptime SLA</span>
          </div>
        </div>
      </div>

      <!-- Col 2: Brand & Actions -->
      <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <span class="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <span class="text-white font-bold text-lg tracking-tight">CampusFlow</span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed mb-6">
            Centralized university facility management and autonomous workforce dispatch platform.
          </p>
        </div>
        <div class="pt-4 border-t border-slate-800/80">
          <div class="inline-flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <a href="${signupLink}" class="text-xs font-semibold px-3.5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm border border-emerald-500">Get Started Free</a>
            <a href="${signinLink}" class="text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors border border-slate-700">Sign In</a>
          </div>
        </div>
      </div>

      <!-- Col 3: Platform Links -->
      <div class="p-4">
        <h4 class="text-xs font-bold font-mono text-white uppercase tracking-widest mb-4">Platform Pages</h4>
        <ul class="space-y-2.5 text-xs text-slate-400">
          <li><a href="${homeLink}" class="hover:text-emerald-400 transition-colors">Home Landing</a></li>
          <li><a href="${aboutLink}" class="hover:text-emerald-400 transition-colors">About Mission</a></li>
          <li><a href="${platformLink}" class="hover:text-emerald-400 transition-colors">Cloud Architecture</a></li>
          <li><a href="${howLink}" class="hover:text-emerald-400 transition-colors">How It Works</a></li>
          <li><a href="${deptLink}" class="hover:text-emerald-400 transition-colors">Departments Bento</a></li>
          <li><a href="${analyticsLink}" class="hover:text-emerald-400 transition-colors">Operations Analytics</a></li>
        </ul>
      </div>

      <!-- Col 4: Role Portals -->
      <div class="p-4">
        <h4 class="text-xs font-bold font-mono text-white uppercase tracking-widest mb-4">Portals</h4>
        <ul class="space-y-2.5 text-xs text-slate-400">
          <li><a href="${signinLink}" class="hover:text-emerald-400 transition-colors">Student / Complainant Portal</a></li>
          <li><a href="${signinLink}" class="hover:text-emerald-400 transition-colors">HOD / Warden Verification Queue</a></li>
          <li><a href="${signinLink}" class="hover:text-emerald-400 transition-colors">Field Technician Cockpit (30m SLA)</a></li>
          <li><a href="${signinLink}" class="hover:text-emerald-400 transition-colors">Campus Facilities Administration</a></li>
          <li><a href="${signinLink}" class="hover:text-emerald-400 transition-colors">Super Admin Global Control</a></li>
        </ul>
      </div>
    </div>

    <div class="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
      <p>© 2026 CampusFlow Technologies Inc. All rights reserved.</p>
      <div class="flex items-center gap-6">
        <a href="${aboutLink}" class="hover:text-slate-400 transition-colors">Privacy Policy</a>
        <a href="${aboutLink}" class="hover:text-slate-400 transition-colors">Terms of Service</a>
        <a href="${aboutLink}" class="hover:text-slate-400 transition-colors">Security Architecture</a>
      </div>
    </div>
  </div>
</footer>

<script src="${isRoot ? 'js/app.js' : '../../js/app.js'}"></script>
<script src="${isRoot ? 'js/auth.js' : '../../js/auth.js'}"></script>
</body>
</html>
`;
}

// Write public pages
const pubDestDir = path.join(ROOT_DIR, 'pages/public');
const frontendPubDestDir = path.join(FRONTEND_DIR, 'pages/public');
[pubDestDir, frontendPubDestDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

publicPages.forEach(p => {
  const srcFile = path.join(SRC_DIR, 'pages/public', p.file);
  let rawContent = fs.readFileSync(srcFile, 'utf8');

  // Strip container hiding & view wrapper
  rawContent = rawContent.replace(/class="public-view[^"]*"/g, 'class="pt-24 pb-16 flex-1 w-full"');
  rawContent = rawContent.replace(/id="view-[^"]*"/g, '');

  // If this is signup.html, redirect immediately to login.html?mode=signup
  if (p.file === 'signup.html') {
    rawContent = `
    <div class="pt-32 pb-24 text-center max-w-md mx-auto px-4">
      <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 animate-spin">
        <span class="material-symbols-outlined text-[32px]">sync</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900 mb-2">Redirecting to Registration...</h2>
      <p class="text-xs text-slate-500 mb-6">Taking you to the CampusFlow institutional account creation portal.</p>
      <a href="login.html?mode=signup" class="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
        Click here if not redirected
      </a>
      <script>
        window.location.replace('login.html?mode=signup');
      </script>
    </div>
    `;
  }

  // Update Hero & Section CTAs if this is landing.html
  if (p.file === 'landing.html') {
    rawContent = rawContent.replace(
      /href="#login"\s+onclick="navigateTo\('login',\s*'public'\)"/g,
      'href="login.html?mode=signin"'
    );
    rawContent = rawContent.replace(
      /href="#signup"\s+onclick="navigateTo\('signup',\s*'public'\)"/g,
      'href="login.html?mode=signup"'
    );
    rawContent = rawContent.replace(/pages\/public\/login\.html/g, 'login.html');
    // Fix button inside CTA card and clean tags
    rawContent = rawContent.replace(
      / <button\ s+ onclick="loginAs\('user'\)"[^>] *> [\s\S] *?<\/button>/g,
      `<a href="login.html?mode=signin" class="px-7 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 inline-block">Explore Live Demo</a>`
    );
    rawContent = rawContent.replace(
      /<a href="login\.html\?mode=signin"[^>]*>[\s\S]*?<\/button>/g,
      `<a href="login.html?mode=signin" class="px-7 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 inline-block">Explore Live Demo</a>`
    );
  }

  // If this is login.html, add quick switch helper links under the forms
  if (p.file === 'login.html') {
    rawContent = rawContent.replace(
      '</form>\n\n      <!-- ================= SIGN UP FORM ================= -->',
      `<div class="pt-3 text-center">
        <button type="button" onclick="setAuthMode('signup')" class="text-xs text-slate-500 hover:text-slate-900 transition-colors">
          Don't have an institutional account? <span class="text-emerald-700 font-bold hover:underline">Get Started & Sign Up</span>
        </button>
      </div>
      </form>

      <!-- ================= SIGN UP FORM ================= -->`
    );

    rawContent = rawContent.replace(
      '</form>\n\n      <!-- Bottom Helper -->',
      `<div class="pt-3 text-center">
        <button type="button" onclick="setAuthMode('signin')" class="text-xs text-slate-500 hover:text-slate-900 transition-colors">
          Already registered? <span class="text-emerald-700 font-bold hover:underline">Sign In to Dashboard</span>
        </button>
      </div>
      </form>

      <!-- Bottom Helper -->`
    );
  }

  // Wrap in standalone document
  const head = getHtmlHead(p.title, '../../css/style.css');
  const header = getPublicHeader(p.file, false);
  const footer = getPublicFooter(false);

  const fullDoc = head + '\n' + header + '\n' + rawContent + '\n' + footer;

  fs.writeFileSync(path.join(pubDestDir, p.file), fullDoc, 'utf8');
  fs.writeFileSync(path.join(frontendPubDestDir, p.file), fullDoc, 'utf8');
  console.log('Saved page: pages/public/' + p.file);
});

// -------------------------------------------------------------
// 2. ROOT & FRONTEND INDEX.HTML & CODE.HTML (Landing Page)
// -------------------------------------------------------------
let landingSrc = fs.readFileSync(path.join(SRC_DIR, 'pages/public/landing.html'), 'utf8')
  .replace(/class="public-view[^"]*"/g, 'class="pt-24 pb-16 flex-1 w-full relative z-10" style="background-color: #f8fafc;"')
  .replace(/id="view-[^"]*"/g, '');

// Update CTAs in root Landing Page
landingSrc = landingSrc.replace(
  /href="#login"\s+onclick="navigateTo\('login',\s*'public'\)"/g,
  'href="pages/public/login.html?mode=signin"'
);
landingSrc = landingSrc.replace(
  /href="#signup"\s+onclick="navigateTo\('signup',\s*'public'\)"/g,
  'href="pages/public/login.html?mode=signup"'
);
// Fix broken CTA button
landingSrc = landingSrc.replace(
  / <button\ s+ onclick="loginAs\('user'\)"[\s\S]*?<\/button>/g,
  `<a href="pages/public/login.html?mode=signin" class="px-7 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 inline-block">Explore Live Demo</a>`
);
landingSrc = landingSrc.replace(
  /<a href="pages\/public\/login\.html\?mode=signin"[^>]*>[\s\S]*?<\/button>/g,
  `<a href="pages/public/login.html?mode=signin" class="px-7 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 inline-block">Explore Live Demo</a>`
);

// Fix CTA card container styling
landingSrc = landingSrc.replace(
  /<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">/,
  `<section class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">`
);
landingSrc = landingSrc.replace(
  /<div class="bg-slate-900 text-white rounded-3xl p-10 sm:p-16 shadow-2xl relative overflow-hidden">/,
  `<div class="bg-slate-900 text-white rounded-3xl p-10 sm:p-16 shadow-2xl relative overflow-hidden border border-slate-800" style="background-color: #0f172a;">`
);

const rootLandingDoc = getHtmlHead('Intelligent Campus Operations', 'css/style.css') + '\n' +
  getPublicHeader('landing.html', true) + '\n' +
  landingSrc + '\n' +
  getPublicFooter(true);

[
  path.join(ROOT_DIR, 'index.html'),
  path.join(ROOT_DIR, 'code.html'),
  path.join(FRONTEND_DIR, 'index.html'),
  path.join(FRONTEND_DIR, 'code.html')
].forEach(target => {
  fs.writeFileSync(target, rootLandingDoc, 'utf8');
  console.log('Generated Landing Page: ' + path.relative(ROOT_DIR, target) + ' (' + rootLandingDoc.length + ' bytes)');
});

// -------------------------------------------------------------
// 3. GENERATE AUTHENTICATED ROLE DASHBOARDS
// -------------------------------------------------------------
const rolesConfig = {
  user: {
    tag: 'USER PORTAL',
    name: 'Aarav Patel',
    sub: 'Student / Complainant (2024-ENG-0142)',
    avatar: 'AP',
    navs: [
      { file: 'overview.html', label: 'Overview', icon: 'dashboard' },
      { file: 'report-issue.html', label: 'Report New Issue', icon: 'add_circle' },
      { file: 'my-complaints.html', label: 'My Complaints', icon: 'receipt_long' },
      { file: 'complaint-details.html', label: 'Complaint Tracker', icon: 'timeline' },
      { file: 'history.html', label: 'Complaint History', icon: 'history' },
      { file: 'notifications.html', label: 'Notifications', icon: 'notifications' },
      { file: 'profile.html', label: 'Profile & Settings', icon: 'account_circle' }
    ]
  },
  authority: {
    tag: 'AUTHORITY PORTAL',
    name: 'Dr. Ramesh Sharma',
    sub: 'HOD Electrical & Warden Block B',
    avatar: 'RS',
    navs: [
      { file: 'overview.html', label: 'Overview', icon: 'dashboard' },
      { file: 'verification-queue.html', label: 'Verification Queue (2)', icon: 'pending_actions' },
      { file: 'complaint-review.html', label: 'Complaint Review', icon: 'rate_review' },
      { file: 'approved-requests.html', label: 'Approved Requests', icon: 'verified' },
      { file: 'rejected-requests.html', label: 'Rejected Requests', icon: 'cancel' },
      { file: 'active-maintenance.html', label: 'Active Maintenance', icon: 'handyman' },
      { file: 'worker-monitoring.html', label: 'Worker Monitoring', icon: 'engineering' },
      { file: 'analytics.html', label: 'Department Analytics', icon: 'analytics' },
      { file: 'notifications.html', label: 'Notifications', icon: 'notifications' },
      { file: 'settings.html', label: 'Jurisdiction Settings', icon: 'settings' }
    ]
  },
  worker: {
    tag: 'TECHNICIAN PORTAL',
    name: 'Rajesh Kumar',
    sub: 'Senior Electrician (WRK-0018)',
    avatar: 'RK',
    hasSlaScript: true,
    navs: [
      { file: 'overview.html', label: 'Cockpit Overview', icon: 'dashboard' },
      { file: 'incoming-dispatch.html', label: 'Incoming Job (30m SLA)', icon: 'notification_important' },
      { file: 'assignment-details.html', label: 'Assignment Details', icon: 'description' },
      { file: 'active-job.html', label: 'Active Job Live', icon: 'bolt' },
      { file: 'work-progress.html', label: 'Work Progress', icon: 'pending' },
      { file: 'job-complete.html', label: 'Job Completion', icon: 'task_alt' },
      { file: 'completed-jobs.html', label: 'Completed Jobs Ledger', icon: 'checklist' },
      { file: 'history.html', label: 'Work History', icon: 'history' },
      { file: 'notifications.html', label: 'Notifications', icon: 'notifications' },
      { file: 'profile.html', label: 'Worker Profile', icon: 'person' }
    ]
  },
  admin: {
    tag: 'ADMIN PORTAL',
    name: 'Vikramaditya Rao',
    sub: 'Chief Facilities Officer',
    avatar: 'VR',
    navs: [
      { file: 'overview.html', label: 'Overview', icon: 'dashboard' },
      { file: 'complaints-master.html', label: 'Master Complaints', icon: 'table_chart' },
      { file: 'workers-directory.html', label: 'Workforce Roster', icon: 'badge' },
      { file: 'create-worker.html', label: 'Provision Worker', icon: 'person_add' },
      { file: 'worker-details.html', label: 'Worker Details', icon: 'contact_page' },
      { file: 'departments.html', label: 'Departments', icon: 'domain' },
      { file: 'assignment-telemetry.html', label: 'Assignment Telemetry', icon: 'radar' },
      { file: 'assignment-details.html', label: 'Dispatch Telemetry', icon: 'hub' },
      { file: 'reports.html', label: 'Reports & Analytics', icon: 'bar_chart' },
      { file: 'notifications.html', label: 'System Alerts', icon: 'notifications' },
      { file: 'settings.html', label: 'Campus Settings', icon: 'tune' }
    ]
  },
  super: {
    tag: 'SUPER ADMIN',
    name: 'Dr. Aris Thorne',
    sub: 'Platform Operations Director',
    avatar: 'AT',
    navs: [
      { file: 'overview.html', label: 'Global Overview', icon: 'hub' },
      { file: 'user-directory.html', label: 'User Directory', icon: 'group' },
      { file: 'user-details.html', label: 'User Details', icon: 'manage_accounts' },
      { file: 'role-management.html', label: 'Role Hierarchy', icon: 'security' },
      { file: 'permission-matrix.html', label: 'Permission Matrix', icon: 'key' },
      { file: 'department-hierarchy.html', label: 'Org Hierarchy', icon: 'account_tree' },
      { file: 'assignment-engine-config.html', label: 'Assignment Engine', icon: 'settings_suggest' },
      { file: 'platform-settings.html', label: 'Platform Settings', icon: 'settings' },
      { file: 'audit-logs.html', label: 'Audit Logs (SHA-256)', icon: 'fact_check' },
      { file: 'system-activity.html', label: 'System Activity', icon: 'terminal' },
      { file: 'global-analytics.html', label: 'Global Analytics', icon: 'monitoring' }
    ]
  }
};

Object.keys(rolesConfig).forEach(roleKey => {
  const role = rolesConfig[roleKey];
  const targetDir = path.join(ROOT_DIR, 'pages', roleKey);
  const frontendTargetDir = path.join(FRONTEND_DIR, 'pages', roleKey);
  [targetDir, frontendTargetDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  role.navs.forEach(nav => {
    const srcFile = path.join(SRC_DIR, 'pages', roleKey, nav.file);
    let pageContent = fs.existsSync(srcFile) ? fs.readFileSync(srcFile, 'utf8') : '';

    // Strip hidden & view markers
    pageContent = pageContent.replace(/class="auth-view[^"]*"/g, 'class="w-full"');
    pageContent = pageContent.replace(/id="view-[^"]*"/g, '');

    // Generate nav links
    const navLinksHtml = role.navs.map(item => {
      const isCurrent = item.file === nav.file;
      const cls = isCurrent
        ? 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-white bg-slate-900 border border-slate-800 font-bold'
        : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors font-medium';
      return `<a href="${item.file}" class="${cls}"><span class="material-symbols-outlined text-[18px]">${item.icon}</span><span>${item.label}</span></a>`;
    }).join('\n        ');

    const pageDoc = `${getHtmlHead(nav.label + ' — ' + role.tag, '../../css/style.css')}
<div class="flex-1 flex w-full min-h-screen bg-slate-50">
  <!-- Sidebar -->
  <aside id="auth-sidebar" class="w-64 bg-slate-950 text-white shrink-0 hidden md:flex flex-col justify-between p-4 border-r border-slate-900">
    <div>
      <a href="../../index.html" class="flex items-center gap-3 px-2 py-3 mb-6">
        <div class="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
          <span class="material-symbols-outlined text-[18px]">account_balance</span>
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-base tracking-tight text-white leading-none">CampusFlow</span>
          <span class="font-mono text-[9px] text-slate-400 uppercase tracking-widest mt-1">${role.tag}</span>
        </div>
      </a>
      <nav class="space-y-1 text-xs">
        ${navLinksHtml}
      </nav>
    </div>

    <div class="pt-4 border-t border-slate-800/80">
      <div class="flex items-center gap-3 px-2 py-2 mb-2">
        <div class="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-mono font-bold text-xs">
          ${role.avatar}
        </div>
        <div class="flex flex-col truncate">
          <span class="text-xs font-bold text-white truncate">${role.name}</span>
          <span class="text-[10px] text-slate-400 font-mono truncate">${role.sub}</span>
        </div>
      </div>
      <a href="../../index.html" class="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors">
        <span class="material-symbols-outlined text-[16px]">logout</span>
        <span>Exit to Public Site</span>
      </a>
    </div>
  </aside>

  <!-- Main Canvas -->
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Topbar -->
    <header class="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      <div class="flex items-center gap-3">
        <button onclick="toggleMobileSidebar()" class="md:hidden text-slate-600 hover:text-slate-900">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span class="font-semibold text-slate-900">${role.tag}</span>
          <span>/</span>
          <span class="text-slate-600">${nav.label}</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500">
          <span class="material-symbols-outlined text-[16px]">search</span>
          <span>Search records...</span>
        </div>
        <a href="../public/login.html?mode=signin" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all shadow-sm">
          <span class="material-symbols-outlined text-[16px]">switch_account</span>
          <span>Switch Role</span>
        </a>
        <a href="../../index.html" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all shadow-sm">
          <span class="material-symbols-outlined text-[16px]">logout</span>
          <span class="hidden sm:inline">Sign Out</span>
        </a>
      </div>
    </header>

    <!-- Content Outlet -->
    <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      ${pageContent}
    </main>
  </div>
</div>

${modalsHtml}

<script src="../../js/app.js"></script>
${role.hasSlaScript ? '<script src="../../js/dispatch.js"></script>' : ''}
</body>
</html>
`;

    fs.writeFileSync(path.join(targetDir, nav.file), pageDoc, 'utf8');
    fs.writeFileSync(path.join(frontendTargetDir, nav.file), pageDoc, 'utf8');
    console.log('Saved role page: pages/' + roleKey + '/' + nav.file);
  });
});

console.log('\n--- ALL STANDALONE PAGES & LAYOUT FIXES SUCCESSFULLY APPLIED! ---');

/**
 * CAMPUSFLOW ROUTER & VIEW CONTROLLER
 * Module: frontend/src/scripts/router.js
 */

// Router Core
  function navigateTo(viewId, roleId) {
    if (roleId) {
      AppState.currentRole = roleId;
    }
    AppState.currentView = viewId;
    window.location.hash = '#' + viewId;

    // Update visibility of Public vs Authenticated Shell
    const isPublic = AppState.currentRole === 'public';
    const publicHeader = document.getElementById('public-header');
    const authShell = document.getElementById('authenticated-shell');

    if (isPublic) {
      if (publicHeader) publicHeader.classList.remove('hidden');
      if (authShell) authShell.classList.add('hidden');

      // Hide all public views except target
      document.querySelectorAll('.public-view').forEach(el => el.classList.add('hidden'));
      const targetView = document.getElementById('view-' + viewId);
      if (targetView) targetView.classList.remove('hidden');

      // Update public navbar link active states
      document.querySelectorAll('.pub-nav-link').forEach(link => {
        if (link.getAttribute('data-pub-route') === viewId) {
          link.classList.add('text-slate-900', 'font-bold');
          link.classList.remove('text-slate-600');
        } else {
          link.classList.remove('text-slate-900', 'font-bold');
          link.classList.add('text-slate-600');
        }
      });
    } else {
      if (publicHeader) publicHeader.classList.add('hidden');
      if (authShell) authShell.classList.remove('hidden');

      // Update Shell Topbar & Sidebar
      renderSidebarNav();
      updateTopbarMetadata(viewId);

      // Hide all auth views except target
      document.querySelectorAll('.auth-view').forEach(el => el.classList.add('hidden'));
      const targetView = document.getElementById('view-' + viewId);
      if (targetView) targetView.classList.remove('hidden');
    }

    // Update Universal Controller Badge & Buttons
    updateDemoControllerUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function loginAs(role) {
    const roleLanding = {
      user: 'user-overview',
      authority: 'authority-overview',
      worker: 'worker-overview',
      admin: 'admin-overview',
      super: 'super-overview'
    };
    navigateTo(roleLanding[role] || 'home', role);
    showToast(`Switched persona to: ${role.toUpperCase()}`, 'success');
  }

  function renderSidebarNav() {
    const container = document.getElementById('sidebar-nav-container');
    if (!container) return;
    const items = RoleNavs[AppState.currentRole] || [];
    
    container.innerHTML = items.map(item => {
      const isActive = AppState.currentView === item.id;
      return `
        <a href="#${item.id}" onclick="navigateTo('${item.id}', '${AppState.currentRole}')" 
           class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}">
          <span class="material-symbols-outlined text-[18px]">${item.icon}</span>
          <span>${item.label}</span>
        </a>
      `;
    }).join('');

    // Update Role identity tags
    const roleTag = document.getElementById('sidebar-role-tag');
    const roleName = document.getElementById('sidebar-user-name');
    const roleSub = document.getElementById('sidebar-user-sub');
    const roleAvatar = document.getElementById('sidebar-user-avatar');
    const topbarAvatar = document.getElementById('topbar-avatar');

    const meta = {
      user: { tag: 'STUDENT PORTAL', name: 'Aarav Patel', sub: 'Roll 2024-ENG-UG', av: 'AP' },
      authority: { tag: 'HOD / WARDEN', name: 'Dr. Ramesh Sharma', sub: 'Academic Block B Lead', av: 'RS' },
      worker: { tag: 'FIELD TECHNICIAN', name: 'Rajesh Kumar', sub: 'WRK-0018 • Electrical', av: 'RK' },
      admin: { tag: 'FACILITIES COMMAND', name: 'Vikramaditya Rao', sub: 'Chief Operations Lead', av: 'VR' },
      super: { tag: 'SUPER ADMIN', name: 'Dr. Aris Thorne', sub: 'Platform Director', av: 'AT' }
    }[AppState.currentRole] || { tag: 'CAMPUSFLOW', name: 'User', sub: '', av: 'CF' };

    if (roleTag) roleTag.textContent = meta.tag;
    if (roleName) roleName.textContent = meta.name;
    if (roleSub) roleSub.textContent = meta.sub;
    if (roleAvatar) roleAvatar.textContent = meta.av;
    if (topbarAvatar) topbarAvatar.textContent = meta.av;
  }

  function updateTopbarMetadata(viewId) {
    const roleBadge = document.getElementById('topbar-role-badge');
    const breadcrumb = document.getElementById('topbar-breadcrumb');
    if (roleBadge) roleBadge.textContent = AppState.currentRole.toUpperCase();
    if (breadcrumb) {
      breadcrumb.textContent = viewId.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }
  }

  function updateDemoControllerUI() {
    const badge = document.getElementById('current-role-badge');
    if (badge) badge.textContent = `${AppState.currentRole} / ${AppState.currentView}`;

    document.querySelectorAll('.demo-role-btn').forEach(btn => {
      if (btn.getAttribute('data-role') === AppState.currentRole) {
        btn.classList.add('bg-emerald-500', 'text-slate-950', 'font-bold');
        btn.classList.remove('text-slate-300');
      } else {
        btn.classList.remove('bg-emerald-500', 'text-slate-950', 'font-bold');
        btn.classList.add('text-slate-300');
      }
    });
  }

  function handleJumpSelect(val) {
    const [viewId, roleId] = val.split(',');
    navigateTo(viewId, roleId);
  }


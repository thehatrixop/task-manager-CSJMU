/**
 * CAMPUSFLOW DATA STORE & APP STATE
 * Module: frontend/src/scripts/store.js
 */

// Application State
  const AppState = {
    currentRole: 'public', // 'public', 'user', 'authority', 'worker', 'admin', 'super'
    currentView: 'home',
    workerOnline: true,
    countdownSeconds: 1694, // ~28 min 14 sec
    weights: { dept: 35, skill: 25, prox: 20, fair: 20, timeout: 30 },
    complaints: [
      { id: 'CF-2026-00124', title: 'Switchboard Malfunction & Sparking', dept: 'Electrical', location: 'Academic Block B, Rm 204', priority: 'High', status: 'In Progress', worker: 'Rajesh Kumar (WRK-0018)' },
      { id: 'CF-2026-00125', title: 'HVAC Chiller Condensate Leak', dept: 'HVAC', location: 'Block B, Server Rm 102', priority: 'Medium', status: 'Pending Verification', worker: 'Unassigned' },
      { id: 'CF-2026-00122', title: 'Library 3F Water Cooler Pressure', dept: 'Plumbing', location: 'Central Library, 3F', priority: 'Low', status: 'Resolved', worker: 'Suresh Babu' }
    ]
  };

  // Role Navigation Specs
  const RoleNavs = {
    user: [
      { id: 'user-overview', label: 'Overview', icon: 'dashboard' },
      { id: 'user-report', label: 'Report New Issue', icon: 'add_circle' },
      { id: 'user-complaints', label: 'My Complaints', icon: 'receipt_long' },
      { id: 'user-history', label: 'Complaint History', icon: 'history' },
      { id: 'user-notifications', label: 'Notifications', icon: 'notifications' },
      { id: 'user-profile', label: 'My Profile & Settings', icon: 'account_circle' }
    ],
    authority: [
      { id: 'authority-overview', label: 'Overview', icon: 'dashboard' },
      { id: 'authority-queue', label: 'Verification Queue (2)', icon: 'pending_actions' },
      { id: 'authority-approved', label: 'Approved Requests', icon: 'verified' },
      { id: 'authority-rejected', label: 'Rejected Requests', icon: 'cancel' },
      { id: 'authority-active', label: 'Active Maintenance', icon: 'handyman' },
      { id: 'authority-workers', label: 'Worker Monitoring', icon: 'engineering' },
      { id: 'authority-analytics', label: 'Department Analytics', icon: 'analytics' },
      { id: 'authority-notifications', label: 'Notifications', icon: 'notifications' },
      { id: 'authority-settings', label: 'Jurisdiction Settings', icon: 'settings' }
    ],
    worker: [
      { id: 'worker-overview', label: 'Overview', icon: 'dashboard' },
      { id: 'worker-incoming', label: 'Incoming Job (30m SLA)', icon: 'notification_important' },
      { id: 'worker-active', label: 'Active Job', icon: 'bolt' },
      { id: 'worker-completed', label: 'Completed Jobs', icon: 'task_alt' },
      { id: 'worker-history', label: 'Assignment History', icon: 'history' },
      { id: 'worker-notifications', label: 'Notifications', icon: 'notifications' },
      { id: 'worker-profile', label: 'Worker Profile', icon: 'person' }
    ],
    admin: [
      { id: 'admin-overview', label: 'Overview', icon: 'dashboard' },
      { id: 'admin-complaints', label: 'Complaint Master', icon: 'table_chart' },
      { id: 'admin-workers', label: 'Worker Management', icon: 'badge' },
      { id: 'admin-create-worker', label: 'Provision Worker', icon: 'person_add' },
      { id: 'admin-departments', label: 'Departments', icon: 'domain' },
      { id: 'admin-assignments', label: 'Assignment Telemetry', icon: 'radar' },
      { id: 'admin-reports', label: 'Reports & Analytics', icon: 'bar_chart' },
      { id: 'admin-notifications', label: 'Alerts', icon: 'notifications' },
      { id: 'admin-settings', label: 'Settings', icon: 'tune' }
    ],
    super: [
      { id: 'super-overview', label: 'Global Overview', icon: 'hub' },
      { id: 'super-users', label: 'User Directory', icon: 'group' },
      { id: 'super-roles', label: 'Role Hierarchy', icon: 'security' },
      { id: 'super-permissions', label: 'Permission Matrix', icon: 'key' },
      { id: 'super-hierarchy', label: 'Department Hierarchy', icon: 'account_tree' },
      { id: 'super-assignment-engine', label: 'Assignment Engine Config', icon: 'settings_suggest' },
      { id: 'super-settings', label: 'Platform Settings', icon: 'settings' },
      { id: 'super-audit-logs', label: 'Immutable Audit Logs', icon: 'fact_check' },
      { id: 'super-activity', label: 'System Activity', icon: 'terminal' },
      { id: 'super-analytics', label: 'Global Analytics', icon: 'monitoring' }
    ]
  };


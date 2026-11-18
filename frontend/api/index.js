// api/index.js
// Vercel Serverless Function & REST API Gateway for CampusFlow
// Pure Node.js / Express implementation for zero-config serverless deployment

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// API Root Discovery endpoint
app.get(['/', '/api'], (req, res) => {
  res.json({
    name: 'CampusFlow Intelligent Operations API Gateway',
    version: '1.0.0',
    status: 'ONLINE',
    runtime: 'Vercel Serverless / Node.js',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        google: 'POST /api/auth/google'
      },
      complaints: {
        list: 'GET /api/complaints',
        create: 'POST /api/complaints'
      },
      dispatch: {
        accept: 'POST /api/dispatch/accept',
        decline: 'POST /api/dispatch/decline',
        override: 'POST /api/dispatch/override'
      }
    }
  });
});

// Health Check endpoint
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'campusflow-serverless-api',
    node: 'CLUSTER::NODE-EAST-CAMPUS',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// Authentication Routes (/api/auth)
// ==========================================
app.post(['/auth/login', '/api/auth/login'], (req, res) => {
  const { role, method, identifier, password } = req.body;

  if (!role || !identifier || !password) {
    return res.status(400).json({ error: 'Role, identifier, and password are required.' });
  }

  const roleRedirects = {
    user: '/pages/user/overview.html',
    faculty: '/pages/faculty/overview.html',
    authority: '/pages/authority/overview.html',
    worker: '/pages/worker/overview.html',
    admin: '/pages/admin/overview.html',
    super: '/pages/super/overview.html'
  };

  const userNameMap = {
    user: 'Aarav Patel',
    faculty: 'Prof. Ananya Sen',
    authority: 'Dr. Ramesh Sharma',
    worker: 'Rajesh Kumar',
    admin: 'Vikramaditya Rao',
    super: 'Dr. Aris Thorne'
  };

  return res.json({
    token: `jwt_token_${role}_session`,
    role,
    user: {
      name: userNameMap[role] || 'CampusFlow User',
      identifier,
      method: method || 'email'
    },
    redirectUrl: roleRedirects[role] || '/pages/user/overview.html'
  });
});

app.post(['/auth/google', '/api/auth/google'], (req, res) => {
  return res.json({
    token: 'jwt_google_sso_session',
    role: 'user',
    user: {
      name: 'Aarav Patel',
      email: 'aarav.patel@eng.university.edu'
    },
    redirectUrl: '/pages/user/overview.html'
  });
});

// ==========================================
// Complaints Routes (/api/complaints)
// ==========================================
const mockComplaints = [];

app.get(['/complaints', '/api/complaints'], (req, res) => {
  const { role, status } = req.query;
  // If requested by worker or administrator, only return complaints verified by warden/HOD
  if (role === 'worker' || role === 'admin') {
    return res.json(mockComplaints.filter(c => c.status !== 'PENDING_VERIFICATION'));
  }
  if (status) {
    return res.json(mockComplaints.filter(c => c.status === status));
  }
  res.json(mockComplaints);
});

app.post(['/complaints', '/api/complaints'], (req, res) => {
  const { id, title, department, locationDesc, priority, description, complainant } = req.body;
  const newId = id || `CF-2026-00${Math.floor(127 + Math.random() * 80)}`;
  const isFaculty = complainant && complainant.toLowerCase().includes('faculty');

  const newTicket = {
    id: newId,
    title: title || 'Reported Facility Issue',
    department: department || 'General Maintenance',
    location: locationDesc || 'Campus Grounds',
    priority: priority || 'MEDIUM',
    status: isFaculty ? 'VERIFIED_DISPATCHED' : 'PENDING_VERIFICATION',
    assignedWorker: isFaculty ? 'Rajesh Kumar (WRK-0018)' : 'Awaiting Warden Verification',
    verifiedBy: isFaculty ? 'Autonomous Engine (Faculty Auto-Verification Privilege)' : null,
    complainant: complainant || 'Aarav Patel (Student)',
    createdAt: new Date().toISOString()
  };

  mockComplaints.unshift(newTicket);
  res.status(201).json(newTicket);
});

// Complainant Edit Unverified Request
app.put(['/complaints/:id', '/api/complaints/:id'], (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const index = mockComplaints.findIndex(c => c.id === id);
  if (index !== -1) {
    if (mockComplaints[index].status === 'PENDING_VERIFICATION') {
      mockComplaints[index] = { ...mockComplaints[index], ...updates };
      return res.json({ success: true, complaint: mockComplaints[index] });
    }
    return res.status(403).json({ error: 'Cannot directly edit complaints that are already verified.' });
  }
  res.json({ success: true });
});

// Complainant Retract / Delete Unverified Request
app.delete(['/complaints/:id', '/api/complaints/:id'], (req, res) => {
  const { id } = req.params;
  const index = mockComplaints.findIndex(c => c.id === id);
  if (index !== -1) {
    mockComplaints.splice(index, 1);
  }
  res.json({ success: true, message: `Complaint ${id} retracted and purged from verification queue.` });
});

// Complainant Post-Approval Rejection
app.post(['/complaints/reject', '/api/complaints/reject'], (req, res) => {
  const { ticketId, reason } = req.body;
  const t = mockComplaints.find(c => c.id === ticketId);
  if (t) {
    t.status = 'REJECTED';
    t.rejectionReason = reason || 'Cancelled by complainant';
    t.updatedAt = new Date().toISOString();
  }
  res.json({ success: true, status: 'REJECTED', ticketId });
});

// Warden/Authority Verification Endpoint
app.post(['/dispatch/verify', '/api/dispatch/verify', '/authority/verify', '/api/authority/verify'], (req, res) => {
  const { ticketId, workerId, verifiedBy } = req.body;
  const t = mockComplaints.find(c => c.id === ticketId);
  if (t) {
    t.status = 'VERIFIED_DISPATCHED';
    t.assignedWorker = workerId || 'Rajesh Kumar (WRK-0018)';
    t.verifiedBy = verifiedBy || 'Dr. Ramesh Sharma (HOD / Warden)';
    t.verifiedAt = new Date().toISOString();
  }
  res.json({
    status: 'VERIFIED_DISPATCHED',
    ticketId: ticketId || 'CF-2026-00124',
    assignedWorker: workerId || 'Rajesh Kumar (WRK-0018)',
    message: 'Warden verification successful. Dispatched to field technician and facilities command.',
    updatedAt: new Date().toISOString()
  });
});

// ==========================================
// Dispatch Routes (/api/dispatch)
// ==========================================
app.post(['/dispatch/accept', '/api/dispatch/accept'], (req, res) => {
  const { ticketId, workerId } = req.body;
  const t = mockComplaints.find(c => c.id === ticketId);
  if (t) {
    t.status = 'ACTIVE_IN_PROGRESS';
    t.assignedWorker = workerId || 'Rajesh Kumar (WRK-0018)';
  }
  res.json({
    status: 'ACCEPTED',
    ticketId: ticketId || 'CF-2026-00124',
    workerId: workerId || 'WRK-0018',
    message: 'Worker accepted within 30-minute SLA window. Locked into active work order.',
    updatedAt: new Date().toISOString()
  });
});

app.post(['/dispatch/decline', '/api/dispatch/decline'], (req, res) => {
  const { ticketId, workerId, reason } = req.body;
  res.json({
    status: 'DECLINED_REASSIGNING',
    ticketId: ticketId || 'CF-2026-00124',
    workerId: workerId || 'WRK-0018',
    reason: reason || 'Shift limit reached',
    cascadeCandidate: 'WRK-0019 (Vikram Singh)',
    message: 'Decline recorded. Automated cascading to secondary standby unit triggered.',
    updatedAt: new Date().toISOString()
  });
});

app.post(['/dispatch/override', '/api/dispatch/override'], (req, res) => {
  const { ticketId, newWorkerId } = req.body;
  res.json({
    status: 'ADMIN_OVERRIDDEN',
    ticketId: ticketId || 'CF-2026-00124',
    newWorkerId: newWorkerId || 'WRK-0019',
    message: 'Administrative override executed. Work order reassigned.',
    updatedAt: new Date().toISOString()
  });
});

// Export Express app as Vercel Serverless Function handler
module.exports = app;

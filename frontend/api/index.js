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
    authority: '/pages/authority/overview.html',
    worker: '/pages/worker/overview.html',
    admin: '/pages/admin/overview.html',
    super: '/pages/super/overview.html'
  };

  const userNameMap = {
    user: 'Aarav Patel',
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
const mockComplaints = [
  {
    id: 'CF-2026-00124',
    title: 'Switchboard Malfunction & Sparking',
    department: 'Electrical',
    location: 'Academic Block B, Second Floor, Room 204, Near Laboratory Entrance',
    priority: 'HIGH',
    status: 'ACTIVE_IN_PROGRESS',
    assignedWorker: 'Rajesh Kumar (WRK-0018)',
    createdAt: '2026-11-10T08:30:00.000Z'
  },
  {
    id: 'CF-2026-00125',
    title: 'Water Pressure Loss in Common Restrooms',
    department: 'Plumbing',
    location: 'Hostel Block C, Ground Floor Washrooms',
    priority: 'MEDIUM',
    status: 'PENDING_VERIFICATION',
    assignedWorker: 'Unassigned',
    createdAt: '2026-11-10T09:15:00.000Z'
  },
  {
    id: 'CF-2026-00126',
    title: 'HVAC Chiller Unit Abnormal Vibration',
    department: 'HVAC',
    location: 'Central Library, Third Floor Server Room',
    priority: 'CRITICAL',
    status: 'ACTIVE_IN_PROGRESS',
    assignedWorker: 'Vikram Singh (WRK-0019)',
    createdAt: '2026-11-10T09:45:00.000Z'
  }
];

app.get(['/complaints', '/api/complaints'], (req, res) => {
  res.json(mockComplaints);
});

app.post(['/complaints', '/api/complaints'], (req, res) => {
  const { id, title, department, locationDesc, priority, description, complainant } = req.body;
  const newId = id || `CF-2026-00${Math.floor(127 + Math.random() * 80)}`;

  const newTicket = {
    id: newId,
    title: title || 'Reported Facility Issue',
    department: department || 'General Maintenance',
    location: locationDesc || 'Campus Grounds',
    priority: priority || 'MEDIUM',
    status: 'PENDING_VERIFICATION',
    assignedWorker: 'Pending Authority Approval',
    complainant: complainant || 'Aarav Patel (Student)',
    createdAt: new Date().toISOString()
  };

  mockComplaints.unshift(newTicket);
  res.status(201).json(newTicket);
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

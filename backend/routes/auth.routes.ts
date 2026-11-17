// backend/routes/auth.routes.ts
import { Router } from 'express';

const router = Router();

// POST /api/auth/login
// Supports 4-field payload: role, method (email/phone), identifier, password
router.post('/login', async (req, res) => {
  const { role, method, identifier, password } = req.body;

  if (!role || !identifier || !password) {
    return res.status(400).json({ error: 'Role, identifier, and password are required.' });
  }

  // Role-based mock routing
  const roleRedirects: Record<string, string> = {
    user: '/user/overview',
    authority: '/authority/overview',
    worker: '/worker/overview',
    admin: '/admin/overview',
    super: '/super/overview'
  };

  return res.json({
    token: `jwt_token_${role}_session`,
    role,
    user: {
      name: role === 'user' ? 'Aarav Patel' : role === 'worker' ? 'Rajesh Kumar' : 'Staff Lead',
      identifier,
      method
    },
    redirectUrl: roleRedirects[role] || '/user/overview'
  });
});

// POST /api/auth/google
// User Role Google SSO
router.post('/google', async (req, res) => {
  return res.json({
    token: 'jwt_google_sso_session',
    role: 'user',
    user: {
      name: 'Aarav Patel',
      email: 'aarav.patel@eng.university.edu'
    },
    redirectUrl: '/user/overview'
  });
});

export default router;


// backend/routes/complaints.routes.ts
import { Router } from 'express';

const router = Router();

// GET /api/complaints
router.get('/', (req, res) => {
  res.json([
    {
      id: 'CF-2026-00124',
      title: 'Switchboard Malfunction & Sparking',
      department: 'Electrical',
      location: 'Academic Block B, Second Floor, Room 204, Near Laboratory Entrance',
      priority: 'HIGH',
      status: 'ACTIVE_IN_PROGRESS',
      assignedWorker: 'Rajesh Kumar (WRK-0018)'
    }
  ]);
});

// POST /api/complaints
router.post('/', (req, res) => {
  const { title, department, locationDesc, priority, description } = req.body;
  const newId = `CF-2026-00${Math.floor(100 + Math.random() * 900)}`;

  res.status(201).json({
    id: newId,
    title,
    department,
    locationDesc,
    priority: priority || 'MEDIUM',
    status: 'PENDING_VERIFICATION',
    createdAt: new Date().toISOString()
  });
});

export default router;


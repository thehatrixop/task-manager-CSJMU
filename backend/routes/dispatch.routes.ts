// backend/routes/dispatch.routes.ts
import { Router } from 'express';

const router = Router();

// POST /api/dispatch/accept
router.post('/accept', (req, res) => {
  const { ticketId, workerId } = req.body;
  res.json({
    status: 'ACCEPTED',
    ticketId,
    workerId,
    message: `Worker accepted within 30-minute SLA window. Locked into active work order.`,
    updatedAt: new Date().toISOString()
  });
});

// POST /api/dispatch/decline
router.post('/decline', (req, res) => {
  const { ticketId, workerId, reason } = req.body;
  res.json({
    status: 'DECLINED_REASSIGNING',
    ticketId,
    workerId,
    reason,
    cascadeCandidate: 'WRK-0019 (Vikram Singh)',
    message: `Decline recorded. Automated cascading to secondary standby unit triggered.`
  });
});

// POST /api/dispatch/override
router.post('/override', (req, res) => {
  const { ticketId, newWorkerId } = req.body;
  res.json({
    status: 'ADMIN_OVERRIDDEN',
    ticketId,
    newWorkerId,
    message: `Administrative override executed.`
  });
});

export default router;


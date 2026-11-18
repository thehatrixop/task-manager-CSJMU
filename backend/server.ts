// backend/server.ts
// Express REST & WebSocket Real-Time Gateway for CampusFlow

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRouter from './routes/auth.routes';
import complaintsRouter from './routes/complaints.routes';
import dispatchRouter from './routes/dispatch.routes';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// API Root Discovery endpoint
app.get(['/', '/api'], (req, res) => {
  res.json({
    name: 'CampusFlow Intelligent Operations API Gateway',
    version: '1.0.0',
    status: 'ONLINE',
    service: 'campusflow-backend',
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

// Health Check endpoint (supports both direct and /api prefixed routes)
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'campusflow-backend',
    node: 'CLUSTER::NODE-EAST-CAMPUS',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount Core Application Routes
// Supports both path formats (with and without /api prefix) to accommodate top-level rewrites or internal proxies
app.use('/api/auth', authRouter);
app.use('/auth', authRouter);

app.use('/api/complaints', complaintsRouter);
app.use('/complaints', complaintsRouter);

app.use('/api/dispatch', dispatchRouter);
app.use('/dispatch', dispatchRouter);

// Real-Time WebSocket Connections
io.on('connection', (socket) => {
  console.log(`[WebSocket] Connected: ${socket.id}`);

  // Join role channel
  socket.on('join_channel', (role: string) => {
    socket.join(`role:${role}`);
    console.log(`[WebSocket] Client joined channel: role:${role}`);
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`[CampusFlow API] Gateway running on http://localhost:${PORT}`);
  });
}

export { app, io, server };
export default app;

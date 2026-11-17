// backend/server.ts
// Express REST & WebSocket Real-Time Gateway for CampusFlow

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    node: 'CLUSTER::NODE-EAST-CAMPUS',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

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
server.listen(PORT, () => {
  console.log(`[CampusFlow API] Gateway running on http://localhost:${PORT}`);
});

export { app, io, server };


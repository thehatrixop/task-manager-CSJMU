// server.js
// Production-grade static web server and API proxy for CampusFlow
// Supports Vercel Services multi-service routing with BACKEND_URL binding

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let parsedUrl = req.url.split('?')[0].split('#')[0];

  // 1. Forward /api/* requests to internal backend service via bound BACKEND_URL
  if (parsedUrl.startsWith('/api/')) {
    const backendBase = process.env.BACKEND_URL || 'http://localhost:4000';
    try {
      const targetUrl = new URL(req.url, backendBase);
      const client = targetUrl.protocol === 'https:' ? https : http;

      const proxyReq = client.request(
        targetUrl,
        {
          method: req.method,
          headers: {
            ...req.headers,
            host: targetUrl.host
          }
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res);
        }
      );

      proxyReq.on('error', (err) => {
        console.error(`[App -> Backend Binding Error] ${err.message}`);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Bad Gateway',
          message: 'Unable to connect to internal backend service via BACKEND_URL binding.',
          target: backendBase,
          details: err.message
        }));
      });

      req.pipe(proxyReq);
      return;
    } catch (err) {
      console.error('[Proxy Error]', err);
    }
  }

  // 2. Static file serving for web application frontend
  if (parsedUrl === '/' || parsedUrl === '') {
    parsedUrl = '/index.html';
  }

  const safePath = path.normalize(parsedUrl).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(__dirname, 'index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[CampusFlow Server] Active on port ${PORT}`);
    console.log(`- URL: http://localhost:${PORT}/`);
    if (process.env.BACKEND_URL) {
      console.log(`- Bound Backend Service URL: ${process.env.BACKEND_URL}`);
    }
  });
}

module.exports = server;

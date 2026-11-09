import http from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.FRONTEND_PORT || 5174);
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };

http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) {
    try {
      const headers = { 'content-type': request.headers['content-type'] || 'application/json' };
      if (request.headers.authorization) headers.authorization = request.headers.authorization;
      if (request.headers['x-guest-access-token']) headers['x-guest-access-token'] = request.headers['x-guest-access-token'];
      const body = ['GET', 'HEAD'].includes(request.method || 'GET') ? undefined : await new Promise((resolve, reject) => {
        const chunks = [];
        request.on('data', chunk => chunks.push(chunk));
        request.on('end', () => resolve(Buffer.concat(chunks)));
        request.on('error', reject);
      });
      const upstream = await fetch(`http://127.0.0.1:${process.env.BACKEND_PORT || 8081}${url.pathname}${url.search}`, { method: request.method, headers, body });
      response.writeHead(upstream.status, { 'content-type': upstream.headers.get('content-type') || 'application/json' });
      response.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      response.writeHead(502, { 'content-type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ message: `AgroConnect API is unavailable. Confirm the Spring Boot app is running on port ${process.env.BACKEND_PORT || 8081}.` }));
    }
    return;
  }

  const requested = url.pathname === '/' ? '/index.html' : url.pathname;
  const candidate = path.resolve(root, `.${requested}`);
  if (!candidate.startsWith(root + path.sep)) { response.writeHead(404).end('Not found'); return; }
  try {
    const actual = await realpath(candidate);
    if (!actual.startsWith(root + path.sep)) { response.writeHead(404).end('Not found'); return; }
    const data = await readFile(actual);
    response.writeHead(200, { 'content-type': contentTypes[path.extname(actual)] || 'application/octet-stream', 'cache-control': 'no-store' });
    response.end(data);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`AgroConnect frontend available at http://localhost:${port}`));


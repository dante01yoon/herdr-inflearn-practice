import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadDashboard } from './data.mjs';
import { dashboardResponse } from './dashboard.mjs';

const dist = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };

export function createServer() {
  let liveCache;
  let liveRequest;
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' }); res.end(); return;
    }
    if (url.pathname === '/api/dashboard') {
      const source = url.searchParams.get('source') ?? 'snapshot';
      if (!['snapshot', 'live'].includes(source)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '지원하지 않는 데이터 모드입니다.' })); return;
      }
      const state = url.searchParams.get('state') ?? 'all';
      if (!['all', 'open', 'closed'].includes(state)) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: '지원하지 않는 이슈 상태입니다.' })); return;
      }
      try {
        let data;
        if (source === 'snapshot') data = await loadDashboard();
        else if (liveCache && Date.now() - liveCache.time < 60_000) data = liveCache.data;
        else {
          liveRequest ??= loadDashboard({ source: 'live' }).then(value => {
            liveCache = { data: value, time: Date.now() }; return value;
          }).finally(() => { liveRequest = undefined; });
          data = await liveRequest;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify(dashboardResponse(data, {
          query: url.searchParams.get('query') ?? '', state,
          label: url.searchParams.get('label') ?? 'all',
        })));
      } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '실습 데이터를 불러오지 못했습니다.' }));
      }
      return;
    }
    try {
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === '/') pathname = '/index.html';
      const target = path.resolve(dist, `.${pathname}`);
      if (!target.startsWith(dist + path.sep)) { res.writeHead(403); res.end(); return; }
      const bytes = await readFile(target);
      res.writeHead(200, { 'Content-Type': mime[path.extname(target)] ?? 'application/octet-stream' });
      res.end(bytes);
    } catch {
      res.writeHead(404); res.end('Not found');
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4174);
  createServer().listen(port, '127.0.0.1', () => console.log(`Herdr course: http://127.0.0.1:${port}`));
}

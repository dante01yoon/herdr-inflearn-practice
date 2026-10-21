import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server/index.mjs';

test('HTTP API validates mode, rejects writes, serves snapshot', async t => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(`${base}/api/dashboard?source=bad`)).status, 400);
  assert.equal((await fetch(`${base}/api/dashboard`, { method: 'POST' })).status, 405);
  const response = await fetch(`${base}/api/dashboard`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).issues.length, 26);
  assert.equal((await fetch(`${base}/%2e%2e%2fpackage.json`)).status, 403);
});

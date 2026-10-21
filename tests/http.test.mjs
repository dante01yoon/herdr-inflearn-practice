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

test('HTTP filters intersect and empty results preserve global metadata', async t => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api/dashboard`;
  const all = await (await fetch(base)).json();
  assert.equal(all.total, 26);
  assert.equal(all.filtered, 26);
  const item = all.issues[0];
  const params = new URLSearchParams({ query: ` #${item.number} `, state: item.state,
    label: item.labels[0]?.name ?? '__unlabelled__' });
  const filtered = await (await fetch(`${base}?${params}`)).json();
  assert.deepEqual(filtered.issues.map(issue => issue.number), [item.number]);
  assert.equal(filtered.filtered, 1);
  for (const query of ['label=unknown-label', 'query=no-match-934789']) {
    const response = await fetch(`${base}?${query}`);
    assert.equal(response.status, 200);
    const empty = await response.json();
    assert.deepEqual(empty.issues, []);
    assert.equal(empty.filtered, 0);
    for (const key of ['total', 'labels', 'labelCounts', 'repository', 'capturedAt', 'source', 'scope', 'warning', 'releases']) {
      assert.deepEqual(empty[key], all[key]);
    }
  }
  const invalid = await fetch(`${base}?state=invalid`);
  assert.equal(invalid.status, 400);
  assert.ok((await invalid.json()).error);
  const write = await fetch(base, { method: 'POST' });
  assert.equal(write.status, 405);
  assert.equal(write.headers.get('allow'), 'GET');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDashboard } from '../server/data.mjs';

test('snapshot never calls network and contains real repository records', async () => {
  const data = await loadDashboard({ fetcher: () => { throw new Error('Must not fetch'); } });
  assert.equal(data.source, 'snapshot');
  assert.equal(data.repository, 'herdrdev/herdr');
  assert.ok(data.issues.length > 0);
  assert.ok(data.releases.length > 0);
});
test('network failure returns visible fallback metadata', async () => {
  const data = await loadDashboard({ source: 'live', fetcher: async () => { throw new Error('offline'); } });
  assert.equal(data.source, 'snapshot-fallback');
  assert.ok(data.warning);
  assert.ok(data.issues.length);
});
test('invalid GitHub payload falls back instead of empty success', async () => {
  const data = await loadDashboard({ source: 'live', fetcher: async () => new Response('{"message":"bad"}') });
  assert.equal(data.source, 'snapshot-fallback');
});
test('live mode excludes PRs and prereleases', async () => {
  const fetcher = async url => new Response(JSON.stringify(url.includes('/issues') ? [
    { number: 1, title: 'Issue', state: 'open', labels: [] },
    { number: 2, title: 'PR', state: 'open', labels: [], pull_request: {} },
  ] : [{ tag_name: 'v1', prerelease: false }, { tag_name: 'v2-beta', prerelease: true }]));
  const data = await loadDashboard({ source: 'live', fetcher });
  assert.equal(data.source, 'live');
  assert.equal(data.issues.length, 1);
  assert.equal(data.releases.length, 1);
});

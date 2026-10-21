import test from 'node:test';
import assert from 'node:assert/strict';
import { dashboardResponse } from '../server/dashboard.mjs';

const data = { source: 'snapshot-fallback', warning: 'offline', issues: [
  { number: 123, title: 'Alpha BUG', state: 'open', labels: [{ name: 'z' }, { name: 'z' }, { name: 'a' }] },
  { number: 24, title: 'Beta', state: 'closed', labels: [] },
  { number: 35, title: 'Gamma', state: 'open', labels: [{ name: 'a' }] },
] };

test('aggregates deduplicate issue labels and include unlabelled issues', () => {
  const result = dashboardResponse(data);
  assert.deepEqual(result.labels, ['a', 'z']);
  assert.deepEqual(result.labelCounts, [
    { name: 'a', count: 2 },
    ...[{ name: 'z', count: 1 }, { name: '라벨 없음', count: 1 }].sort((a, b) => a.name.localeCompare(b.name)),
  ]);
  assert.equal(result.source, data.source);
  assert.equal(result.warning, data.warning);
});

test('search normalization, partial numbers, states and unlabelled filters', () => {
  for (const query of [' alpha ', ' BUG ', ' #23 ']) {
    assert.deepEqual(dashboardResponse(data, { query }).issues.map(x => x.number), [123]);
  }
  assert.deepEqual(dashboardResponse(data, { state: 'closed', label: '__unlabelled__' }).issues.map(x => x.number), [24]);
  assert.equal(dashboardResponse(data, { query: 'alpha', state: 'closed' }).filtered, 0);
  assert.equal(dashboardResponse(data, { query: 'alpha', label: '__unlabelled__' }).filtered, 0);
  assert.equal(dashboardResponse(data).filtered, 3);
  assert.equal(data.issues.length, 3);
});

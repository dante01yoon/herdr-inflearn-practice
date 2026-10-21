import test from 'node:test';
import assert from 'node:assert/strict';
import { labelPercentage } from '../src/domain.mjs';
import { dashboardResponse } from '../server/dashboard.mjs';

test('label percentage rounds to the nearest integer', () => {
  assert.equal(labelPercentage(12, 35), 34);
  assert.equal(labelPercentage(2, 3), 67);
  assert.equal(labelPercentage(1, 8), 13);
  assert.equal(labelPercentage(0, 3), 0);
  assert.equal(labelPercentage(3, 3), 100);
});

test('label percentage avoids division by zero', () => {
  assert.equal(labelPercentage(0, 0), 0);
  assert.equal(labelPercentage(1, 0), 0);
});

test('label percentage uses the response total across filters and overlapping labels', () => {
  const data = { issues: [
    { number: 1, title: 'First', state: 'open', labels: [{ name: 'bug' }, { name: 'ui' }] },
    { number: 2, title: 'Second', state: 'closed', labels: [{ name: 'bug' }] },
    { number: 3, title: 'Third', state: 'open', labels: [] },
  ] };
  for (const query of ['', 'First', 'missing']) {
    const response = dashboardResponse(data, { query });
    const bug = response.labelCounts.find(item => item.name === 'bug');
    assert.equal(labelPercentage(bug.count, response.total), 67);
  }
});

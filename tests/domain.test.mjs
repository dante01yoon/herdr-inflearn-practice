import test from 'node:test';
import assert from 'node:assert/strict';
import { filterIssues, labelCounts, normalizeIssues } from '../src/domain.mjs';

const issues = [
  { number: 10, title: 'Keyboard focus', state: 'open', labels: [{ name: 'bug' }, { name: 'ui' }] },
  { number: 11, title: 'Other issue', state: 'closed', labels: [{ name: 'bug' }] },
  { number: 12, title: 'Keyboard setting', state: 'open', labels: [] },
];
test('search, state and label intersect; query is case insensitive', () => {
  assert.deepEqual(filterIssues(issues, { query: ' KEYBOARD ', state: 'open', label: 'bug' }).map(x => x.number), [10]);
});
test('number lookup and empty results', () => {
  assert.deepEqual(filterIssues(issues, { query: '#11' }).map(x => x.number), [11]);
  assert.deepEqual(filterIssues(issues, { query: 'not found' }), []);
});
test('reset returns all issues without mutation', () => {
  assert.equal(filterIssues(issues, {}).length, 3);
  assert.equal(issues.length, 3);
});
test('counts each issue once per label and includes unlabelled', () => {
  const result = labelCounts([...issues, { number: 13, labels: [{ name: 'bug' }, { name: 'bug' }] }]);
  assert.equal(result.find(x => x.name === 'bug').count, 3);
  assert.equal(result.find(x => x.name === '라벨 없음').count, 1);
});
test('normalization excludes PRs and malformed entries', () => {
  const result = normalizeIssues([...issues, { number: 99, title: 'PR', pull_request: {}, labels: [] }, null]);
  assert.equal(result.length, 3);
  assert.ok(result.every(x => Array.isArray(x.labels)));
});

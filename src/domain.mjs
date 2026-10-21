export function normalizeIssues(items) {
  return items.filter(x => x && !x.pull_request && Number.isInteger(x.number) && typeof x.title === 'string')
    .map(x => ({ ...x, labels: (x.labels ?? []).map(l => typeof l === 'string' ? { name: l } : l).filter(l => typeof l?.name === 'string') }));
}

export function filterIssues(issues, { query = '', state = 'all', label = 'all' } = {}) {
  const q = query.trim().toLowerCase().replace(/^#/, '');
  return issues.filter(issue =>
    (state === 'all' || issue.state === state) &&
    (label === 'all' || (label === '__unlabelled__' ? !issue.labels.length : issue.labels.some(l => l.name === label))) &&
    (!q || issue.title.toLowerCase().includes(q) || String(issue.number).includes(q))
  );
}

// 제목을 검색어 일치 여부로 나눈다. 정규화는 filterIssues와 같고, 홀수 번째 조각이 일치 부분이다.
export function highlightParts(title, query = '') {
  const q = query.trim().replace(/^#/, '');
  if (!q) return [title];
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return title.split(new RegExp(`(${escaped})`, 'gi'));
}

export function labelCounts(issues) {
  const counts = new Map();
  for (const issue of issues) {
    const labels = [...new Set((issue.labels ?? []).map(l => l.name))];
    for (const name of labels.length ? labels : ['라벨 없음']) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function labelPercentage(count, total) {
  return total > 0 ? Math.round(count / total * 100) : 0;
}

export function repositoryUrl(repository) {
  return repository ? `https://github.com/${repository}` : null;
}

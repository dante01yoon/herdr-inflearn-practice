export function dashboardResponse(data, { query = '', state = 'all', label = 'all' } = {}) {
  const q = query.trim().toLowerCase().replace(/^#/, '');
  const counts = new Map();
  const names = new Set();
  for (const issue of data.issues) {
    const labels = new Set(issue.labels.map(item => item.name));
    for (const name of labels) names.add(name);
    for (const name of labels.size ? labels : ['라벨 없음']) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  const issues = data.issues.filter(issue =>
    (state === 'all' || issue.state === state) &&
    (label === 'all' || (label === '__unlabelled__' ? issue.labels.length === 0 : issue.labels.some(item => item.name === label))) &&
    (!q || issue.title.toLowerCase().includes(q) || String(issue.number).includes(q))
  );
  return {
    ...data, issues, total: data.issues.length, filtered: issues.length,
    labels: [...names].sort(),
    labelCounts: [...counts].map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
  };
}

import { readFile } from 'node:fs/promises';
import { normalizeIssues } from '../src/domain.mjs';

const fixtureUrl = new URL('../data/snapshot.json', import.meta.url);
const baseUrl = 'https://api.github.com/repos/herdrdev/herdr';

export async function loadDashboard({ source = 'snapshot', fetcher = fetch } = {}) {
  const snapshot = JSON.parse(await readFile(fixtureUrl, 'utf8'));
  if (source !== 'live') return { ...snapshot, source: 'snapshot', warning: null };
  try {
    const get = async path => {
      const response = await fetcher(`${baseUrl}/${path}`, {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Herdr-Course-Dashboard' },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error(`GitHub ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid response');
      return data;
    };
    const [issues, releases] = await Promise.all([get('issues?state=all&per_page=30'), get('releases?per_page=5')]);
    return {
      repository: snapshot.repository, capturedAt: new Date().toISOString(), source: 'live',
      scope: snapshot.scope, warning: null, issues: normalizeIssues(issues),
      releases: releases.filter(x => !x.prerelease && !x.draft),
    };
  } catch {
    return { ...snapshot, source: 'snapshot-fallback', warning: 'GitHub에 연결하지 못해 저장된 스냅숏을 표시합니다.' };
  }
}

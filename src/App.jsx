import { useCallback, useEffect, useRef, useState } from 'react';
import Filters from './components/Filters.jsx';
import IssueList from './components/IssueList.jsx';
import LabelStats from './components/LabelStats.jsx';
import Releases from './components/Releases.jsx';
import { stage } from './stage.js';

const DEFAULT_FILTERS = { query: '', state: 'all', label: 'all' };

function useDashboard(source, filters) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(0);

  useEffect(() => {
    const id = ++latest.current;
    const controller = new AbortController();
    const params = new URLSearchParams({ source, ...filters });
    setLoading(true);
    // 검색어 입력 중 요청이 쏟아지지 않도록 짧게 늦춘다.
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/dashboard?${params}`, { signal: controller.signal });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || `서버 오류 (${res.status})`);
        if (id !== latest.current) return;
        setData(body); setError(null);
      } catch (err) {
        if (controller.signal.aborted || id !== latest.current) return;
        setError(err.message || '데이터를 불러오지 못했습니다.');
      } finally {
        if (id === latest.current) setLoading(false);
      }
    }, filters.query ? 200 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [source, filters.query, filters.state, filters.label, attempt]);

  const retry = useCallback(() => setAttempt(n => n + 1), []);
  return { data, error, loading, retry };
}

export default function App() {
  const [tab, setTab] = useState('issues');
  const [source, setSource] = useState('snapshot');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, error, loading, retry } = useDashboard(source, filters);
  const reset = () => setFilters(DEFAULT_FILTERS);

  return <>
    <header><div className="header-inner">
      <a className="brand" href="/"><strong>Herdr</strong><span>이슈 대시보드</span></a>
    </div></header>
    <main>
      <div className="page-heading">
        <h1>이슈 대시보드</h1>
        <p>{data ? `${data.repository} 저장소의 공개 이슈와 릴리스` : 'Herdr 저장소의 공개 이슈와 릴리스'}</p>
      </div>
      {stage.releases && <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'issues'} className={tab === 'issues' ? 'active' : ''} onClick={() => setTab('issues')}>이슈</button>
        <button role="tab" aria-selected={tab === 'releases'} className={tab === 'releases' ? 'active' : ''} onClick={() => setTab('releases')}>릴리스</button>
      </div>}
      {data?.warning && <p className="warning" role="alert">{data.warning}</p>}
      {tab === 'issues' && stage.filters && <Filters filters={filters} setFilters={setFilters} labels={data?.labels ?? []} />}
      <Body tab={tab} data={data} error={error} loading={loading} retry={retry} reset={reset} />
      <footer>
        <div>
          {data && <p>기준 시각 {data.capturedAt} · 출처 <a href={data.source} target="_blank" rel="noreferrer">GitHub API</a></p>}
          {data?.scope && <p>{data.scope}</p>}
        </div>
        <label className="data-source">데이터
          <select aria-label="데이터 모드" value={source} onChange={event => setSource(event.target.value)}>
            <option value="snapshot">스냅숏</option><option value="live">실시간</option>
          </select>
        </label>
      </footer>
    </main>
  </>;
}

function Body({ tab, data, error, loading, retry, reset }) {
  if (error) return <div className="error" role="alert">
    <strong>데이터를 불러오지 못했습니다.</strong><p>{error}</p>
    <button type="button" onClick={retry}>다시 시도</button>
  </div>;
  if (!data) return <p className="loading" role="status">불러오는 중…</p>;
  if (tab === 'releases') return <Releases releases={data.releases ?? []} />;
  return <div className={`content${stage.stats ? '' : ' without-stats'}`} aria-busy={loading}>
    <section aria-label="이슈 목록">
      <p className="result-count" role="status">{loading ? '불러오는 중… ' : ''}전체 {data.total}개 중 {data.filtered}개</p>
      <IssueList issues={data.issues} onReset={reset} />
    </section>
    {stage.stats && <LabelStats counts={data.labelCounts ?? []} />}
  </div>;
}

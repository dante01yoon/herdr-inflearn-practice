export default function Filters({ filters, setFilters, labels }) {
  const change = (key, value) => setFilters(previous => ({ ...previous, [key]: value }));
  return <form className="filters" role="search" onSubmit={event => event.preventDefault()}>
    <label className="search"><span className="sr-only">제목 또는 번호 검색</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg>
      <input value={filters.query} onChange={event => change('query', event.target.value)} placeholder="제목 또는 번호 검색" />
    </label>
    <label><span className="sr-only">상태</span><select aria-label="상태" value={filters.state} onChange={event => change('state', event.target.value)}>
      <option value="all">모든 상태</option><option value="open">열림</option><option value="closed">닫힘</option>
    </select></label>
    <label><span className="sr-only">라벨</span><select aria-label="라벨" value={filters.label} onChange={event => change('label', event.target.value)}>
      <option value="all">모든 라벨</option><option value="__unlabelled__">라벨 없음</option>
      {labels.map(name => <option key={name} value={name}>{name}</option>)}
    </select></label>
    <button type="button" className="text-button" onClick={() => setFilters({ query: '', state: 'all', label: 'all' })}>초기화</button>
  </form>;
}

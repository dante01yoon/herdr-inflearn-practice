import { labelPercentage } from '../domain.mjs';

export default function LabelStats({ counts, total }) {
  const max = Math.max(1, ...counts.map(x => x.count));
  return <aside className="stats"><h2>라벨별 이슈</h2><p className="muted">필터와 무관한 전체 이슈 기준</p>
    {counts.slice(0, 10).map(({ name, count }) => <div className="stat" key={name}>
      <div className="stat-label"><span>{name}</span><span>{count} ({labelPercentage(count, total)}%)</span></div>
      <div className="bar" role="img" aria-label={`${name} ${count}개`}><span style={{ width: `${count / max * 100}%` }}/></div>
    </div>)}
    {!counts.length && <p>집계할 이슈가 없습니다.</p>}
  </aside>;
}

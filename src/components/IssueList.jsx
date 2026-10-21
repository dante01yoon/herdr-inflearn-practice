function Status({ state }) {
  return <span className={`status ${state}`}>
    <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/>{state === 'open' ? <circle cx="10" cy="10" r="1" /> : <path d="m6 10 3 3 5-6"/>}</svg>
    {state === 'open' ? '열림' : '닫힘'}
  </span>;
}
export default function IssueList({ issues, onReset }) {
  if (!issues.length) return <div className="empty" role="status"><strong>조건에 맞는 이슈가 없습니다.</strong><p>검색어나 필터를 바꾸거나 초기화해 보세요.</p>{onReset && <button type="button" onClick={onReset}>조건 초기화</button>}</div>;
  return <div className="table-wrap"><table>
    <thead><tr><th className="number">#</th><th>제목</th><th className="label-heading">라벨</th><th className="date-heading">작성일</th><th>상태</th></tr></thead>
    <tbody>{issues.map(issue => <tr key={issue.number}>
      <td className="number">#{issue.number}</td>
      <td className="issue-title"><a href={issue.html_url} target="_blank" rel="noreferrer">{issue.title}</a></td>
      <td className="issue-labels"><div className="chips">{issue.labels.slice(0, 3).map(label => <span className="chip" key={label.name}>{label.name}</span>)}{issue.labels.length > 3 && <span className="more-labels" title={issue.labels.slice(3).map(l => l.name).join(', ')}>+{issue.labels.length - 3}</span>}</div></td>
      <td className="date-cell">{issue.created_at?.slice(0, 10)}</td><td><Status state={issue.state}/></td>
    </tr>)}</tbody>
  </table></div>;
}

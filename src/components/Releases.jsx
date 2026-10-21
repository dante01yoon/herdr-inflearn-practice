export default function Releases({ releases }) {
  return <section className="releases" aria-label="릴리스 목록">
    {!releases.length && <p>표시할 정식 릴리스가 없습니다.</p>}
    {releases.map(release => <article key={release.tag_name}>
      <div className="release-date">{release.published_at?.slice(0, 10)}</div>
      <div><h2><a href={release.html_url} target="_blank" rel="noreferrer">{release.name || release.tag_name}</a></h2>
        <p className="release-summary">{(release.body || '변경 내용은 GitHub에서 확인하세요.').replace(/[#*_`]/g, '').slice(0, 320)}</p>
        <a href={release.html_url} target="_blank" rel="noreferrer">전체 변경 내용 보기 ↗</a></div>
    </article>)}
  </section>;
}

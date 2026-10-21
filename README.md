# issue-board — Herdr 강의 실습 프로젝트

Herdr 저장소(github.com/herdrdev/herdr)의 실제 공개 이슈 26개 스냅숏(`data/snapshot.json`)을 보여 주는 대시보드입니다.
이 강의에서는 Claude Code와 Codex가 이 프로젝트를 나눠 만들고, 서로 리뷰합니다.

## 시작

```bash
npm ci
npm test          # 기존 서버 테스트 (처음부터 통과)
npm run accept    # API 계약 테스트 (처음에는 실패, 강의에서 구현)
npm run dev       # http://localhost:5173
```

- `src/` 화면(React) · `server/` API · `contract/API.md` 만들 기능의 약속 · `acceptance/` 약속 검사

# 섹션 8 · Herdr 앱

인프런 「에이전트 워크플로우 최강 도구, Herdr 완벽 가이드」 섹션 8 수업 자료입니다.

| 수업 | 내용 |
|---|---|
| Herdr 앱이 나왔다 | TUI와 앱, herdr-core(hc) 두 층 구조 |
| 설치하고 첫 화면 | 설치 한 줄, 환영 안내, 사이드바, 상태 네 가지 |
| 앱을 꺼도 일은 계속된다 | `hc ls` · `hc attach` · `hc wait` |
| 말로 내 앱 바꾸기 | AGENTS.md, 글꼴, 탭 타이머 모드, 보드 레이아웃 |
| 남이 만든 레이아웃·모드 | herdr.dev/layouts · /mods, pasture, tmux-prefix |
| 에이전트가 에이전트를 부린다 | `hc run --bg` 도우미, `hc send`로 결과 회신 |
| 휴대폰에서 채팅처럼 답하기 · Ovis | Bun, `OVIS_RUNTIME=herdr-core`, 답 카드 |
| 다른 컴퓨터도 한 화면에 | Add machine, `hc machine add` |

- 프롬프트 원문: [PROMPTS.md](PROMPTS.md)
- 말로 만든 레이아웃·모드 예시: [herdr-app-examples/](herdr-app-examples/) — `~/.config/herdr-app/` 아래 같은 자리에 넣으면 됩니다.
- Windows: 설치 파일을 받아 실행합니다(herdr.dev/download). 설치 스크립트는 macOS·Linux용입니다.

# 섹션 8 「Herdr 앱」 프롬프트 원문

수업에서 에이전트에게 그대로 붙여 넣은 문장입니다. 촬영: Mac(Apple Silicon), Herdr 앱 0.1.10 · herdr-core(hc) 0.1.15.

## 설치하고 첫 화면
```sh
curl -fsSL https://releases.herdr.dev/app/install.sh | sh
herdr-app
```
```
README.md를 읽고 이 프로젝트가 무엇인지 세 줄로 알려 줘.
```

## 앱을 꺼도 일은 계속된다
```
tests 폴더의 테스트 파일을 하나씩 모두 읽고, 파일마다 무엇을 검사하는지 표로 정리해 줘. 그다음 npm test를 두 번 돌려서 결과가 같은지도 확인해 줘.
```
```sh
hc ls            # core에서 도는 터미널 목록
hc attach t5     # 그 터미널에 붙기 (빠져나오기: ctrl+\)
hc wait t5       # 일이 끝날 때까지 기다리기
```

## 말로 내 앱 바꾸기
```
~/.config/herdr-app/AGENTS.md를 읽고, 이 앱에서 무엇을 바꿀 수 있는지 다섯 줄로 알려 줘.
```
```
한글 글자 사이가 벌어져 보여. 터미널 글꼴을 D2Coding으로 바꿔 줘.
```
```
탭마다 에이전트가 일한 시간을 타이머로 보여 줘.
```
```
needs you, working, done 세 칸에 에이전트를 카드로 보여 주는 보드 레이아웃을 새로 만들고 그 레이아웃으로 바꿔 줘.
```
결과 예시: `herdr-app-examples/` (layouts/board.json, layouts/main-timer.json, mods/agent-board, mods/tabs-timer). 레이아웃 전환은 `ctrl-shift-l`.

## 남이 만든 레이아웃·모드 가져오기
```
Read ~/.config/herdr-app/AGENTS.md, then add this layout: herdr.dev/layouts/herdrdev/pasture
```
```
Read ~/.config/herdr-app/AGENTS.md, then add this mod: herdr.dev/mods/herdrdev/tmux-prefix
```
모드는 명령·네트워크를 쓸 수 있는 JavaScript입니다. 남이 만든 것은 에이전트가 먼저 읽고 확인하게 하세요.

## 에이전트가 에이전트를 부린다
```
hc --skill을 읽고, Codex 리뷰어를 하나 띄워서 server 폴더를 읽기만 하며 검토하게 해 줘. 리뷰어가 끝나면 결과를 세 줄로 알려 줘.
```
Codex 안에서 `hc send`로 결과를 돌려보내려면 Codex 샌드박스가 herdr-core 소켓 폴더에 쓸 수 있어야 합니다(`[sandbox_workspace_write] writable_roots`).

## 휴대폰에서 채팅처럼 답하기 · Ovis
```sh
curl -fsSL https://bun.sh/install | bash        # Bun 1.4 이상
git clone https://github.com/devswha/ovis.git
cd ovis && bun install
OVIS_RUNTIME=herdr-core OVIS_TELEMETRY=0 bun run start   # → http://127.0.0.1:7317
```
- `OVIS_RUNTIME=herdr-core`: Herdr 앱(herdr-core)에 붙기. 빼면 Herdr TUI 서버를 찾습니다.
- `OVIS_TELEMETRY=0`: 익명 사용 통계 끄기.
- 포트 7317은 내 컴퓨터(127.0.0.1)에서만 열고, 인터넷에 직접 열지 마세요.
- 휴대폰: 두 기기 모두 Tailscale → `tailscale serve --bg --https=443 http://127.0.0.1:7317` → Ovis 설정 Phone & devices의 QR. 알림은 HTTPS에서만. (강의에서는 촬영하지 않음)
```
방금 넣은 줄 아래에 'Ovis로 휴대폰에서도 답할 수 있습니다.' 한 줄을 더 추가해 줘.
```

## 다른 컴퓨터도 한 화면에
앱: 사이드바 아래 **Add machine** → `user@host`(SSH로 닿는 주소). 터미널에서는:
```sh
hc machine add <ssh 호스트> --name macbook-air --install
hc ls     # macbook-air/t1 처럼 다른 컴퓨터의 터미널도 한 목록에
```

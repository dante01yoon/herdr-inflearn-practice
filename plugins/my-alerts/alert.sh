#!/usr/bin/env bash
# 에이전트 상태가 바뀔 때마다 Herdr가 이 스크립트를 실행한다
status=$(jq -r '.data.agent_status // empty' <<< "$HERDR_PLUGIN_EVENT_JSON")
name=$(jq -r '.data.name // .data.agent // "에이전트"' <<< "$HERDR_PLUGIN_EVENT_JSON")

case "$status" in
  blocked) "$HERDR_BIN_PATH" notification show "$name 허락 대기" --body "패널에서 확인해 주세요" --sound request ;;
  done)    "$HERDR_BIN_PATH" notification show "$name 끝" --sound done ;;
esac

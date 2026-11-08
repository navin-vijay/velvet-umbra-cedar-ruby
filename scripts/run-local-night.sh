#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/.grok"
LOG_FILE="$LOG_DIR/scentindex-night.log"
PID_FILE="$LOG_DIR/scentindex-night.pid"

mkdir -p "$LOG_DIR"
cd "$ROOT_DIR"

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Scent Index keeper is already running (pid $(cat "$PID_FILE"))."
  exit 0
fi

cleanup() {
  if [[ -f "$PID_FILE" ]]; then
    pid="$(cat "$PID_FILE")"
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
  fi
}

trap cleanup EXIT

nohup npm run dev >"$LOG_FILE" 2>&1 &
APP_PID=$!
printf '%s\n' "$APP_PID" > "$PID_FILE"

for _ in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:8080 >/dev/null 2>&1; then
    echo "Scent Index is running on http://127.0.0.1:8080"
    echo "Logs: $LOG_FILE"
    echo "PID: $APP_PID"
    exit 0
  fi
  sleep 2
done

echo "Scent Index did not start successfully within 60s. Check logs: $LOG_FILE"
exit 1

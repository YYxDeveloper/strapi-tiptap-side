#!/usr/bin/env bash
# Strapi backend 一鍵啟動腳本
# 用法：./start.sh [develop|start|build]
# 預設：develop（watch mode）

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

MODE="${1:-develop}"
PORT="${PORT:-1337}"
HOST="${HOST:-0.0.0.0}"

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[start.sh]${NC} $*"; }
warn() { echo -e "${YELLOW}[start.sh]${NC} $*"; }
err() { echo -e "${RED}[start.sh]${NC} $*" >&2; }

# 1. 檢查 .env
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    warn ".env 不存在，從 .env.example 複製"
    cp .env.example .env
    warn "已自動產生 .env，請檢查後重啟（如需自訂 APP_KEYS / DB 等）"
  else
    err ".env 與 .env.example 都不存在，無法啟動"
    exit 1
  fi
fi

# 2. 檢查 node_modules
if [ ! -d "node_modules" ]; then
  log "安裝依賴（首次啟動）..."
  npm install
fi

# 3. 確保 SQLite 資料庫目錄存在
mkdir -p .tmp
DATABASE_FILENAME="${DATABASE_FILENAME:-.tmp/data.db}"
DATABASE_DIR="$(dirname "$DATABASE_FILENAME")"
if [ "$DATABASE_DIR" != "." ] && [ ! -d "$DATABASE_DIR" ]; then
  log "建立資料庫目錄 $DATABASE_DIR"
  mkdir -p "$DATABASE_DIR"
fi

# 4. 確保 DATABASE_FILENAME 寫入 .env（首次啟動）
if ! grep -q "^DATABASE_FILENAME=" .env; then
  echo "" >> .env
  echo "# SQLite database file (relative to backend/)" >> .env
  echo "DATABASE_FILENAME=$DATABASE_FILENAME" >> .env
fi

# 5. 顯示啟動資訊
log "啟動模式：$MODE"
log "位址：    http://$HOST:$PORT"
log "Admin：   http://$HOST:$PORT/admin"
echo ""

# 6. 啟動
case "$MODE" in
  develop|dev)
    HOST="$HOST" PORT="$PORT" npm run develop
    ;;
  start|production)
    HOST="$HOST" PORT="$PORT" npm run start
    ;;
  build)
    npm run build
    ;;
  *)
    err "未知的模式：$MODE（支援：develop / start / build）"
    exit 1
    ;;
esac

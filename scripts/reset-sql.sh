#!/usr/bin/env bash
# =============================================================================
# reset-sql.sh — Wipes all data except the admin user, via direct SQL (psql)
#
# Usage:
#   ./scripts/reset-sql.sh [DB_HOST] [DB_PORT] [DB_NAME] [DB_USER] [DB_PASS] [ADMIN_USER]
#
# Defaults:
#   DB_HOST    = localhost
#   DB_PORT    = 5432
#   DB_NAME    = immocare
#   DB_USER    = immocare
#   DB_PASS    = immocare
#   ADMIN_USER = admin
# =============================================================================

set -euo pipefail

DB_HOST="${1:-localhost}"
DB_PORT="${2:-5432}"
DB_NAME="${3:-immocare}"
DB_USER="${4:-immocare}"
DB_PASS="${5:-immocare}"
ADMIN_USER="${6:-admin}"

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
log_ok()      { echo -e "  ${GREEN}✔${NC}  $*"; }
log_error()   { echo -e "  ${RED}✘${NC}  $*"; }
log_section() { echo -e "\n${CYAN}▶ $*${NC}"; }

if ! command -v psql &> /dev/null; then
  log_error "psql is required. Install: apt install postgresql-client (Linux) or brew install libpq (macOS)"
  exit 1
fi

echo -e "${RED}"
echo "  ██████╗ ███████╗███████╗███████╗████████╗"
echo "  ██╔══██╗██╔════╝██╔════╝██╔════╝╚══██╔══╝"
echo "  ██████╔╝█████╗  ███████╗█████╗     ██║   "
echo "  ██╔══██╗██╔══╝  ╚════██║██╔══╝     ██║   "
echo "  ██║  ██║███████╗███████║███████╗   ██║   "
echo "  ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝   ╚═╝   "
echo -e "${NC}"
echo "  This will DELETE ALL DATA on:"
echo "    Host     : $DB_HOST:$DB_PORT"
echo "    Database : $DB_NAME"
echo ""
echo "  User '$ADMIN_USER' will be kept."
echo ""
read -r -p "  Type 'yes' to confirm: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "  Aborted."
  exit 0
fi

log_section "Running reset"

export PGPASSWORD="$DB_PASS"

psql \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --set ON_ERROR_STOP=0 \
  <<SQL

-- ============================================================
-- Reset DB — truncate order respects FK constraints
-- Leaf tables first, root tables last.
-- Uses exception handling for non-existent tables.
-- ============================================================
 


-- ─── Catalog entries (keep Functions) ───────────────────────────────────────────────
DO \$\$ BEGIN TRUNCATE TABLE catalog_entry CASCADE; EXCEPTION WHEN UNDEFINED_TABLE THEN NULL; END \$\$;

-- ─── Catalog types (keep Functions) ───────────────────────────────────────────────
DELETE FROM catalog_type WHERE code != 'FUNCTION';

-- ─── Users (keep admin) ───────────────────────────────────────────────
DELETE FROM app_user WHERE username != '$ADMIN_USER';

SQL

unset PGPASSWORD

log_ok "Reset complete — '$ADMIN_USER' kept."
echo ""
echo "  Next step: make seed-demo"
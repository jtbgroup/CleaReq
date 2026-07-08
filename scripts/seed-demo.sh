#!/usr/bin/env bash
# =============================================================================
# seed-demo.sh — Injects demo data via the REST API
#
# Usage:
#   ./scripts/seed-demo.sh [BASE_URL] [ADMIN_USER] [ADMIN_PASS]
#
# Defaults (dev):
#   BASE_URL   = http://localhost:8081
#   ADMIN_USER = admin
#   ADMIN_PASS = admin123
#
# Prerequisites:
#   - jq must be installed  (brew install jq / apt install jq)
#   - The application must be running and reachable at BASE_URL
#
# All data goes through the REST API so model validation rules are enforced.
# This file (and scripts/demo-data/*.json) is the single source of truth
# and is intended to also serve as Cypress fixtures in the future.
# =============================================================================

set -euo pipefail

BASE_URL="${1:-http://localhost:8081}"
ADMIN_USER="${2:-admin}"
ADMIN_PASS="${3:-admin123}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/demo-data"

# 4th argument: custom users JSON file (absolute or relative to CWD)
# Defaults to scripts/demo-data/users.json
USERS_FILE="${4:-$DATA_DIR/users.json}"
CATALOGS_FILE="${5:-$DATA_DIR/catalogs.json}"
PERSONS_FILE="${6:-$DATA_DIR/persons.json}"

COOKIE_JAR=$(mktemp)
trap 'rm -f "$COOKIE_JAR"' EXIT

# ─── Colors ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()    { echo -e "  ${CYAN}ℹ${NC}  $*"; }
log_ok()      { echo -e "  ${GREEN}✔${NC}  $*"; }
log_warn()    { echo -e "  ${YELLOW}⚠${NC}  $*"; }
log_error()   { echo -e "  ${RED}✘${NC}  $*"; }
log_section() { echo -e "\n${CYAN}▶ $*${NC}"; }

# ─── Dependency check ────────────────────────────────────────────────────────
if ! command -v jq &> /dev/null; then
  log_error "jq is required but not installed."
  echo "       Install it with: brew install jq  (macOS) or  apt install jq  (Linux)"
  exit 1
fi

# ─── Admin login ─────────────────────────────────────────────────────────────
log_section "Authenticating as '$ADMIN_USER' on $BASE_URL"

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}" \
  -c "$COOKIE_JAR")

if [ "$HTTP_STATUS" != "200" ]; then
  log_error "Login failed (HTTP $HTTP_STATUS). Is the app running at $BASE_URL?"
  exit 1
fi

log_ok "Authenticated successfully"

# ─── Seed users ──────────────────────────────────────────────────────────────
log_section "Seeding users from $USERS_FILE"

if [ ! -f "$USERS_FILE" ]; then
  log_warn "No users.json found at $USERS_FILE — skipping"
else
  TOTAL=$(jq length "$USERS_FILE")
  CREATED=0
  SKIPPED=0

  for i in $(seq 0 $(( TOTAL - 1 ))); do
    USER=$(jq -c ".[$i]" "$USERS_FILE")
    USERNAME=$(echo "$USER" | jq -r '.username')

    HTTP_STATUS=$(curl -s -o /tmp/seed_response.json -w "%{http_code}" \
      -X POST "$BASE_URL/api/users" \
      -H "Content-Type: application/json" \
      -b "$COOKIE_JAR" \
      -d "$USER")

    case "$HTTP_STATUS" in
      200|201)
        log_ok "Created user: $USERNAME"
        CREATED=$(( CREATED + 1 ))
        ;;
      409)
        log_warn "Skipped user: $USERNAME (already exists)"
        SKIPPED=$(( SKIPPED + 1 ))
        ;;
      *)
        REASON=$(jq -r '.message // "unknown error"' /tmp/seed_response.json 2>/dev/null || echo "unknown error")
        log_error "Failed to create user: $USERNAME (HTTP $HTTP_STATUS — $REASON)"
        ;;
    esac
  done

  echo ""
  log_info "Users: $CREATED created, $SKIPPED skipped (total: $TOTAL)"
fi



# ─── Seed catalogs ─────────────────────────────────────────────────────────────
log_section "Seeding catalogs from $CATALOGS_FILE"

if [ ! -f "$CATALOGS_FILE" ]; then
  log_warn "No catalogs.json found at $CATALOGS_FILE — skipping"
else
  TOTAL=$(jq length "$CATALOGS_FILE")
  CREATED=0
  SKIPPED=0

  for i in $(seq 0 $(( TOTAL - 1 ))); do
    CATALOG_ENTRY=$(jq -c ".[$i]" "$CATALOGS_FILE")
    LABEL=$(echo "$CATALOG_ENTRY" | jq -r '.label')
    CATALOG_TYPE=$(echo "$CATALOG_ENTRY" | jq -r '.catalogType')

    HTTP_STATUS=$(curl -s -o /tmp/seed_response.json -w "%{http_code}" \
      -X POST "$BASE_URL/api/catalogs/$CATALOG_TYPE/entries" \
      -H "Content-Type: application/json" \
      -b "$COOKIE_JAR" \
      -d "$CATALOG_ENTRY")

    case "$HTTP_STATUS" in
      200|201)
        log_ok "Created catalog entry: $LABEL"
        CREATED=$(( CREATED + 1 ))
        ;;
      409)
        log_warn "Skipped catalog entry: $LABEL (already exists)"
        SKIPPED=$(( SKIPPED + 1 ))
        ;;
      *)
        REASON=$(jq -r '.message // "unknown error"' /tmp/seed_response.json 2>/dev/null || echo "unknown error")
        log_error "Failed to create catalog entry: $LABEL (HTTP $HTTP_STATUS — $REASON)"
        ;;
    esac
  done

  echo ""
  log_info "Catalog entries: $CREATED created, $SKIPPED skipped (total: $TOTAL)"
fi


# ─── Seed persons ─────────────────────────────────────────────────────────────
log_section "Seeding persons from $PERSONS_FILE"

if [ ! -f "$PERSONS_FILE" ]; then
  log_warn "No persons.json found at $PERSONS_FILE — skipping"
else
  TOTAL=$(jq length "$PERSONS_FILE")
  CREATED=0
  SKIPPED=0


    FUNCTION_ENTRIES=$(curl -s \
      -X GET "$BASE_URL/api/catalogs/FUNCTION/entries" \
      -H "Content-Type: application/json" \
      -b "$COOKIE_JAR")

  for i in $(seq 0 $(( TOTAL - 1 ))); do
    PERSON_ENTRY=$(jq -c ".[$i]" "$PERSONS_FILE")
    LAST_NAME=$(echo "$PERSON_ENTRY" | jq -r '.lastName')
    FIRST_NAME=$(echo "$PERSON_ENTRY" | jq -r '.firstName')
    EMAIL=$(echo "$PERSON_ENTRY" | jq -r '.email')
    FUNCTION=$(echo "$PERSON_ENTRY" | jq -r '.function')
    FUNCTION_ID=$(echo "$FUNCTION_ENTRIES" | jq -r ".[] | select(.label == \"$FUNCTION\") | .id")
    UPDATED_PERSON=$(echo "$PERSON_ENTRY" | jq --arg uuid "$FUNCTION_ID" '.functionId = $uuid | del(.function)')

    HTTP_STATUS=$(curl -s -o /tmp/seed_response.json -w "%{http_code}" \
      -X POST "$BASE_URL/api/persons" \
      -H "Content-Type: application/json" \
      -b "$COOKIE_JAR" \
      -d "$UPDATED_PERSON")

    case "$HTTP_STATUS" in
      200|201)
        log_ok "Created person: $LAST_NAME $FIRST_NAME"
        CREATED=$(( CREATED + 1 ))
        ;;
      409)
        log_warn "Skipped person: $LAST_NAME $FIRST_NAME (already exists)"
        SKIPPED=$(( SKIPPED + 1 ))
        ;;
      *)
        REASON=$(jq -r '.message // "unknown error"' /tmp/seed_response.json 2>/dev/null || echo "unknown error")
        log_error "Failed to create person: $LAST_NAME $FIRST_NAME (HTTP $HTTP_STATUS — $REASON)"
        ;;
    esac
  done

  echo ""
  log_info "Catalog entries: $CREATED created, $SKIPPED skipped (total: $TOTAL)"
fi

# ─── Logout ──────────────────────────────────────────────────────────────────
curl -s -o /dev/null \
  -X POST "$BASE_URL/api/auth/logout" \
  -b "$COOKIE_JAR"

echo ""
log_ok "Done. Demo data injected via API."
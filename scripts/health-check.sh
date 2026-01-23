#!/usr/bin/env bash
set -euo pipefail

CONTACT_URL="https://zcrpvb8zn1.execute-api.us-west-2.amazonaws.com/prod/contact"
ORIGIN="https://delete-from.com"
NAME="Health Check"
EMAIL="healthcheck+deletefrom@example.com"
MESSAGE="Mensaje de prueba desde health-check.sh"
TOPIC="general"
LANG="es"

usage() {
  cat <<USAGE
Usage: scripts/health-check.sh [options]

Options:
  --contact-url URL   Override contact endpoint
  --origin URL        Origin for CORS preflight (default: https://delete-from.com)
  --email EMAIL       Email used in test payload
  --name NAME         Name used in test payload
  --message MSG       Message used in test payload
  --topic TOPIC       Topic for payload (general|chatbots|apps|ia)
  --lang LANG         Language (default: es)
  --no-post           Only run OPTIONS preflight
  -h, --help          Show help
USAGE
}

RUN_POST=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --contact-url)
      CONTACT_URL="$2"; shift 2;;
    --origin)
      ORIGIN="$2"; shift 2;;
    --email)
      EMAIL="$2"; shift 2;;
    --name)
      NAME="$2"; shift 2;;
    --message)
      MESSAGE="$2"; shift 2;;
    --topic)
      TOPIC="$2"; shift 2;;
    --lang)
      LANG="$2"; shift 2;;
    --no-post)
      RUN_POST=0; shift 1;;
    -h|--help)
      usage; exit 0;;
    *)
      echo "Unknown option: $1"; usage; exit 1;;
  esac
  done

TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
MESSAGE="$MESSAGE ($TIMESTAMP)"

echo "==> CORS preflight: $CONTACT_URL"
curl -i -s -X OPTIONS "$CONTACT_URL" \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  | sed -n '1,12p'

if [[ $RUN_POST -eq 1 ]]; then
  echo "==> POST lead payload"
  curl -i -s -X POST "$CONTACT_URL" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"message\":\"$MESSAGE\",\"lang\":\"$LANG\",\"topic\":\"$TOPIC\",\"company\":\"\"}" \
    | sed -n '1,12p'
fi

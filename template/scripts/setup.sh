#!/usr/bin/env bash
set -euo pipefail
APP_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
command -v uv >/dev/null || { echo "Instale uv para preparar o backend." >&2; exit 1; }
command -v npm >/dev/null || { echo "Instale Node/npm para preparar o frontend." >&2; exit 1; }
UV_PROJECT_ENVIRONMENT="$APP_ROOT/.venv" uv sync --project "$APP_ROOT/api" --frozen
(cd "$APP_ROOT/web" && npm ci --no-audit --no-fund)
DJANGO_ENV=development "$APP_ROOT/.venv/bin/python" "$APP_ROOT/api/manage.py" migrate
echo "Dependências e banco local prontos. Configure os ambientes conforme README."

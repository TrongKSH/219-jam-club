#!/usr/bin/env bash
set -e
# Build 219 Jam Club for Azure: Angular SPA into backend wwwroot, then dotnet publish.
# Run from repo root.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "Building frontend..."
cd frontend
npm ci
npx ng build --configuration=production
cd "$REPO_ROOT"

WWWROOT="$REPO_ROOT/backend/VenueApi/wwwroot"
mkdir -p "$WWWROOT"
echo "Copying SPA to backend wwwroot..."
cp -r frontend/dist/frontend/browser/* "$WWWROOT/"

echo "Publishing backend..."
cd backend/VenueApi
dotnet publish -c Release -o out
echo "Done. Output: backend/VenueApi/out"

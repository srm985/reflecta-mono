#!/usr/bin/env bash
set -euo pipefail

cd /workspaces/reflecta-mono

echo "Installing global JS tooling..."
npm install -g eas-cli

echo "Installing Codex CLI..."
npm install -g @openai/codex

echo "Installing project dependencies..."
if [ -f package-lock.json ]; then
  echo "Lock file exists - running npm ci..."
  npm ci
else
  echo "Lock file missing - running npm install..."
  npm install
fi

echo "Fixing executable bits..."
if [ -d .husky ]; then
  find .husky -maxdepth 1 -type f -exec chmod ug+x {} +
fi

if [ -d .git/hooks ]; then
  find .git/hooks -maxdepth 1 -type f -exec chmod ug+x {} +
fi

if [ -d ./scripts ]; then
  find ./scripts -type f \( -name "*.py" -o -name "*.sh" -o -name "*.bash" \) -exec chmod +x {} +
fi

echo "Post-create setup complete."

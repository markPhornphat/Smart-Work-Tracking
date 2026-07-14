# Start Postgres + backend + frontend from repo root.
# Usage: .\scripts\dev.ps1   |   pnpm dev

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $Root
node "$Root\scripts\dev.mjs"

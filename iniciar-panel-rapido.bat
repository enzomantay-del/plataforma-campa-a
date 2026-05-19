@echo off
title Plataforma campana - inicio rapido
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Instala Node.js desde https://nodejs.org
  pause
  exit /b 1
)

echo Iniciando sin comprobar migraciones...
echo Panel: http://localhost:3000
echo.

start "" "http://localhost:3000"
call npm run dev

pause

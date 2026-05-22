@echo off
title Sembrar barrios via Netlify
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sembrar-por-netlify.ps1"

echo.
pause

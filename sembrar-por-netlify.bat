@echo off
title Sembrar barrios via Netlify
cd /d "%~dp0"

set SITIO=https://sistema-municipal-directoalvecino.netlify.app
set SECRETO=campana-seed-2026-interno

echo.
echo Llamando a %SITIO%/api/admin/seed ...
echo.

powershell -NoProfile -Command ^
  "$ErrorActionPreference='Stop'; try { $r = Invoke-WebRequest -Uri '%SITIO%/api/admin/seed' -Method POST -Headers @{ 'x-seed-secret' = '%SECRETO%' } -UseBasicParsing; Write-Host ''; Write-Host 'RESPUESTA:' -ForegroundColor Green; Write-Host $r.Content; exit 0 } catch { Write-Host ''; Write-Host 'ERROR:' -ForegroundColor Red; if ($_.Exception.Response) { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Host $reader.ReadToEnd() } else { Write-Host $_.Exception.Message }; exit 1 }"

echo.
if errorlevel 1 (
  echo.
  echo Revisa en Netlify:
  echo   - SEED_SECRET = campana-seed-2026-interno
  echo   - DATABASE_URL y DIRECT_URL con neon.tech
  echo   - Ultimo deploy en VERDE
) else (
  echo.
  echo LISTO. Entra al panel y carga Referentes.
)
echo.
pause

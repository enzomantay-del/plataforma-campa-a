@echo off
title Sembrar barrios via Netlify
cd /d "%~dp0"

set SITIO=https://sistema-municipal-directoalvecino.netlify.app

echo.
echo Leyendo SEED_SECRET del archivo .env ...
echo.

for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
  if /i "%%a"=="SEED_SECRET" set SECRETO=%%b
)

set SECRETO=%SECRETO:"=%

if "%SECRETO%"=="" (
  echo ERROR: no hay SEED_SECRET en .env
  echo Agrega: SEED_SECRET=tu-frase-secreta
  pause
  exit /b 1
)

echo Llamando a %SITIO%/api/admin/seed ...
echo.

powershell -NoProfile -Command ^
  "$ErrorActionPreference='Stop'; try { $r = Invoke-WebRequest -Uri '%SITIO%/api/admin/seed' -Method POST -Headers @{ 'x-seed-secret' = '%SECRETO%' } -UseBasicParsing; Write-Host ''; Write-Host 'RESPUESTA:' -ForegroundColor Green; Write-Host $r.Content; exit 0 } catch { Write-Host ''; Write-Host 'ERROR:' -ForegroundColor Red; if ($_.Exception.Response) { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Host $reader.ReadToEnd() } else { Write-Host $_.Exception.Message }; exit 1 }"

echo.
if errorlevel 1 (
  echo Revisa SEED_SECRET en Netlify ^(.env local debe coincidir^)
) else (
  echo LISTO. Entra al panel y carga Referentes.
)
echo.
pause

@echo off
title Cargar barrios en Neon (desde tu PC)
cd /d "%~dp0"

echo.
echo Si falla con P1001, NO es un error tuyo: muchas redes bloquean
echo el puerto 5432. En ese caso usa configurar-netlify-neon.bat
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Instala Node.js desde https://nodejs.org
  pause
  exit /b 1
)

echo Abri console.neon.tech y entra al proyecto antes de continuar.
pause

echo Creando tablas...
call npx prisma migrate deploy
if errorlevel 1 (
  echo.
  echo No se pudo conectar desde esta PC.
  echo Ejecuta: configurar-netlify-neon.bat
  pause
  exit /b 1
)

call npm run db:seed
echo.
echo Listo.
pause

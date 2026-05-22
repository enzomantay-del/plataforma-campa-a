@echo off
title Plataforma campana - MVP
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instalalo desde https://nodejs.org
  pause
  exit /b 1
)

if not exist ".env" (
  if exist ".env.example" copy /Y ".env.example" ".env" >nul
)

if not exist "node_modules\next\" (
  echo Instalando dependencias, puede tardar varios minutos...
  call npm install
  if errorlevel 1 (
    echo Error al instalar dependencias.
    pause
    exit /b 1
  )
)

echo Comprobando base de datos (si falla, el panel igual puede abrir)...
call npx prisma migrate deploy >nul 2>&1
if errorlevel 1 (
  echo AVISO: no se pudo conectar a Neon desde esta PC. Usa el sitio en Netlify.
) else (
  echo Base de datos OK.
)

echo.
echo ========================================
echo  LOCAL (esta PC):  http://localhost:3000
echo  PUBLICO (Netlify): https://sistema-municipal-directoalvecino.netlify.app
echo ========================================
echo.
echo Para referentes y celulares usa la URL de Netlify.
echo DEJA ESTA VENTANA ABIERTA. Espera a ver "Ready" y abri localhost.
echo.

start /b cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:3000"
call npm run dev

echo.
echo El servidor se detuvo.
pause

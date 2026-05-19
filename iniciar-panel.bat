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

if not exist "node_modules\" (
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
  echo AVISO: no se pudo conectar a Supabase ahora. Revisa .env o tu internet.
) else (
  echo Base de datos OK.
)

echo.
echo ========================================
echo  Panel: http://localhost:3000
echo  Carga referentes (solo esta PC): http://localhost:3000/cargar
echo ========================================
echo.
echo Para compartir con celulares de otra red:
echo   desplegar-para-compartir.bat  (Netlify, recomendado)
echo   link-publico-ngrok.bat        (prueba rapida)
echo.
echo DEJA ESTA VENTANA ABIERTA. Para cerrar el servidor: Ctrl+C
echo.

start "" "http://localhost:3000"
call npm run dev

echo.
echo El servidor se detuvo.
pause

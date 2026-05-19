@echo off
title Link publico temporal (ngrok)
cd /d "%~dp0"

echo.
echo ============================================================
echo   LINK PUBLICO TEMPORAL (prueba rapida)
echo ============================================================
echo.
echo 1. Primero ejecuta iniciar-panel.bat y dejalo abierto.
echo 2. Este script abre ngrok para exponer el puerto 3000.
echo 3. Copia la URL https://xxxx.ngrok-free.app que aparece.
echo 4. Pegala en .env en la linea:
echo      NEXT_PUBLIC_APP_URL=https://xxxx.ngrok-free.app
echo 5. Cierra y vuelve a abrir iniciar-panel.bat
echo 6. En el panel: Carga publica - el enlace ya sera publico.
echo.
echo Descarga ngrok: https://ngrok.com/download
echo.

where ngrok >nul 2>nul
if errorlevel 1 (
  echo No se encontro ngrok en el PATH.
  echo Instalalo y volve a ejecutar este archivo.
  pause
  exit /b 1
)

echo Abriendo tunel en http://localhost:3000 ...
echo Copia la URL https y actualiza NEXT_PUBLIC_APP_URL en .env
echo.
ngrok http 3000

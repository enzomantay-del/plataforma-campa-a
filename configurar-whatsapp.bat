@echo off
chcp 65001 >nul
title Configurar WhatsApp - Plataforma campaña
cd /d "%~dp0"

if not exist ".env" (
  if exist ".env.example" (
    copy /Y ".env.example" ".env" >nul
    echo Se creó el archivo .env desde el ejemplo.
  ) else (
    echo No se encontró .env.example
    pause
    exit /b 1
  )
)

echo.
echo Se abrirá el Bloc de notas con tu configuración.
echo.
echo IMPORTANTE:
echo  - Cada línea es UNA variable. El token va en UNA sola línea.
echo  - Después de guardar, cerrá el Bloc y ejecutá iniciar-panel.bat
echo.
pause
notepad ".env"

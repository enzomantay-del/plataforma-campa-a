@echo off
title Publicar campana en Netlify (link para referentes)
cd /d "%~dp0"

echo.
echo ============================================================
echo   PUBLICAR PARA QUE EL LINK ABRA EN CUALQUIER CELULAR
echo ============================================================
echo.
echo Necesitas:
echo   1. Cuenta gratis en https://www.netlify.com
echo   2. Base Supabase con DATABASE_URL y DIRECT_URL en Netlify
echo   3. Codigo en GitHub O usar Netlify CLI desde esta carpeta
echo.
echo Guia detallada: DESPLIEGUE-NETLIFY.md
echo.
pause

where node >nul 2>nul
if errorlevel 1 (
  echo Instala Node.js desde https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Instalando dependencias...
  call npm install
)

echo.
echo Paso 1: Iniciar sesion en Netlify (se abre el navegador)
call npx --yes netlify-cli login
if errorlevel 1 (
  echo No se pudo iniciar sesion.
  pause
  exit /b 1
)

echo.
echo Paso 2: Vincular este proyecto (elegi "Create configure a new site")
call npx --yes netlify-cli init
if errorlevel 1 (
  echo Error al vincular. Podes seguir la guia DESPLIEGUE-NETLIFY.md manualmente.
  pause
  exit /b 1
)

echo.
echo IMPORTANTE: En Netlify - Site configuration - Environment variables
echo   Carga las mismas variables que tu archivo .env (DATABASE_URL, etc.)
echo   Y NEXT_PUBLIC_APP_URL = https://TU-SITIO.netlify.app
echo.
pause

echo.
echo Paso 3: Desplegar en produccion (puede tardar varios minutos)...
call npx --yes netlify-cli deploy --build --prod
if errorlevel 1 (
  echo El deploy fallo. Revisa variables de entorno en Netlify.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo   LISTO. Entra al panel en tu sitio .netlify.app
echo   Menu: Carga publica - Copiar enlace - Enviar por WhatsApp
echo ============================================================
echo.
pause

@echo off
title Configurar Netlify con Neon
cd /d "%~dp0"

echo.
echo ============================================================
echo   PASOS: Netlify + Neon (tu PC no necesita conectar a Neon)
echo ============================================================
echo.
echo Si actualizar-base-neon.bat da P1001, es tu red/ISP bloqueando
echo el puerto 5432. Netlify SI puede conectar desde la nube.
echo.
echo --- PASO 1: Variables en Netlify ---
echo Entra a app.netlify.com - sitio sistema-municipal-directoalvecino
echo Environment variables - edita o agrega:
echo.
echo   DATABASE_URL  = (copiar del .env, linea DATABASE_URL)
echo   DIRECT_URL    = (copiar del .env, linea DIRECT_URL)
echo   NEXT_PUBLIC_APP_URL = https://sistema-municipal-directoalvecino.netlify.app
echo   SEED_SECRET   = (la misma frase que en tu .env)
echo.
echo --- PASO 2: Deploy ---
echo Deploys - Trigger deploy - Deploy site
echo Espera hasta Published (verde). Si falla, copia el error.
echo.
echo --- PASO 3: Barrios ---
echo Doble clic en sembrar-por-netlify.bat
echo.
echo --- PASO 4: Panel ---
echo https://sistema-municipal-directoalvecino.netlify.app/panel
echo Referentes - Carga publica - copiar enlace
echo.
pause
start https://app.netlify.com

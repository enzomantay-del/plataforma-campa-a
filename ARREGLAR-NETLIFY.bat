@echo off
title ARREGLAR NETLIFY - 3 pasos
cd /d "%~dp0"

echo.
echo ============================================================
echo   EL ERROR: Netlify sigue usando SUPABASE (URL vieja)
echo   Hay que cambiar DATABASE_URL y DIRECT_URL a NEON
echo ============================================================
echo.
echo PASO 1 - Variables en Netlify
echo   app.netlify.com - sistema-municipal-directoalvecino
echo   Environment variables:
echo.
echo   DATABASE_URL  - EDITAR el Value
echo     DEBE contener: neon.tech
echo     NO debe contener: supabase
echo     (copiar del .env de esta carpeta)
echo.
echo   DIRECT_URL - lo mismo (neon.tech, sin supabase)
echo.
echo   Si no podes editar bien: BORRAR la variable y crearla de nuevo.
echo.
echo PASO 2 - Deploy
echo   Deploys - Trigger deploy - Deploy Project
echo   Esperar VERDE (Published)
echo.
echo PASO 3 - Barrios
echo   Doble clic en sembrar-por-netlify.bat
echo.
echo ============================================================
echo.
pause
start https://app.netlify.com/projects/sistema-municipal-directoalvecino/configuration/env

@echo off
title SOLUCION DEFINITIVA - 4 pasos
cd /d "%~dp0"

echo.
echo ============================================================
echo   POR QUE FALLABA
echo ============================================================
echo.
echo 1. Netlify construia desde GitHub con codigo viejo que
echo    pedia la base en el BUILD (y DIRECT_URL seguia Supabase).
echo 2. Ya subimos codigo nuevo: el build NO necesita base.
echo.
echo ============================================================
echo   HACE ESTO AHORA (en orden)
echo ============================================================
echo.
echo PASO A - BORRAR variables viejas en Netlify
echo   Project configuration - Environment variables
echo   En DATABASE_URL: Options (3 puntos) - DELETE
echo   En DIRECT_URL: Options - DELETE
echo   (BORRAR, no editar)
echo.
echo PASO B - CREAR de nuevo (copiar del .env de esta carpeta)
echo   Add variable:
echo     Key: DATABASE_URL
echo     Value: URL con -pooler y neon.tech
echo   Add variable:
echo     Key: DIRECT_URL
echo     Value: URL SIN -pooler y neon.tech
echo.
echo PASO C - Deploy
echo   Deploys - Trigger deploy - Deploy WITHOUT cache
echo   Esperar VERDE
echo.
echo PASO D - Barrios
echo   Doble clic: sembrar-por-netlify.bat
echo.
pause

@echo off
title IP local para compartir /cargar
echo.
echo Si el referente esta en la MISMA Wi-Fi que esta PC, puede usar:
echo.
powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notmatch '^169\.' } | Select-Object -First 1 | ForEach-Object { 'http://' + $_.IPAddress + ':3000/cargar' }"
echo.
pause

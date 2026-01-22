@echo off
echo ========================================
echo   Stopping AI Intelligence Hub
echo ========================================
echo.

cd /d "%~dp0"
docker-compose down

echo.
echo ========================================
echo   All services stopped!
echo ========================================
echo.
echo To start again, double-click: START-EVERYTHING.bat
echo.
echo Press any key to exit...
pause >nul

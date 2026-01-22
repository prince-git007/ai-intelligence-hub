@echo off
echo ========================================
echo   Starting AI Intelligence Hub
echo ========================================
echo.

echo [1/3] Checking if Docker Desktop is running...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Desktop is not running!
    echo Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Waiting 25 seconds for Docker Desktop to start...
    timeout /t 25 /nobreak >nul
) else (
    echo Docker Desktop is already running!
)

echo.
echo [2/3] Starting all services...
cd /d "%~dp0"
docker-compose up -d

echo.
echo [3/3] Waiting for services to be healthy...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   AI Intelligence Hub is READY!
echo ========================================
echo.
echo Open these URLs in your browser:
echo.
echo   Dashboard:  http://localhost
echo   Backend API: http://localhost:5000
echo   n8n:        http://localhost:5678
echo.
echo Press any key to exit...
pause >nul

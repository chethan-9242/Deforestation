@echo off
title Deforestation Detection - Full App
echo ========================================
echo   Deforestation Detection - Full App
echo ========================================
echo.

REM Check if Python is installed first
py --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed!
    echo.
    echo You have two options:
    echo.
    echo 1. Install Python and use the full app (real AI)
    echo    - Run: install-python.bat
    echo    - Then run this script again
    echo.
    echo 2. Use the offline app instead (no Python needed)
    echo    - Run: frontend\offline-app.bat
    echo    - Includes mock AI analysis
    echo.
    echo For more help, see: SETUP-GUIDE.md
    echo.
    pause
    exit /b 1
)

echo ✅ Python is installed!
echo.

echo Starting both backend and frontend...
echo.

REM Start backend in new window
echo Starting backend server...
start "Backend Server" cmd /k "cd /d %~dp0 && call start-backend.bat"

REM Wait a moment for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start frontend
echo Starting frontend app...
cd frontend
call working-app.bat

@echo off
title Deforestation Detection - Real AI App
echo ========================================
echo   Deforestation Detection - Real AI App
echo ========================================
echo.

echo Starting both backend and frontend...
echo.

REM Start backend in new window
echo Starting backend server...
start "Backend Server" cmd /k "cd /d %~dp0 && call start-backend-real.bat"

REM Wait a moment for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start frontend
echo Starting frontend app...
cd frontend
call working-app.bat

@echo off
title Deforestation Detection - Complete App
echo ========================================
echo   Deforestation Detection - Complete App
echo ========================================
echo.

echo Step 1: Rebuilding frontend with correct API URL...
cd frontend
call npm run build
cd ..

echo.
echo Step 2: Starting backend server...
start "Backend Server" cmd /k "cd /d %~dp0 && call start-backend.bat"

echo.
echo Step 3: Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo Step 4: Starting frontend app...
cd frontend
call working-app.bat

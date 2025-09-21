@echo off
title Deforestation Detection App Launcher
echo ========================================
echo   Deforestation Detection App Launcher
echo ========================================
echo.

echo Choose how you want to run the app:
echo.
echo 1. Full App (Real AI) - Requires Python
echo 2. Offline App (Mock AI) - No Python needed
echo 3. Install Python Helper
echo 4. View Setup Guide
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Starting Full App with Real AI...
    call start-full-app.bat
) else if "%choice%"=="2" (
    echo.
    echo Starting Offline App with Mock AI...
    call frontend\offline-app.bat
) else if "%choice%"=="3" (
    echo.
    echo Opening Python Installation Helper...
    call install-python.bat
) else if "%choice%"=="4" (
    echo.
    echo Opening Setup Guide...
    start SETUP-GUIDE.md
    echo.
    echo Setup guide opened. You can also read it in any text editor.
    pause
) else (
    echo Invalid choice. Please run the script again.
    pause
)

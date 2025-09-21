@echo off
title Python Installation Helper
echo ========================================
echo   Python Installation Helper
echo ========================================
echo.

echo This script will help you install Python for the Deforestation Detection app.
echo.

REM Check if Python is already installed
python --version >nul 2>&1
if not errorlevel 1 (
    echo ✅ Python is already installed!
    python --version
    echo.
    echo You can now run the full app with: start-full-app.bat
    pause
    exit /b 0
)

echo ❌ Python is not installed.
echo.

echo Choose an installation method:
echo.
echo 1. Download Python installer (Recommended)
echo 2. Use Windows Store (Alternative)
echo 3. Skip and use offline app instead
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Opening Python download page...
    echo Please download and install Python 3.8 or newer
    echo IMPORTANT: Check "Add Python to PATH" during installation!
    echo.
    start https://www.python.org/downloads/
    echo.
    echo After installing Python:
    echo 1. Restart your computer (recommended)
    echo 2. Run start-full-app.bat
    echo.
    pause
) else if "%choice%"=="2" (
    echo.
    echo Opening Windows Store...
    start ms-windows-store://pdp/?productid=9NRWMJP3717K
    echo.
    echo After installing Python from Windows Store:
    echo 1. Run start-full-app.bat
    echo.
    pause
) else if "%choice%"=="3" (
    echo.
    echo Great! You can use the offline app instead.
    echo.
    echo The offline app includes:
    echo - Image upload and display
    echo - Mock AI analysis (simulated results)
    echo - Interactive charts and visualizations
    echo - PWA features (installable)
    echo - Fully offline capability
    echo.
    echo To start the offline app, run: frontend\offline-app.bat
    echo.
    pause
) else (
    echo Invalid choice. Please run the script again.
    pause
)

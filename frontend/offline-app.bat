@echo off
title Deforestation Detection - Offline App
echo ========================================
echo   Deforestation Detection - Offline App
echo ========================================
echo.
echo This is a fully offline version that works without Python!
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo Make sure to check "Add to PATH" during installation
    pause
    exit /b 1
)

REM Check if build exists
if not exist "build" (
    echo Building offline app...
    call npm install --legacy-peer-deps
    call npm run build
    echo.
)

REM Check if serve is installed
echo Checking serve installation...
call npx serve --version >nul 2>&1
if errorlevel 1 (
    echo Installing serve...
    call npm install -g serve
    echo.
)

echo Starting offline app...
echo App will open at: http://localhost:3000
echo.
echo This version includes:
echo - Image upload and display
echo - Mock AI analysis (simulated results)
echo - Interactive charts and visualizations
echo - PWA features (installable)
echo - Fully offline capability
echo.
echo Setting offline mode...
set REACT_APP_USE_MOCK_API=true
echo.
echo Press Ctrl+C to stop the app
echo.

REM Start the app
call npx serve -s build -l 3000

echo.
echo App stopped.
pause

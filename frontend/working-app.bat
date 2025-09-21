@echo off
title Deforestation Detection App
echo ========================================
echo   Deforestation Detection App
echo ========================================
echo.

REM Check if build exists
if not exist "build" (
    echo Building app first...
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

echo Starting app...
echo App will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the app
echo.

REM Start the app
call npx serve -s build -l 3000

echo.
echo App stopped.
pause

@echo off
title Deforestation Detection Backend
echo ========================================
echo   Deforestation Detection Backend
echo ========================================
echo.

REM Check if Python is installed
py --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo.
    echo Please install Python from https://python.org
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    echo After installing Python, restart this script.
    echo.
    echo Alternative: You can use the offline app version instead!
    echo Run: frontend\offline-app.bat
    echo.
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "backend\venv" (
    echo Creating virtual environment...
    cd backend
    py -m venv venv
    cd ..
)

REM Activate virtual environment and install dependencies
echo Activating virtual environment...
call backend\venv\Scripts\activate.bat

echo Installing dependencies...
cd backend
pip install -r requirements.txt
cd ..

echo.
echo Starting backend server...
echo Backend will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the backend
echo.

cd backend
py main.py

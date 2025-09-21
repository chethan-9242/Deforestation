@echo off
title Deforestation Detection Backend
echo ========================================
echo   Deforestation Detection Backend
echo ========================================
echo.

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

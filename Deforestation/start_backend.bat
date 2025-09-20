@echo off
echo Starting Deforestation Detection Backend...
cd backend

echo Creating virtual environment...
py -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
py -m pip install --upgrade pip
py -m pip install -r requirements.txt

echo Starting FastAPI server...
py main.py

pause

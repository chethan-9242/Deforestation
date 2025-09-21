@echo off
title Rebuilding Frontend
echo Rebuilding frontend with correct API URL...
echo.

cd frontend

echo Building React app...
call npm run build

echo.
echo Frontend rebuilt successfully!
echo The app now points to localhost:8000 for the backend.
echo.
pause

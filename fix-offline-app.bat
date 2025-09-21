@echo off
title Fix Offline App
echo ========================================
echo   Fixing Offline App
echo ========================================
echo.

echo This will rebuild the app with offline mode fixes...
echo.

cd frontend

echo Building app with offline mode...
call npm run build

echo.
echo App rebuilt successfully!
echo.
echo Now run: frontend\offline-app.bat
echo.
echo The app will now use mock API instead of trying to connect to backend.
echo.

pause

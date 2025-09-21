@echo off
title Create Desktop Shortcut
echo Creating desktop shortcut for your app...
echo.

REM Create VBS script to run server in background
echo Set WshShell = CreateObject("WScript.Shell") > start-app.vbs
echo WshShell.Run "cmd /c npx serve -s build -l 3000", 0 >> start-app.vbs
echo WScript.Sleep 3000 >> start-app.vbs
echo WshShell.Run "http://localhost:3000", 1 >> start-app.vbs

REM Create desktop shortcut
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Deforestation App.lnk'); $Shortcut.TargetPath = '%CD%\start-app.vbs'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.Description = 'Deforestation Detection App'; $Shortcut.Save()"

echo.
echo ✓ Desktop shortcut created!
echo.
echo You now have "Deforestation App" on your desktop.
echo Double-click it to start your app anytime!
echo.
pause

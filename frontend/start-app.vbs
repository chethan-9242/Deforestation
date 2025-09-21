Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run "cmd /c npx serve -s build -l 3000", 0 
WScript.Sleep 3000 
WshShell.Run "http://localhost:3000", 1 

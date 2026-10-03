@echo off
title WTZ Cloud Guard
echo ============================================
echo   Cloud guard running, check every 60 seconds
echo   - guestbook service (8701)
echo   - cpolar tunnel (4040)
echo   - auto refresh & push public url when tunnel restarts
echo   close this window to stop the guard
echo ============================================
:loop
netstat -ano | findstr ":8701 " >nul 2>&1
if errorlevel 1 (
  echo [%date% %time%] guestbook down, restarting...
  start "" /min "C:\Users\Administrator\AppData\Local\Python\bin\pythonw.exe" "D:\WTZ\prts\_cloud\guestbook_server.py"
)
netstat -ano | findstr ":4040 " >nul 2>&1
if errorlevel 1 (
  echo [%date% %time%] cpolar down, restarting...
  start "" "D:\Program Files\cpolar.exe" start-all -daemon=on -dashboard=on -log=C:\Users\Administrator\.cpolar\logs\cpolar_service.log -config=C:\Users\Administrator\.cpolar\cpolar.yml
  echo waiting for tunnel...
  ping -n 22 127.0.0.1 >nul
  powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_cloud\get_url.ps1"
  powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_cloud\push_cloud.ps1"
)
timeout /t 60 /nobreak >nul
goto loop

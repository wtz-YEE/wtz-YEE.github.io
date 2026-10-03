@echo off
title WTZ Cloud One-Click (multi-host)
echo [1/3] guestbook service...
netstat -ano | findstr ":8701" >nul 2>&1
if %errorlevel%==0 (
  echo   already running
) else (
  start "" /min "C:\Users\Administrator\AppData\Local\Python\bin\pythonw.exe" "D:\WTZ\prts\_cloud\guestbook_server.py"
  echo   starting, waiting for port...
  ping -n 10 127.0.0.1 >nul
)
echo [2/3] cpolar daemon...
netstat -ano | findstr ":4040" >nul 2>&1
if %errorlevel%==0 (
  echo   running
) else (
  echo   NOT running - please start cpolar first (cpolar start guestbook)
  echo   or run ‘∆∂À ÿª§.bat for auto-restart
)
echo [3/3] fetch public url (multi-host merge)...
powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_cloud\get_url.ps1"
echo push url to github via api (dedup)...
powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_cloud\push_cloud.ps1"
echo.
pause

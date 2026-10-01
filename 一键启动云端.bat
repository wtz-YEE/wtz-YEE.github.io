@echo off
chcp 65001 >nul
title WTZ Cloud One-Click
echo [1/3] guestbook service...
netstat -ano | findstr ":8701" >nul 2>&1
if %errorlevel%==0 (echo   already running) else (start "" /min pythonw "D:\WTZ\prts\_gb\guestbook_server.py" & echo   started)
echo [2/3] cpolar daemon...
netstat -ano | findstr ":4040" >nul 2>&1
if %errorlevel%==0 (echo   running) else (echo   NOT running - please start cpolar first)
echo [3/3] fetch public url...
powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_gb\get_url.ps1"
echo push url to github...
cd /d D:\WTZ\prts
git add cloud.txt
git commit -m "cloud" >nul 2>&1
git push origin main >nul 2>&1
if %errorlevel%==0 (echo   pushed OK) else (echo   push failed - check network / git login)
echo.
pause

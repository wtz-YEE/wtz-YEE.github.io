@echo off
chcp 936 >nul
title WTZ Cloud One-Click
echo ============================================
echo   一键启动云端
echo   [1/3] 留言服务(8701)
echo   [2/3] CPOLAR 服务
echo   [3/3] 刷新公网地址并推送 GitHub
echo ============================================
echo [1/3] 留言服务...
netstat -ano | findstr ":8701" >nul 2>&1
if %errorlevel%==0 (
  echo   已在运行
) else (
  start "" /min "C:\Users\Administrator\AppData\Local\Python\bin\pythonw.exe" "D:\WTZ\prts\_gb\guestbook_server.py"
  echo   已启动，等待端口...
  ping -n 10 127.0.0.1 >nul
)
echo [2/3] CPOLAR 服务...
sc query cpolar | findstr RUNNING >nul 2>&1
if %errorlevel%==0 (
  echo   服务已在运行
) else (
  echo   未运行，正在启动 cpolar 服务...
  net start cpolar >nul 2>&1
  echo   等待隧道建立...
  ping -n 22 127.0.0.1 >nul
)
echo [3/3] 刷新公网地址并推送...
powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_gb\get_url.ps1"
powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_gb\push_cloud.ps1"
echo.
echo   全部完成，公网地址已推送 GitHub
pause

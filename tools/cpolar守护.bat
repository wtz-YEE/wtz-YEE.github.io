@echo off
chcp 936 >nul
title CPOLAR 云端守护
echo ============================================
echo   云端守护进程已启动
echo   每 60 秒检查一次 留言服务(8701) 与 CPOLAR(4040)
echo   异常自动重启，公网地址变化自动刷新并推送
echo   维护状态(cloud_fixing.txt)变化自动推送 GitHub
echo   关闭本窗口即可停止守护
echo ============================================
:loop
set PYG=C:\Users\Administrator\AppData\Local\Python\bin\pythonw.exe

REM ---- 维护状态自动推送 ----
powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_gb\push_fixing.ps1"

REM ---- 留言服务 8701 ----
netstat -ano | findstr ":8701 " >nul 2>&1
if errorlevel 1 (
  echo [%date% %time%] 留言服务已挂，正在重启...
  start "" /min "%PYG%" "D:\WTZ\prts\_gb\guestbook_server.py"
)

REM ---- CPOLAR 4040 ----
netstat -ano | findstr ":4040 " >nul 2>&1
if errorlevel 1 (
  echo [%date% %time%] CPOLAR 已挂，正在重启...
  start "" "D:\Program Files\cpolar.exe" start-all -daemon=on -dashboard=on -log=C:\Users\Administrator\.cpolar\logs\cpolar_service.log -config=C:\Users\Administrator\.cpolar\cpolar.yml
  echo 等待隧道建立...
  ping -n 22 127.0.0.1 >nul
  echo 刷新公网地址...
  powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_gb\get_url.ps1"
  echo 推送 GitHub cloud.txt...
  powershell -ExecutionPolicy Bypass -File "D:\WTZ\prts\_gb\push_cloud.ps1"
  echo [%date% %time%] 云端地址已刷新并推送
)

timeout /t 60 /nobreak >nul
goto loop

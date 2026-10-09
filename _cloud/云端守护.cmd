@echo off
chcp 936 >nul
title WTZ 云端守护
set CLOUD=%~dp0
echo ============================================
echo   云端守护进程已启动
echo   每 60 秒检测：留言服务(8701) / cpolar 服务
echo   异常自动重启，地址变化自动刷新推送
echo   关闭本窗口即停止守护
echo ============================================
:loop
set PY=
for /f "delims=" %%i in ('where python 2^>nul') do (set PY=%%i & goto :pyf)
:pyf
if not defined PY (
  echo [%date% %time%] 未找到 Python，稍后重试
  timeout /t 60 /nobreak >nul
  goto loop
)
set PYW=%PY:~0,-3%pythonw.exe
if not exist "%PYW%" set PYW=pythonw.exe

REM ---- 留言服务 8701 ----
netstat -ano | findstr ":8701 " >nul 2>&1
if errorlevel 1 (
  echo [%date% %time%] 留言服务已挂，重启...
  start "" /min "%PYW%" "%CLOUD%guestbook_server.py"
  ping -n 10 127.0.0.1 >nul
)

REM ---- cpolar 服务（只在未运行时启动，避免反复重启）----
sc query cpolar 2>nul | findstr RUNNING >nul 2>&1
if errorlevel 1 (
  echo [%date% %time%] cpolar 服务未运行，正在启动...
  net start cpolar >nul 2>&1
  ping -n 25 127.0.0.1 >nul
)

REM ---- 刷新公网地址并推送 ----
python "%CLOUD%get_url.py"
powershell -ExecutionPolicy Bypass -File "%CLOUD%push_cloud.ps1"

timeout /t 60 /nobreak >nul
goto loop

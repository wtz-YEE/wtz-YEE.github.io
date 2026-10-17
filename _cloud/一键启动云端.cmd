@echo off
chcp 936 >nul
title WTZ 云端一键启动
setlocal enabledelayedexpansion
set CLOUD=%~dp0
echo ============================================
echo   WTZ 云端一键启动（防护版）
echo   自动检测 Python + 装依赖 + 起 cpolar + 推地址
echo ============================================
net session >nul 2>&1
if errorlevel 1 (
  echo 正在请求管理员权限...
  powershell -NoProfile -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c \"%~f0\"'"
  exit /b
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%guard_core.ps1"
if errorlevel 1 exit /b 1
echo.
echo [1/5] 检测 Python ...
set PY=
for /f "delims=" %%i in ('where python 2^>nul') do (set PY=%%i & goto :pyfound)
:pyfound
if not defined PY (
  echo.
  echo   [错误] 未找到 Python
  echo   请先安装 Python 3 并勾选 "Add python.exe to PATH"
  echo   下载: https://www.python.org/downloads/
  echo.
  pause
  exit /b 1
)
echo      Python: %PY%
echo [2/5] 检测依赖并安装 + cpolar ...
python "%CLOUD%setup.py"
if errorlevel 1 (
  echo.
  echo   [错误] 依赖安装失败，请看上方提示
  echo.
  pause
  exit /b 1
)
echo [3/5] 启动服务 8701 ...
set PYW=%PY:~0,-3%pythonw.exe
if not exist "%PYW%" set PYW=pythonw.exe
netstat -ano | findstr ":8701" >nul 2>&1
if errorlevel 1 (
  start "" /min "%PYW%" "%CLOUD%guestbook_server.py"
  echo      服务已拉起，等待健康检查...
  set /a n=0
  :wait1
  powershell -NoProfile -Command "try{$r=Invoke-WebRequest 'http://127.0.0.1:8701/health' -UseBasicParsing -TimeoutSec 3;if($r.StatusCode -eq 200){'ok'}else{'no'}}catch{'no'}" | findstr /i "ok" >nul 2>&1
  if errorlevel 1 (
    set /a n+=1
    if !n! lss 30 (ping -n 2 127.0.0.1 >nul & goto wait1)
    echo      [警告] 健康检查未通过，守护将接管
  ) else (
    echo      服务健康检查通过
  )
) else (
  echo      服务已在运行
)
echo [4/5] 启动 cpolar 隧道 ...
sc query cpolar 2>nul | findstr RUNNING >nul 2>&1
if errorlevel 1 (
  where cpolar >nul 2>&1
  if errorlevel 1 (
    echo      [错误] cpolar 命令不可用，请确认已安装并加入 PATH
  ) else (
    cpolar start guestbook -daemon=on >nul 2>&1
    echo      已后台启动，等待隧道就绪...
    ping -n 22 127.0.0.1 >nul
  )
) else (
  echo      服务式运行中，等待隧道就绪...
  ping -n 22 127.0.0.1 >nul
)
echo [5/5] 获取公网地址并推送 ...
python "%CLOUD%get_url.py"
if exist "%CLOUD%..\云端地址.txt" (
  set /p URL=<"%CLOUD%..\云端地址.txt"
) else (
  set URL=
)
echo %URL% | findstr /i "^http" >nul 2>&1
if errorlevel 1 (
  echo      [警告] 地址获取失败或格式异常，守护将自动重试
) else (
  echo      公网地址: %URL%
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%push_cloud.ps1"
echo.
echo ============================================
echo   云端启动完成
echo   公网地址已推送 GitHub，前端将自动读取
echo ============================================
pause
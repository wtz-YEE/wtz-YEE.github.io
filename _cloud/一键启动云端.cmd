@echo off
chcp 936 >nul
title WTZ 云端一键启动
set CLOUD=%~dp0
echo ============================================
echo   WTZ 云端一键启动（新电脑友好）
echo   自动：检测Python + 装依赖 + 配cpolar + 起服务
echo ============================================

REM ---- 1. 定位 Python ----
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
echo [1/5] Python: %PY%

REM ---- 2. 检测并配置环境（依赖 + cpolar）----
echo [2/5] 检测依赖并配置 cpolar ...
python "%CLOUD%setup.py"
if errorlevel 1 (
  echo.
  echo   [错误] 环境配置失败，请查看上方提示
  echo.
  pause
  exit /b 1
)

REM ---- 3. 启动留言服务 8701 ----
echo [3/5] 留言服务 ...
set PYW=%PY:~0,-3%pythonw.exe
if not exist "%PYW%" set PYW=pythonw.exe
netstat -ano | findstr ":8701" >nul 2>&1
if errorlevel 1 (
  start "" /min "%PYW%" "%CLOUD%guestbook_server.py"
  echo      启动中，等待端口...
  ping -n 10 127.0.0.1 >nul
) else (
  echo      已在运行
)

REM ---- 4. 启动 cpolar 隧道 ----
echo [4/5] cpolar 隧道 ...
sc query cpolar 2>nul | findstr RUNNING >nul 2>&1
if errorlevel 1 (
  where cpolar >nul 2>&1
  if errorlevel 1 (
    echo      [警告] cpolar 命令不可用，请确认已安装并加入 PATH
  ) else (
    cpolar start guestbook -daemon=on >nul 2>&1
    echo      已后台启动，等待隧道建立...
    ping -n 22 127.0.0.1 >nul
  )
) else (
  echo      服务方式运行中（隧道由服务管理）
  ping -n 22 127.0.0.1 >nul
)

REM ---- 5. 获取公网地址并推送 ----
echo [5/5] 获取公网地址 ...
python "%CLOUD%get_url.py"
echo.
echo      地址已写入 cloud.txt
powershell -ExecutionPolicy Bypass -File "%CLOUD%push_cloud.ps1"
echo.
echo ============================================
echo   启动流程完成
echo   云端地址已推送到 GitHub，前端将自动读取
echo ============================================
pause

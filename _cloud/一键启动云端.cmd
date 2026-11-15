@echo off
chcp 936 >nul
title WTZ 云端一键启动（云端稳定版）
setlocal enabledelayedexpansion
cd /d "%~dp0"
set CLOUD=%~dp0
set LOGDIR=%USERPROFILE%\.cpolar\logs
echo ============================================
echo   WTZ 云端一键启动（云端稳定版）
echo   本地服务 + cpolar 隧道 + 地址同步 + 守护
echo ============================================
net session >nul 2>&1
if errorlevel 1 (
  echo 正在请求管理员权限...
  powershell -NoProfile -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c \"%~f0\"'"
  exit /b
)

set "PY="
if exist "%LOCALAPPDATA%\Python\bin\python.exe" set "PY=%LOCALAPPDATA%\Python\bin\python.exe"
if not defined PY for /d %%d in ("%LOCALAPPDATA%\Python\pythoncore-*") do if exist "%%d\python.exe" if not defined PY set "PY=%%d\python.exe"
if not defined PY for /d %%d in ("%LOCALAPPDATA%\Programs\Python\Python3*") do if exist "%%d\python.exe" if not defined PY set "PY=%%d\python.exe"
if not defined PY for /d %%d in ("C:\Python3*") do if exist "%%d\python.exe" if not defined PY set "PY=%%d\python.exe"
if not defined PY for /f "delims=" %%i in ('where python 2^>nul') do if not defined PY set "PY=%%i"
if not defined PY ( echo [失败] 未找到 Python & pause & exit /b 1 )

powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%guard_core.ps1"
if errorlevel 1 ( echo [失败] 守护签名校验失败，已中止 & pause & exit /b 1 )

echo [1/6] Python: %PY%
"%PY%" "%CLOUD%setup.py"
if errorlevel 1 ( echo [失败] 云端环境检查失败，请查看上方原因 & pause & exit /b 1 )

echo [2/6] 启动本地服务 ...
"%PY%" "%CLOUD%start_services.py"

echo [3/6] 启动 cpolar 隧道 ...
"%PY%" "%CLOUD%start_tunnels.py"
if errorlevel 1 ( echo [失败] cpolar 启动失败，请确认已安装并加入 PATH & pause & exit /b 1 )

echo [4/6] 等待隧道分配地址并同步 ...
set /a n=0
:wait3
set /a n+=1
"%PY%" "%CLOUD%get_url.py" --scan-only > "%LOGDIR%\_sync.out" 2>nul
findstr /i "37web=" "%LOGDIR%\_sync.out" >nul 2>&1
if not errorlevel 1 goto ok3
if !n! geq 20 goto warn3
echo   等待隧道就绪 (!n!/20) ...
ping -n 6 127.0.0.1 >nul
goto wait3
:ok3
echo   隧道地址：
type "%LOGDIR%\_sync.out"
goto after3
:warn3
echo   [提示] 隧道未在时限内就绪，守护会继续重试
:after3
"%PY%" "%CLOUD%get_url.py"

echo [5/6] 推送公网地址 ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%push_cloud.ps1"

echo [6/6] 启动云端看门狗 ...
call "%CLOUD%云端看门狗.cmd"
echo.
echo ============================================
echo   云端启动完成
echo   守护已接管，公网地址会自动同步
echo   关闭本窗口不会停止云端服务
echo ============================================
pause
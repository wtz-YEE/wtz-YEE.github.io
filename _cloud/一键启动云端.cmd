@echo off
chcp 936 >nul
title WTZ 云端一键启动（多云端稳定版）
setlocal enabledelayedexpansion
set CLOUD=%~dp0
set LOGDIR=%USERPROFILE%\.cpolar\logs
echo ============================================
echo   WTZ 云端一键启动（多云端稳定版）
echo   本机服务 + cpolar 多隧道 + 地址自动同步 + 云端守护
echo ============================================
net session >nul 2>&1
if errorlevel 1 (
  echo 正在请求管理员权限...
  powershell -NoProfile -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c \"%~f0\"'"
  exit /b
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%guard_core.ps1"
if errorlevel 1 ( echo [错误] 守护签名校验失败，已中止 & pause & exit /b 1 )

set PY=
for /f "delims=" %%i in ('where python 2^>nul') do (set PY=%%i & goto :pyfound)
:pyfound
if not defined PY (
  for /f "delims=" %%i in ('dir /b /s "C:\Users\*\AppData\Local\Programs\Python\python.exe" 2^>nul') do (set PY=%%i & goto :pyfound2)
)
:pyfound2
if not defined PY if exist "C:\Python312\python.exe" set PY=C:\Python312\python.exe
if not defined PY if exist "C:\Python311\python.exe" set PY=C:\Python311\python.exe
if not defined PY if exist "C:\Python310\python.exe" set PY=C:\Python310\python.exe
if not defined PY if exist "C:\Python39\python.exe" set PY=C:\Python39\python.exe
if not defined PY ( echo [错误] 未找到 Python & pause & exit /b 1 )
echo [1/6] Python: %PY%
python "%CLOUD%setup.py"
if errorlevel 1 ( echo [错误] 云端环境检查失败，请查看上方原因 & pause & exit /b 1 )

echo [2/6] 启动本机服务 ...
python "%CLOUD%start_services.py"
echo.
echo [3/6] 启动 cpolar 多隧道 ...
python "%CLOUD%start_tunnels.py"
if errorlevel 1 ( echo [错误] cpolar 启动失败，请确认已安装并加入 PATH & pause & exit /b 1 )

echo [4/6] 等待隧道就绪并同步地址 ...
set /a n=0
:wait3
set /a n+=1
python "%CLOUD%get_url.py" --scan-only > "%LOGDIR%\_sync.out" 2>nul
findstr /i "37web=" "%LOGDIR%\_sync.out" >nul 2>&1
if not errorlevel 1 goto ok3
if !n! geq 12 goto warn3
echo   等待隧道建立 (!n!/12) ...
ping -n 9 127.0.0.1 >nul
goto wait3
:ok3
echo   隧道就绪:
type "%LOGDIR%\_sync.out"
goto after3
:warn3
echo   [警告] 隧道未完全就绪，云端守护将自动重试
:after3
python "%CLOUD%get_url.py" > "%LOGDIR%\_sync.out" 2>nul
echo [5/6] 推送公网地址 ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%push_cloud.ps1"
echo [6/6] 启动云端守护 ...
call "%CLOUD%云端看门狗.cmd"
echo.
echo ============================================
echo   云端启动完成
echo   守护已接管，隧道地址自动同步
echo   关闭本窗口不会停止云端服务
echo ============================================
pause

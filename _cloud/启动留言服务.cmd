@echo off
chcp 936 >nul
title WTZ 留言服务
set CLOUD=%~dp0
if not defined WTZ_CLOUD_PORT set "WTZ_CLOUD_PORT=8701"
set "PY="
for /f "delims=" %%i in ('where python 2^>nul') do if not defined PY set "PY=%%i"
if not defined PY for /f "delims=" %%i in ('py -3 -c "import sys;print(sys.executable)" 2^>nul') do if not defined PY set "PY=%%i"
if not defined PY for /d %%d in ("%LOCALAPPDATA%\Programs\Python\Python3*") do if exist "%%d\python.exe" if not defined PY set "PY=%%d\python.exe"
if not defined PY for /d %%d in ("%LOCALAPPDATA%\Python\pythoncore-*") do if exist "%%d\python.exe" if not defined PY set "PY=%%d\python.exe"
if not defined PY for /d %%d in ("%LOCALAPPDATA%\Python\bin") do if exist "%%d\python.exe" if not defined PY set "PY=%%d\python.exe"
if not defined PY for /d %%d in ("%ProgramFiles%\Python3*") do if exist "%%d\python.exe" if not defined PY set "PY=%%d\python.exe"
if not defined PY for /d %%d in ("%ProgramFiles%\Python\Python3*") do if exist "%%d\python.exe" if not defined PY set "PY=%%d\python.exe"
if not defined PY for /d %%d in ("%SystemDrive%\Python3*") do if exist "%%d\python.exe" if not defined PY set "PY=%%d\python.exe"
if not defined PY (
  echo 未找到 Python，请安装 Python 3 并勾选 Add to PATH
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%guard_core.ps1"
if errorlevel 1 exit /b 1
"%PY%" "%CLOUD%start_services.py"
echo 关闭本窗口不会停止服务
ping -n 5 127.0.0.1 >nul

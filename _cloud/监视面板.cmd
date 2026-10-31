@echo off
chcp 936 >nul
title WTZ 服务器监视面板
set CLOUD=%~dp0
netstat -ano | findstr "LISTENING" | findstr ":8702 " >nul 2>&1
if not errorlevel 1 (
  echo 监视面板已在运行
) else (
  set PYW=
  for /f "delims=" %%p in ('where pythonw 2^>nul') do if not defined PYW set PYW=%%p
  if not defined PYW set PYW=%LOCALAPPDATA%\Programs\Python\Python312\pythonw.exe
  if not defined PYW set PYW=%LOCALAPPDATA%\Programs\Python\Python311\pythonw.exe
  if not defined PYW set PYW=%LOCALAPPDATA%\Programs\Python\Python310\pythonw.exe
  if not defined PYW (
    echo 未找到 pythonw.exe，无法启动监视面板
    pause
    exit /b 1
  )
  start "" "%PYW%" "%CLOUD%monitor.py"
  ping -n 2 127.0.0.1 >nul
)
start "" http://127.0.0.1:8702/
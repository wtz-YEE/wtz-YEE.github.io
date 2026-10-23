@echo off
chcp 936 >nul
title WTZ 云端守护
setlocal enabledelayedexpansion
set CLOUD=%~dp0
set ARG=%1
echo ============================================
echo   云端守护（黑曜石版）
echo   15 秒轮询 · 本机/公网双轨探测 · 分级自愈
echo   心跳文件 guard.heartbeat 供看门狗判活
echo   关闭本窗口即停止守护
echo ============================================
if not "%ARG%"=="/watchdog" (
  net session >nul 2>&1
  if errorlevel 1 (
    echo 正在请求管理员权限...
    powershell -NoProfile -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c \"%~f0\"'"
    exit /b
  )
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%guard_core.ps1"
if errorlevel 1 exit /b 1
set HB2=
for /f "delims=" %%h in ('type "%CLOUD%guard.heartbeat" 2^>nul') do set HB2=%%h
for /f %%t in ('powershell -NoProfile -Command "[int](Get-Date -UFormat %%s)"') do set HB=%%t
echo %HB%> "%CLOUD%guard.heartbeat"
if defined HB2 (
  set /a D2=!HB!-!HB2!
  if !D2! lss 150 (
    echo [防护] 已有守护在运行，退出
    exit /b 2
  )
)
echo [%date% %time%] 守护已启动
set FAIL=0
set CF=0
set N=0
:loop
for /f %%t in ('powershell -NoProfile -Command "[int](Get-Date -UFormat %%s)"') do set HB=%%t
echo %HB%> "%CLOUD%guard.heartbeat"
set PY=
for /f "delims=" %%i in ('where python 2^>nul') do (set PY=%%i & goto :pyf)
:pyf
if not defined PY (
  for /f "delims=" %%i in ('dir /b /s "C:\Users\*\AppData\Local\Programs\Python\python.exe" 2^>nul') do (set PY=%%i & goto :pyf2)
)
:pyf2
if not defined PY if exist "C:\Python312\python.exe" set PY=C:\Python312\python.exe
if not defined PY if exist "C:\Python311\python.exe" set PY=C:\Python311\python.exe
if not defined PY if exist "C:\Python310\python.exe" set PY=C:\Python310\python.exe
if not defined PY if exist "C:\Python39\python.exe" set PY=C:\Python39\python.exe
if not defined PY (
  echo [%date% %time%] 未找到 Python，稍后重试
  timeout /t 15 /nobreak >nul
  goto loop
)
set PYW=%PY:~0,-3%pythonw.exe
if not exist "%PYW%" set PYW=pythonw.exe
powershell -NoProfile -Command "try{$r=Invoke-WebRequest 'http://127.0.0.1:8701/health' -UseBasicParsing -TimeoutSec 4;if($r.StatusCode -eq 200){'ok'}else{'no'}}catch{'no'}" | findstr /i "ok" >nul 2>&1
if errorlevel 1 (
  set /a FAIL+=1
  echo [%date% %time%] 本机服务异常 (连续失败 !FAIL!)
  if !FAIL! geq 5 (
    echo   终极修复：重启 cpolar 隧道 + 服务
taskkill /f /im cpolar.exe >nul 2>&1
ping -n 3 127.0.0.1 >nul
start "" cpolar start guestbook -daemon=on >nul 2>&1
ping -n 2 127.0.0.1 >nul
start "" cpolar start web37 -daemon=on >nul 2>&1
ping -n 4 127.0.0.1 >nul
    set FAIL=3
  )
  if !FAIL! geq 3 (
    echo   强杀残留进程并重启服务
    for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8701 "') do taskkill /f /pid %%p >nul 2>&1
    powershell -NoProfile -Command "Get-CimInstance Win32_Process ^| Where-Object {$_.CommandLine -like '*guestbook_server.py*'} ^| ForEach-Object {Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue}" >nul 2>&1
    ping -n 2 127.0.0.1 >nul
    start "" /min "%PYW%" "%CLOUD%guestbook_server.py"
    set FAIL=1
  ) else (
    echo   拉起服务
    netstat -ano | findstr "LISTENING" | findstr ":8701 " >nul 2>&1
    if not errorlevel 1 (
      echo   已存在监听，跳过重复拉起
    ) else (
      start "" /min "%PYW%" "%CLOUD%guestbook_server.py"
    )
  )
  ping -n 5 127.0.0.1 >nul
) else (
  if !FAIL! gtr 0 echo [%date% %time%] 本机服务已恢复
  set FAIL=0
  powershell -NoProfile -Command "$n=(Get-CimInstance Win32_Process ^| Where-Object {$_.CommandLine -like '*guestbook_server.py*'} ^| Measure-Object).Count; if($n -gt 1){'multi'}" | findstr /i "multi" >nul 2>&1
  if not errorlevel 1 (
    echo 检测到多实例，清理为单实例
    powershell -NoProfile -Command "Get-CimInstance Win32_Process ^| Where-Object {$_.CommandLine -like '*guestbook_server.py*'} ^| ForEach-Object {Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue}" >nul 2>&1
    ping -n 2 127.0.0.1 >nul
    start "" /min "%PYW%" "%CLOUD%guestbook_server.py"
  )
)
set /a N+=1
if !N! geq 4 (
  set N=0
  set PUB=
  if exist "%CLOUD%..\云端地址.txt" (
    for /f "delims=" %%h in ('type "%CLOUD%..\云端地址.txt" 2^>nul') do set PUB=%%h
    echo !PUB! | findstr /i "^http" >nul 2>&1
    if not errorlevel 1 (
      powershell -NoProfile -Command "try{$r=Invoke-WebRequest '!PUB!/health' -UseBasicParsing -TimeoutSec 8;if($r.StatusCode -eq 200){'ok'}else{'no'}}catch{'no'}" | findstr /i "ok" >nul 2>&1
      if errorlevel 1 (
        set /a CF+=1
        echo [%date% %time%] 公网隧道失联 (连续失败 !CF!)
        if !CF! geq 4 (
          echo   终极修复：强杀 cpolar 进程并重启
          taskkill /f /im cpolar.exe >nul 2>&1
          ping -n 3 127.0.0.1 >nul
          start "" cpolar start guestbook -daemon=on >nul 2>&1
          ping -n 2 127.0.0.1 >nul
          start "" cpolar start web37 -daemon=on >nul 2>&1
          set CF=1
        ) else (
          echo   重启 cpolar 隧道
taskkill /f /im cpolar.exe >nul 2>&1
ping -n 3 127.0.0.1 >nul
start "" cpolar start guestbook -daemon=on >nul 2>&1
ping -n 2 127.0.0.1 >nul
start "" cpolar start web37 -daemon=on >nul 2>&1
ping -n 4 127.0.0.1 >nul
        )
        ping -n 15 127.0.0.1 >nul
      ) else (
        if !CF! gtr 0 echo [%date% %time%] 公网隧道已恢复
        set CF=0
      )
    )
  )
  python "%CLOUD%get_url.py"
  powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%push_cloud.ps1"
)
timeout /t 15 /nobreak >nul
goto loop
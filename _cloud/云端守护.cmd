@echo off
chcp 936 >nul
title WTZ 云端守护
setlocal enabledelayedexpansion
set CLOUD=%~dp0
set ARG=%1
if not defined WTZ_CLOUD_PORT set "WTZ_CLOUD_PORT=8701"
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
set "LK=%CLOUD%guard.lock"
set "LB=0"
for /f "delims=" %%h in ('type "%CLOUD%guard.heartbeat" 2^>nul') do set "LB=%%h"
set "NOWT=0"
for /f %%t in ('powershell -NoProfile -Command "[DateTimeOffset]::Now.ToUnixTimeSeconds()"') do set "NOWT=%%t"
set /a AGE=NOWT-LB
mkdir "%LK%" 2>nul
if errorlevel 1 (
  set "LP="
  for /f "tokens=1" %%p in ('type "%LK%\pid" 2^>nul') do set "LP=%%p"
  if not defined LP (
    ping -n 3 127.0.0.1 >nul
    for /f "tokens=1" %%p in ('type "%LK%\pid" 2^>nul') do set "LP=%%p"
  )
  if defined LP (
    powershell -NoProfile -Command "if (Get-Process -Id !LP! -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
    if not errorlevel 1 (
      echo [防护] 已有守护在运行，本实例自动退出
      timeout /t 4 /nobreak >nul
      exit /b 2
    )
  )
  rmdir /s /q "%LK%" 2>nul
  mkdir "%LK%" 2>nul
  if errorlevel 1 (
    echo [防护] 已有守护在运行，本实例自动退出
    exit /b 2
  )
)
set "MYPID="
for /f %%p in ('powershell -NoProfile -Command "$pp=(Get-CimInstance Win32_Process | Where-Object {$_.ProcessId -eq $PID}).ParentProcessId;$gp=(Get-CimInstance Win32_Process | Where-Object {$_.ProcessId -eq $pp}).ParentProcessId;$gp"') do set "MYPID=%%p"
if defined MYPID echo !MYPID!>"%LK%\pid"
echo !NOWT!> "%CLOUD%guard.heartbeat"
powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%guard_core.ps1"
if errorlevel 1 exit /b 1
set HB2=
for /f "delims=" %%h in ('type "%CLOUD%guard.heartbeat" 2^>nul') do set HB2=%%h
for /f %%t in ('powershell -NoProfile -Command "[DateTimeOffset]::Now.ToUnixTimeSeconds()"') do set HB=%%t
echo %HB%> "%CLOUD%guard.heartbeat"
echo [%date% %time%] 守护已启动
set FAIL=0
set CF=0
set N=0
:loop
for /f %%t in ('powershell -NoProfile -Command "[DateTimeOffset]::Now.ToUnixTimeSeconds()"') do set HB=%%t
echo %HB%> "%CLOUD%guard.heartbeat"
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
  echo [%date% %time%] 未找到 Python，稍后重试
  timeout /t 15 /nobreak >nul
  goto loop
)
for %%I in ("%PY%") do set "PYD=%%~dpI"
set "PYW=%PYD%pythonw.exe"
if not exist "%PYW%" set "PYW=%PY%"
powershell -NoProfile -Command "try{$r=Invoke-WebRequest 'http://127.0.0.1:%WTZ_CLOUD_PORT%/health' -UseBasicParsing -TimeoutSec 4;if($r.StatusCode -eq 200){'ok'}else{'no'}}catch{'no'}" | findstr /i "ok" >nul 2>&1
if errorlevel 1 (
  set /a FAIL+=1
  echo [%date% %time%] 本机服务异常 (连续失败 !FAIL!)
  if !FAIL! geq 5 (
    echo   终极修复：重启 cpolar 隧道 + 服务
"%PY%" "%CLOUD%start_tunnels.py"
ping -n 4 127.0.0.1 >nul
    set FAIL=3
  )
  if !FAIL! geq 3 (
    echo   强杀残留进程并重启服务
    for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":%WTZ_CLOUD_PORT% "') do taskkill /f /pid %%p >nul 2>&1
    powershell -NoProfile -Command "Get-CimInstance Win32_Process ^| Where-Object {$_.CommandLine -like '*guestbook_server.py*'} ^| ForEach-Object {Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue}" >nul 2>&1
    ping -n 2 127.0.0.1 >nul
    "%PY%" "%CLOUD%start_services.py"
    set FAIL=1
  ) else (
    echo   拉起服务
    netstat -ano | findstr "LISTENING" | findstr ":%WTZ_CLOUD_PORT% " >nul 2>&1
    if not errorlevel 1 (
      echo   已存在监听，跳过重复拉起
    ) else (
      "%PY%" "%CLOUD%start_services.py"
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
    "%PY%" "%CLOUD%start_services.py"
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
          "%PY%" "%CLOUD%start_tunnels.py"
          ping -n 4 127.0.0.1 >nul
          set CF=1
        ) else (
          echo   重启 cpolar 隧道
"%PY%" "%CLOUD%start_tunnels.py"
ping -n 4 127.0.0.1 >nul
        )
        ping -n 15 127.0.0.1 >nul
      ) else (
        if !CF! gtr 0 echo [%date% %time%] 公网隧道已恢复
        set CF=0
      )
    )
  )
  "%PY%" "%CLOUD%get_url.py"
  powershell -NoProfile -ExecutionPolicy Bypass -File "%CLOUD%push_cloud.ps1"
)
timeout /t 15 /nobreak >nul
goto loop
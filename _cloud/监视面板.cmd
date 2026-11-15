@echo off
chcp 936 >nul
title WTZ 云端监视面板
setlocal
set "CLOUD=%~dp0"
set "URL=http://127.0.0.1:8702/"

netstat -ano | findstr /i "LISTENING" | findstr ":8702 " >nul 2>&1
if errorlevel 1 goto START
call :HEALTH
if not errorlevel 1 goto OPEN
echo 检测到旧面板无响应，正在重启...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8702 " ^| findstr /i "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
ping -n 2 127.0.0.1 >nul

:START
set "PYW="
if exist "%LOCALAPPDATA%\Python\bin\pythonw.exe" set "PYW=%LOCALAPPDATA%\Python\bin\pythonw.exe"
if not defined PYW for /d %%d in ("%LOCALAPPDATA%\Python\pythoncore-*") do if exist "%%d\pythonw.exe" if not defined PYW set "PYW=%%d\pythonw.exe"
if not defined PYW for /d %%d in ("%LOCALAPPDATA%\Programs\Python\Python3*") do if exist "%%d\pythonw.exe" if not defined PYW set "PYW=%%d\pythonw.exe"
if not defined PYW for /d %%d in ("C:\Python3*") do if exist "%%d\pythonw.exe" if not defined PYW set "PYW=%%d\pythonw.exe"
if not defined PYW for /f "delims=" %%p in ('where pythonw 2^>nul') do if not defined PYW set "PYW=%%p"
if not defined PYW goto NOPY

start "" "%PYW%" "%CLOUD%monitor.py"
echo 正在启动监视面板，初始化约需 10 秒...
set /a N=0

:WAIT
call :HEALTH
if not errorlevel 1 goto OPEN
set /a N+=1
if %N% GEQ 40 goto FAIL
ping -n 2 127.0.0.1 >nul
goto WAIT

:OPEN
start "" "%URL%"
exit /b 0

:NOPY
echo 未找到 pythonw.exe，请安装 Python 3 并勾选 Add to PATH。
echo 也可以直接运行: python "%CLOUD%monitor.py"
pause
exit /b 1

:FAIL
echo 面板启动失败：8702 端口在 60 秒内没有响应。
echo 请手动运行 python "%CLOUD%monitor.py" 查看报错，或检查 "%CLOUD%monitor.err.log"。
pause
exit /b 1

:HEALTH
where curl.exe >nul 2>&1
if errorlevel 1 goto HPWS
curl.exe -s -f --max-time 1 -o nul "http://127.0.0.1:8702/health" >nul 2>&1
exit /b %errorlevel%

:HPWS
powershell -NoProfile -Command "try{if((Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:8702/health' -TimeoutSec 2).StatusCode -eq 200){exit 0}}catch{};exit 1" >nul 2>&1
exit /b %errorlevel%
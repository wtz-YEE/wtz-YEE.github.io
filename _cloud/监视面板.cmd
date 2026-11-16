@echo off
chcp 936 >nul
title WTZ 云端监视面板
setlocal
set "CLOUD=%~dp0"
if not defined WTZ_MONITOR_PORT set "WTZ_MONITOR_PORT=8702"
set "URL=http://127.0.0.1:%WTZ_MONITOR_PORT%/"

netstat -ano | findstr /i "LISTENING" | findstr ":%WTZ_MONITOR_PORT% " >nul 2>&1
if errorlevel 1 goto START
call :HEALTH
if not errorlevel 1 goto OPEN
echo 检测到旧面板无响应，正在重启...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8702 " ^| findstr /i "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
ping -n 2 127.0.0.1 >nul

:START
set "PYW="
for /f "delims=" %%p in ('where pythonw 2^>nul') do if not defined PYW set "PYW=%%p"
if not defined PYW for /f "delims=" %%i in ('where python 2^>nul') do if not defined PYW for %%I in ("%%i") do if exist "%%~dpIpythonw.exe" set "PYW=%%~dpIpythonw.exe"
if not defined PYW for /f "delims=" %%i in ('py -3 -c "import sys;print(sys.executable)" 2^>nul') do if not defined PYW for %%I in ("%%i") do if exist "%%~dpIpythonw.exe" set "PYW=%%~dpIpythonw.exe"
if not defined PYW for /d %%d in ("%LOCALAPPDATA%\Programs\Python\Python3*") do if exist "%%d\pythonw.exe" if not defined PYW set "PYW=%%d\pythonw.exe"
if not defined PYW for /d %%d in ("%LOCALAPPDATA%\Python\pythoncore-*") do if exist "%%d\pythonw.exe" if not defined PYW set "PYW=%%d\pythonw.exe"
if not defined PYW for /d %%d in ("%LOCALAPPDATA%\Python\bin") do if exist "%%d\pythonw.exe" if not defined PYW set "PYW=%%d\pythonw.exe"
if not defined PYW for /d %%d in ("%ProgramFiles%\Python3*") do if exist "%%d\pythonw.exe" if not defined PYW set "PYW=%%d\pythonw.exe"
if not defined PYW for /d %%d in ("%ProgramFiles%\Python\Python3*") do if exist "%%d\pythonw.exe" if not defined PYW set "PYW=%%d\pythonw.exe"
if not defined PYW for /d %%d in ("%SystemDrive%\Python3*") do if exist "%%d\pythonw.exe" if not defined PYW set "PYW=%%d\pythonw.exe"
if not defined PYW goto NOPY

start "" "%PYW%" "%CLOUD%monitor.py"
echo 正在启动监视面板，初始化约需 10 秒...
echo 面板会自动接管云端守护：未运行则拉起单实例，已运行则直接复用。
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
curl.exe -s -f --max-time 1 -o nul "%URL%health" >nul 2>&1
exit /b %errorlevel%

:HPWS
powershell -NoProfile -Command "try{if((Invoke-WebRequest -UseBasicParsing -Uri '%URL%health' -TimeoutSec 2).StatusCode -eq 200){exit 0}}catch{};exit 1" >nul 2>&1
exit /b %errorlevel%
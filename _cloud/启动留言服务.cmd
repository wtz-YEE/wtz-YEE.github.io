@echo off
chcp 936 >nul
set CLOUD=%~dp0
set PY=
for /f "delims=" %%i in ('where python 2^>nul') do (set PY=%%i & goto :pyf)
:pyf
if not defined PY (
  echo 未找到 Python，请安装并加入 PATH
  pause
  exit /b 1
)
set PYW=%PY:~0,-3%pythonw.exe
if not exist "%PYW%" set PYW=pythonw.exe
start "" /min "%PYW%" "%CLOUD%guestbook_server.py"
echo 留言服务已启动 (端口 8701)
echo 关闭本窗口不会停止服务
timeout /t 4 >nul

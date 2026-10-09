@echo off
chcp 936 >nul
start "" /min "C:\Users\Administrator\AppData\Local\Python\bin\pythonw.exe" "D:\WTZ\prts\_gb\guestbook_server.py"
echo 留言服务已启动 (端口 8701)
echo 关闭本窗口不会停止服务
timeout /t 4 >nul

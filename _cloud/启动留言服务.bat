@echo off
start "" /min pythonw "D:\WTZ\prts\_cloud\guestbook_server.py"
echo guestbook service started (port 8701)
echo close this window will NOT stop the service
timeout /t 4 >nul

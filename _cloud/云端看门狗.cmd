@echo off
chcp 936 >nul
set CLOUD=%~dp0
set HB=
for /f "delims=" %%h in ('type "%CLOUD%guard.heartbeat" 2^>nul') do set HB=%%h
if not defined HB goto start_wd
for /f %%t in ('powershell -NoProfile -Command "[int](Get-Date -UFormat %%s)"') do set T=%%t
set /a D=%T%-%HB%
if %D% lss 150 exit /b 0
:start_wd
start "" "%CLOUD%‘∆∂À ÿª§.cmd" /watchdog
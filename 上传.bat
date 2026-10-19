@echo off
title 一键上传 GitHub
cd /d "%~dp0"
echo ============================================
echo   一键上传 - wtz-YEE.github.io
echo ============================================
echo.
echo [1/3] 提交本地改动 ...
git add -A
git commit -m "auto upload %date% %time%"
echo.
echo [2/3] 同步远端（自动处理冲突）...
git pull --rebase --autostash -X ours origin main
echo.
echo [3/3] 推送 GitHub ...
git -c http.lowSpeedLimit=1 -c http.lowSpeedTime=60 push origin main
echo.
if %errorlevel%==0 (
  echo [OK] 上传成功
) else (
  echo [失败] 推送未完成，请检查网络或代理后重新运行本脚本
)
echo.
pause
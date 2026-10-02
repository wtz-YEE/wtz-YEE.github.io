@echo off
chcp 65001 >nul
cd /d D:\WTZ\prts
echo ========================================
echo   PRTS 自动上传 GitHub
echo ========================================
echo.
echo [1/3] 暂存全部更改 ...
git add -A
echo [2/3] 提交 ...
git commit -m "auto upload %date% %time%"
echo [3/3] 推送到 GitHub ...
git push origin main
echo.
echo [OK] 流程结束，请检查上方输出
echo      若显示 "nothing to commit" 表示无新更改
pause

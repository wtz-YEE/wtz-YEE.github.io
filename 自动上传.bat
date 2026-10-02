@echo off
chcp 936 >nul
cd /d D:\WTZ\prts
echo ========================================
echo   PRTS 自动上传 GitHub
echo ========================================
echo.
echo [1/3] 暂存并提交本地更改 ...
git add -A
git commit -m "auto upload %date% %time%" >nul 2>nul
echo [2/3] 尝试 git push ...
git -c http.version=HTTP/1.1 push origin main >nul 2>nul
if %errorlevel%==0 (
  echo       git push 成功
  goto :done
)
echo       git 通道失败，改用 API 直传 ...
echo [3/3] 全量 API 直传 ...
python _gb\push_all_api.py
if %errorlevel%==0 (
  echo       API 直传完成
) else (
  echo       API 直传失败，请检查网络或令牌
)
:done
echo.
echo [OK] 流程结束，请检查上方输出
echo       Pages 构建约需 1-2 分钟生效
pause

@echo off
chcp 65001 >nul
REM 自动提交相册更新到 Git (Windows 版本)

echo ==========================================
echo 🚀 自动提交相册更新
echo ==========================================
echo.

REM 检查是否有变更
git status --short > nul 2>&1
if errorlevel 1 (
    echo ℹ️  没有文件变更，无需提交
    pause
    exit /b 0
)

echo 📋 变更文件列表：
git status -s
echo.

REM 添加所有变更
echo 📝 添加文件到暂存区...
git add pages/albums/*.md
git add public/albums/*
echo ✅ 文件已添加
echo.

REM 生成提交信息
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%a-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
set COMMIT_MSG=📸 新增相册 %mydate% %mytime%

echo 💬 提交信息: %COMMIT_MSG%
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo ❌ 提交失败
    pause
    exit /b 1
)
echo ✅ 提交成功
echo.

REM 推送到远程
echo 🚀 推送到 GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ 推送失败
    pause
    exit /b 1
)
echo ✅ 推送成功
echo.

echo ==========================================
echo ✅ 完成！云效 Flow 将自动构建并部署
echo ==========================================
echo.
echo 📊 查看构建进度：
echo    https://flow.aliyun.com/pipelines
echo.
pause

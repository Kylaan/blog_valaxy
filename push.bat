@echo off
echo 开始推送...

git add .
git commit -m "自动提交"
git push origin main

echo 推送完成.
pause
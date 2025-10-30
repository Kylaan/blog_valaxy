#!/bin/bash
# 自动提交相册更新到 Git

set -e

echo "=========================================="
echo "🚀 自动提交相册更新"
echo "=========================================="
echo ""

# 检查是否有变更
if [[ -z $(git status -s) ]]; then
    echo "ℹ️  没有文件变更，无需提交"
    exit 0
fi

echo "📋 变更文件列表："
git status -s
echo ""

# 添加所有变更
echo "📝 添加文件到暂存区..."
git add pages/albums/*.md
git add public/albums/*
echo "✅ 文件已添加"
echo ""

# 生成提交信息
COMMIT_MSG="📸 新增相册 $(date '+%Y-%m-%d %H:%M:%S')"
echo "💬 提交信息: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"
echo "✅ 提交成功"
echo ""

# 推送到远程
echo "🚀 推送到 GitHub..."
git push origin main
echo "✅ 推送成功"
echo ""

echo "=========================================="
echo "✅ 完成！云效 Flow 将自动构建并部署"
echo "=========================================="
echo ""
echo "📊 查看构建进度："
echo "   https://flow.aliyun.com/pipelines"
echo ""

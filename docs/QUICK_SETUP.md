# GitHub Actions 自动部署 - 快速配置指南

本指南将帮助你在 5 分钟内配置好 GitHub Actions 自动部署。

## 🎯 部署方案

**基于 Valaxy 官方推荐的 GitHub Actions 工作流**，改进为部署到阿里云服务器：

- ✅ 基于官方 `.github/workflows/gh-pages.yml` 模板
- ✅ 自动构建（每次推送到 main 分支）
- ✅ 自动部署到阿里云服务器
- ✅ 自动备份旧版本
- ✅ 自动重启 Nginx

## 📋 第一步：配置 GitHub Secrets

### 方法 1: 网页界面配置（推荐）

1. 打开你的 GitHub 仓库页面
2. 点击 `Settings` (设置)
3. 在左侧菜单找到 `Secrets and variables` → `Actions`
4. 点击 `New repository secret` 按钮
5. 添加以下 secrets:

| Name | Value | 说明 |
|------|-------|------|
| `SERVER_HOST` | `47.104.216.235` | 服务器 IP |
| `SERVER_USER` | `root` | SSH 用户名 |
| `SERVER_PASSWORD` | `你的SSH密码` | SSH 密码 |
| `SERVER_PORT` | `22` | SSH 端口（可选） |

### 方法 2: 使用 GitHub CLI

如果你安装了 GitHub CLI (`gh`):

```bash
# 安装 GitHub CLI (如果还没有)
# Windows: winget install GitHub.cli
# macOS: brew install gh

# 登录
gh auth login

# 添加 secrets
gh secret set SERVER_HOST -b "47.104.216.235"
gh secret set SERVER_USER -b "root"
gh secret set SERVER_PASSWORD -b "your_password_here"
gh secret set SERVER_PORT -b "22"
```

## 📋 第二步：验证服务器配置

连接到服务器检查：

```bash
# SSH 连接
ssh root@47.104.216.235

# 检查目录
ls -la /www/wwwroot/blog_valaxy/

# 检查 Nginx
nginx -t

# 检查 Nginx 运行状态
systemctl status nginx
```

✅ 确认以下内容：
- 目录 `/www/wwwroot/blog_valaxy/` 存在
- Nginx 配置正确且运行中
- 你有权限写入该目录

## 📋 第三步：首次部署

### 选项 A: 推送代码触发

```bash
# 添加工作流文件（如果还没有）
git add .github/workflows/deploy.yml

# 提交
git commit -m "chore: setup GitHub Actions auto deployment"

# 推送到 main 分支
git push origin main
```

### 选项 B: 手动触发

1. 进入 GitHub 仓库
2. 点击 `Actions` 标签页
3. 在左侧选择 "Deploy to Aliyun Server"
4. 点击右侧 `Run workflow` 按钮
5. 选择 `main` 分支
6. 点击绿色的 `Run workflow` 按钮

## 📋 第四步：监控部署

1. 在 `Actions` 页面查看工作流运行状态
2. 点击运行的工作流查看详细日志
3. 等待所有步骤完成（通常 2-5 分钟）

### 工作流步骤：

```
📦 Checkout code
📦 Setup pnpm
🔧 Setup Node.js
📦 Install dependencies
🌌 Build Valaxy Blog
📊 Check build output
📦 Compress dist
📤 Upload to server
🚀 Deploy to server
🎉 Notification
```

## 📋 第五步：验证部署

访问你的网站：

```
https://kylaan.top
```

✅ 检查：
- 网站能正常访问
- 内容已更新
- 无错误提示

## 🎉 完成！

现在，每次你推送代码到 `main` 分支时，GitHub Actions 会自动：

1. ✅ 拉取最新代码
2. ✅ 安装依赖
3. ✅ 构建网站
4. ✅ 上传到服务器
5. ✅ 备份旧版本
6. ✅ 部署新版本
7. ✅ 重启 Nginx

---

## 🔧 日常使用

### 发布新文章

```bash
# 编写文章
# 在 pages/posts/ 目录创建新的 .md 文件

# 提交并推送
git add pages/posts/my-new-post.md
git commit -m "feat: add new post"
git push origin main

# GitHub Actions 自动部署，约 2-5 分钟后生效
```

### 上传相册

```bash
# 访问相册管理系统
http://47.104.216.235:3000

# 上传照片，系统会自动：
# 1. 保存照片
# 2. 生成 Markdown
# 3. 触发构建
# 4. 提交到 GitHub
# 5. GitHub Actions 自动部署
```

---

## 🔍 故障排查

### 问题：Actions 构建失败

```bash
# 本地测试构建
pnpm install
pnpm run build

# 如果本地构建成功，检查 Actions 日志
# GitHub → Actions → 点击失败的运行 → 查看日志
```

### 问题：无法连接到服务器

```bash
# 验证 Secrets 配置
# GitHub → Settings → Secrets → Actions
# 确认所有 secrets 都已配置

# 测试 SSH 连接
ssh root@47.104.216.235
```

### 问题：部署后网站未更新

```bash
# SSH 到服务器
ssh root@47.104.216.235

# 检查部署目录
ls -la /www/wwwroot/blog_valaxy/dist/

# 检查 Nginx
nginx -t
systemctl status nginx

# 手动重启 Nginx
nginx -s reload
```

### 问题：需要回滚

```bash
# SSH 到服务器
ssh root@47.104.216.235
cd /www/wwwroot/blog_valaxy

# 恢复备份
rm -rf dist
mv dist.backup dist

# 重启 Nginx
nginx -s reload
```

---

## 🔐 安全建议

### 使用 SSH 密钥代替密码（可选但推荐）

1. **生成 SSH 密钥**

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy"
# 保存在 ~/.ssh/github_actions
```

2. **上传公钥到服务器**

```bash
# 查看公钥
cat ~/.ssh/github_actions.pub

# SSH 到服务器
ssh root@47.104.216.235

# 添加公钥
mkdir -p ~/.ssh
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

3. **更新 GitHub Secret**

- 删除 `SERVER_PASSWORD`
- 添加 `SERVER_SSH_KEY`（内容为私钥 `~/.ssh/github_actions` 的完整内容）

4. **修改工作流**

将 `password:` 改为 `key:`，参考 [GITHUB_ACTIONS_DEPLOYMENT.md](./GITHUB_ACTIONS_DEPLOYMENT.md)

---

## 📚 更多信息

- **完整文档**: [GITHUB_ACTIONS_DEPLOYMENT.md](./GITHUB_ACTIONS_DEPLOYMENT.md)
- **配置清单**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Valaxy 官方文档**: https://valaxy.site/guide/deploy
- **GitHub Actions 文档**: https://docs.github.com/en/actions

---

## 🆘 需要帮助？

如果遇到问题：
1. 查看 Actions 运行日志
2. 参考本指南的故障排查部分
3. 查看完整文档 [GITHUB_ACTIONS_DEPLOYMENT.md](./GITHUB_ACTIONS_DEPLOYMENT.md)

---

最后更新: 2025-10-30

# GitHub Actions 自动部署指南

本文档说明如何使用 GitHub Actions 自动构建并部署 Valaxy 博客到阿里云服务器。

## 📋 部署流程概览

当你推送代码到 `main` 分支时，GitHub Actions 会自动：

1. ✅ 检出代码
2. ✅ 安装 pnpm 和 Node.js (LTS 版本)
3. ✅ 安装项目依赖
4. ✅ 构建静态网站 (SSG)
5. ✅ 压缩构建产物
6. ✅ 上传到服务器
7. ✅ 自动部署并重启 Nginx

## 🔧 配置步骤

### 1. 配置 GitHub Secrets

在 GitHub 仓库页面，进入 `Settings` → `Secrets and variables` → `Actions`，点击 `New repository secret` 添加以下密钥：

#### 必需的 Secrets:

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `SERVER_HOST` | 服务器 IP 地址或域名 | `47.104.216.235` |
| `SERVER_USER` | SSH 登录用户名 | `root` |
| `SERVER_PASSWORD` | SSH 登录密码 | `your_password` |

#### 可选的 Secrets:

| Secret 名称 | 说明 | 默认值 |
|------------|------|--------|
| `SERVER_PORT` | SSH 端口 | `22` |

### 2. 验证服务器配置

确保服务器已正确配置：

```bash
# SSH 连接到服务器
ssh root@47.104.216.235

# 检查目录是否存在
ls -la /www/wwwroot/blog_valaxy/

# 检查 Nginx 配置
nginx -t

# 检查权限
ls -la /www/wwwroot/blog_valaxy/dist/
```

### 3. 测试部署

#### 方式 1: 推送代码触发
```bash
git add .
git commit -m "test: trigger GitHub Actions deployment"
git push origin main
```

#### 方式 2: 手动触发
1. 进入 GitHub 仓库
2. 点击 `Actions` 选项卡
3. 选择 `Deploy to Aliyun Server` 工作流
4. 点击 `Run workflow` → `Run workflow`

### 4. 监控部署过程

1. 进入 GitHub `Actions` 页面
2. 查看最新的工作流运行
3. 点击查看详细日志

## 📊 工作流详情

### 构建阶段
- **环境**: Ubuntu Latest
- **Node.js**: LTS (最新长期支持版本)
- **包管理器**: pnpm 8
- **构建命令**: `pnpm run build`
- **内存限制**: 4GB (通过 `NODE_OPTIONS` 设置)

### 部署阶段
- **传输方式**: SCP (压缩后传输)
- **目标目录**: `/www/wwwroot/blog_valaxy/`
- **备份策略**: 自动备份旧版本到 `dist.backup`
- **权限设置**: `www:www` (用户:组), `755` (权限)
- **服务重启**: 自动重启 Nginx

## 🔍 故障排查

### 问题 1: Actions 构建失败

**可能原因**:
- 依赖安装失败
- 构建过程出错
- 内存不足

**解决方案**:
```bash
# 本地测试构建
pnpm install
pnpm run build

# 检查构建日志
# 查看 Actions 页面的详细日志
```

### 问题 2: 上传到服务器失败

**可能原因**:
- SSH 连接失败
- 密码错误
- 端口不正确

**解决方案**:
1. 验证 Secrets 配置是否正确
2. 本地测试 SSH 连接:
```bash
ssh root@47.104.216.235
# 输入密码，确认可以登录
```

### 问题 3: 部署脚本执行失败

**可能原因**:
- 目录权限问题
- Nginx 配置错误
- 磁盘空间不足

**解决方案**:
```bash
# SSH 到服务器
ssh root@47.104.216.235

# 检查磁盘空间
df -h

# 检查目录权限
ls -la /www/wwwroot/blog_valaxy/

# 检查 Nginx
nginx -t

# 手动测试部署脚本
cd /www/wwwroot/blog_valaxy
tar -xzf /tmp/dist.tar.gz
chown -R www:www dist
chmod -R 755 dist
nginx -s reload
```

## 🔐 安全建议

### 使用 SSH 密钥代替密码 (推荐)

1. **生成 SSH 密钥对** (在本地):
```bash
ssh-keygen -t ed25519 -C "github-actions"
# 保存到 ~/.ssh/github_actions_ed25519
```

2. **上传公钥到服务器**:
```bash
# 复制公钥内容
cat ~/.ssh/github_actions_ed25519.pub

# SSH 到服务器
ssh root@47.104.216.235

# 添加到 authorized_keys
echo "your_public_key_content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

3. **修改 GitHub Actions 工作流**:

将工作流中的密码认证改为密钥认证:

```yaml
- name: 📤 Upload to server
  uses: appleboy/scp-action@v0.1.7
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SERVER_SSH_KEY }}  # 使用密钥代替 password
    port: ${{ secrets.SERVER_PORT || 22 }}
    source: "dist.tar.gz"
    target: "/tmp/"
```

4. **添加私钥到 GitHub Secrets**:
- Secret 名称: `SERVER_SSH_KEY`
- 值: 复制 `~/.ssh/github_actions_ed25519` 的完整内容

## 📈 性能优化

### 1. 启用构建缓存

工作流已配置 pnpm 缓存:
```yaml
- name: 🔧 Setup Node.js
  uses: actions/setup-node@v4
  with:
    cache: 'pnpm'  # 自动缓存依赖
```

### 2. 增量上传 (可选)

如果构建产物较大，可以考虑使用 rsync 进行增量传输:

```yaml
- name: 🚀 Deploy via rsync
  uses: burnett01/rsync-deployments@6.0.0
  with:
    switches: -avzr --delete
    path: dist/
    remote_path: /www/wwwroot/blog_valaxy/dist/
    remote_host: ${{ secrets.SERVER_HOST }}
    remote_user: ${{ secrets.SERVER_USER }}
    remote_key: ${{ secrets.SERVER_SSH_KEY }}
```

### 3. 并行构建

对于大型项目，可以启用并行构建:
```yaml
env:
  NODE_OPTIONS: --max-old-space-size=4096
  VITE_BUILD_PARALLEL: true
```

## 🎯 最佳实践

### 1. 使用 staging 环境

建议添加一个测试分支的部署流程:

```yaml
on:
  push:
    branches:
      - main      # 生产环境
      - staging   # 测试环境
```

### 2. 添加通知

可以添加部署成功/失败的通知（如邮件、Webhook）:

```yaml
- name: 📧 Send notification
  if: always()
  uses: some-notification-action@v1
  with:
    status: ${{ job.status }}
```

### 3. 版本管理

在部署时记录版本信息:

```yaml
- name: 📝 Write version info
  run: |
    echo "BUILD_TIME=$(date)" >> dist/version.txt
    echo "COMMIT_SHA=${{ github.sha }}" >> dist/version.txt
```

## 📚 相关文档

- [Valaxy 官方部署文档](https://valaxy.site/guide/deploy)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [appleboy/scp-action](https://github.com/appleboy/scp-action)
- [appleboy/ssh-action](https://github.com/appleboy/ssh-action)

## 🆘 获取帮助

如遇到问题:
1. 查看 Actions 运行日志
2. 检查服务器日志: `journalctl -u nginx`
3. 参考本文档的故障排查部分
4. 查看 [Valaxy 官方文档](https://valaxy.site/)

---

最后更新: 2025-10-30

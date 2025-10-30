# GitHub Actions 部署配置检查清单

## ✅ 部署前检查

使用此清单确保 GitHub Actions 自动部署正确配置。

### 1. GitHub Secrets 配置

进入 GitHub 仓库 → `Settings` → `Secrets and variables` → `Actions`

- [ ] `SERVER_HOST` = `47.104.216.235`
- [ ] `SERVER_USER` = `root` (或其他用户)
- [ ] `SERVER_PASSWORD` = `你的SSH密码`
- [ ] `SERVER_PORT` = `22` (可选，默认22)

### 2. 服务器准备

SSH 连接到服务器验证：

```bash
ssh root@47.104.216.235
```

- [ ] 目录存在: `/www/wwwroot/blog_valaxy/`
- [ ] 权限正确: `chown -R www:www /www/wwwroot/blog_valaxy/`
- [ ] Nginx 运行中: `systemctl status nginx`
- [ ] Nginx 配置正确: `nginx -t`

### 3. 本地测试

在推送前本地验证：

```bash
# 安装依赖
pnpm install

# 构建测试
pnpm run build

# 检查构建产物
ls -la dist/
```

- [ ] 构建成功无错误
- [ ] dist 目录包含完整文件
- [ ] dist/index.html 存在

### 4. GitHub Actions 权限

进入 GitHub 仓库 → `Settings` → `Actions` → `General`

- [ ] Workflow permissions 设置为 "Read and write permissions"
- [ ] "Allow GitHub Actions to create and approve pull requests" 已勾选

### 5. 工作流文件

检查 `.github/workflows/deploy.yml` 文件：

- [ ] 文件存在
- [ ] 分支配置正确 (main)
- [ ] 构建命令正确 (`pnpm run build`)
- [ ] 服务器路径正确 (`/www/wwwroot/blog_valaxy/`)

### 6. 首次部署

1. 推送代码触发部署：

```bash
git add .
git commit -m "chore: setup GitHub Actions deployment"
git push origin main
```

2. 监控部署：

- [ ] 进入 GitHub `Actions` 页面
- [ ] 查看工作流运行状态
- [ ] 等待所有步骤完成（约 2-5 分钟）

3. 验证部署：

- [ ] 访问 https://kylaan.top
- [ ] 网站正常显示
- [ ] 新内容已更新

### 7. 后续部署

每次推送到 main 分支时自动触发：

```bash
# 编辑内容
git add .
git commit -m "feat: add new post"
git push origin main

# 自动部署，无需手动操作
```

或手动触发：

- [ ] GitHub 仓库 → `Actions`
- [ ] 选择 "Deploy to Aliyun Server"
- [ ] `Run workflow` → `Run workflow`

## 🔍 故障排查

### 如果部署失败

1. **查看 Actions 日志**
   - GitHub → Actions → 点击失败的运行
   - 查看具体哪一步失败

2. **常见问题**

   - ❌ **构建失败**: 检查 `pnpm run build` 本地是否能成功
   - ❌ **连接失败**: 验证 Secrets 配置，测试 SSH 连接
   - ❌ **权限错误**: 检查服务器目录权限
   - ❌ **Nginx 错误**: 运行 `nginx -t` 检查配置

3. **回滚**

   如果新部署有问题，服务器上有备份：

   ```bash
   ssh root@47.104.216.235
   cd /www/wwwroot/blog_valaxy
   rm -rf dist
   mv dist.backup dist
   nginx -s reload
   ```

## 📞 获取帮助

- 查看完整文档: [GITHUB_ACTIONS_DEPLOYMENT.md](./GITHUB_ACTIONS_DEPLOYMENT.md)
- GitHub Actions 文档: https://docs.github.com/en/actions
- Valaxy 部署文档: https://valaxy.site/guide/deploy

---

最后更新: 2025-10-30

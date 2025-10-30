# 阿里云云效 Flow 部署指南

## 🎯 目标
使用阿里云云效 Flow 实现：
- Git 推送自动触发构建
- 云端构建 Valaxy 博客
- 自动部署到阿里云服务器

---

## 📝 步骤 1：创建云效 Flow 流水线

### 1.1 访问云效控制台
访问：https://flow.aliyun.com/

### 1.2 创建新流水线
1. 点击【新建流水线】
2. 选择【空白流水线】
3. 流水线名称：`blog-valaxy-deploy`

### 1.3 配置代码源
1. 点击【代码源】
2. 选择 **GitHub**（或 Gitee）
3. 授权并选择仓库：`Kylaan/blog_valaxy`
4. 选择分支：`main`
5. 触发方式：**代码推送时触发**

---

## 📝 步骤 2：配置构建环境

### 2.1 添加构建阶段
1. 点击【+ 添加阶段】
2. 阶段名称：`构建阶段`

### 2.2 添加构建任务
点击【+ 添加任务】，选择【主机构建】：

```yaml
# 构建脚本
#!/bin/bash
set -e

echo "=== 1. 安装 pnpm ==="
npm install -g pnpm

echo "=== 2. 安装依赖 ==="
pnpm install

echo "=== 3. 构建网站 ==="
pnpm build:ssg

echo "=== 4. 打包产物 ==="
# 打包 dist 目录和部署脚本 appctl.sh
tar -czf dist.tar.gz dist app-configs/

echo "✅ 构建完成！"
```

**环境配置**：
- Node 版本：`20`
- 构建规格：`2C4G`（免费额度）

**⚠️ 重要**：在构建物上传步骤中，需要添加打包路径：
- 打包路径 1：`dist/`
- 打包路径 2：`app-configs/bin/appctl.sh`

这样可以确保部署脚本也被打包进去。

### 2.3 配置产物
1. 点击【产物设置】
2. 产物路径：`dist.tar.gz`
3. 产物名称：`blog-dist`

---

## 📝 步骤 3：配置部署阶段

### 3.1 添加部署阶段
1. 点击【+ 添加阶段】
2. 阶段名称：`部署阶段`

### 3.2 配置主机组
1. 点击【部署】→【主机部署】
2. 点击【新建主机组】
3. 主机组名称：`阿里云服务器`
4. 添加主机：
   - 主机名称：`blog-server`
   - IP 地址：`47.104.216.235`
   - 连接方式：`SSH`
   - 用户名：`root`
   - 认证方式：`密码` 或 `SSH 密钥`
   - 密码/密钥：输入你的服务器密码或上传 SSH 密钥

### 3.3 添加部署脚本
选择主机组后，配置部署脚本：

```bash
#!/bin/bash
set -e

echo "=== 1. 下载构建产物 ==="
# 云效会自动下载产物到 /home/admin/app/dist.tar.gz

echo "=== 2. 进入应用目录 ==="
cd /www/wwwroot/blog_valaxy

echo "=== 3. 解压构建产物 ==="
# 解压包含 dist 和 app-configs 目录
tar -xzf /home/admin/app/dist.tar.gz

echo "=== 4. 设置权限 ==="
chown -R www:www dist app-configs
chmod -R 755 dist
chmod +x app-configs/bin/appctl.sh

echo "=== 5. 使用 appctl.sh 重启应用 ==="
# appctl.sh 会自动备份、测试配置、重新加载 Nginx
./app-configs/bin/appctl.sh restart

echo "=== 6. 清理临时文件 ==="
rm -f /home/admin/app/dist.tar.gz

echo "✅ 部署完成！"
echo "🌐 访问: https://kylaan.top"
echo "📊 查看状态: ./app-configs/bin/appctl.sh status"
```

**关于 appctl.sh**：
- 这是应用管理脚本，提供启动、停止、重启、回滚等功能
- 位置：`app-configs/bin/appctl.sh`
- 详细说明：参考 [app-configs/README.md](../app-configs/README.md)

---

## 📝 步骤 4：配置通知（可选）

### 4.1 添加钉钉通知
1. 点击【通知设置】
2. 选择【钉钉】
3. 配置 Webhook
4. 通知时机：
   - ✅ 构建成功
   - ✅ 构建失败
   - ✅ 部署成功
   - ✅ 部署失败

---

## 📝 步骤 5：保存并测试

### 5.1 保存流水线
点击【保存】按钮

### 5.2 手动触发测试
1. 点击【运行】按钮
2. 查看构建日志
3. 确认部署成功

### 5.3 提交代码测试
```bash
# 本地修改代码
git add .
git commit -m "test: 测试云效自动部署"
git push origin main

# 云效会自动触发构建和部署
```

---

## 🎯 完整工作流程

```
上传照片到服务器
    ↓
生成 Markdown 文件
    ↓
Git 提交并推送
    ↓
触发云效 Flow
    ↓
云端构建 (pnpm build:ssg)
    ↓
打包产物 (dist.tar.gz)
    ↓
自动部署到服务器
    ↓
Nginx 重新加载
    ↓
✅ 网站更新完成
```

---

## 🔐 安全建议

1. **使用 SSH 密钥代替密码**
   - 在云效主机配置中上传 SSH 公钥
   - 更安全，不会暴露密码

2. **配置 IP 白名单**
   - 在服务器上只允许云效 IP 访问

3. **定期更新密钥**
   - 定期轮换服务器密码或 SSH 密钥

---

## ⚡ 优化建议

### 构建缓存
在构建脚本中添加缓存：

```bash
# 使用 pnpm 缓存
pnpm config set store-dir .pnpm-store
pnpm install --frozen-lockfile
```

### 增量部署
只部署变化的文件：

```bash
# 使用 rsync 增量同步
rsync -avz --delete dist/ /www/wwwroot/blog_valaxy/dist/
```

---

## 🐛 常见问题

### Q1: 构建失败，提示内存不足
**解决**：升级构建规格到 4C8G

### Q2: 部署失败，SSH 连接超时
**解决**：
1. 检查服务器防火墙设置
2. 确认云效 IP 在白名单中
3. 检查 SSH 端口是否为 22

### Q3: Nginx 重载失败
**解决**：
1. 检查 Nginx 配置是否正确：`nginx -t`
2. 查看 Nginx 日志：`tail -f /var/log/nginx/error.log`

---

## 📚 相关文档

- [云效 Flow 官方文档](https://help.aliyun.com/product/153674.html)
- [主机部署指南](https://help.aliyun.com/document_detail/432768.html)
- [流水线配置示例](https://help.aliyun.com/document_detail/432769.html)

---

## ✅ 验证清单

- [ ] 云效流水线创建成功
- [ ] 代码源配置正确
- [ ] 构建脚本运行成功
- [ ] 主机组配置完成
- [ ] 部署脚本测试通过
- [ ] 手动触发构建成功
- [ ] Git 推送自动触发成功
- [ ] 网站正常访问

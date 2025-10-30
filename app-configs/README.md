# appctl.sh 部署脚本说明

## 📝 文件位置

```
app-configs/bin/appctl.sh
```

## 🎯 用途

这个脚本用于云效 Flow 自动部署时管理 Valaxy 博客应用的生命周期。

## 🔧 功能

### 1. **start** - 启动应用
- 检查 dist 目录是否存在
- 测试 Nginx 配置
- 重新加载 Nginx

### 2. **stop** - 停止应用
- 备份当前版本到 `dist.backup`

### 3. **restart** - 重启应用
- 执行 stop + start

### 4. **status** - 查看状态
- 检查 dist 目录
- 统计文件数量
- 查看 Nginx 状态
- 显示最近更新时间

### 5. **health** - 健康检查
- 本地访问测试（HTTP 200）

### 6. **clean** - 清理
- 删除 7 天前的备份
- 清理日志文件

### 7. **rollback** - 回滚
- 恢复到上一个备份版本

## 📋 使用方法

### 在云效 Flow 中使用

云效部署脚本会自动调用：

```bash
./app-configs/bin/appctl.sh restart
```

### 手动使用

在服务器上手动执行：

```bash
# 进入项目目录
cd /www/wwwroot/blog_valaxy

# 重启应用
./app-configs/bin/appctl.sh restart

# 查看状态
./app-configs/bin/appctl.sh status

# 健康检查
./app-configs/bin/appctl.sh health

# 回滚到上一个版本
./app-configs/bin/appctl.sh rollback
```

## 📂 相关文件

- **日志文件**: `/www/wwwroot/blog_valaxy/deploy.log`
- **备份目录**: `/www/wwwroot/blog_valaxy/dist.backup`
- **应用目录**: `/www/wwwroot/blog_valaxy/dist`

## 🔄 部署流程

```
1. 云效构建 dist.tar.gz（包含 dist/ 和 app-configs/）
   ↓
2. 上传到服务器 /tmp/dist.tar.gz
   ↓
3. 解压到 /www/wwwroot/blog_valaxy/
   ↓
4. 设置权限（www:www, 755）
   ↓
5. 执行 appctl.sh restart
   ├─ 备份当前版本
   ├─ 测试 Nginx 配置
   └─ 重新加载 Nginx
   ↓
6. 清理临时文件
   ↓
7. ✅ 部署完成
```

## ⚙️ 配置变量

在 `appctl.sh` 中可以修改这些变量：

```bash
APP_NAME="valaxy-blog"           # 应用名称
APP_DIR="/www/wwwroot/blog_valaxy"  # 应用目录
DIST_DIR="$APP_DIR/dist"         # 静态文件目录
LOG_FILE="$APP_DIR/deploy.log"   # 日志文件
```

## 🐛 故障排查

### 部署失败

1. 查看部署日志：
   ```bash
   tail -f /www/wwwroot/blog_valaxy/deploy.log
   ```

2. 检查 Nginx 配置：
   ```bash
   nginx -t
   ```

3. 手动回滚：
   ```bash
   ./app-configs/bin/appctl.sh rollback
   ```

### 权限问题

```bash
# 修复权限
chown -R www:www /www/wwwroot/blog_valaxy/dist
chmod +x /www/wwwroot/blog_valaxy/app-configs/bin/appctl.sh
```

## 📊 日志示例

```
[2025-10-30 20:00:00] 🔄 重启应用: valaxy-blog
[2025-10-30 20:00:01] ⏸️  停止应用: valaxy-blog
[2025-10-30 20:00:02] 📦 备份当前版本...
[2025-10-30 20:00:03] ✅ 备份完成: /www/wwwroot/blog_valaxy/dist.backup
[2025-10-30 20:00:04] 🚀 启动应用: valaxy-blog
[2025-10-30 20:00:05] 🔍 测试 Nginx 配置...
[2025-10-30 20:00:06] 🔄 重新加载 Nginx...
[2025-10-30 20:00:07] ✅ 应用启动成功
```

## 🔐 安全建议

1. **限制执行权限**：只允许 root 或特定用户执行
2. **日志轮转**：定期清理日志文件（已内置）
3. **备份保留**：自动删除 7 天前的备份（已内置）

## 📚 参考

- [云效 Flow 官方文档](https://help.aliyun.com/zh/yunxiao/use-cases/node-js-application-build-and-deploy-ecs)
- [主机部署指南](https://help.aliyun.com/document_detail/153846.html)

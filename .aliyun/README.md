# 阿里云云效 Flow 部署指南

## 🚀 快速开始

### 1. 开通云效服务
访问 https://flow.aliyun.com/ 并登录阿里云账号

### 2. 创建 Flow 流水线

#### 方式一：导入配置文件（推荐）
1. 点击「新建流水线」
2. 选择「导入配置」
3. 上传 `.aliyun/flow.yaml`

#### 方式二：手动配置
1. **代码源**
   - 类型：GitHub
   - 仓库：Kylaan/blog_valaxy
   - 分支：main

2. **触发规则**
   - 触发方式：代码提交触发
   - 分支：main

3. **构建**
   - 环境：Node.js 20
   - 命令：
     ```bash
     npm install -g pnpm@8
     pnpm install
     NODE_OPTIONS="--max-old-space-size=4096" pnpm build:ssg
     tar -czf dist.tar.gz dist
     ```

4. **部署**
   - 主机类型：ECS/自有主机
   - 主机地址：47.104.216.235
   - 用户名：root
   - 认证方式：密码/密钥
   - 部署脚本：
     ```bash
     cd /www/wwwroot/blog_valaxy
     rm -rf dist.backup
     mv dist dist.backup 2>/dev/null || true
     tar -xzf /tmp/dist.tar.gz
     chown -R www:www dist
     chmod -R 755 dist
     rm /tmp/dist.tar.gz
     nginx -s reload
     ```

### 3. 配置密钥

在流水线设置中添加以下变量：
- `SERVER_HOST`: 47.104.216.235
- `SERVER_USER`: root
- `SERVER_PASSWORD`: 你的服务器密码（加密存储）

### 4. 测试部署

```bash
git add .
git commit -m "test: 测试云效自动部署"
git push origin main
```

### 5. 查看构建日志

在云效控制台查看构建进度和日志

---

## 📊 工作流程

```
GitHub Push
    ↓
云效检测到提交
    ↓
拉取代码
    ↓
安装依赖 (pnpm install)
    ↓
构建网站 (pnpm build:ssg)
    ↓
打包产物 (tar -czf dist.tar.gz)
    ↓
上传到服务器 (/tmp/)
    ↓
解压并替换 (/www/wwwroot/blog_valaxy/dist)
    ↓
重载 Nginx
    ↓
部署完成 ✅
```

---

## ✅ 优势

- ✅ 云效服务器在国内，构建速度快（约 2-3 分钟）
- ✅ 内存充足，不会 OOM
- ✅ 直接部署到阿里云 ECS，传输速度快
- ✅ 可视化界面，操作简单
- ✅ 支持钉钉通知
- ✅ 免费额度足够使用

---

## 🔧 故障排查

### 构建失败
- 检查 Node.js 版本是否为 20
- 检查依赖安装是否成功

### 部署失败
- 检查服务器密码是否正确
- 检查服务器 SSH 端口是否开放（22）
- 检查 `/www/wwwroot/blog_valaxy/` 目录权限

### Nginx 未重载
- 手动登录服务器执行 `nginx -s reload`
- 检查 Nginx 配置是否正确

---

## 📞 相关链接

- 云效官网: https://flow.aliyun.com/
- 云效文档: https://help.aliyun.com/zh/yunxiao/
- 阿里云 ECS: https://ecs.console.aliyun.com/

# 🚀 快速开始 - 相册管理系统

## ⚡ 3分钟配置

### 1️⃣ 生成 GitHub Token

```bash
# 访问
https://github.com/settings/tokens

# 点击: Generate new token (classic)
# 权限: 勾选 repo
# 复制生成的 token
```

### 2️⃣ 配置本地环境

```bash
# 复制配置文件
cp .env.example .env

# 编辑 .env 文件
VITE_GITHUB_TOKEN=ghp_你的token

# 重启开发服务器
pnpm dev
```

### 3️⃣ 开始使用

```bash
# 访问
http://localhost:4859/albums

# 输入密码 (默认: 0921)
# 点击 "创建相册" 按钮
# 上传图片并提交
```

---

## 📝 详细文档

查看完整使用指南: [`ALBUM_ADMIN_GUIDE.md`](./ALBUM_ADMIN_GUIDE.md)

---

## 🎯 核心优势

✅ **无需后端** - 纯前端方案,零维护成本  
✅ **自动部署** - 提交即部署,约 5-7 分钟生效  
✅ **原生样式** - 完美继承主题样式  
✅ **简单易用** - 3 分钟完成配置  

---

## 🔐 安全提醒

⚠️ **不要将 `.env` 文件提交到 Git**  
⚠️ **Token 拥有仓库完整权限,请妥善保管**  
✅ `.env` 已添加到 `.gitignore`

---

## 📊 架构对比

| 特性 | 旧系统 | 新系统 |
|------|--------|--------|
| 后端服务 | ✅ Node.js + Express | ❌ 无需后端 |
| 服务器负载 | 占用端口 3000 | 零负载 |
| 部署方式 | PM2 守护进程 | GitHub Actions |
| 维护成本 | 需要管理进程 | 零维护 |

---

开始创建你的第一个相册! 🎉

# 📸 Valaxy 博客 - 相册自动部署系统

基于 Valaxy 框架的个人博客，集成相册管理和阿里云云效 Flow 自动部署。

---

## ✨ 特性

- 📸 **Web 相册管理** - 浏览器上传照片，自动生成相册页面
- 🚀 **自动部署** - Git 推送触发云效 Flow 自动构建部署
- 🎨 **精美主题** - 使用 valaxy-theme-yun 主题
- 🔐 **密码保护** - 支持为相册设置访问密码
- 📱 **响应式设计** - 完美适配移动端和桌面端

---

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| [部署方案总结](docs/DEPLOYMENT_SUMMARY.md) | 📋 整体方案介绍，从这里开始 |
| [云效 Flow 配置指南](docs/ALIYUN_FLOW_GUIDE.md) | 📖 详细的云效配置步骤 |
| [快速开始](docs/QUICK_START.md) | ⚡ 日常使用指南 |

---

## 🚀 快速开始

### 1. 上传相册

访问相册管理后台：
```
http://47.104.216.235:3000
密码: yourpass
```

### 2. 提交到 Git

**Windows:**
```bash
.\scripts\auto-commit.bat
```

**Linux/Mac:**
```bash
./scripts/auto-commit.sh
```

### 3. 自动部署

- 云效 Flow 自动触发构建
- 2-3 分钟后自动部署到服务器
- 访问 https://kylaan.top/albums/ 查看

---

## 📁 项目结构

```
blog_valaxy/
├── docs/                       # 📚 文档目录
│   ├── DEPLOYMENT_SUMMARY.md   # 部署方案总结
│   ├── ALIYUN_FLOW_GUIDE.md    # 云效配置指南
│   └── QUICK_START.md          # 快速开始指南
├── scripts/                    # 🔧 工具脚本
│   ├── auto-commit.bat         # Windows 自动提交
│   └── auto-commit.sh          # Linux/Mac 自动提交
├── album-admin/                # 📸 相册管理后端
│   ├── server.js               # Express 服务器
│   ├── public/                 # 上传界面
│   └── .env                    # 配置文件
├── pages/                      # 📝 页面源文件
│   ├── posts/                  # 博客文章
│   └── albums/                 # 相册 Markdown
├── public/                     # 📦 静态资源
│   └── albums/                 # 相册图片
├── components/                 # 🧩 自定义组件
├── layouts/                    # 🎨 自定义布局
│   └── albums.vue              # 相册日历布局
├── .flow.yml                   # ☁️ 云效配置文件
├── site.config.ts              # ⚙️ 网站配置
└── valaxy.config.ts            # ⚙️ Valaxy 配置
```

---

## 🔧 本地开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
# 启动博客开发服务器
pnpm dev

# 启动相册管理后台（新终端）
cd album-admin
node server.js
```

### 构建网站

```bash
pnpm build:ssg
```

---

## 🌐 部署架构

```
┌─────────────┐      Git Push      ┌──────────────┐
│   本地电脑   │  ───────────────>  │ 阿里云云效    │
│ 上传相册照片  │                    │  Flow 构建    │
└─────────────┘                    └──────────────┘
                                           │
                                           │ 自动部署
                                           ▼
                                   ┌──────────────┐
                                   │  阿里云服务器  │
                                   │    Nginx      │
                                   │ 47.104.216.235│
                                   └──────────────┘
                                           │
                                           ▼
                                   https://kylaan.top
```

---

## 📊 工作流程

```mermaid
graph LR
    A[上传照片] --> B[生成 Markdown]
    B --> C[Git 提交]
    C --> D[云效构建]
    D --> E[自动部署]
    E --> F[网站更新]
```

---

## 🔐 环境配置

### album-admin/.env

```env
PORT=3000
HOST=0.0.0.0
ADMIN_PASSWORD=yourpass
```

### 云效 Flow 密钥

在云效控制台配置：
- `SERVER_HOST`: 47.104.216.235
- `SERVER_USER`: root
- `SERVER_PASSWORD`: 服务器密码

---

## 📝 相册格式

相册 Markdown 示例 (`pages/albums/2025-10-30.md`)：

```yaml
---
title: 美好的一天
date: 2025-10-30
layout: gallery
password: 可选密码
photos:
  - caption: 照片 1
    src: /albums/2025-10-30/photo1.jpg
    desc: 照片描述
  - caption: 照片 2
    src: /albums/2025-10-30/photo2.jpg
    desc: 照片描述
---

这是相册描述内容。
```

---

## 🐛 故障排查

### 上传失败

- 检查 album-admin 服务是否运行
- 检查端口 3000 是否被占用
- 查看服务器日志

### 构建失败

- 访问云效控制台查看构建日志
- 检查依赖是否安装成功
- 检查 Node 版本是否正确

### 部署失败

- 检查服务器 SSH 连接
- 检查磁盘空间
- 检查 Nginx 配置

详细故障排查指南：[QUICK_START.md](docs/QUICK_START.md#常见问题)

---

## 🛠️ 技术栈

- **框架**: [Valaxy](https://valaxy.site/) - Vue 3 + Vite
- **主题**: [valaxy-theme-yun](https://yun.valaxy.site/)
- **后端**: Express + Multer
- **CI/CD**: 阿里云云效 Flow
- **服务器**: Nginx + 阿里云 ECS

---

## 📦 依赖包

主要依赖：
- `valaxy` - 静态站点生成器
- `valaxy-theme-yun` - 主题
- `express` - Web 服务器
- `multer` - 文件上传
- `cors` - 跨域支持

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 👤 作者

**Kylaan**

- 网站: https://kylaan.top
- GitHub: [@Kylaan](https://github.com/Kylaan)

---

## 🙏 致谢

- 感谢 [Valaxy](https://valaxy.site/) 提供优秀的框架
- 感谢阿里云云效 Flow 提供免费的 CI/CD 服务
- 感谢前辈提供的云效部署方案建议

---

**开始使用：** 查看 [快速开始指南](docs/QUICK_START.md)

# Kylaan's Blog

[![Valaxy](https://img.shields.io/badge/Valaxy-0.26.3-blue)](https://valaxy.site)
[![Deploy](https://img.shields.io/badge/deploy-Aliyun-orange)](https://kylaan.top)
[![Status](https://img.shields.io/badge/status-online-success)](https://kylaan.top)

个人博客，使用 [Valaxy](https://valaxy.site) 构建，部署在阿里云。

🌐 **网站**: [Kylaan.top](https://Kylaan.top)

---

## 📚 文档导航

- **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** - 📖 完整项目上下文（新对话必读！）
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - ⚡ 快速参考手册
- **[docs/ALIYUN_FLOW_GUIDE.md](./docs/ALIYUN_FLOW_GUIDE.md)** - 🚀 阿里云云效部署指南
- **[docs/DEPLOYMENT_SUMMARY.md](./docs/DEPLOYMENT_SUMMARY.md)** - 📝 部署总结
- **[docs/QUICK_START.md](./docs/QUICK_START.md)** - 🎯 快速开始

---

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 启动相册管理系统
cd album-admin
node server.js

# 构建生产版本
pnpm build:ssg
```

---

## ✨ 特性

- ✅ 基于 Valaxy 的现代博客框架
- ✅ 自定义相册管理系统（照片上传 + 自动构建）
- ✅ 交互式相册日历布局
- ✅ 阿里云云效自动化部署
- ✅ Waline 评论系统
- ✅ LightGallery 图片画廊
- ✅ 响应式设计

---

## 📸 相册管理

访问 `http://47.104.216.235:3000` 上传照片，系统将自动：
1. 保存图片到 `public/albums/`
2. 生成 Markdown 文件
3. 触发网站构建
4. 更新在线网站

密码：`yourpass`

---

## 🛠️ 技术栈

- **框架**: Valaxy 0.26.3
- **主题**: valaxy-theme-yun
- **前端**: Vue 3 + Vite
- **后端**: Express.js (相册管理)
- **部署**: 阿里云云效 Flow
- **服务器**: Nginx + PM2

---

## 📦 项目结构

```
blog_valaxy/
├── album-admin/          # 相册管理系统
├── components/           # 自定义 Vue 组件
├── layouts/              # 自定义布局
│   └── albums.vue       # 相册日历
├── pages/               # 内容页面
│   ├── albums/         # 相册 Markdown
│   └── posts/          # 博客文章
├── public/             # 静态资源
├── styles/             # 自定义样式
└── docs/               # 项目文档
```

---

## 🔗 相关链接

- **官方网站**: https://kylaan.top
- **Valaxy 文档**: https://valaxy.site/
- **主题文档**: https://yun.valaxy.site/
- **GitHub**: https://github.com/Kylaan/blog_valaxy

---

## 📄 许可证

MIT License

---

**Created with** [Valaxy](https://valaxy.site) **&** ❤️

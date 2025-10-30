# 🤖 AI Agent 新对话 Prompt 模板

> 将此内容复制粘贴到新对话中，让 AI 快速理解整个项目。

---

## 📋 项目简介

你好！我正在开发一个基于 **Valaxy 0.26.3** 的个人博客项目。请阅读以下上下文，然后协助我进行开发。

**项目地址**: https://github.com/Kylaan/blog_valaxy
**在线网站**: https://kylaan.top

---

## 📚 完整文档

请首先阅读这些文档文件以了解项目：

1. **`PROJECT_CONTEXT.md`** - 📖 完整项目上下文（必读）
2. **`QUICK_REFERENCE.md`** - ⚡ 快速参考手册
3. **`.github/copilot-instructions.md`** - 🤖 Copilot 指令

---

## 🎯 关键信息速览

### 技术栈
- Valaxy 0.26.3 (Vue 3 SSR)
- valaxy-theme-yun
- Express.js (相册管理后端)
- 阿里云云效 Flow 自动部署

### 核心功能
- ✅ 博客文章发布
- ✅ 相册管理系统（照片上传 + 自动构建）
- ✅ 交互式日历布局
- ✅ 自动化部署

### 重要文件
- `album-admin/server.js` - 相册上传后端（Express）
- `layouts/albums.vue` - 相册日历组件（Vue 3）
- `.flow.yml` - 阿里云云效部署配置
- `valaxy.config.ts` - Valaxy 主配置
- `site.config.ts` - 网站元数据

### 服务器信息
- **IP**: 47.104.216.235
- **路径**: `/www/wwwroot/blog_valaxy/`
- **域名**: https://kylaan.top
- **相册管理**: http://47.104.216.235:3000
- **Node.js**: v25.1.0 (nvm)
- **PM2**: 守护 album-admin 进程

---

## ⚠️ 已知问题和注意事项

### 1. 不要使用增量构建
Valaxy 是 Vue SSR 应用，必须使用 `pnpm build:ssg` 完整构建。

### 2. 日期格式问题（已修复）
在 `layouts/albums.vue` 中，日期匹配使用本地格式而不是 UTC：
```javascript
// ✅ 正确
const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// ❌ 错误
const key = d.toISOString().slice(0, 10);  // 会导致时区偏移
```

### 3. 服务器权限
`dist/` 目录必须是 `www:www` 用户（Nginx 用户）。

### 4. 跨平台构建
`album-admin/server.js` 已支持 Windows 本地和 Linux 服务器：
```javascript
const isWindows = process.platform === 'win32';
```

---

## 🚀 常用命令

```bash
# 开发
pnpm dev                              # 本地开发服务器
cd album-admin && node server.js     # 相册管理系统

# 构建
pnpm build:ssg                       # 静态站点生成

# 部署
git push origin main                 # 触发云效自动部署

# 服务器
ssh root@47.104.216.235
pm2 restart album-admin
pm2 logs album-admin
nginx -s reload
```

---

## 💬 我需要帮助的是...

[在这里描述你的需求或问题]

---

## 📝 工作风格偏好

- ✅ 请直接使用工具操作文件，不要只输出代码
- ✅ 修改前先读取文件内容，确保上下文正确
- ✅ 遵循项目现有的代码风格和架构
- ✅ 考虑跨平台兼容性（Windows 本地 + Linux 服务器）
- ✅ 修改后验证是否有语法错误
- ❌ 不要使用增量构建
- ❌ 不要修改 Valaxy 核心配置（除非必要）

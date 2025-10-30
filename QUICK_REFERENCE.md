# 项目快速参考 (Quick Reference)

> 这是 Valaxy Blog 项目的精简版参考文档，用于快速理解项目结构和关键信息。
> 详细文档请查看 `PROJECT_CONTEXT.md`

## 📌 一句话概述

基于 **Valaxy 0.26.3** 的个人博客，包含自定义相册管理系统，部署到 **https://kylaan.top**。

---

## 🏗️ 核心架构

```
Valaxy (Vue 3 SSR) + valaxy-theme-yun
├── 相册管理系统 (album-admin/)     # Express + Multer
├── 自定义日历布局 (layouts/albums.vue)
└── 内容页面 (pages/)                # Markdown 文件
```

---

## 🔑 关键文件

| 文件 | 作用 | 重要度 |
|------|------|--------|
| `album-admin/server.js` | 相册上传后端 | ⭐⭐⭐⭐⭐ |
| `layouts/albums.vue` | 相册日历组件（含日期修复） | ⭐⭐⭐⭐⭐ |
| `valaxy.config.ts` | Valaxy 主配置 | ⭐⭐⭐ |
| `site.config.ts` | 网站元数据 | ⭐⭐⭐ |

---

## 🚀 常用命令

```bash
# 开发
pnpm dev                              # 本地开发 (http://localhost:4859)
cd album-admin && node server.js     # 相册管理 (http://127.0.0.1:3000)

# 构建
pnpm build:ssg                       # 静态站点生成

# 部署
git push origin main                 # 推送到 GitHub

# 服务器
ssh root@47.104.216.235              # 连接服务器
pm2 restart album-admin              # 重启相册服务
pm2 logs album-admin                 # 查看日志
nginx -s reload                      # 重载 Nginx
```

---

## ⚙️ 服务器信息

- **IP**: 47.104.216.235
- **路径**: `/www/wwwroot/blog_valaxy/`
- **域名**: https://kylaan.top
- **相册管理**: http://47.104.216.235:3000 (密码: yourpass)
- **Nginx**: 宝塔面板管理
- **Node.js**: v25.1.0 (通过 nvm)

---

## 🎨 相册管理系统

### API 端点

```javascript
POST /api/auth              // 验证密码
GET  /api/albums            // 获取相册列表
POST /api/albums            // 上传相册（自动触发构建）
DELETE /api/albums/:id      // 删除相册
POST /api/build             // 手动触发构建
GET  /api/build-status      // 查看构建状态
```

### 环境变量 (`.env`)

```env
PORT=3000
HOST=0.0.0.0              # ⚠️ 服务器必须是 0.0.0.0
ADMIN_PASSWORD=yourpass
```

### 跨平台构建逻辑

```javascript
const isWindows = process.platform === 'win32';
const buildCommand = isWindows
  ? `cd "${BLOG_ROOT}" && pnpm build:ssg`  // Windows 本地
  : `cd ${BLOG_ROOT} && NODE_OPTIONS="--max-old-space-size=2048" pnpm build:ssg`;  // Linux
```

---

## 🐛 已修复的关键问题

### 1. 日历日期偏移 Bug

**问题**: 日历高亮日期比实际少一天

**原因**: 
```javascript
// ❌ 错误：UTC 时区转换
const key = d.toISOString().slice(0, 10);  // 2025-10-28T16:00:00Z → 2025-10-28
```

**修复** (`layouts/albums.vue` 第 176-180 行):
```javascript
// ✅ 正确：本地日期格式
const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
```

### 2. 服务器内存不足

**问题**: `pnpm build:ssg` 崩溃

**解决**: 在构建命令中增加内存限制：`NODE_OPTIONS="--max-old-space-size=2048"`

### 3. 增量构建失败

**问题**: 简单 HTML 无法被 Vue Router 识别

**解决**: 放弃增量构建，使用 Valaxy 完整 SSR 构建

---

## 📦 工作流程

### 上传相册

```
上传照片 (album-admin)
  ↓
生成 Markdown (pages/albums/YYYY-MM-DD.md)
  ↓
触发构建 (pnpm build:ssg)
  ↓
生成 dist/ (Vue SSR 应用)
  ↓
更新网站 (https://kylaan.top/albums/)
```

### 自动部署

```
git push origin main
  ↓
（待配置自动部署）
```

---

## ⚠️ 重要提醒

1. **不要使用增量构建** - Valaxy 是 Vue SSR 应用
2. **日期格式统一** - 避免 `toISOString()`，使用本地日期
3. **权限管理** - `dist/` 必须是 `www:www` 用户
4. **HOST 配置** - 服务器必须 `HOST=0.0.0.0`
5. **PM2 守护** - album-admin 使用 PM2 管理

---

## 📂 目录速查

```
blog_valaxy/
├── album-admin/          # 相册管理后端
├── layouts/albums.vue    # 日历组件（重要！）
├── pages/
│   ├── albums/          # 相册 MD 文件
│   └── posts/           # 博客文章
├── public/albums/       # 相册图片
└── PROJECT_CONTEXT.md   # 完整文档 ⭐
```

---

## 🔗 快速链接

- 📖 完整文档: `PROJECT_CONTEXT.md`
- 🌐 网站: https://kylaan.top
- 📸 相册管理: http://47.104.216.235:3000
- 📚 Valaxy 文档: https://valaxy.site/
- 🎨 主题文档: https://yun.valaxy.site/

---

**最后更新**: 2025-10-30
**状态**: ✅ 生产环境运行中

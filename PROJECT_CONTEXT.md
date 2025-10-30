# Valaxy Blog - 项目上下文 Prompt

## 📋 项目概述

这是一个基于 **Valaxy (v0.26.3)** 构建的个人博客项目，使用 `valaxy-theme-yun` 主题，部署在阿里云服务器上。项目包含自定义的相册管理系统，支持照片上传和自动构建部署。

### 关键信息

- **框架**: Valaxy + Vue 3 + Vite
- **主题**: valaxy-theme-yun
- **包管理器**: pnpm
- **部署方式**: 阿里云云效 Flow 自动化部署
- **服务器**: 阿里云轻量服务器 47.104.216.235
- **域名**: https://kylaan.top
- **Node.js**: v20+ (本地) / v25.1.0 (服务器)

---

## 🏗️ 项目架构

### 核心目录结构

```
blog_valaxy/
├── .github/
│   ├── copilot-instructions.md    # AI Agent 指令文档
│   └── workflows/
│       └── deploy.yml              # GitHub Actions (备用)
│
├── album-admin/                    # 📸 相册管理系统
│   ├── public/
│   │   └── index.html             # 上传界面
│   ├── server.js                  # Express 后端服务
│   ├── .env                       # 环境变量配置
│   └── package.json
│
├── components/                     # 自定义 Vue 组件
│   ├── YunFooter.vue              # 自定义页脚
│   └── YunSponsor.vue             # 赞助组件
│
├── layouts/                        # 自定义页面布局
│   └── albums.vue                 # 📅 相册日历布局（重要！）
│
├── pages/                          # 📝 内容页面
│   ├── albums/                    # 相册 Markdown 文件
│   │   ├── index.md
│   │   ├── 2025-10-29.md
│   │   └── ...
│   ├── posts/                     # 博客文章
│   └── about/                     # 关于页面
│
├── public/                         # 静态资源
│   ├── albums/                    # 📷 相册图片目录
│   │   ├── 2025-10-29/
│   │   └── ...
│   └── img/
│
├── styles/                         # 自定义样式
│   ├── vars.scss                  # 主题变量覆盖
│   └── index.scss                 # 全局样式
│
├── docs/                           # 📚 项目文档
│   ├── ALIYUN_FLOW_GUIDE.md       # 阿里云云效部署指南
│   ├── DEPLOYMENT_SUMMARY.md       # 部署总结
│   └── QUICK_START.md             # 快速开始
│
├── scripts/                        # 自动化脚本
│   ├── auto-commit.bat            # Windows 自动提交
│   └── auto-commit.sh             # Linux 自动提交
│
├── .flow.yml                       # ⚙️ 阿里云云效配置（关键）
├── valaxy.config.ts               # Valaxy 主配置
├── site.config.ts                 # 网站元数据配置
├── locales/                        # 国际化文件
│   ├── zh-CN.yml
│   └── en.yml
└── package.json                    # 项目依赖
```

---

## 🔑 关键功能模块

### 1. 相册管理系统 (`album-admin/`)

**目的**: 提供 Web 界面上传照片，自动生成 Markdown 并触发网站构建。

**核心文件**: `album-admin/server.js`

**功能**:
- ✅ 照片上传（支持多张）
- ✅ 自动生成相册 Markdown 文件
- ✅ 触发全量构建 `pnpm build:ssg`
- ✅ 跨平台支持（Windows 本地 / Linux 服务器）
- ✅ 密码保护（环境变量 `ADMIN_PASSWORD`）

**API 端点**:
- `POST /api/auth` - 验证密码
- `GET /api/albums` - 获取相册列表
- `POST /api/albums` - 上传相册
- `DELETE /api/albums/:filename` - 删除相册
- `POST /api/build` - 手动触发构建
- `GET /api/build-status` - 查看构建状态

**环境变量** (`.env`):
```env
PORT=3000
HOST=0.0.0.0              # 服务器：0.0.0.0，本地：127.0.0.1
ADMIN_PASSWORD=yourpass
```

**构建逻辑**:
```javascript
// 自动检测操作系统
const isWindows = process.platform === 'win32';
const buildCommand = isWindows
  ? `cd "${BLOG_ROOT}" && pnpm build:ssg`  // Windows
  : `cd ${BLOG_ROOT} && NODE_OPTIONS="--max-old-space-size=2048" pnpm build:ssg`;  // Linux
```

---

### 2. 相册日历布局 (`layouts/albums.vue`)

**目的**: 显示交互式日历，高亮有相册的日期。

**关键特性**:
- ✅ Vue 3 组合式 API
- ✅ 密码保护功能
- ✅ 响应式日历网格
- ✅ **日期匹配修复**：使用本地日期格式避免时区问题

**日期匹配逻辑**（重要！）:
```javascript
// ❌ 错误：使用 UTC 导致时区偏移
const key = d.toISOString().slice(0, 10);

// ✅ 正确：使用本地日期格式
const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
```

---

### 3. 部署系统

#### 方式 1: 阿里云云效 Flow（主要）

**配置文件**: `.flow.yml`

**流程**:
1. 监听 `main` 分支 push 事件
2. 在云效服务器上构建（`pnpm install` + `pnpm build:ssg`）
3. 通过 SSH 上传 `dist.tar.gz` 到服务器
4. 自动解压并重新加载 Nginx

**关键配置**:
```yaml
deploy:
  image: registry.cn-beijing.aliyuncs.com/aliyun-fc/runtime-nodejs20:build-2.0.4
  steps:
    - run: pnpm install
    - run: pnpm build:ssg
    - run: tar -czf dist.tar.gz dist
    - run: scp dist.tar.gz root@47.104.216.235:/tmp/
    - run: ssh root@47.104.216.235 "cd /www/wwwroot/blog_valaxy && ..."
```

#### 方式 2: GitHub Actions（备用）

**配置文件**: `.github/workflows/deploy.yml`

---

## 🎨 主题定制

### 配置文件

**`valaxy.config.ts`**:
- Valaxy 主配置
- 插件配置（Waline 评论、LightGallery）
- 主题配置

**`site.config.ts`**:
- 网站元数据（标题、描述、作者）
- 导航链接
- 社交媒体链接

### 样式覆盖

**`styles/vars.scss`**:
```scss
:root {
  --va-c-primary: #0078e7;
}
```

---

## 🚀 开发工作流

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
# 访问 http://localhost:4859

# 启动相册管理系统
cd album-admin
node server.js
# 访问 http://127.0.0.1:3000
```

### 内容创建

**博客文章**:
```bash
# 在 pages/posts/ 创建 .md 文件
---
title: 我的文章
date: 2025-10-30
categories: [技术]
tags: [Vue, Valaxy]
---

文章内容...
```

**相册**:
1. 访问 `http://127.0.0.1:3000`（本地）或 `http://47.104.216.235:3000`（服务器）
2. 输入密码：`yourpass`
3. 上传照片并填写信息
4. 自动生成 Markdown 并触发构建

### 部署流程

```bash
# 本地构建（用于测试）
pnpm build:ssg

# 推送到 GitHub 触发自动部署
git add .
git commit -m "feat: 添加新内容"
git push origin main

# 阿里云云效自动构建并部署
```

---

## ⚙️ 服务器配置

### 服务器信息

- **IP**: 47.104.216.235
- **路径**: `/www/wwwroot/blog_valaxy/`
- **Nginx**: 配置在宝塔面板
- **PM2**: 管理 album-admin 服务

### 服务管理

```bash
# SSH 连接
ssh root@47.104.216.235

# PM2 管理
pm2 list
pm2 restart album-admin
pm2 logs album-admin

# Nginx 重载
nginx -s reload

# 构建网站（如果需要手动）
cd /www/wwwroot/blog_valaxy
pnpm build:ssg
```

### 目录权限

```bash
# dist 目录需要 www:www 权限（Nginx 用户）
chown -R www:www /www/wwwroot/blog_valaxy/dist
chmod -R 755 /www/wwwroot/blog_valaxy/dist
```

---

## 🐛 常见问题

### 1. 日历日期显示错误（已修复）

**问题**: 日历高亮的日期比实际日期少一天。

**原因**: 使用 `toISOString()` 导致 UTC 时区转换。

**解决**: 使用本地日期字符串（见 `layouts/albums.vue` 第 176-180 行）。

### 2. 服务器构建内存不足

**问题**: `pnpm build:ssg` 失败，提示 "JavaScript heap out of memory"。

**解决**: 
- 在构建命令中增加内存限制：`NODE_OPTIONS="--max-old-space-size=2048"`
- 或使用云效 Flow 在云端构建（推荐）

### 3. 照片上传后网站不更新

**问题**: 上传照片后，网站没有显示新相册。

**原因**: 
- Valaxy 是 Vue SSR 应用，必须完整构建
- 增量构建生成的简单 HTML 无法被 Vue Router 识别

**解决**: 使用全量构建 `pnpm build:ssg`（当前方案）

### 4. album-admin 无法从外网访问

**问题**: `http://47.104.216.235:3000` 访问超时。

**原因**: `.env` 中 `HOST=127.0.0.1` 只监听本地回环。

**解决**: 改为 `HOST=0.0.0.0`

---

## 📦 依赖管理

### 主项目依赖

```json
{
  "valaxy": "0.26.3",
  "valaxy-theme-yun": "0.26.3",
  "valaxy-addon-waline": "^0.2.1",
  "valaxy-addon-lightgallery": "^0.0.4"
}
```

### album-admin 依赖

```json
{
  "express": "^4.18.2",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3"
}
```

---

## 📝 重要文件说明

| 文件 | 作用 | 修改频率 |
|------|------|---------|
| `valaxy.config.ts` | Valaxy 核心配置 | 偶尔 |
| `site.config.ts` | 网站元数据 | 偶尔 |
| `layouts/albums.vue` | 相册日历组件 | 很少 |
| `album-admin/server.js` | 相册上传后端 | 很少 |
| `.flow.yml` | 云效部署配置 | 很少 |
| `pages/posts/*.md` | 博客文章 | 频繁 |
| `pages/albums/*.md` | 相册内容 | 频繁 |

---

## 🎯 下一步优化建议

1. **性能优化**:
   - 图片压缩和 WebP 转换
   - CDN 加速静态资源

2. **功能增强**:
   - 相册批量管理界面
   - 支持视频上传
   - 相册分类和标签

3. **开发体验**:
   - 添加 Prettier 格式化
   - 配置 ESLint
   - 单元测试

---

## 🔗 相关链接

- **Valaxy 文档**: https://valaxy.site/
- **主题文档**: https://yun.valaxy.site/
- **服务器**: https://kylaan.top
- **相册管理**: http://47.104.216.235:3000
- **GitHub 仓库**: https://github.com/Kylaan/blog_valaxy

---

## 📌 重要提醒

1. ⚠️ **不要使用增量构建**：Valaxy 是 Vue SSR 应用，必须完整构建。
2. ⚠️ **日期格式统一**：避免使用 `toISOString()`，使用本地日期字符串。
3. ⚠️ **权限管理**：服务器 `dist/` 目录必须是 `www:www` 用户。
4. ⚠️ **环境变量**：`album-admin/.env` 不要提交到 Git（已在 `.gitignore`）。
5. ⚠️ **PM2 管理**：服务器上 album-admin 使用 PM2 守护进程。

---

## 💡 快速命令参考

```bash
# 开发
pnpm dev                    # 启动开发服务器
cd album-admin && node server.js  # 启动相册管理

# 构建
pnpm build:ssg             # 静态站点生成

# 部署
git push origin main       # 触发云效自动部署

# 服务器
ssh root@47.104.216.235    # 连接服务器
pm2 restart album-admin    # 重启相册服务
nginx -s reload            # 重载 Nginx

# 调试
pm2 logs album-admin       # 查看日志
pnpm build:ssg             # 本地测试构建
```

---

**最后更新**: 2025-10-30
**项目状态**: ✅ 生产环境运行中
**已知问题**: 无

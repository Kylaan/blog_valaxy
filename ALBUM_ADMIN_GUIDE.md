# 相册管理系统 - 使用指南

## 🎯 功能概述

全新的相册管理系统已集成到日历页面 (`/albums`),无需单独部署后端服务,直接通过 GitHub API 上传相册并自动触发部署。

## 🔧 配置步骤

### 1. 生成 GitHub Token

1. 访问 **https://github.com/settings/tokens**
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 设置信息:
   - **Note**: `Valaxy Album Upload`
   - **Expiration**: 建议选择 `No expiration` 或 `1 year`
   - **权限**: 勾选 **`repo`** (完整权限)
4. 点击 **"Generate token"**
5. **⚠️ 重要**: 立即复制生成的 token (只显示一次)

### 2. 配置本地环境变量

```bash
# 在项目根目录创建 .env 文件
cp .env.example .env

# 编辑 .env 文件,填入你的 GitHub Token
VITE_GITHUB_TOKEN=ghp_your_actual_token_here
```

### 3. 配置 Vercel/Netlify 环境变量 (可选)

如果你希望在生产环境也能使用此功能:

**Vercel**:
- 进入项目设置 → Environment Variables
- 添加: `VITE_GITHUB_TOKEN` = `你的token`

**Netlify**:
- 进入 Site settings → Environment variables
- 添加: `VITE_GITHUB_TOKEN` = `你的token`

---

## 📝 使用流程

### 1. 访问相册页面

访问: **https://kylaan.top/albums**

### 2. 输入密码解锁

- 当前密码: `0921` (在 `layouts/albums.vue` 第 76 行修改)

### 3. 创建相册

1. 点击右上角 **"创建相册"** 按钮
2. 填写表单:
   - **日期**: 选择相册日期 (默认今天)
   - **标题**: 相册标题 (必填)
   - **描述**: 相册描述 (可选)
   - **密码保护**: 设置访问密码 (可选)
3. 点击 **"选择图片"** 上传区域
4. 选择一张或多张图片
5. 为每张图片设置标题 (默认 "照片 1", "照片 2" ...)
6. 点击 **"创建相册"**

### 4. 自动部署

- 系统会自动:
  1. 上传图片到 `public/albums/{日期}/`
  2. 创建 Markdown 文件到 `pages/albums/{日期}.md`
  3. 提交到 GitHub 主分支
  4. 触发 GitHub Actions 自动部署
  5. 约 5-7 分钟后网站更新

---

## 🎨 界面特点

- ✅ **原生主题样式**: 完全继承 `valaxy-theme-yun` 的设计风格
- ✅ **暗色模式支持**: 自动适配主题的暗色/亮色模式
- ✅ **响应式设计**: 手机、平板、电脑都能完美显示
- ✅ **实时预览**: 上传前可预览所有图片
- ✅ **拖拽友好**: 点击上传区域即可选择文件

---

## 📂 文件结构

创建相册后会生成:

```
blog_valaxy/
├── pages/albums/
│   └── 2025-10-30.md          # 相册 Markdown
└── public/albums/
    └── 2025-10-30/
        ├── 1730280000000-abc123.jpg
        └── 1730280001000-def456.jpg
```

### Markdown 示例

```yaml
---
title: 秋日漫步
date: 2025-10-30
layout: gallery
password: optional_password
photos:
  - caption: 照片 1
    src: /albums/2025-10-30/1730280000000-abc123.jpg
    desc: 
  - caption: 照片 2
    src: /albums/2025-10-30/1730280001000-def456.jpg
    desc: 
---

这是一个美好的秋日下午...
```

---

## 🔐 安全说明

### Token 安全

- ⚠️ **不要将 `.env` 文件提交到 Git**
- ⚠️ **Token 拥有仓库完整权限,请妥善保管**
- ✅ `.env` 已添加到 `.gitignore`

### 密码保护

1. **日历密码**: 在 `layouts/albums.vue` 修改
   ```javascript
   const ALBUM_PASSWORD = '0921' // 修改这里
   ```

2. **相册密码**: 创建时可选设置,存储在 frontmatter 中

---

## 🚀 部署流程

```
用户操作
  ↓
点击"创建相册"
  ↓
填写表单 + 上传图片
  ↓
前端处理
  ├─ 读取图片为 Base64
  ├─ 调用 GitHub API 上传图片
  └─ 调用 GitHub API 创建 Markdown
  ↓
GitHub 接收提交
  ↓
触发 GitHub Actions
  ├─ 安装依赖
  ├─ 构建 SSG (pnpm build:ssg)
  ├─ 压缩 dist/
  ├─ 上传到服务器
  └─ 解压并重载 Nginx
  ↓
部署完成 (约 5-7 分钟)
  ↓
访问 kylaan.top/albums/{日期}
```

---

## 🐛 故障排除

### 1. "未配置 GitHub Token"

**解决**:
- 检查 `.env` 文件是否存在
- 检查 `VITE_GITHUB_TOKEN` 是否正确填写
- 重启开发服务器: `pnpm dev`

### 2. "上传图片失败"

**可能原因**:
- Token 权限不足 → 重新生成 token 并勾选 `repo` 权限
- Token 过期 → 生成新 token
- 网络问题 → 检查网络连接

### 3. "创建 Markdown 失败"

**可能原因**:
- 同日期相册已存在 → 删除旧相册或选择其他日期
- 文件路径冲突 → 检查 `pages/albums/` 目录

### 4. "部署未触发"

**检查**:
- GitHub Actions 是否启用
- `.github/workflows/deploy.yml` 是否存在
- Secrets 是否配置正确

---

## 💡 高级技巧

### 1. 批量上传

- 一次可选择多张图片 (建议不超过 20 张)
- 系统会依次上传,显示进度

### 2. 图片命名

- 自动生成: `时间戳-随机字符串.扩展名`
- 避免文件名冲突

### 3. 自定义日期

- 可以为过去或未来的日期创建相册
- 日历会高亮显示所有有相册的日期

### 4. 密码保护

- 日历页面密码: 保护整个相册区域
- 单个相册密码: 保护特定相册内容

---

## 📊 与旧系统对比

| 特性 | 旧系统 (album-admin) | 新系统 |
|------|---------------------|--------|
| 部署方式 | 需要 Node.js 后端 + PM2 | 无需后端,纯前端 |
| 服务器负载 | 需要占用端口 3000 | 零负载 |
| 构建触发 | 后端执行 `pnpm build:ssg` | GitHub Actions 自动 |
| 认证方式 | HTTP Header | GitHub Token |
| UI 集成 | 独立页面 | 嵌入日历页面 |
| 样式 | 自定义 CSS | 主题原生样式 |
| 维护成本 | 需要管理进程 | 零维护 |

---

## 🎉 总结

新的相册管理系统完全集成到 Valaxy 博客中:
- ✅ 无需后端服务
- ✅ 自动部署
- ✅ 原生样式
- ✅ 简单易用

**开始创建你的第一个相册吧!** 🚀

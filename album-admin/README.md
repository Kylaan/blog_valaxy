# Album Admin System

相册管理系统 - 为 Valaxy 博客提供可视化的相册管理后台

## 功能特性

- ✅ 拖拽上传图片
- ✅ 自动生成相册 Markdown
- ✅ 密码保护
- ✅ 相册列表管理
- ✅ 一键删除相册

## 本地开发

```bash
# 1. 安装依赖
cd album-admin
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置管理密码

# 3. 启动服务
npm run dev

# 4. 访问
# 打开浏览器：http://localhost:3000
```

## 服务器部署

### 方式 1：直接运行（简单）

```bash
# 1. 上传 album-admin 目录到服务器
scp -r album-admin root@your-server:/www/wwwroot/blog_valaxy/

# 2. 安装依赖
cd /www/wwwroot/blog_valaxy/album-admin
npm install --production

# 3. 配置环境变量
cp .env.example .env
nano .env  # 修改密码

# 4. 使用 PM2 启动（保持后台运行）
npm install -g pm2
pm2 start server.js --name album-admin
pm2 save
pm2 startup
```

### 方式 2：Docker 部署（推荐）

```bash
# Dockerfile 已在 album-admin 目录
cd album-admin
docker build -t album-admin .
docker run -d --name album-admin -p 3000:3000 album-admin
```

## 宝塔配置

1. **添加反向代理**
   - 网站 → 添加站点 → 反向代理
   - 域名：`album.kylaan.top`
   - 目标 URL：`http://127.0.0.1:3000`

2. **配置 SSL**
   - 申请 Let's Encrypt 证书
   - 开启强制 HTTPS

## 使用说明

1. 访问 `https://album.kylaan.top`
2. 输入管理密码登录
3. 选择"创建相册"标签
4. 填写相册信息并上传照片
5. 点击"创建相册"
6. 系统会自动：
   - 保存图片到 `public/albums/日期/`
   - 生成 Markdown 到 `pages/albums/日期.md`
7. 重新构建博客：`pnpm build:ssg`
8. 上传 dist 到服务器

## 文件结构

```
album-admin/
├── server.js          # 后端服务
├── package.json       # 依赖配置
├── .env              # 环境变量（不要提交到 Git）
├── .env.example      # 环境变量示例
└── public/
    └── index.html    # 前端界面
```

## API 文档

### POST /api/auth
验证管理员密码

### GET /api/albums
获取所有相册列表（需要密码）

### POST /api/albums
创建新相册（需要密码）

### DELETE /api/albums/:filename
删除指定相册（需要密码）

## 安全建议

- ⚠️ 修改默认密码
- ⚠️ 只允许信任的 IP 访问（宝塔防火墙）
- ⚠️ 定期备份数据
- ⚠️ 使用 HTTPS

## 常见问题

**Q: 上传后图片不显示？**
A: 需要重新构建博客并上传 dist 到服务器

**Q: 如何修改密码？**
A: 修改 `.env` 文件中的 `ADMIN_PASSWORD`，然后重启服务

**Q: 支持多大的图片？**
A: 默认单张最大 10MB，可在 server.js 中修改 `limits`

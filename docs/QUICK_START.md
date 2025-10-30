# 📸 相册上传与自动部署快速指南

## 🎯 工作流程

```
上传照片 → Git 提交 → 云效构建 → 自动部署 → ✅ 完成
```

---

## 📝 详细步骤

### 步骤 1：上传照片

1. 访问相册管理后台：`http://47.104.216.235:3000`
2. 输入管理密码：`yourpass`
3. 填写相册信息：
   - 标题
   - 日期
   - 描述
   - 访问密码（可选）
4. 选择照片上传
5. 点击【提交】

### 步骤 2：提交到 Git

**方法 A：使用自动脚本（推荐）**

```bash
# Windows
.\scripts\auto-commit.bat

# Linux/Mac
./scripts/auto-commit.sh
```

**方法 B：手动提交**

```bash
git add pages/albums/*.md public/albums/*
git commit -m "📸 新增相册"
git push origin main
```

### 步骤 3：等待自动部署

1. 推送后，云效 Flow 自动触发
2. 查看构建进度：https://flow.aliyun.com/pipelines
3. 约 2-3 分钟后部署完成
4. 访问网站查看：https://kylaan.top/albums/

---

## ⚡ 一键操作（最快方式）

上传完照片后，直接运行：

```bash
# Windows
.\scripts\auto-commit.bat

# Linux/Mac
chmod +x ./scripts/auto-commit.sh
./scripts/auto-commit.sh
```

脚本会自动完成：
- ✅ 添加变更文件
- ✅ 提交到 Git
- ✅ 推送到 GitHub
- ✅ 触发云效自动部署

---

## 🔍 常见问题

### Q1: 上传成功但网站没更新？

**检查清单**：
1. 是否已经 `git push`？
2. 云效 Flow 是否成功触发？访问 https://flow.aliyun.com/pipelines 查看
3. 构建是否成功？查看云效构建日志
4. 清除浏览器缓存：`Ctrl + Shift + R`

### Q2: Git 推送失败？

```bash
# 拉取最新代码
git pull origin main

# 重新推送
git push origin main
```

### Q3: 云效构建失败？

1. 登录云效控制台查看构建日志
2. 检查是否有语法错误
3. 检查依赖是否安装成功

---

## 📊 监控与日志

### 查看上传统计

访问：`http://47.104.216.235:3000/api/stats`

```json
{
  "totalUploads": 5,
  "lastUploadTime": "2025-10-30T12:00:00.000Z",
  "lastUploadAlbum": "2025-10-30.md"
}
```

### 查看云效构建历史

访问：https://flow.aliyun.com/pipelines

可以看到：
- 构建状态（成功/失败）
- 构建时长
- 部署日志
- 错误信息

---

## 🎨 提示与技巧

### 批量上传

一次性上传多张照片：
1. 在上传表单中选择多个文件
2. 系统会自动处理所有照片
3. 生成一个相册页面

### 相册密码保护

如果不想公开相册：
1. 在"访问密码"字段输入密码
2. 访问者需要输入密码才能查看

### 定时发布

使用 Git 的定时推送功能：
```bash
# 添加到 crontab (Linux/Mac)
0 12 * * * cd /path/to/blog_valaxy && git push origin main
```

---

## 🚀 性能优化

### 图片优化

上传前压缩图片可以提升加载速度：
- 使用工具：TinyPNG、ImageOptim
- 推荐尺寸：宽度 1920px 以内
- 推荐格式：WebP > JPEG > PNG

### 云效构建加速

1. 启用依赖缓存
2. 使用国内镜像源
3. 增加构建机器规格

---

## 📚 相关文档

- [阿里云云效 Flow 配置指南](./ALIYUN_FLOW_GUIDE.md)
- [相册管理 API 文档](./album-admin/README.md)
- [Valaxy 官方文档](https://valaxy.site/)

---

## ✅ 验证清单

每次上传后检查：

- [ ] 照片已上传到 `public/albums/`
- [ ] Markdown 文件已生成 `pages/albums/`
- [ ] Git 已提交并推送
- [ ] 云效 Flow 已触发构建
- [ ] 构建成功
- [ ] 网站已更新
- [ ] 照片正常显示

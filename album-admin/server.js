const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1'; // 反代场景默认仅本机监听，提升安全性

// 管理员密码（从环境变量读取）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yourpass';

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 路径配置
const BLOG_ROOT = path.resolve(__dirname, '..'); // /www/wwwroot/blog_valaxy
const ALBUMS_DIR = path.join(BLOG_ROOT, 'public', 'albums');
const PAGES_DIR = path.join(BLOG_ROOT, 'pages', 'albums');
const DIST_DIR = path.resolve(__dirname, '../dist');

// 构建状态管理
let buildStatus = {
  building: false,
  lastBuildTime: null,
  lastBuildSuccess: null,
  lastBuildError: null
};

// 全量构建函数
function triggerFullBuild() {
  if (buildStatus.building) {
    console.log('⚠️ 构建已在进行中，跳过本次触发');
    return;
  }

  buildStatus.building = true;
  buildStatus.lastBuildError = null;
  console.log('🔨 开始全量构建网站...');

  // 自动检测操作系统和环境
  const isWindows = process.platform === 'win32';
  const buildCommand = isWindows
    ? `cd "${BLOG_ROOT}" && pnpm build:ssg`  // Windows 本地
    : `cd ${BLOG_ROOT} && NODE_OPTIONS="--max-old-space-size=2048" pnpm build:ssg`;  // Linux 服务器
  
  console.log(`执行命令: ${buildCommand}`);
  
  exec(buildCommand, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
    buildStatus.building = false;
    buildStatus.lastBuildTime = new Date().toISOString();

    if (error) {
      console.error('❌ 构建失败:', error.message);
      console.error('stderr:', stderr);
      buildStatus.lastBuildSuccess = false;
      buildStatus.lastBuildError = error.message;
      return;
    }

    console.log('✅ 构建成功!');
    console.log('构建输出:', stdout.slice(-500));
    buildStatus.lastBuildSuccess = true;
  });
}

// 创建必要的目录

// 确保目录存在
if (!fs.existsSync(ALBUMS_DIR)) {
  fs.mkdirSync(ALBUMS_DIR, { recursive: true });
}
if (!fs.existsSync(PAGES_DIR)) {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
}

// 配置 Multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const date = req.body.date || new Date().toISOString().split('T')[0];
    const uploadDir = path.join(ALBUMS_DIR, date);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.random().toString(36).substr(2, 9) + ext;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('只支持图片文件！'));
  }
});

// 简单的密码验证中间件
const authenticate = (req, res, next) => {
  const password = req.headers['x-admin-password'] || req.body.password;
  
  if (password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: '密码错误' });
  }
};

// API 路由

// 1. 验证密码
app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: '验证成功' });
  } else {
    res.status(401).json({ success: false, error: '密码错误' });
  }
});

// 2. 获取构建状态
app.get('/api/build-status', authenticate, (req, res) => {
  res.json(buildStatus);
});

// 3. 手动触发构建
app.post('/api/build', authenticate, (req, res) => {
  if (buildStatus.building) {
    return res.json({
      success: false,
      message: '构建已在进行中'
    });
  }

  triggerFullBuild();
  res.json({
    success: true,
    message: '全量构建已触发'
  });
});

// 4. 获取相册列表
app.get('/api/albums', authenticate, (req, res) => {
  try {
    const albums = [];
    const files = fs.readdirSync(PAGES_DIR);
    
    files.forEach(file => {
      if (file.endsWith('.md') && file !== 'index.md') {
        const filePath = path.join(PAGES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // 解析 frontmatter
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
          const frontmatter = {};
          match[1].split('\n').forEach(line => {
            const [key, ...values] = line.split(':');
            if (key && values.length) {
              frontmatter[key.trim()] = values.join(':').trim();
            }
          });
          
          albums.push({
            filename: file,
            title: frontmatter.title || '',
            date: frontmatter.date || '',
          });
        }
      }
    });
    
    // 按日期降序排序
    albums.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ albums });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. 上传图片并创建相册
app.post('/api/albums', authenticate, upload.array('photos', 50), (req, res) => {
  console.log('📥 收到创建相册请求');
  console.log('请求体:', req.body);
  console.log('文件数量:', req.files?.length || 0);
  
  try {
    const { date, title, description, password } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      console.error('❌ 没有上传文件');
      return res.status(400).json({ error: '没有上传文件' });
    }
    
    // 生成相册 Markdown 文件
    const photos = files.map((file, index) => {
      const caption = req.body[`caption_${index}`] || `照片 ${index + 1}`;
      const desc = req.body[`desc_${index}`] || '';
      
      return {
        caption,
        src: `/albums/${date}/${file.filename}`,
        desc
      };
    });
    
    const markdownContent = generateMarkdown({
      title: title || '相册',
      date: date || new Date().toISOString(),
      description: description || '',
      password: password || '',
      photos
    });
    
    // 生成文件名（使用日期或自定义）
    const filename = `${date.replace(/[:\s]/g, '-')}.md`;
    const mdPath = path.join(PAGES_DIR, filename);
    
    console.log('📝 写入 Markdown:', mdPath);
    fs.writeFileSync(mdPath, markdownContent, 'utf-8');
    
    console.log('✅ 相册创建成功:', filename);
    
    // 触发全量构建
    triggerFullBuild();
    
    res.json({
      success: true,
      message: '相册创建成功，正在构建网站...',
      filename,
      photosCount: files.length,
      url: `/albums/${filename.replace('.md', '')}`
    });
    
  } catch (error) {
    console.error('❌ 创建相册失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. 删除相册
app.delete('/api/albums/:filename', authenticate, (req, res) => {
  try {
    const { filename } = req.params;
    const mdPath = path.join(PAGES_DIR, filename);
    
    if (!fs.existsSync(mdPath)) {
      return res.status(404).json({ error: '相册不存在' });
    }
    
    // 读取 Markdown 获取日期
    const content = fs.readFileSync(mdPath, 'utf-8');
    const dateMatch = content.match(/date:\s*([^\n]+)/);
    
    if (dateMatch) {
      const date = dateMatch[1].trim().split(' ')[0];
      const albumDir = path.join(ALBUMS_DIR, date);
      
      // 删除图片目录
      if (fs.existsSync(albumDir)) {
        fs.rmSync(albumDir, { recursive: true, force: true });
      }
    }
    
    // 删除 Markdown 文件
    fs.unlinkSync(mdPath);
    
    res.json({ success: true, message: '相册已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 生成 Markdown 内容
function generateMarkdown({ title, date, description, password, photos }) {
  const photosYaml = photos.map(p => 
    `  - caption: ${p.caption}\n    src: ${p.src}\n    desc: ${p.desc}`
  ).join('\n');
  
  return `---
title: ${title}
date: ${date}
layout: gallery
${password ? `password: ${password}` : ''}
photos:
${photosYaml}
---

${description || ''}
`;
}

// 启动服务器
app.listen(PORT, HOST, () => {
  console.log(`🚀 相册管理系统启动成功！`);
  console.log(`📍 地址: http://${HOST}:${PORT}`);
  console.log(`🔑 管理密码: ${ADMIN_PASSWORD}`);
  console.log(`📁 图片目录: ${ALBUMS_DIR}`);
  console.log(`📝 页面目录: ${PAGES_DIR}`);
});

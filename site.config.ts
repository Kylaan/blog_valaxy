//site.config.ts
import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://Kylaan.top/',
  lang: 'zh-CN',
  title: "Kylaan's Blog",
  subtitle: '欢迎来到我的小站',
  author: {
    name: 'Kylaan',
    avatar: "/avatar.png",
    status: {
      /**
       * Emoji representation of your status like '👨‍💻'
       * @description 你的状态的 Emoji 表示，如 '👨‍💻'
       */
      emoji: '👨‍💻',
      /**
       * show when hover emoji
       * @description 当鼠标悬浮在图标上时显示
       */
      message: "Studying",
    },
      /**
       * @zh 个人简介
       */
    // intro: "Shandong University, Mathematics and Applied Mathematics",
  },
  
  /**
   * show last updated time by git/mtime
   */
  lastUpdated: true,

  description: 'Welcome to my site.',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'QQ',
      link: 'https://qq.com/',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/Kylaan',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '知乎',
      link: 'https://www.zhihu.com/people/ji-feng-42-44',
      icon: 'i-ri-zhihu-line',
      color: '#0084FF',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/396172321',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: 'E-Mail',
      link: 'mailto:202300091106@mail.sdu.edu.cn',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
    {
      name: 'Travelling',
      link: 'https://www.travellings.cn/go.html',
      icon: 'i-ri-train-line',
      color: 'var(--va-c-text)',
    },
  ],

  search: {
    enable: true,
    /**
     * Search Type
     * - algolia: Algolia Search
     * - engine: Engine Search, like Google/Baidu
     * - fuse: Local Search by fuse.js
     */
    type: 'algolia' 
  },

  sponsor: {
    enable: true,
    title: '感谢支持',
    description: '😗😗',
    methods: [
      {
        name: '支付宝',
        url: '/zfb.jpg',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: '微信支付',
        url: '/wx.png',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
  /**
   * 开启阅读统计
   */
  statistics: {
    enable: true,
    readTime: {
      /**
       * 阅读速度
       */
      speed: {
        cn: 300,
        en: 200,
      },
    },
  },
  //加密文章
  encrypt: {
    enable: true,
  },
  //评论
  comment: {
    enable: true,
    
  },
  
})



import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonWaline } from 'valaxy-addon-waline'
import { addonLightGallery } from 'valaxy-addon-lightgallery'

//模板： D:\Downloads\\index.d.ts
// https://github.com/YunYouJun/valaxy/blob/main/packages/valaxy-theme-yun/types/index.d.ts

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',
  
  // Vite 配置
  vite: {
    envPrefix: ['VITE_'], // 确保 VITE_ 前缀的环境变量被加载
  },
  //addon
  addons: [addonWaline({
    serverURL: 'https://comment.kylaan.top//',
    reaction: true,
    pageview: true, // 和浏览量统计
    }),
    // enable lightgallery addon so YunGallery loads and gallery pages can show images
    addonLightGallery(),
  ],


  themeConfig: {
    banner: {
      enable: true,
      title: 'MQ的小站',
    },
    pages: [
      {
        name: '友情链接',
        url: '/links/',
        icon: 'i-tabler-link',
        color: '#97b3cc',
      },
      {
        name: '岁岁年年',
        url: '/albums/',
        icon: 'i-ri-hearts-line',
        color: '#718699',
      },
      {
        name: '文章归档',
        url: '/archives/',
        icon: 'i-si-archive-duotone',
        color: '#536371',
      },
    ],

    nav: [
      {
        text: '关于我',
        link: '/about/',
        icon: 'i-ri-user-3-line',
      },
      {
        text: '友链',
        link: '/links/',
        icon: 'i-tabler-link',
      },
      {
        text: '留言板',
        link: '/message/',
        icon: 'i-ri-chat-1-line',
      },
      {
        text: '岁岁年年',
        link: '/albums/',
        icon: 'i-ri-hearts-line',
      }
    ],
    footer: {
      since: 2025,
      icon: {
        enable: true,
        name: "i-ri-user-2-line",
        animated: true,
        // color: "#718699",
        url: "/about/",
        title: '关于我',
        },
      
        powered: true,
      },
    
  },
  
  unocss: { safelist },
})

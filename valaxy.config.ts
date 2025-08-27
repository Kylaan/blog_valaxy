import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonWaline } from 'valaxy-addon-waline'

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
  //addon
  addons: [addonWaline({
    serverURL: 'https://blog-nu-lilac-79.vercel.app/',
    reaction: true,
    pageview: true, // 和浏览量统计
    }),
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
        name: '网站历史',
        url: '/building/',
        icon: 'i-lucide-laugh',
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

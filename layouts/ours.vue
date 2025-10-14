<template>
  <YunLayoutWrapper>
    <YunLayoutLeft />

    <main class="px-6 py-8 max-w-4xl mx-auto">
      <YunPageHeader :title="$t('menu.ours')" />
      <div class="yun-text-light p-4 rounded-md">
        本页面已恢复为占位页，之前为演示所添加的相册/时间轴实现已被移除。
        如果你要使用主题作者提供的相册模板，请使用作者的示例文件并替换本页面内容。
      </div>
    </main>

    <YunLayoutRight />
  </YunLayoutWrapper>

  <YunFooter />
</template>

<!-- Minimal placeholder: no script or styles to avoid side-effects -->

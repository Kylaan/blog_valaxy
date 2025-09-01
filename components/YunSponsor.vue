<template>
  <div class="custom-like-container">
    <button class="like-button" @click="handleLike" :class="{ 'liked': isLiked }" :disabled="isLiked || isLoading">
      <div class="icon" :class="isLiked ? 'i-ri-heart-fill' : 'i-ri-heart-line'" />
      <span class="text">{{ isLiked ? '感谢支持!' : '点个赞' }}</span>
      <span class="count">{{ likeCountDisplay }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// 获取当前页面的路径，例如 "/posts/Git/"
const pagePath = computed(() => route.path)

const likeCount = ref(0)
const isLiked = ref(false)
const isLoading = ref(true)

// --- 根据你提供的信息精确配置 ---
const API_ENDPOINT = 'https://comment.kylaan.top/api/'

// 获取点赞数（通过 GET_COUNTER 事件）
async function fetchLikeCount() {
  isLoading.value = true
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'GET_COUNTER',
        url: pagePath.value,
      }),
    })

    if (!response.ok) throw new Error('Network response was not ok')
    
    const data = await response.json()
    // 假设返回的数据结构是 { result: [{ time: 123 }] }
    // 如果没有数据，则 `data.result` 可能为空数组
    likeCount.value = data.result[0]?.time || 0

  } catch (error) {
    console.error("获取点赞数失败:", error)
    likeCount.value = 0 // 出错时显示 0
  } finally {
    isLoading.value = false
  }
}

// 发送点赞请求（通过 INC_COUNTER 事件）
async function postLike() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'INC_COUNTER',
        url: pagePath.value,
      }),
    })

    if (!response.ok) throw new Error('Like request failed')
    
    console.log("点赞成功!")

  } catch (error) {
    console.error("点赞请求失败:", error)
    // 如果请求失败，回滚UI状态
    likeCount.value--
    isLiked.value = false
    localStorage.removeItem(`liked-${pagePath.value}`)
    alert('点赞失败，请稍后重试')
  }
}
// --- 配置区结束 ---

// 计算属性，用于优雅地显示加载状态
const likeCountDisplay = computed(() => {
  return isLoading.value ? '...' : likeCount.value
})

// 组件挂载时执行
onMounted(() => {
  // 检查本地存储，判断用户是否已点赞
  if (localStorage.getItem(`liked-${pagePath.value}`)) {
    isLiked.value = true
  }
  fetchLikeCount()
})

// 点击事件处理
async function handleLike() {
  if (isLiked.value) return

  // 1. 乐观更新 UI
  isLiked.value = true
  likeCount.value++
  localStorage.setItem(`liked-${pagePath.value}`, 'true')

  // 2. 向后端发送请求
  await postLike()
}
</script>

<style lang="scss" scoped>
.custom-like-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.like-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.5rem;
  border-radius: 2rem;
  // --- 颜色修改 ---
  border: 1px solid #90cdf4; /* 浅蓝色边框 */
  color: #3998ff; /* 蓝色文字 */
  background-color: #ebf8ff; /* 非常浅的蓝色背景 */
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    // --- 颜色修改 ---
    box-shadow: 0 4px 12px rgba(49, 130, 206, 0.2); /* 蓝色阴影 */
    border-color: #2b6cb0; /* 悬浮时边框加深 */
  }

  &.liked, &:disabled {
    // --- 颜色修改 ---
    background-color: #12b7f5; /* 主蓝色背景 */
    color: white; /* 白色文字 */
    border-color: rgb(32, 129, 219); /* 主蓝色边框 */
    cursor: not-allowed;
  }
  
  .count {
    min-width: 1.5ch;
    text-align: left;
  }
}
</style>

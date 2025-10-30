<template>
  <YunLayoutWrapper>
    <YunLayoutLeft />

  <main class="px-6 py-8 w-full max-w-none">
      <YunPageHeader :title="title || $t('title.album')" :icon="frontmatter.icon || 'i-ri-hearts-line'" />

      <div class="calendar-actions mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button class="yun-icon-btn" @click="prevMonth" aria-label="prev">
            <i class="i-ri-arrow-left-line" />
          </button>
          <button class="yun-icon-btn" @click="nextMonth" aria-label="next">
            <i class="i-ri-arrow-right-line" />
          </button>
          <button class="yun-btn" @click="goToday">今天</button>
        </div>
  <div class="text-lg font-medium whitespace-nowrap">{{ monthYearLabel }}</div>
        <div class="flex items-center gap-2" v-if="isUnlocked">
          <button class="yun-icon-btn" @click="manageToken" title="配置 GitHub Token">
            <i class="i-ri-key-line" />
          </button>
          <button class="yun-btn" @click="openAdminModal">
            <i class="i-ri-add-line" />
            创建相册
          </button>
        </div>
      </div>

      <div v-if="isUnlocked">
        <div class="calendar-grid">
        <div class="weekday" v-for="d in weekdays" :key="d">{{ d }}</div>

        <div
          v-for="cell in cells"
          :key="cell.key"
          class="day-cell"
          :class="{ 'has-album': cell.hasAlbum, other: !cell.inMonth, today: cell.isToday }"
        >
          <RouterLink v-if="cell.hasAlbum" :to="cell.page.path" class="day-link" aria-label="album">
            <div class="day-num">{{ cell.date.getDate() }}</div>
            <span class="album-badge" aria-label="有相册" />
          </RouterLink>

          <div v-else class="day-empty">
            <div class="day-num">{{ cell.date.getDate() }}</div>
          </div>
        </div>
        </div>
      </div>
      <div v-else class="albums-lock">
        <div class="albums-lock-box">
          <h3>输入密码以查看相册</h3>
          <input v-model="passwordInput" type="password" placeholder="密码" class="albums-input" @keyup.enter="submitPassword" />
          <div class="albums-lock-actions">
            <button class="yun-btn" @click="submitPassword">提交</button>
            <button class="yun-btn yun-btn-ghost" @click="cancelPassword">取消</button>
          </div>
          <p v-if="passwordError" class="albums-error">{{ passwordError }}</p>
        </div>
      </div>
    </main>

  <!-- right column removed to hide article TOC -->
  </YunLayoutWrapper>

  <!-- Album Admin Modal -->
  <div v-if="showAdminModal" class="modal-overlay" @click="closeAdminModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>创建新相册</h2>
        <button class="close-btn" @click="closeAdminModal">
          <i class="i-ri-close-line" />
        </button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>日期</label>
          <input v-model="albumForm.date" type="date" class="form-input" />
        </div>
        
        <div class="form-group">
          <label>标题</label>
          <input v-model="albumForm.title" type="text" class="form-input" placeholder="相册标题" />
        </div>
        
        <div class="form-group">
          <label>描述</label>
          <textarea v-model="albumForm.description" class="form-input" rows="3" placeholder="相册描述"></textarea>
        </div>
        
        <div class="form-group">
          <label>密码保护 (可选)</label>
          <input v-model="albumForm.password" type="text" class="form-input" placeholder="留空则不设密码" />
        </div>
        
        <div class="form-group">
          <label>选择图片</label>
          <div class="upload-area" @click="triggerFileInput">
            <input 
              ref="fileInput" 
              type="file" 
              multiple 
              accept="image/*" 
              @change="handleFileSelect" 
              style="display: none"
            />
            <i class="i-ri-upload-cloud-line text-4xl mb-2" />
            <p>点击选择图片</p>
            <p class="text-sm opacity-60">支持多张图片</p>
          </div>
        </div>
        
        <div v-if="selectedFiles.length > 0" class="preview-grid">
          <div v-for="(file, index) in selectedFiles" :key="index" class="preview-item">
            <img :src="file.preview" :alt="file.name" />
            <div class="preview-info">
              <input 
                v-model="file.caption" 
                type="text" 
                class="form-input-sm" 
                placeholder="图片标题" 
              />
              <button class="remove-btn" @click="removeFile(index)">
                <i class="i-ri-delete-bin-line" />
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="uploadStatus" class="status-message" :class="uploadStatus.type">
          {{ uploadStatus.message }}
        </div>
        
        <div v-if="!canSubmit && !isUploading" class="status-message info">
          <template v-if="!albumForm.title">⚠️ 请填写标题</template>
          <template v-else-if="selectedFiles.length === 0">⚠️ 请至少选择一张图片</template>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="yun-btn yun-btn-ghost" @click="closeAdminModal" :disabled="isUploading">
          取消
        </button>
        <button 
          class="yun-btn" 
          @click="submitAlbum" 
          :disabled="isUploading || !canSubmit"
          :title="!canSubmit ? '请填写标题并上传至少一张图片' : ''"
        >
          {{ isUploading ? '上传中...' : '创建相册' }}
        </button>
      </div>
    </div>
  </div>

  <YunFooter />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { usePageList, useFrontmatter } from 'valaxy'

const frontmatter = useFrontmatter()
const title = computed(() => frontmatter.value?.title || '')

// 密码配置：直接在这里设置密码
const ALBUM_PASSWORD = '0921' // 修改这里来更改密码

// collect album pages under /albums
const pageList = usePageList()
const albumPages = computed(() => (
  pageList.value.filter((p: any) => p && p.path && p.path.startsWith('/albums') && p.date)
))

// map YYYY-MM-DD -> page
const pagesByDate = computed(() => {
  const m: Record<string, any> = {}
  albumPages.value.forEach((p: any) => {
    try {
      const d = new Date(p.date)
      const key = d.toISOString().slice(0, 10)
      if (!m[key]) m[key] = p
    }
    catch (e) {
      // ignore
    }
  })
  return m
})

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-index

const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// i18n not required for today button; using explicit label to avoid missing-key display

function startOfMonthDate(year: number, month: number) {
  return new Date(year, month, 1)
}

function endOfMonthDate(year: number, month: number) {
  return new Date(year, month + 1, 0)
}

const monthYearLabel = computed(() => {
  const d = new Date(viewYear.value, viewMonth.value, 1)
  return d.toLocaleString(undefined, { year: 'numeric', month: 'long' })
})

// password gate
const pagePassword = computed(() => ALBUM_PASSWORD) // 使用硬编码的密码
const passwordKey = 'albums-unlocked' // 简化 key
const passwordInput = ref('')
const passwordError = ref('')
const isUnlocked = ref(false)

// check sessionStorage on mount
onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      // 在挂载后检查是否已解锁
      isUnlocked.value = !!sessionStorage.getItem(passwordKey)
    }
    catch (e) {
      isUnlocked.value = false
    }
  }
})

function submitPassword() {
  // 确保密码已配置且不为空
  const configuredPassword = String(pagePassword.value || '').trim()
  if (!configuredPassword) {
    passwordError.value = '未配置密码或密码为空'
    return
  }
  
  // 验证用户输入的密码
  const userPassword = String(passwordInput.value || '').trim()
  
  if (userPassword === configuredPassword) {
    try { sessionStorage.setItem(passwordKey, '1') } catch (e) {}
    isUnlocked.value = true
    passwordError.value = ''
  }
  else {
    passwordError.value = '密码错误'
  }
}

function cancelPassword() {
  passwordInput.value = ''
  passwordError.value = ''
}

function buildCells(year: number, month: number) {
  const start = startOfMonthDate(year, month)
  const end = endOfMonthDate(year, month)

  const startWeek = start.getDay() // 0-6
  const totalDays = end.getDate()

  const cells: any[] = []

  // previous month's tail
  for (let i = 0; i < startWeek; i++) {
    const d = new Date(year, month, i - startWeek + 1)
    cells.push({ date: d, inMonth: false, key: d.toISOString() })
  }

  // current month
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day)
    // 使用本地日期格式，避免时区问题
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const page = pagesByDate.value[key]
    const today = new Date()
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    cells.push({ date: d, inMonth: true, key: d.toISOString(), hasAlbum: !!page, page, isToday: key === todayKey })
  }

  // fill next month's head to complete week rows
  while (cells.length % 7 !== 0) {
    const idx = cells.length - 1
    const lastDate = cells[idx].date
    const d = new Date(lastDate)
    d.setDate(d.getDate() + 1)
    cells.push({ date: d, inMonth: false, key: d.toISOString() })
  }

  return cells
}

const cells = computed(() => buildCells(viewYear.value, viewMonth.value))

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11; viewYear.value--
  }
  else viewMonth.value--
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0; viewYear.value++
  }
  else viewMonth.value++
}

function goToday() {
  const d = new Date()
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
}

// ============ Album Admin Modal ============
const showAdminModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

interface SelectedFile {
  file: File
  preview: string
  name: string
  caption: string
}

const albumForm = ref({
  date: new Date().toISOString().split('T')[0],
  title: '',
  description: '',
  password: ''
})

const selectedFiles = ref<SelectedFile[]>([])
const uploadStatus = ref<{ type: string; message: string } | null>(null)

const canSubmit = computed(() => {
  return albumForm.value.title && 
         albumForm.value.date && 
         selectedFiles.value.length > 0 &&
         !isUploading.value
})

function openAdminModal() {
  console.log('🚀 打开相册管理模态框')
  try {
    showAdminModal.value = true
    // 重置表单
    albumForm.value = {
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      password: ''
    }
    selectedFiles.value = []
    uploadStatus.value = null
    console.log('✅ 模态框已打开')
  } catch (error) {
    console.error('❌ 打开模态框失败:', error)
  }
}

function closeAdminModal() {
  showAdminModal.value = false
  selectedFiles.value.forEach(f => URL.revokeObjectURL(f.preview))
  selectedFiles.value = []
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  files.forEach((file, index) => {
    if (file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file)
      selectedFiles.value.push({
        file,
        preview,
        name: file.name,
        caption: `照片 ${selectedFiles.value.length + 1}`
      })
    }
  })
  
  // 清空 input 以便重复选择
  if (target) target.value = ''
}

function removeFile(index: number) {
  const file = selectedFiles.value[index]
  URL.revokeObjectURL(file.preview)
  selectedFiles.value.splice(index, 1)
}

async function submitAlbum() {
  if (!canSubmit.value) return
  
  isUploading.value = true
  uploadStatus.value = { type: 'info', message: '正在上传...' }
  
  try {
    // 获取 GitHub Token
    // 方式1: 从环境变量读取
    let GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string || ''
    
    // 方式2: 临时从 localStorage 读取 (备用方案)
    if (!GITHUB_TOKEN && typeof window !== 'undefined') {
      GITHUB_TOKEN = localStorage.getItem('GITHUB_TOKEN') || ''
    }
    
    const GITHUB_OWNER = 'Kylaan'
    const GITHUB_REPO = 'blog_valaxy'
    
    console.log('🔍 Token 检查:', {
      envExists: !!import.meta.env.VITE_GITHUB_TOKEN,
      tokenExists: !!GITHUB_TOKEN,
      tokenLength: GITHUB_TOKEN?.length || 0,
      tokenPrefix: GITHUB_TOKEN?.substring(0, 4) || 'none',
      allEnvKeys: Object.keys(import.meta.env || {})
    })
    
    if (!GITHUB_TOKEN) {
      // 提示用户手动输入 token (临时方案)
      const userToken = prompt('未检测到 GitHub Token\n\n请输入你的 GitHub Token (ghp_...):\n\n(或者确保 .env 文件中配置了 VITE_GITHUB_TOKEN 并重启服务器)')
      if (userToken && userToken.trim()) {
        GITHUB_TOKEN = userToken.trim()
        // 保存到 localStorage 以便下次使用
        localStorage.setItem('GITHUB_TOKEN', GITHUB_TOKEN)
      } else {
        throw new Error('未配置 GitHub Token。\n\n请检查:\n1. .env 文件中的 VITE_GITHUB_TOKEN\n2. 已重启开发服务器 (pnpm dev)\n3. 或在弹窗中手动输入 Token')
      }
    }
    
    // 1. 准备文件数据
    const date = albumForm.value.date
    const photos: any[] = []
    const blobs: any[] = []
    
    uploadStatus.value = { type: 'info', message: '正在准备文件...' }
    
    // 2. 为每张图片生成文件名和读取内容
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const fileData = selectedFiles.value[i]
      const ext = fileData.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`
      
      // 读取文件为 base64
      const base64 = await fileToBase64(fileData.file)
      const content = base64.split(',')[1] // 移除 data:image/...;base64, 前缀
      
      photos.push({
        caption: fileData.caption,
        src: `/albums/${date}/${filename}`,
        desc: ''
      })
      
      blobs.push({
        path: `public/albums/${date}/${filename}`,
        content: content
      })
      
      uploadStatus.value = { 
        type: 'info', 
        message: `已准备 ${i + 1}/${selectedFiles.value.length} 张图片` 
      }
    }
    
    // 3. 生成 Markdown 内容
    const markdown = generateMarkdownContent({
      title: albumForm.value.title,
      date: albumForm.value.date,
      description: albumForm.value.description,
      password: albumForm.value.password,
      photos
    })
    
    const mdPath = `pages/albums/${date}.md`
    blobs.push({
      path: mdPath,
      content: btoa(unescape(encodeURIComponent(markdown))) // UTF-8 to base64
    })
    
    console.log('📦 准备批量提交:', {
      filesCount: blobs.length,
      photos: photos.length,
      mdPath
    })
    
    // 4. 使用 GitHub API 批量提交所有文件
    uploadStatus.value = { type: 'info', message: '正在上传到 GitHub...' }
    
    // 4.1 获取当前 main 分支的最新 commit SHA
    const refResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/main`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`
        }
      }
    )
    
    if (!refResponse.ok) {
      throw new Error(`获取分支信息失败: ${refResponse.statusText}`)
    }
    
    const refData = await refResponse.json()
    const latestCommitSha = refData.object.sha
    
    console.log('📍 最新 commit:', latestCommitSha)
    
    // 4.2 创建 blobs (上传文件内容)
    uploadStatus.value = { type: 'info', message: '正在创建文件对象...' }
    
    const blobShas: { path: string; sha: string; mode: string }[] = []
    
    for (let i = 0; i < blobs.length; i++) {
      const blob = blobs[i]
      const blobResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: blob.content,
            encoding: 'base64'
          })
        }
      )
      
      if (!blobResponse.ok) {
        const errorData = await blobResponse.json().catch(() => ({}))
        throw new Error(`创建文件对象失败 (${blobResponse.status}): ${errorData.message || blobResponse.statusText}`)
      }
      
      const blobData = await blobResponse.json()
      blobShas.push({
        path: blob.path,
        sha: blobData.sha,
        mode: '100644' // 普通文件权限
      })
      
      console.log(`✅ 创建 blob ${i + 1}/${blobs.length}:`, blob.path)
    }
    
    // 4.3 获取基础 tree
    const baseTreeResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${latestCommitSha}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`
        }
      }
    )
    
    if (!baseTreeResponse.ok) {
      throw new Error(`获取基础 tree 失败: ${baseTreeResponse.statusText}`)
    }
    
    const baseCommit = await baseTreeResponse.json()
    const baseTreeSha = baseCommit.tree.sha
    
    // 4.4 创建新 tree (包含所有文件)
    uploadStatus.value = { type: 'info', message: '正在创建文件树...' }
    
    const treeResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: blobShas.map(b => ({
            path: b.path,
            mode: b.mode,
            type: 'blob',
            sha: b.sha
          }))
        })
      }
    )
    
    if (!treeResponse.ok) {
      const errorData = await treeResponse.json().catch(() => ({}))
      throw new Error(`创建文件树失败 (${treeResponse.status}): ${errorData.message || treeResponse.statusText}`)
    }
    
    const treeData = await treeResponse.json()
    console.log('✅ 文件树创建成功:', treeData.sha)
    
    // 4.5 创建新 commit
    uploadStatus.value = { type: 'info', message: '正在创建提交...' }
    
    const commitResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `feat: 添加相册 ${albumForm.value.title} (${date})`,
          tree: treeData.sha,
          parents: [latestCommitSha]
        })
      }
    )
    
    if (!commitResponse.ok) {
      const errorData = await commitResponse.json().catch(() => ({}))
      throw new Error(`创建提交失败 (${commitResponse.status}): ${errorData.message || commitResponse.statusText}`)
    }
    
    const commitData = await commitResponse.json()
    console.log('✅ 提交创建成功:', commitData.sha)
    
    // 4.6 更新 main 分支指向新 commit
    uploadStatus.value = { type: 'info', message: '正在更新分支...' }
    
    const updateRefResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/main`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sha: commitData.sha,
          force: false
        })
      }
    )
    
    if (!updateRefResponse.ok) {
      const errorData = await updateRefResponse.json().catch(() => ({}))
      console.error('❌ 更新分支失败:', {
        status: updateRefResponse.status,
        statusText: updateRefResponse.statusText,
        errorData
      })
      throw new Error(`更新分支失败 (${updateRefResponse.status}): ${errorData.message || updateRefResponse.statusText}`)
    }
    
    console.log('✅ 批量提交成功! Commit:', commitData.sha.substring(0, 7))
    
    // 5. 成功
    uploadStatus.value = { 
      type: 'success', 
      message: `✅ 相册创建成功! 已提交 ${blobs.length} 个文件。GitHub Actions 将自动部署到服务器...` 
    }
    
    setTimeout(() => {
      closeAdminModal()
      // 刷新页面以显示新相册
      window.location.reload()
    }, 2000)
    
  } catch (error: any) {
    console.error('上传失败:', error)
    uploadStatus.value = { 
      type: 'error', 
      message: `❌ 上传失败: ${error.message}` 
    }
  } finally {
    isUploading.value = false
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function generateMarkdownContent({ title, date, description, password, photos }: any) {
  const photosYaml = photos.map((p: any) => 
    `  - caption: ${p.caption}\n    src: ${p.src}\n    desc: ${p.desc}`
  ).join('\n')
  
  return `---
title: ${title}
date: ${date}
layout: gallery
${password ? `password: ${password}` : ''}
photos:
${photosYaml}
---

${description || ''}
`
}

function manageToken() {
  if (typeof window === 'undefined') return
  
  const currentToken = localStorage.getItem('GITHUB_TOKEN') || ''
  const action = currentToken 
    ? `当前 Token: ${currentToken.substring(0, 10)}...\n\n选择操作:\n- 输入新 Token 替换\n- 点击取消保持不变\n- 输入空值清除`
    : '请输入你的 GitHub Token (ghp_...)'
  
  const newToken = prompt(action, currentToken)
  
  if (newToken !== null) {
    if (newToken.trim()) {
      localStorage.setItem('GITHUB_TOKEN', newToken.trim())
      alert('✅ Token 已保存! 你现在可以创建相册了')
    } else {
      localStorage.removeItem('GITHUB_TOKEN')
      alert('Token 已清除')
    }
  }
}
</script>

<style lang="scss">
.calendar-grid {
  /* fixed responsive cell size to guarantee consistent grid width */
  --cal-cell: clamp(3rem, 4.5vw, 4.5rem);
  display: grid;
  grid-template-columns: repeat(7, var(--cal-cell));
  gap: 0.6rem;
  justify-content: center; /* center the whole calendar regardless of container width */
}
.calendar-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  /* lock actions width to calendar width to avoid header pushing layout */
  max-width: calc(7 * var(--cal-cell) + 6 * 0.6rem);
  margin-left: auto;
  margin-right: auto;
}
.weekday { text-align: center; font-weight: 600; padding: 0.25rem 0 }
.day-cell {
  width: var(--cal-cell);
  height: calc(var(--cal-cell) * 0.95);
  border-radius: 0.5rem;
  padding: 0.25rem;
  background: var(--va-c-bg);
  box-sizing: border-box;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.day-cell.other { opacity: 0.45 }
.day-cell.today { box-shadow: 0 0 0 2px rgba(127, 199, 235, 0.644); }
.day-link { display:flex; flex-direction:column; align-items:flex-start; gap:0.25rem; padding:0.5rem; text-decoration:none; color:inherit; width:100%; box-sizing:border-box; overflow:hidden; min-width: 0; flex: 1 1 auto }
.day-num { font-weight:700 }
.day-num { font-weight:700; position: relative; z-index: 1 }

/* uniform cell content: only date number */
.day-link, .day-empty { display:flex; align-items:center; justify-content:center; height:100%; width:100% }

/* highlight cells that have albums */
.has-album {
  border: 1.5px solid rgba(var(--va-c-primary-rgb),0.35);
  background: rgba(var(--va-c-primary-rgb),0.18);
}
.album-badge {
  position: absolute;
  right: 0.45rem;
  bottom: 0.35rem;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--va-c-primary);
  box-shadow: 0 0 2px rgba(0,0,0,0.12);
  z-index: 2;
  pointer-events: none;
}
@media (max-width: 600px) {
  .calendar-grid {
    --cal-cell: clamp(2.1rem, 12vw, 2.7rem);
    gap: 0.28rem;
  }
  .album-badge {
    right: 0.18rem;
    bottom: 0.18rem;
    width: 0.38rem;
    height: 0.38rem;
  }
}
.albums-lock {
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 4rem 0;
}
.albums-lock-box {
  background: rgba(var(--va-c-bg-rgb), 0.9);
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: min(360px, 90%);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center;
}
.albums-input { width: 100%; padding: 0.6rem 0.75rem; margin-top: 0.75rem; border-radius: 6px; border: 1px solid rgba(0,0,0,0.08) }
.albums-lock-actions { display:flex; gap:0.6rem; justify-content:center; margin-top:0.8rem }
.albums-error { color: #e85959; margin-top: 0.6rem }

/* Album Admin Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: var(--va-c-bg);
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(var(--va-c-text-rgb), 0.1);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--va-c-text);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--va-c-text);
  opacity: 0.6;
  transition: opacity 0.3s;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(var(--va-c-text-rgb), 0.1);
}

.modal-footer button:disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
  filter: grayscale(0.3);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--va-c-text);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(var(--va-c-text-rgb), 0.15);
  border-radius: 6px;
  background: var(--va-c-bg-soft);
  color: var(--va-c-text);
  font-size: 0.95rem;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--va-c-primary);
  box-shadow: 0 0 0 3px rgba(var(--va-c-primary-rgb), 0.1);
}

.form-input-sm {
  padding: 0.5rem;
  font-size: 0.875rem;
}

.upload-area {
  border: 2px dashed rgba(var(--va-c-text-rgb), 0.2);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--va-c-bg-soft);
}

.upload-area:hover {
  border-color: var(--va-c-primary);
  background: rgba(var(--va-c-primary-rgb), 0.05);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(var(--va-c-text-rgb), 0.1);
  background: var(--va-c-bg-soft);
}

.preview-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.preview-info {
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.preview-info input {
  flex: 1;
  min-width: 0;
}

.remove-btn {
  background: #e85959;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #d63939;
}

.status-message {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.status-message.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-message.success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-message.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

@media (max-width: 600px) {
  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>

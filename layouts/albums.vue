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
</style>

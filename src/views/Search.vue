<template>
  <div class="search-container">
    <header class="search-header">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="keyword" 
          type="text" 
          placeholder="输入装备名称或类别进行检索"
          class="search-input"
          @input="handleSearch"
        />
        <button v-if="keyword" class="clear-btn" @click="clearSearch">✕</button>
      </div>
    </header>

    <div v-if="suggestions.length > 0 && !keyword" class="suggestions">
      <h4 class="suggestions-title">热门检索</h4>
      <div class="suggestions-list">
        <button 
          v-for="suggestion in suggestions" 
          :key="suggestion"
          class="suggestion-item"
          @click="keyword = suggestion; handleSearch()"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <div v-if="keyword && results.length > 0" class="results">
      <h4 class="results-title">找到 {{ results.length }} 个结果</h4>
      <div class="results-list">
        <div 
          v-for="result in results" 
          :key="result.id" 
          class="result-card"
        >
          <div class="result-header">
            <span class="toolbox-icon">{{ result.toolboxIcon }}</span>
            <span class="toolbox-name">{{ result.toolboxName }}</span>
          </div>
          <div class="result-body">
            <div class="tool-info">
              <span class="tool-name">{{ result.name }}</span>
              <span class="tool-category">{{ result.category }}</span>
            </div>
            <div class="location-info">
              <span class="location-icon">📍</span>
              <span class="location-text">{{ result.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="keyword && results.length === 0" class="empty-results">
      <span class="empty-icon">🔍</span>
      <p>未找到相关装备</p>
      <p class="empty-hint">尝试其他关键词或添加新装备</p>
    </div>

    <div v-if="!keyword && suggestions.length === 0" class="empty-state">
      <span class="empty-icon">🔎</span>
      <p>开始检索装备</p>
      <p class="empty-hint">输入装备名称或类别，快速定位装备位置</p>
    </div>

    <div v-if="showHistory" class="history-section">
      <div class="history-header">
        <h4 class="history-title">搜索历史</h4>
        <button class="clear-history-btn" @click="clearHistory">清空</button>
      </div>
      <div class="history-list">
        <button 
          v-for="(item, index) in searchHistory" 
          :key="index"
          class="history-item"
          @click="keyword = item; handleSearch()"
        >
          <span>📝</span>
          <span>{{ item }}</span>
        </button>
      </div>
    </div>

    <div v-if="!keyword && searchHistory.length > 0" class="history-toggle">
      <button class="toggle-history-btn" @click="showHistory = !showHistory">
        {{ showHistory ? '收起' : '展开' }}搜索历史
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { searchTools } from '../data/tools'

const keyword = ref('')
const results = ref([])
const searchHistory = ref([])
const showHistory = ref(false)

const suggestions = [
  '帐篷',
  '卡式炉',
  '头灯',
  '拖车绳',
  '千斤顶',
  '扳手'
]

const HISTORY_KEY = 'camping_search_history'

onMounted(() => {
  const history = localStorage.getItem(HISTORY_KEY)
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
})

watch(keyword, (newVal) => {
  if (newVal) {
    handleSearch()
  } else {
    results.value = []
  }
})

function handleSearch() {
  if (!keyword.value.trim()) {
    results.value = []
    return
  }
  
  results.value = searchTools(keyword.value)
  
  if (!searchHistory.value.includes(keyword.value)) {
    searchHistory.value.unshift(keyword.value)
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory.value))
  }
}

function clearSearch() {
  keyword.value = ''
  results.value = []
}

function clearHistory() {
  searchHistory.value = []
  localStorage.removeItem(HISTORY_KEY)
}
</script>

<style scoped>
.search-container {
  padding: 16px;
  min-height: 100vh;
}

.search-header {
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 12px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.search-icon {
  font-size: 18px;
  margin-right: 12px;
  color: #999;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
}

.clear-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0f0f0;
  border: none;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggestions {
  margin-bottom: 20px;
}

.suggestions-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-item {
  padding: 8px 16px;
  background: white;
  border: 1px solid #eee;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-item:hover {
  background: rgba(39, 174, 96, 0.05);
  border-color: #27ae60;
  color: #27ae60;
}

.results {
  margin-bottom: 20px;
}

.results-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.toolbox-icon {
  font-size: 28px;
  margin-right: 8px;
}

.toolbox-name {
  font-size: 14px;
  font-weight: 600;
  color: #27ae60;
}

.result-body {
  padding-left: 36px;
}

.tool-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.tool-name {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
}

.tool-category {
  font-size: 11px;
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.location-icon {
  font-size: 14px;
}

.location-text {
  font-size: 14px;
  color: #666;
}

.empty-results,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-results p,
.empty-state p {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14 !important;
  color: #999 !important;
}

.history-section {
  margin-top: 20px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.clear-history-btn {
  font-size: 12px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #eee;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  background: rgba(39, 174, 96, 0.05);
  border-color: #27ae60;
}

.history-toggle {
  margin-top: 16px;
  text-align: center;
}

.toggle-history-btn {
  font-size: 13px;
  color: #27ae60;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}
</style>

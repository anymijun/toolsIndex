<template>
  <div class="app-container">
    <header v-if="isLoggedIn && currentUser" class="top-header">
      <div class="user-info">
        <span class="user-icon">👤</span>
        <span class="user-name">{{ currentUser.nickname }}</span>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <span>退出</span>
      </button>
    </header>
    <router-view />
    <nav class="bottom-nav">
      <button 
        class="nav-item" 
        :class="{ active: $route.name === 'Home' }"
        @click="$router.push('/')"
      >
        <span class="nav-icon">🎒</span>
        <span class="nav-text">装备包</span>
      </button>
      <button 
        class="nav-item" 
        :class="{ active: $route.name === 'Search' }"
        @click="$router.push('/search')"
      >
        <span class="nav-icon">🔍</span>
        <span class="nav-text">检索</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCurrentUser, logout, isLoggedIn as checkLogin } from './data/auth'

const currentUser = ref(null)
const isLoggedIn = ref(false)

onMounted(() => {
  refreshUser()
})

function refreshUser() {
  currentUser.value = getCurrentUser()
  isLoggedIn.value = checkLogin()
}

function handleLogout() {
  logout()
  window.location.href = '/login'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  padding-bottom: 70px;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-icon {
  font-size: 20px;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.logout-btn {
  padding: 8px 16px;
  background: #f8f9fa;
  border: none;
  border-radius: 20px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #e9ecef;
  color: #333;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding: 8px 0;
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-text {
  font-size: 12px;
  color: #666666;
}

.nav-item.active .nav-text {
  color: #27ae60;
  font-weight: 500;
}
</style>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <span class="logo-icon">🏕️</span>
        <h1 class="app-title">露营装备管理</h1>
      </div>
      
      <div v-if="!isRegisterMode" class="form-container">
        <h2 class="form-title">登录</h2>
        <div class="form-group">
          <label>手机号码</label>
          <input 
            v-model="phone" 
            type="tel" 
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
          />
        </div>
        <button class="submit-btn" @click="handleLogin">登录</button>
        <div class="form-footer">
          <span class="switch-link" @click="isRegisterMode = true">
            还没有账号？立即注册
          </span>
        </div>
      </div>

      <div v-else class="form-container">
        <h2 class="form-title">注册</h2>
        <div class="form-group">
          <label>手机号码</label>
          <input 
            v-model="phone" 
            type="tel" 
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="请输入密码（至少6位）"
          />
        </div>
        <div class="form-group">
          <label>昵称（选填）</label>
          <input 
            v-model="nickname" 
            type="text" 
            placeholder="请输入昵称"
          />
        </div>
        <button class="submit-btn" @click="handleRegister">注册</button>
        <div class="form-footer">
          <span class="switch-link" @click="isRegisterMode = false">
            已有账号？立即登录
          </span>
        </div>
      </div>

      <div v-if="message" class="message" :class="{ error: isError }">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../data/auth'

const router = useRouter()

const phone = ref('')
const password = ref('')
const nickname = ref('')
const isRegisterMode = ref(false)
const message = ref('')
const isError = ref(false)

function showMessage(msg, error = false) {
  message.value = msg
  isError.value = error
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

function handleLogin() {
  if (!phone.value.trim()) {
    showMessage('请输入手机号码', true)
    return
  }
  if (phone.value.length !== 11) {
    showMessage('请输入正确的手机号码', true)
    return
  }
  if (!password.value.trim()) {
    showMessage('请输入密码', true)
    return
  }

  const result = login(phone.value, password.value)
  if (result.success) {
    showMessage('登录成功')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } else {
    showMessage(result.message, true)
  }
}

function handleRegister() {
  if (!phone.value.trim()) {
    showMessage('请输入手机号码', true)
    return
  }
  if (phone.value.length !== 11) {
    showMessage('请输入正确的手机号码', true)
    return
  }
  if (!password.value.trim()) {
    showMessage('请输入密码', true)
    return
  }
  if (password.value.length < 6) {
    showMessage('密码至少需要6位', true)
    return
  }

  const result = register(phone.value, password.value, nickname.value)
  if (result.success) {
    showMessage('注册成功，请登录')
    isRegisterMode.value = false
    phone.value = ''
    password.value = ''
    nickname.value = ''
  } else {
    showMessage(result.message, true)
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 12px;
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.form-container {
  margin-bottom: 20px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #27ae60;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
  transition: transform 0.2s;
}

.submit-btn:active {
  transform: scale(0.98);
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.switch-link {
  color: #27ae60;
  font-size: 14px;
  cursor: pointer;
}

.message {
  text-align: center;
  padding: 12px;
  border-radius: 10px;
  margin-top: 16px;
  font-size: 14px;
}

.message.error {
  background: #ffeaea;
  color: #e74c3c;
}

.message:not(.error) {
  background: #e8f5e9;
  color: #27ae60;
}
</style>

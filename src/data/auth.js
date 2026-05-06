const AUTH_KEY = 'camping_auth'
const USERS_KEY = 'camping_users'

const mockUsers = [
  {
    id: 'u1',
    phone: '13800138000',
    password: '123456',
    nickname: '户外达人'
  }
]

export function getUsers() {
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : mockUsers
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function register(phone, password, nickname) {
  const users = getUsers()
  
  if (users.find(u => u.phone === phone)) {
    return { success: false, message: '该手机号已被注册' }
  }
  
  const newUser = {
    id: Date.now().toString(),
    phone,
    password,
    nickname: nickname || `用户${phone.slice(-4)}`
  }
  
  users.push(newUser)
  saveUsers(users)
  
  return { success: true, message: '注册成功', user: newUser }
}

export function login(phone, password) {
  const users = getUsers()
  const user = users.find(u => u.phone === phone && u.password === password)
  
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    return { success: true, message: '登录成功', user }
  }
  
  return { success: false, message: '手机号或密码错误' }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export function getCurrentUser() {
  const data = localStorage.getItem(AUTH_KEY)
  return data ? JSON.parse(data) : null
}

export function isLoggedIn() {
  return !!getCurrentUser()
}

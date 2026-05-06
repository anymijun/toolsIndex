<template>
  <div class="home-container">
    <header class="header">
      <h1 class="title">露营装备管理</h1>
      <button class="add-btn" @click="showAddToolbox = true">
        <span>+</span>
      </button>
    </header>

    <div class="toolboxes-grid">
      <div 
        v-for="toolbox in toolboxes" 
        :key="toolbox.id" 
        class="toolbox-card"
      >
        <div class="toolbox-header">
          <span class="toolbox-icon">{{ toolbox.icon }}</span>
          <div class="toolbox-info">
            <h3 class="toolbox-name">{{ toolbox.name }}</h3>
            <span class="tool-count">{{ toolbox.tools.length }} 件装备</span>
          </div>
          <button class="delete-toolbox-btn" @click="confirmDeleteToolbox(toolbox.id)">
            <span>✕</span>
          </button>
        </div>

        <div class="tools-list">
          <div 
            v-for="tool in toolbox.tools" 
            :key="tool.id" 
            class="tool-item"
          >
            <div class="tool-info">
              <span class="tool-name">{{ tool.name }}</span>
              <span class="tool-category">{{ tool.category }}</span>
            </div>
            <div class="tool-location">
              <span>📍 {{ tool.location }}</span>
            </div>
            <button class="delete-tool-btn" @click="deleteTool(toolbox.id, tool.id)">
              <span>✕</span>
            </button>
          </div>

          <button 
            v-if="toolbox.tools.length < 10" 
            class="add-tool-btn"
            @click="openAddTool(toolbox)"
          >
            <span>+ 添加装备</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="toolboxes.length === 0" class="empty-state">
      <span class="empty-icon">🏕️</span>
      <p>暂无装备包</p>
      <button class="empty-add-btn" @click="showAddToolbox = true">
        创建第一个装备包
      </button>
    </div>

    <div v-if="showAddToolbox" class="modal-overlay" @click.self="showAddToolbox = false">
      <div class="modal">
        <h3>创建装备包</h3>
        <div class="form-group">
          <label>装备包名称</label>
          <input 
            v-model="newToolbox.name" 
            type="text" 
            placeholder="请输入装备包名称"
          />
        </div>
        <div class="form-group">
          <label>选择图标</label>
          <div class="icon-selector">
            <button 
              v-for="icon in icons" 
              :key="icon" 
              class="icon-btn"
              :class="{ selected: newToolbox.icon === icon }"
              @click="newToolbox.icon = icon"
            >
              {{ icon }}
            </button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showAddToolbox = false">取消</button>
          <button class="btn-confirm" @click="createToolbox">确认创建</button>
        </div>
      </div>
    </div>

    <div v-if="showAddTool" class="modal-overlay" @click.self="showAddTool = false">
      <div class="modal">
        <h3>添加装备</h3>
        <div class="form-group">
          <label>装备名称</label>
          <input 
            v-model="newTool.name" 
            type="text" 
            placeholder="请输入装备名称"
          />
        </div>
        <div class="form-group">
          <label>装备类别</label>
          <select v-model="newTool.category">
            <option value="住宿装备">住宿装备</option>
            <option value="烹饪工具">烹饪工具</option>
            <option value="照明装备">照明装备</option>
            <option value="服装">服装</option>
            <option value="鞋类">鞋类</option>
            <option value="餐具">餐具</option>
            <option value="饮水装备">饮水装备</option>
            <option value="固定装备">固定装备</option>
            <option value="点火工具">点火工具</option>
            <option value="配件">配件</option>
            <option value="配饰">配饰</option>
            <option value="救援工具">救援工具</option>
            <option value="电气设备">电气设备</option>
            <option value="安全装备">安全装备</option>
            <option value="消防设备">消防设备</option>
            <option value="医疗用品">医疗用品</option>
            <option value="举升工具">举升工具</option>
            <option value="维修工具">维修工具</option>
            <option value="专用工具">专用工具</option>
            <option value="电气配件">电气配件</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div class="form-group">
          <label>存放位置</label>
          <input 
            v-model="newTool.location" 
            type="text" 
            placeholder="请输入存放位置"
          />
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showAddTool = false">取消</button>
          <button class="btn-confirm" @click="addToolToToolbox">确认添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getToolboxes, saveToolboxes, addToolbox, deleteToolbox, addTool, deleteTool as removeTool } from '../data/tools'

const toolboxes = ref([])
const showAddToolbox = ref(false)
const showAddTool = ref(false)
const currentToolbox = ref(null)

const newToolbox = ref({
  name: '',
  icon: '⛺'
})

const newTool = ref({
  name: '',
  category: '住宿装备',
  location: ''
})

const icons = ['⛺', '🍳', '💡', '🧥', '🥾', '🎒', '�', '⚡', '🌲', '🏕️']

onMounted(() => {
  toolboxes.value = getToolboxes()
})

function createToolbox() {
  if (!newToolbox.value.name.trim()) {
    alert('请输入装备包名称')
    return
  }
  toolboxes.value = addToolbox(newToolbox.value)
  newToolbox.value = { name: '', icon: '⛺' }
  showAddToolbox.value = false
}

function confirmDeleteToolbox(id) {
  if (confirm('确定要删除这个装备包吗？所有装备也会被删除。')) {
    toolboxes.value = deleteToolbox(id)
  }
}

function openAddTool(toolbox) {
  currentToolbox.value = toolbox
  newTool.value = { name: '', category: '住宿装备', location: '' }
  showAddTool.value = true
}

function addToolToToolbox() {
  if (!newTool.value.name.trim()) {
    alert('请输入装备名称')
    return
  }
  if (!newTool.value.location.trim()) {
    alert('请输入存放位置')
    return
  }
  toolboxes.value = addTool(currentToolbox.value.id, newTool.value)
  showAddTool.value = false
}

function deleteTool(toolboxId, toolId) {
  if (confirm('确定要删除这个装备吗？')) {
    toolboxes.value = removeTool(toolboxId, toolId)
  }
}
</script>

<style scoped>
.home-container {
  padding: 16px;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.add-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border: none;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.3);
  cursor: pointer;
  transition: transform 0.2s;
}

.add-btn:active {
  transform: scale(0.95);
}

.toolboxes-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbox-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.toolbox-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.toolbox-icon {
  font-size: 32px;
  margin-right: 12px;
}

.toolbox-info {
  flex: 1;
}

.toolbox-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.tool-count {
  font-size: 12px;
  color: #999;
}

.delete-toolbox-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  color: #999;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-toolbox-btn:hover {
  background: #ffeaea;
  color: #e74c3c;
}

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 10px;
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: block;
}

.tool-category {
  font-size: 11px;
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.tool-location {
  font-size: 12px;
  color: #666;
  margin-right: 8px;
}

.delete-tool-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #ccc;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-tool-btn:hover {
  background: #ffeaea;
  color: #e74c3c;
}

.add-tool-btn {
  padding: 10px;
  background: transparent;
  border: 1px dashed #ddd;
  border-radius: 10px;
  color: #999;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-tool-btn:hover {
  border-color: #27ae60;
  color: #27ae60;
}

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

.empty-state p {
  font-size: 16px;
  color: #999;
  margin-bottom: 20px;
}

.empty-add-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  padding: 24px;
}

.modal h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #1a1a1a;
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #27ae60;
}

.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 2px solid #eee;
  background: white;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn.selected {
  border-color: #27ae60;
  background: rgba(39, 174, 96, 0.05);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-confirm {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
}

.btn-cancel:active,
.btn-confirm:active {
  transform: scale(0.98);
}
</style>

import { getCurrentUser } from './auth'

const STORAGE_KEY = 'camping_data'

const defaultData = {
  'default': [
    {
      id: '1',
      name: '帐篷装备包',
      icon: '⛺',
      tools: [
        { id: 't1', name: '帐篷主体', location: '主收纳袋', category: '住宿装备' },
        { id: 't2', name: '地布', location: '侧袋', category: '住宿装备' },
        { id: 't3', name: '风绳', location: '网袋', category: '固定装备' },
        { id: 't4', name: '地钉', location: '小收纳盒', category: '固定装备' }
      ]
    },
    {
      id: '2',
      name: '厨房炊具包',
      icon: '🍳',
      tools: [
        { id: 't5', name: '卡式炉', location: '下层隔层', category: '烹饪工具' },
        { id: 't6', name: '锅具套装', location: '中层', category: '烹饪工具' },
        { id: 't7', name: '餐具', location: '小拉链袋', category: '餐具' },
        { id: 't8', name: '水壶', location: '侧袋', category: '饮水装备' }
      ]
    },
    {
      id: '3',
      name: '照明工具包',
      icon: '💡',
      tools: [
        { id: 't9', name: '头灯', location: '顶部网袋', category: '照明装备' },
        { id: 't10', name: '营地灯', location: '主袋', category: '照明装备' },
        { id: 't11', name: '备用电池', location: '小口袋', category: '配件' },
        { id: 't12', name: '火柴', location: '防水盒', category: '点火工具' }
      ]
    },
    {
      id: '4',
      name: '户外服装包',
      icon: '🧥',
      tools: [
        { id: 't13', name: '冲锋衣', location: '上层', category: '服装' },
        { id: 't14', name: '登山鞋', location: '底部', category: '鞋类' },
        { id: 't15', name: '保暖手套', location: '侧袋', category: '配饰' },
        { id: 't16', name: '遮阳帽', location: '顶袋', category: '配饰' }
      ]
    },
    {
      id: '5',
      name: '车辆救援包',
      icon: '🛻',
      tools: [
        { id: 't17', name: '拖车绳', location: '主袋', category: '救援工具' },
        { id: 't18', name: '应急启动电源', location: '防震隔层', category: '电气设备' },
        { id: 't19', name: '三角警示牌', location: '外侧袋', category: '安全装备' },
        { id: 't20', name: '灭火器', location: '专用位', category: '消防设备' },
        { id: 't21', name: '应急手电', location: '小网袋', category: '照明装备' },
        { id: 't22', name: '急救包', location: '侧袋', category: '医疗用品' }
      ]
    },
    {
      id: '6',
      name: '车辆维修包',
      icon: '🔧',
      tools: [
        { id: 't23', name: '套筒扳手组', location: '上层隔层', category: '手动工具' },
        { id: 't24', name: '螺丝刀套装', location: '中层', category: '手动工具' },
        { id: 't25', name: '千斤顶', location: '底部', category: '举升工具' },
        { id: 't26', name: '轮胎扳手', location: '侧袋', category: '手动工具' },
        { id: 't27', name: '补胎工具', location: '小收纳包', category: '维修工具' },
        { id: 't28', name: '机油滤清器扳手', location: '网袋', category: '专用工具' },
        { id: 't29', name: '万用表', location: '防震盒', category: '测量工具' },
        { id: 't30', name: '备用保险丝', location: '小盒子', category: '电气配件' }
      ]
    }
  ]
}

function getUserKey() {
  const user = getCurrentUser()
  return user ? user.id : 'default'
}

export function getToolboxes() {
  const data = localStorage.getItem(STORAGE_KEY)
  const allData = data ? JSON.parse(data) : defaultData
  const userKey = getUserKey()
  
  if (!allData[userKey]) {
    allData[userKey] = JSON.parse(JSON.stringify(defaultData['default']))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
  }
  
  return allData[userKey]
}

export function saveToolboxes(toolboxes) {
  const data = localStorage.getItem(STORAGE_KEY)
  const allData = data ? JSON.parse(data) : defaultData
  const userKey = getUserKey()
  
  allData[userKey] = toolboxes
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
}

export function addToolbox(toolbox) {
  const toolboxes = getToolboxes()
  toolboxes.push({
    id: Date.now().toString(),
    ...toolbox,
    tools: []
  })
  saveToolboxes(toolboxes)
  return toolboxes
}

export function deleteToolbox(id) {
  const toolboxes = getToolboxes()
  const filtered = toolboxes.filter(tb => tb.id !== id)
  saveToolboxes(filtered)
  return filtered
}

export function addTool(toolboxId, tool) {
  const toolboxes = getToolboxes()
  const toolbox = toolboxes.find(tb => tb.id === toolboxId)
  if (toolbox) {
    toolbox.tools.push({
      id: Date.now().toString(),
      ...tool
    })
    saveToolboxes(toolboxes)
  }
  return toolboxes
}

export function deleteTool(toolboxId, toolId) {
  const toolboxes = getToolboxes()
  const toolbox = toolboxes.find(tb => tb.id === toolboxId)
  if (toolbox) {
    toolbox.tools = toolbox.tools.filter(t => t.id !== toolId)
    saveToolboxes(toolboxes)
  }
  return toolboxes
}

export function searchTools(keyword) {
  const toolboxes = getToolboxes()
  const results = []
  toolboxes.forEach(toolbox => {
    toolbox.tools.forEach(tool => {
      if (tool.name.toLowerCase().includes(keyword.toLowerCase()) ||
          tool.category.toLowerCase().includes(keyword.toLowerCase())) {
        results.push({
          toolboxName: toolbox.name,
          toolboxIcon: toolbox.icon,
          ...tool
        })
      }
    })
  })
  return results
}

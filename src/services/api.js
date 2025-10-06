let defects = [
  {
    id: '1',
    title: 'Трещина в несущей стене',
    description: 'Обнаружена вертикальная трещина в несущей стене на 3 этаже',
    projectId: '1',
    priority: 'high',
    status: 'in_progress',
    assigneeId: '2',
    createdBy: '1',
    createdAt: '2024-01-15',
    dueDate: '2024-02-01',
    comments: [
      {
        id: '1',
        text: 'Требуется срочный осмотр конструктора',
        authorId: '1',
        createdAt: '2024-01-15T10:30:00'
      }
    ]
  }
]

let projects = [
  {
    id: '1',
    name: 'ЖК "Северный"',
    description: 'Многоэтажный жилой комплекс',
    address: 'ул. Северная, 123',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
]

let users = [
  { id: '1', name: 'Иван Менеджеров', role: 'manager' },
  { id: '2', name: 'Петр Инженеров', role: 'engineer' },
  { id: '3', name: 'Сергей Наблюдателей', role: 'observer' }
]

export const getDefects = async () => {
  return new Promise(resolve => setTimeout(() => resolve(defects), 500))
}

export const getDefect = async (id) => {
  return new Promise(resolve => setTimeout(() => {
    resolve(defects.find(d => d.id === id))
  }, 500))
}

export const updateDefect = async (id, data) => {
  return new Promise(resolve => setTimeout(() => {
    if (typeof id === 'object') {
      // Create new defect
      const newDefect = {
        ...id,
        id: Date.now().toString()
      }
      defects.push(newDefect)
      resolve(newDefect)
    } else {
      // Update existing defect
      const index = defects.findIndex(d => d.id === id)
      if (index !== -1) {
        defects[index] = { ...defects[index], ...data }
        resolve(defects[index])
      }
    }
  }, 500))
}

export const getProjects = async () => {
  return new Promise(resolve => setTimeout(() => resolve(projects), 500))
}

export const createProject = async (data) => {
  return new Promise(resolve => setTimeout(() => {
    const newProject = {
      ...data,
      id: Date.now().toString()
    }
    projects.push(newProject)
    resolve(newProject)
  }, 500))
}

export const updateProject = async (id, data) => {
  return new Promise(resolve => setTimeout(() => {
    const index = projects.findIndex(p => p.id === id)
    if (index !== -1) {
      projects[index] = { ...projects[index], ...data }
      resolve(projects[index])
    }
  }, 500))
}

export const getUsers = async () => {
  return new Promise(resolve => setTimeout(() => resolve(users), 500))
}

export const addComment = async (defectId, comment) => {
  return new Promise(resolve => setTimeout(() => {
    const defect = defects.find(d => d.id === defectId)
    if (defect) {
      if (!defect.comments) defect.comments = []
      defect.comments.push({
        ...comment,
        id: Date.now().toString()
      })
    }
    resolve(defect)
  }, 500))
}
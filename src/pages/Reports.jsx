import React, { useState, useEffect } from 'react'
import { getDefects, getProjects } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function Reports() {
  const [defects, setDefects] = useState([])
  const [projects, setProjects] = useState([])
  const [filters, setFilters] = useState({
    project: '',
    startDate: '',
    endDate: ''
  })
  const { user } = useAuth()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [defectsData, projectsData] = await Promise.all([
      getDefects(),
      getProjects()
    ])
    setDefects(defectsData)
    setProjects(projectsData)
  }

  const generateReport = () => {
    let filtered = defects

    if (filters.project) {
      filtered = filtered.filter(d => d.projectId === filters.project)
    }
    if (filters.startDate) {
      filtered = filtered.filter(d => d.createdAt >= filters.startDate)
    }
    if (filters.endDate) {
      filtered = filtered.filter(d => d.createdAt <= filters.endDate)
    }

    return filtered
  }

  const exportToCSV = () => {
    const reportData = generateReport()
    const headers = ['Название', 'Проект', 'Статус', 'Приоритет', 'Исполнитель', 'Дата создания', 'Срок']
    
    const csvContent = [
      headers.join(','),
      ...reportData.map(defect => [
        `"${defect.title}"`,
        `"${projects.find(p => p.id === defect.projectId)?.name || ''}"`,
        `"${getStatusText(defect.status)}"`,
        `"${getPriorityText(defect.priority)}"`,
        `"${defect.assigneeId}"`,
        `"${defect.createdAt}"`,
        `"${defect.dueDate}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `defects_report_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  const getStatusText = (status) => {
    const statusMap = {
      new: 'Новая',
      in_progress: 'В работе',
      in_review: 'На проверке',
      closed: 'Закрыта'
    }
    return statusMap[status] || status
  }

  const getPriorityText = (priority) => {
    const priorityMap = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий'
    }
    return priorityMap[priority] || priority
  }

  const reportData = generateReport()

  return (
    <div className="reports">
      <h1>Отчеты</h1>

      <div className="report-filters">
        <div className="filter-group">
          <select 
            value={filters.project} 
            onChange={(e) => setFilters({...filters, project: e.target.value})}
          >
            <option value="">Все проекты</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            placeholder="Дата начала"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            placeholder="Дата окончания"
          />

          <button onClick={exportToCSV} className="btn-primary">
            Экспорт в CSV
          </button>
        </div>
      </div>

      <div className="report-stats">
        <h2>Статистика</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Всего дефектов</h3>
            <div className="stat-number">{reportData.length}</div>
          </div>
          <div className="stat-card">
            <h3>Новые</h3>
            <div className="stat-number">{reportData.filter(d => d.status === 'new').length}</div>
          </div>
          <div className="stat-card">
            <h3>В работе</h3>
            <div className="stat-number">{reportData.filter(d => d.status === 'in_progress').length}</div>
          </div>
          <div className="stat-card">
            <h3>Закрыто</h3>
            <div className="stat-number">{reportData.filter(d => d.status === 'closed').length}</div>
          </div>
        </div>
      </div>

      <div className="report-table">
        <h2>Детальный отчет</h2>
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Проект</th>
              <th>Статус</th>
              <th>Приоритет</th>
              <th>Дата создания</th>
              <th>Срок</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map(defect => (
              <tr key={defect.id}>
                <td>{defect.title}</td>
                <td>{projects.find(p => p.id === defect.projectId)?.name}</td>
                <td>
                  <span className={`status ${defect.status}`}>
                    {getStatusText(defect.status)}
                  </span>
                </td>
                <td>
                  <span className={`priority ${defect.priority}`}>
                    {getPriorityText(defect.priority)}
                  </span>
                </td>
                <td>{new Date(defect.createdAt).toLocaleDateString()}</td>
                <td>{defect.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports
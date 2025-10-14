// src/pages/DefectDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom' // Добавляем useLocation
import { getDefect, updateDefect, getProjects, getUsers, addComment } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function DefectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation() // Для определения режима
  const { user } = useAuth()
  
  const isCreate = location.pathname === '/defects/create' || id === 'create'

  const [defect, setDefect] = useState(null)
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    assigneeId: '',
    dueDate: '',
    status: 'new'
  })

  useEffect(() => {
    if (!isCreate) {
      loadDefect()
    }
    loadSupportingData()
  }, [id, isCreate])

  const loadDefect = async () => {
    try {
      const data = await getDefect(id)
      if (data) {
        setDefect(data)
        setFormData({
          title: data.title,
          description: data.description,
          projectId: data.projectId,
          priority: data.priority,
          assigneeId: data.assigneeId,
          dueDate: data.dueDate,
          status: data.status
        })
      }
    } catch (error) {
      console.error('Ошибка загрузки дефекта:', error)
    }
  }

  const loadSupportingData = async () => {
    try {
      const [projectsData, usersData] = await Promise.all([
        getProjects(),
        getUsers()
      ])
      setProjects(projectsData)
      setUsers(usersData)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isCreate) {
        // Создание нового дефекта
        await updateDefect({
          ...formData,
          createdBy: user.id,
          createdAt: new Date().toISOString().split('T')[0],
          comments: []
        })
      } else {
        // Обновление существующего дефекта
        await updateDefect(id, {
          ...formData,
          updatedAt: new Date().toISOString().split('T')[0]
        })
      }
      navigate('/defects')
    } catch (error) {
      console.error('Ошибка сохранения дефекта:', error)
      alert('Произошла ошибка при сохранении дефекта')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return

    try {
      await addComment(id, {
        text: comment,
        authorId: user.id,
        createdAt: new Date().toISOString()
      })
      setComment('')
      loadDefect() // Перезагрузка для обновления комментариев
    } catch (error) {
      console.error('Ошибка добавления комментария:', error)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDefect(id, { status: newStatus })
      loadDefect()
    } catch (error) {
      console.error('Ошибка изменения статуса:', error)
    }
  }

  if (!isCreate && !defect) {
    return <div className="loading">Загрузка дефекта...</div>
  }

  return (
    <div className="defect-detail">
      <div className="page-header">
        <h1>{isCreate ? 'Создание дефекта' : defect?.title}</h1>
        <button onClick={() => navigate('/defects')} className="btn-secondary">
          Назад к списку
        </button>
      </div>

      <div className="defect-content">
        <form onSubmit={handleSubmit} className="defect-form">
          <div className="form-group">
            <label>Название дефекта:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              placeholder="Введите название дефекта"
            />
          </div>

          <div className="form-group">
            <label>Описание:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              required
              placeholder="Подробное описание дефекта"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Проект:</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                required
              >
                <option value="">Выберите проект</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Приоритет:</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Исполнитель:</label>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData({...formData, assigneeId: e.target.value})}
              >
                <option value="">Назначить исполнителя</option>
                {users.filter(u => u.role === 'engineer').map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Срок исправления:</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
          </div>

          {!isCreate && (
            <div className="form-group">
              <label>Статус:</label>
              <div className="status-actions">
                {user?.role === 'manager' && (
                  <>
                    <button 
                      type="button"
                      onClick={() => handleStatusChange('new')}
                      className={defect?.status === 'new' ? 'active' : ''}
                    >
                      Новая
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleStatusChange('in_progress')}
                      className={defect?.status === 'in_progress' ? 'active' : ''}
                    >
                      В работе
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleStatusChange('in_review')}
                      className={defect?.status === 'in_review' ? 'active' : ''}
                    >
                      На проверке
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleStatusChange('closed')}
                      className={defect?.status === 'closed' ? 'active' : ''}
                    >
                      Закрыта
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Сохранение...' : (isCreate ? 'Создать дефект' : 'Сохранить изменения')}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/defects')} 
              className="btn-secondary"
            >
              Отмена
            </button>
          </div>
        </form>

        {!isCreate && defect && (
          <div className="defect-comments">
            <h3>Комментарии и история</h3>
            
            <div className="comment-form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Добавить комментарий..."
                rows="3"
              />
              <button onClick={handleAddComment} className="btn-primary">
                Добавить комментарий
              </button>
            </div>

            <div className="comments-list">
              {defect.comments && defect.comments.length > 0 ? (
                defect.comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <strong>{users.find(u => u.id === comment.authorId)?.name}</strong>
                      <span>{new Date(comment.createdAt).toLocaleString('ru-RU')}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p>Комментариев пока нет</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DefectDetail
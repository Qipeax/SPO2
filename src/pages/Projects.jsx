// src/pages/Projects.jsx
import React, { useState, useEffect } from "react";
import { getProjects, createProject, updateProject } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProject) {
      await updateProject(editingProject.id, formData);
    } else {
      await createProject(formData);
    }
    setShowForm(false);
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      address: "",
      startDate: "",
      endDate: "",
    });
    loadProjects();
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      address: project.address,
      startDate: project.startDate,
      endDate: project.endDate,
    });
    setShowForm(true);
  };

  return (
    <div className="projects">
      <div className="page-header">
        <h1>Проекты</h1>
        {user?.role === "manager" && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Новый проект
          </button>
        )}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingProject ? "Редактировать проект" : "Новый проект"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название проекта:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Описание:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Адрес:</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Дата начала:</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Дата окончания:</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingProject ? "Сохранить" : "Создать"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProject(null);
                  }}
                  className="btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="project-info">
              <span> 📍 {project.address}</span>
              <span>
                📅 {project.startDate} - {project.endDate}
              </span>
            </div>
            <div className="project-stats">
              <span>Дефектов: {project.defectCount || 0}</span>
            </div>
            {user?.role === "manager" && (
              <div className="project-actions">
                <button
                  onClick={() => handleEdit(project)}
                  className="btn-secondary"
                >
                  Редактировать
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;

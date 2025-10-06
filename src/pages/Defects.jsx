import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDefects, getProjects, getUsers } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function Defects() {
  const [defects, setDefects] = useState([]);
  const [filteredDefects, setFilteredDefects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    project: "",
    status: "",
    priority: "",
    assignee: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDefects();
  }, [defects, filters, searchTerm]);

  const loadData = async () => {
    const [defectsData, projectsData, usersData] = await Promise.all([
      getDefects(),
      getProjects(),
      getUsers(),
    ]);
    setDefects(defectsData);
    setProjects(projectsData);
    setUsers(usersData);
  };

  const filterDefects = () => {
    let filtered = defects;

    if (filters.project) {
      filtered = filtered.filter((d) => d.projectId === filters.project);
    }
    if (filters.status) {
      filtered = filtered.filter((d) => d.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter((d) => d.priority === filters.priority);
    }
    if (filters.assignee) {
      filtered = filtered.filter((d) => d.assigneeId === filters.assignee);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDefects(filtered);
  };

  const getStatusText = (status) => {
    const statusMap = {
      new: "Новая",
      in_progress: "В работе",
      in_review: "На проверке",
      closed: "Закрыта",
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      low: "Низкий",
      medium: "Средний",
      high: "Высокий",
    };
    return priorityMap[priority] || priority;
  };

  return (
    <div className="defects">
      <div className="page-header">
        <h1>Дефекты</h1>
        <Link to="/defects?create=new" className="btn-primary">
          + Новый дефект
        </Link>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={filters.project}
            onChange={(e) =>
              setFilters({ ...filters, project: e.target.value })
            }
          >
            <option value="">Все проекты</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Все статусы</option>
            <option value="new">Новая</option>
            <option value="in_progress">В работе</option>
            <option value="in_review">На проверке</option>
            <option value="closed">Закрыта</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="">Все приоритеты</option>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>

          <select
            value={filters.assignee}
            onChange={(e) =>
              setFilters({ ...filters, assignee: e.target.value })
            }
          >
            <option value="">Все исполнители</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="defects-list">
        {filteredDefects.map((defect) => (
          <div key={defect.id} className="defect-card">
            <div className="defect-header">
              <Link to={`/defects/${defect.id}`}>
                <h3>{defect.title}</h3>
              </Link>
              <div className="defect-meta">
                <span className={`priority ${defect.priority}`}>
                  {getPriorityText(defect.priority)}
                </span>
                <span className={`status ${defect.status}`}>
                  {getStatusText(defect.status)}
                </span>
              </div>
            </div>
            <p className="defect-description">{defect.description}</p>
            <div className="defect-footer">
              <span>
                Проект: {projects.find((p) => p.id === defect.projectId)?.name}
              </span>
              <span>
                Исполнитель:{" "}
                {users.find((u) => u.id === defect.assigneeId)?.name}
              </span>
              <span>Срок: {defect.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Defects;

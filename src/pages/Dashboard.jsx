// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDefects, getProjects } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalDefects: 0,
    openDefects: 0,
    inProgressDefects: 0,
    urgentDefects: 0,
  });
  const [recentDefects, setRecentDefects] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const defects = await getDefects();
    const projects = await getProjects();

    const totalDefects = defects.length;
    const openDefects = defects.filter((d) => d.status === "new").length;
    const inProgressDefects = defects.filter(
      (d) => d.status === "in_progress"
    ).length;
    const urgentDefects = defects.filter((d) => d.priority === "high").length;

    setStats({
      totalDefects,
      openDefects,
      inProgressDefects,
      urgentDefects,
    });

    setRecentDefects(defects.slice(0, 5));
  };

  return (
    <div className="dashboard">
      <h1>Дашборд</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Всего дефектов</h3>
          <div className="stat-number">{stats.totalDefects}</div>
        </div>
        <div className="stat-card">
          <h3>Новые дефекты</h3>
          <div className="stat-number">{stats.openDefects}</div>
        </div>
        <div className="stat-card">
          <h3>В работе</h3>
          <div className="stat-number">{stats.inProgressDefects}</div>
        </div>
        <div className="stat-card">
          <h3>Срочные</h3>
          <div className="stat-number">{stats.urgentDefects}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-defects">
          <h2>Последние дефекты</h2>
          {recentDefects.map((defect) => (
            <div key={defect.id} className="defect-item">
              <div className="defect-info">
                <Link to={`/defects/${defect.id}`}>
                  <strong>{defect.title}</strong>
                </Link>
                <span className={`priority ${defect.priority}`}>
                  {defect.priority === "high"
                    ? "Высокий"
                    : defect.priority === "medium"
                    ? "Средний"
                    : "Низкий"}
                </span>
                <span className={`status ${defect.status}`}>
                  {defect.status === "new"
                    ? "Новая"
                    : defect.status === "in_progress"
                    ? "В работе"
                    : defect.status === "in_review"
                    ? "На проверке"
                    : "Закрыта"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-actions">
          <h2>Быстрые действия</h2>
          {(user?.role === "manager" || user?.role === "engineer") && (
            <Link to="/defects?create=new" className="action-btn">
              Создать дефект
            </Link>
          )}
          <Link to="/defects" className="action-btn">
            Все дефекты
          </Link>
          <Link to="/projects" className="action-btn">
            Управление проектами
          </Link>
          {user?.role === "manager" && (
            <Link to="/reports" className="action-btn">
              Сформировать отчет
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

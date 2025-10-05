import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      path: "/dashboard",
      label: "Дашборд",
      icon: "📊",
      roles: ["manager", "engineer", "observer"],
    },
    {
      path: "/projects",
      label: "Проекты",
      icon: "🏗️",
      roles: ["manager", "engineer"],
    },
    {
      path: "/defects",
      label: "Дефекты",
      icon: "⚠️",
      roles: ["manager", "engineer", "observer"],
    },
    {
      path: "/reports",
      label: "Отчеты",
      icon: "📈",
      roles: ["manager", "observer"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;

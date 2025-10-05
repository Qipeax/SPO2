import React from "react";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  const getRoleName = (role) => {
    const roles = {
      manager: "Менеджер",
      engineer: "Инженер",
      observer: "Наблюдатель",
    };
    return roles[role] || role;
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>СистемаКонтроля</h1>
        <span>Управление строительными дефектами</span>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span>{user?.name}</span>
          <span className="user-role">({getRoleName(user?.role)})</span>
        </div>
        <button onClick={logout} className="logout-btn">
          Выйти
        </button>
      </div>
    </header>
  );
}

export default Header;

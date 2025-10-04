import { useLocation, useNavigate } from "react-router-dom";

function Head() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToHome = () => navigate("/");
  const goToProjects = () => navigate("/Projects");
  const goToEvents = () => navigate("/Events");

  const isActive = (path) => location.pathname === path;

  return (
    <div className="AllHeader">
      <div className="parent">
        <h1 className="logo">Квикенд</h1>
        <ul>
          <li>
            <button
              onClick={goToHome}
              className={`headerButton ${isActive("/") ? "active" : ""}`}
            >
              Главная страница
            </button>
          </li>
          <li>
            <button
              onClick={goToProjects}
              className={`headerButton ${
                isActive("/Projects") ? "active" : ""
              }`}
            >
              Проэкты
            </button>
          </li>
          <li>
            <button
              onClick={goToEvents}
              className={`headerButton ${isActive("/events") ? "active" : ""}`}
            >
              Задачи
            </button>
          </li>
          <li>
            <button
              onClick={goToEvents}
              className={`headerButton ${isActive("/events") ? "active" : ""}`}
            >
              Создать
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Head;

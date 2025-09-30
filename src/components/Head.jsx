
import { useLocation, useNavigate } from "react-router-dom";

function Head() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToHome = () => navigate("/");
  const goToCinemas = () => navigate("/Кинотеатры");
  const goToEvents = () => navigate("/events");

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
              Фильмы
            </button>
          </li>
          <li>
            <button 
              onClick={goToCinemas} 
              className={`headerButton ${isActive("/Кинотеатры") ? "active" : ""}`}
            >
              Кинотеатры
            </button>
          </li>
          <li>
            <button 
              onClick={goToEvents} 
              className={`headerButton ${isActive("/events") ? "active" : ""}`}
            >
              События
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Head;
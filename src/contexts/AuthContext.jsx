import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const mockUsers = [
      {
        id: 1,
        email: "manager@kvikend.ru",
        password: "123",
        role: "manager",
        name: "Злой Менеджеров",
      },
      {
        id: 2,
        email: "engineer@kvikend.ru",
        password: "123",
        role: "engineer",
        name: "Инженер Тимфортресович",
      },
      {
        id: 3,
        email: "observer@kvikend.ru",
        password: "123",
        role: "observer",
        name: "Сталкер Смотрячевич",
      },
    ];

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: "Неверный email или пароль" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

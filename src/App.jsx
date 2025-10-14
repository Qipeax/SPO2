// src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Defects from './pages/Defects'
import DefectDetail from './pages/DefectDetail'
import Reports from './pages/Reports'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="defects" element={<Defects />} />
          <Route path="defects/create" element={<DefectDetail />} /> {/* Новый маршрут */}
          <Route path="defects/:id" element={<DefectDetail />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
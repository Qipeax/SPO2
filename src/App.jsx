import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from './pages/home';

function App() {


  return (
        <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/Homepage" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App

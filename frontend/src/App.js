import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatRoom from './components/ChatRoom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={isLoggedIn ? <ChatRoom /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
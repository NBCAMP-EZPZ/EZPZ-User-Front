import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import PopupList from './components/PopupList';
import PopupDetail from './components/PopupDetail';
import OrderList from './components/OrderList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<PopupList />} />
        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} /> {/* setIsLoggedIn 전달 */}
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/popup/:id" element={<PopupDetail />} />
        <Route path="/orders" element={<OrderList />} />
      </Routes>
    </Router>
  );
}

export default App;
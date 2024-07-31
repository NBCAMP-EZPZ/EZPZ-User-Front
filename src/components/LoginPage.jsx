// src/components/LoginPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

function LoginPage({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      alert('이미 로그인된 상태입니다.');
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return <LoginForm setIsLoggedIn={setIsLoggedIn} />;
}

export default LoginPage;
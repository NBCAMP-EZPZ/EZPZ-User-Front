// src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/Header.css';

function Header({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // 로그아웃 API 호출
      localStorage.removeItem('accessToken'); // localStorage에서 사용자 정보 제거
      navigate('/'); // 로그인 페이지로 리디렉션
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('로그아웃 실패:', error); // 에러 로그 출력
      // 필요에 따라 사용자에게 에러 메시지 표시
    }
  };

  return (
    <header className="header d-flex justify-content-between align-items-center p-3">
      <h1 className="header-title">
        <Link to="/" className="header-link">EZPZ</Link>
      </h1>
      <nav>
        {isLoggedIn ? (
          <>
            <Link to="/orders" className="btn btn-primary m-2">주문 목록 보기</Link>
            <Link to="/reservations" className="btn btn-secondary m-2">예약 내역 보기</Link>
            <button className="btn btn-danger m-2" onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary m-2">로그인</Link>
            <Link to="/signup" className="btn btn-secondary m-2">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import PopupList from './components/PopupList';
import PopupDetail from './components/PopupDetail';
import OrderList from './components/OrderList';
import ReservationList from './components/ReservationList';
import ItemList from './components/ItemList';
import CartPage from './components/CartPage';
import SlotList from './components/SlotList';
import CouponList from './components/CouponList';
import MyCoupons from './components/MyCoupons';
import LikedPopups from './components/LikedPopups'; // 추가된 컴포넌트 임포트
import LikedItems from './components/LikedItems'; 


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
        <Route path="/user/orders" element={<OrderList />} />
        <Route path="/user/coupons" element={<MyCoupons />} />
        <Route path="/user/reservations" element={<ReservationList />} />
        <Route path="/popup/:id/items" element={<ItemList />} />
        <Route path="/popup/:id/slots" element={<SlotList />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/coupons" element={<CouponList />} />
        <Route path="/user/liked-popups" element={<LikedPopups />} /> 
        <Route path="/user/liked-items" element={<LikedItems />} />
      </Routes>
    </Router>
  );
}

export default App;
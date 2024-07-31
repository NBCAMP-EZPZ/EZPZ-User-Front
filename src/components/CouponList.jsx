// src/components/CouponList.jsx

import React, { useState, useEffect } from 'react';
import { getCoupons, downloadCoupon } from '../api/coupons';
import { FaDownload } from 'react-icons/fa'; // 다운로드 아이콘 추가
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'react-bootstrap/Pagination'; // Pagination 컴포넌트 추가

const primaryColor = '#071952';

function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getCoupons(page);
        setCoupons(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [page]);

  const handleDownload = async (couponId) => {
    try {
      const response = await downloadCoupon(couponId);
      alert(response.msg); // 서버에서 받은 메시지를 alert로 표시
    } catch (error) {
      alert('쿠폰 다운로드 실패: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const currentPageGroup = Math.floor(page / 10);
  const startPage = currentPageGroup * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return (
    <div className="container mt-4">
      <h3>다운로드 가능한 쿠폰 목록</h3>
      {loading ? (
        <div>Loading coupons...</div>
      ) : error ? (
        <div>{error}</div>
      ) : coupons.length === 0 ? (
        <p>다운로드 가능한 쿠폰이 없습니다!</p>
      ) : (
        <>
          <div className="list-group">
            {coupons.map(coupon => (
              <div key={coupon.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{coupon.name}</h5>
                  <p><strong>할인 금액:</strong> {coupon.discountAmount}원</p>
                  <p><strong>만료 기간:</strong> {coupon.expiredAt}</p>
                </div>
                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => handleDownload(coupon.id)}
                  style={{ backgroundColor: primaryColor, color: '#fff' }}
                >
                  <FaDownload className="me-1" /> 다운로드
                </button>
              </div>
            ))}
          </div>
          <Pagination className="mt-4">
            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
            {[...Array(endPage - startPage).keys()].map(p => (
              <Pagination.Item key={p + startPage} active={p + startPage === page} onClick={() => handlePageChange(p + startPage)}>
                {p + startPage + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
          </Pagination>
        </>
      )}
    </div>
  );
}

export default CouponList;
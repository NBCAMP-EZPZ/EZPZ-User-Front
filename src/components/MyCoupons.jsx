import React, { useState, useEffect } from 'react';
import { getMyCoupons } from '../api/coupons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'react-bootstrap/Pagination';

const primaryColor = '#071952';

function MyCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getMyCoupons(page);
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container mt-4">
      <h3>마이 쿠폰 목록</h3>
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
              </div>
            ))}
          </div>
          <Pagination className="mt-4">
            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
            {[...Array(totalPages).keys()].map(p => (
              <Pagination.Item key={p} active={p === page} onClick={() => handlePageChange(p)}>
                {p + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
          </Pagination>
        </>
      )}
    </div>
  );
}

export default MyCoupons;
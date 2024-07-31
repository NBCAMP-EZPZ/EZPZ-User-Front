// src/components/ReservationList.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getReservations } from '../api/reservations';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ReservationList.css';

const primaryColor = '#071952';

function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('READY');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReservations(status, page);
        setReservations(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError("Request failed with status code " + (error.response ? error.response.status : error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [status, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setSearchParams({ status: newStatus, page: 0 });
    setPage(0); // 페이지를 0으로 초기화
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'READY':
        return '방문 예정';
      case 'FINISHED':
        return '방문 완료';
      case 'CANCEL':
        return '방문 취소';
      default:
        return status;
    }
  };

  return (
    <div className="reservations mt-4">
      <h3>예약 목록 조회</h3>
      
      {/* 상태 선택 드롭다운 */}
      <div className="mb-4">
        <div className="custom-dropdown">
          <select
            id="statusFilter"
            className="form-select"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="READY">방문 예정</option>
            <option value="FINISHED">방문 완료</option>
            <option value="CANCEL">방문 취소</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading reservations...</div>
      ) : error ? (
        <div>{error}</div>
      ) : reservations.length === 0 ? (
        <p>예약 목록이 없습니다!</p>
      ) : (
        reservations.map((reservation, index) => (
          <div key={index} className="reservation mb-3 p-3 border rounded">
            <p><strong>예약번호:</strong> {reservation.id}</p>
            <p><strong>팝업 이름:</strong> {reservation.name}</p>
            <p><strong>날짜:</strong> {reservation.slotDate}</p>
            <p><strong>시간:</strong> {reservation.slotTime}</p>
            <p><strong>상태:</strong> {getStatusText(reservation.reservationStatus)}</p>
          </div>
        ))
      )}
      <div className="pagination mt-4">
        <button
          className="btn pagination-btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          이전
        </button>
        {[...Array(totalPages).keys()].map((pageIndex) => (
          <button
            key={pageIndex}
            className={`btn pagination-btn ${pageIndex === page ? 'btn-current' : ''}`}
            onClick={() => handlePageChange(pageIndex)}
            style={{
              backgroundColor: pageIndex === page ? primaryColor : 'transparent',
              color: pageIndex === page ? '#fff' : primaryColor,
            }}
          >
            {pageIndex + 1}
          </button>
        ))}
        <button
          className="btn pagination-btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default ReservationList;
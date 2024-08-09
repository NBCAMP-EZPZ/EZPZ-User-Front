/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getReservations, cancelReservation } from '../api/reservations'; // cancelReservation API 추가
import { createReview } from '../api/reviews'; // createReview API 추가
import OrderModal from './Modal'; // 모달 컴포넌트
import ReservationDetail from './ReservationDetail'; // 예약 상세 컴포넌트
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ReservationList.css';
import Pagination from 'react-bootstrap/Pagination'; // Pagination 컴포넌트 추가
import Modal from 'react-bootstrap/Modal'; // Modal 컴포넌트 추가
import { FaEdit } from 'react-icons/fa'; // FontAwesome 아이콘 추가

function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('READY');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false); // 리뷰 모달 상태 추가
  const [reviewRating, setReviewRating] = useState(1); // 리뷰 평점 상태 추가
  const [reviewContent, setReviewContent] = useState(''); // 리뷰 내용 상태 추가

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReservations(status, page);
        setReservations(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError("예약 내역이 없습니다 :)");
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

  const handleCardClick = (reservationId) => {
    setSelectedReservationId(reservationId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReservationId(null);
  };

  const handleReviewClick = (reservationId) => {
    setSelectedReservationId(reservationId);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedReservationId(null);
    setReviewRating(1); // 리뷰 평점 초기화
    setReviewContent(''); // 리뷰 내용 초기화
  };

  const handleSubmitReview = async () => {
    try {
      await createReview({
        reservationId: selectedReservationId,
        rating: reviewRating,
        content: reviewContent
      });
      alert('리뷰가 등록되었습니다 :)');
      handleCloseReviewModal();
    } catch (error) {
      alert('리뷰 등록에 실패했습니다 :(');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await cancelReservation(reservationId);
      alert('예약이 취소되었습니다.');
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    } catch (error) {
      alert('예약 취소에 실패했습니다 :(');
    }
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

  const currentPageGroup = Math.floor(page / 10);
  const startPage = currentPageGroup * 10;
  const endPage = Math.min(startPage + 10, totalPages);

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
          <div
            key={index}
            className="reservation mb-3 p-3 border rounded position-relative d-flex align-items-center" // position-relative 추가
            style={{ cursor: 'pointer' }}
          >
            <div onClick={() => handleCardClick(reservation.reservationId)} style={{ flex: 1 }}>
              <p><strong>예약번호:</strong> {reservation.reservationId}</p>
              <p><strong>팝업 이름:</strong> {reservation.popupName}</p>
              <p><strong>날짜:</strong> {reservation.slotDate}</p>
              <p><strong>시간:</strong> {reservation.slotTime}</p>
              <p><strong>상태:</strong> {getStatusText(reservation.reservationStatus)}</p>
            </div>
            {reservation.reservationStatus === 'READY' && (
              <button
                className="btn btn-danger d-flex align-items-center" // position-absolute 및 중앙 정렬 추가
                onClick={(e) => { e.stopPropagation(); handleCancelReservation(reservation.id); }}
              >
                ✖︎ 취소
              </button>
            )}
            {reservation.reservationStatus === 'FINISHED' && (
              <button
                className="btn btn-primary d-flex align-items-center review-button" // review-button 클래스 추가
                onClick={(e) => { e.stopPropagation(); handleReviewClick(reservation.reservationId); }}
              >
                <FaEdit className="me-1" /> 리뷰 작성
              </button>
            )}
          </div>
        ))
      )}
      <Pagination className="mt-4">
        <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
        {[...Array(endPage - startPage).keys()].map(p => (
          <Pagination.Item key={p + startPage} active={p + startPage === page} onClick={() => handlePageChange(p + startPage)}>
            {p + startPage + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
      </Pagination>

      {/* 리뷰 작성 모달 */}
      <OrderModal show={showModal} handleClose={handleCloseModal}>
        {selectedReservationId && <ReservationDetail reservationId={selectedReservationId} />}
      </OrderModal>

      <Modal show={showReviewModal} onHide={handleCloseReviewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>리뷰 작성</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>평점:</label>
            <input
              type="number"
              className="form-control"
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              min="1"
              max="5"
            />
          </div>
          <div className="form-group mt-3">
            <label>리뷰 내용:</label>
            <textarea
              className="form-control"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              rows="3"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseReviewModal}>
            취소
          </button>
          <button className="btn btn-primary" onClick={handleSubmitReview}>
            리뷰 등록
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReservationList;
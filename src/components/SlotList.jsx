// src/components/SlotList.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReservation } from '../api/reservations';
import { getSlots } from '../api/slots';
import Modal from 'react-bootstrap/Modal';
import { FaSmile } from 'react-icons/fa';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/SlotList.css';

const primaryColor = '#071952';

const getStatusText = (status) => {
  switch (status) {
    case 'READY':
      return '예약 진행 예정';
    case 'PROCEEDING':
      return '예약 진행 중';
    case 'FINISHED':
      return '예약 진행 완료';
    default:
      return status;
  }
};

const SlotList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('READY');
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSlots(id, page);
        setSlots(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError('예약 목록 조회 실패: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [id, page]);

  const handleReservation = async () => {
    try {
      await createReservation({ slotId: selectedSlot.id, numberOfPersons });
      alert('예약이 완료되었습니다.');
      navigate('/user/reservations'); // 예약 내역 보기 페이지로 이동
    } catch (error) {
      alert('예약 실패: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleReservationClick = (slot) => {
    setSelectedSlot(slot);
    setNumberOfPersons(1);
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container mt-4">
      <h3>예약 목록</h3>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : slots.length === 0 ? (
        <p>예약이 없습니다!</p>
      ) : (
        <>
          <div className="list-group">
            {slots.map(slot => (
              <div key={slot.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <p><strong>날짜:</strong> {slot.slotDate}</p>
                  <p><strong>시간:</strong> {slot.slotTime}</p>
                  <p><strong>상태:</strong> {getStatusText(slot.slotStatus)}</p>
                </div>
                {slot.slotStatus === 'PROCEEDING' && (
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => handleReservationClick(slot)}
                    style={{ backgroundColor: primaryColor, color: '#fff' }}
                  >
                    <FaSmile className="me-1" /> 예약하기
                  </button>
                )}
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

      {selectedSlot && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>예약하기</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <label>인원:</label>  
              <input
                type="number"
                className="form-control flex-grow-1"
                value={numberOfPersons}
                onChange={(e) => setNumberOfPersons(Number(e.target.value))}
                min="1"
                style={{ width: '80px', margin: '0 10px' }}
              />
              <button
                className="btn btn-primary"
                onClick={handleReservation}
                style={{ backgroundColor: primaryColor, color: '#fff' }}
              >
                예약하기
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default SlotList;
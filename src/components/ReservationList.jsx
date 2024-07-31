import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getReservations } from '../api/reservations';
import OrderModal from './Modal'; // 모달 컴포넌트
import ReservationDetail from './ReservationDetail'; // 예약 상세 컴포넌트
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ReservationList.css';
import Pagination from 'react-bootstrap/Pagination'; // Pagination 컴포넌트 추가

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

    const handleCardClick = (reservationId) => {
        setSelectedReservationId(reservationId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReservationId(null);
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
                        className="reservation mb-3 p-3 border rounded"
                        onClick={() => handleCardClick(reservation.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <p><strong>예약번호:</strong> {reservation.id}</p>
                        <p><strong>팝업 이름:</strong> {reservation.name}</p>
                        <p><strong>날짜:</strong> {reservation.slotDate}</p>
                        <p><strong>시간:</strong> {reservation.slotTime}</p>
                        <p><strong>상태:</strong> {getStatusText(reservation.reservationStatus)}</p>
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
            <OrderModal show={showModal} handleClose={handleCloseModal}>
                {selectedReservationId && <ReservationDetail reservationId={selectedReservationId} />}
            </OrderModal>
        </div>
    );
}

export default ReservationList;
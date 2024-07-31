import React, { useEffect, useState } from 'react';
import { getReservationDetails } from '../api/reservations'; // 예약 상세 API 호출 함수 추가
import 'bootstrap/dist/css/bootstrap.min.css';

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

const ReservationDetail = ({ reservationId }) => {
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservationDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getReservationDetails(reservationId);
                setReservation(data);
            } catch (error) {
                setError("예약 내역이 없습니다 :) ");
            } finally {
                setLoading(false);
            }
        };

        fetchReservationDetails();
    }, [reservationId]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!reservation) {
        return <div>예약 상세 내역이 없습니다</div>;
    }

    return (
        <div>
            <p><strong>예약번호:</strong> {reservation.id}</p>
            <p><strong>팝업 이름:</strong> {reservation.name}</p>
            <p><strong>날짜:</strong> {reservation.slotDate}</p>
            <p><strong>시간:</strong> {reservation.slotTime}</p>
            <p><strong>상태:</strong> {getStatusText(reservation.reservationStatus)}</p>
        </div>
    );
};

export default ReservationDetail;
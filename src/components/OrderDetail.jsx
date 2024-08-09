import React, { useEffect, useState } from 'react';
import { getOrderDetails } from '../api/orders'; // 주문 상세 API 호출 함수 추가
import 'bootstrap/dist/css/bootstrap.min.css';

const getStatusText = (status) => {
    switch (status) {
        case 'ORDER_COMPLETED':
            return '주문 완료';
        case 'IN_TRANSIT':
            return '배송 중';
        case 'DELIVERED':
            return '배송 완료';
        case 'CANCELLED':
            return '주문 취소';
        default:
            return status;
    }
};

const OrderDetail = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getOrderDetails(orderId);
                setOrder(data);
            } catch (error) {
                setError("Request failed with status code " + (error.response ? error.response.status : error.message));
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!order) {
        return <div>주문 상세 정보가 없습니다</div>;
    }

    return (
        <div>
            <p><strong>주문번호:</strong> {order.orderId}</p>
            <p><strong>총액:</strong> {order.totalPrice}</p>
            <p><strong>상태:</strong> {getStatusText(order.orderStatus)}</p>
            <p><strong>주문일:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            <h5>주문 항목:</h5>
            <ul>
                {order.orderedItems.map((item) => (
                    <li key={item.itemId}>
                        <p><strong>상품 ID:</strong> {item.itemId}</p>
                        <p><strong>수량:</strong> {item.quantity}</p>
                        <p><strong>가격:</strong> {item.orderPrice}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetail;
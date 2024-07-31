import React, { useState, useEffect } from 'react';
import { getOrders } from '../api/orders';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/OrderList.css';

const primaryColor = '#071952';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrders(page);
        setOrders(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError("Request failed with status code " + (error.response ? error.response.status : error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

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

  return (
    <div className="orders mt-4">
      <h3>주문 목록 조회</h3>
      {loading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div>{error}</div>
      ) : orders.length === 0 ? (
        <p>주문 목록이 없습니다!</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order mb-3 p-3 border rounded">
            <p><strong>주문번호:</strong> {order.orderId}</p>
            <p><strong>총액:</strong> {order.totalPrice}</p>
            <p><strong>상태:</strong> {getStatusText(order.orderStatus)}</p>
            <p><strong>주문날짜:</strong> {order.orderDate}</p>
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

export default OrderList;
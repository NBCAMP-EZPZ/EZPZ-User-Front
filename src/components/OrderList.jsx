import React, { useState, useEffect } from 'react';
import { getOrders } from '../api/orders';
import OrderModal from './Modal';
import OrderDetail from './OrderDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/OrderList.css';
import Pagination from 'react-bootstrap/Pagination'; // Pagination 컴포넌트 추가

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleCardClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
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

  const currentPageGroup = Math.floor(page / 10);
  const startPage = currentPageGroup * 10;
  const endPage = Math.min(startPage + 10, totalPages);

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
          <div key={index} className="order mb-3 p-3 border rounded" onClick={() => handleCardClick(order.orderId)}>
            <p><strong>주문번호:</strong> {order.orderId}</p>
            <p><strong>총액:</strong> {order.totalPrice}</p>
            <p><strong>상태:</strong> {getStatusText(order.orderStatus)}</p>
            <p><strong>주문날짜:</strong> {order.orderDate}</p>
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
        {selectedOrderId && <OrderDetail orderId={selectedOrderId} />}
      </OrderModal>
    </div>
  );
}

export default OrderList;
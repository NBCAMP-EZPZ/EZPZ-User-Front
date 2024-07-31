// src/components/ItemList.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getItems, getItemDetail } from '../api/items';
import { addToCart } from '../api/cart'; // import addToCart from cart.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ItemList.css';
import ItemDetailModal from './ItemDetailModal';
import Pagination from 'react-bootstrap/Pagination'; // Pagination 컴포넌트 추가


const primaryColor = '#071952';

function ItemList() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getItems(id, status, page);
        setItems(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError("Request failed with status code " + (error.response ? error.response.status : error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [id, status, page]);

  const handlePageChange = (newPage) => {
    console.log(`Page changing to: ${newPage}`);
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setSearchParams({ status: newStatus, page: 0 });
    setPage(0);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'BEFORE_SALE':
        return '판매 전';
      case 'SALE':
        return '판매 중';
      case 'SOLD_OUT':
        return '품절';
      case 'SALE_END':
        return '판매 종료';
      default:
        return status;
    }
  };

  const handleItemClick = async (itemId) => {
    try {
      const itemDetail = await getItemDetail(itemId);
      setSelectedItem(itemDetail);
      setShowModal(true);
    } catch (error) {
      setError("Failed to fetch item details.");
    }
  };

  const handleAddToCart = async (cartItem) => {
    try {
      await addToCart(cartItem);
      alert('Item added to cart!');
    } catch (error) {
      alert('Failed to add item to cart.');
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const currentPageGroup = Math.floor(page / 10);
  const startPage = currentPageGroup * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return (
    <div className="container mt-4">
      <h3>굿즈 목록</h3>

      <div className="mb-4">
        <div className="custom-dropdown">
          <select
            id="statusFilter"
            className="form-select"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="all">전체 보기</option>
            <option value="BEFORE_SALE">판매 전</option>
            <option value="SALE">판매 중</option>
            <option value="SOLD_OUT">품절</option>
            <option value="SALE_END">판매 종료</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading items...</div>
      ) : error ? (
        <div>{error}</div>
      ) : items.length === 0 ? (
        <p>상품이 없습니다!</p>
      ) : (
        <div className="item-list">
          {items.map((item) => (
            <div 
              key={item.itemId} 
              className="item-card card mb-3 shadow-sm"
              onClick={() => handleItemClick(item.itemId)}
              style={{ cursor: 'pointer' }}
            >
              <img src={item.image} className="card-img-top" alt={item.name} />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">가격: {item.price}원</p>
                <p className="card-text">좋아요: {item.likeCount}</p>
                <p className="card-text">상태: {getStatusText(item.itemStatus)}</p>
              </div>
            </div>
          ))}
        </div>
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
      <ItemDetailModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        item={selectedItem} 
        handleAddToCart={handleAddToCart} 
      />
    </div>
  );
}

export default ItemList;
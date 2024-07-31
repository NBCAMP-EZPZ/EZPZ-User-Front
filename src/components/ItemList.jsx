// src/components/ItemList.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getItems } from '../api/items';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ItemList.css';

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
            <div key={item.itemId} className="item-card card mb-3 shadow-sm">
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
      <div className="pagination mt-4">
        <button
          className="btn pagination-btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          이전
        </button>
        {[...Array(totalPages).keys()].slice(page, page + 10).map((pageIndex) => (
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

export default ItemList;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import { getLikedPopups } from '../api/liked';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

const primaryColor = '#071952';

const LikedPopups = () => {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const data = await getLikedPopups(page);
        setPopups(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError('좋아요 누른 팝업이 없습니다 :) ');
      } finally {
        setLoading(false);
      }
    };

    fetchPopups();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCardClick = (popupId) => { // 클릭 핸들러 함수 추가
    navigate(`/popup/${popupId}`);
  };

  const currentPageGroup = Math.floor(page / 10);
  const startPage = currentPageGroup * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return (
    <div className="container mt-4">
      <h3>좋아요 누른 팝업 목록</h3>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : popups.length === 0 ? (
        <p>좋아요 누른 팝업이 없습니다!</p>
      ) : (
        <>
          <div className="list-group">
            {popups.map(popup => (
              <div
                key={popup.popupId}
                className="list-group-item d-flex justify-content-between align-items-center"
                onClick={() => handleCardClick(popup.popupId)} // 클릭 이벤트 추가
                style={{ cursor: 'pointer' }} // 포인터 커서 추가
              >
                <div>
                  <h5>{popup.name}</h5>
                  <p><strong>회사명:</strong> {popup.companyName}</p>
                  <p><strong>좋아요 수:</strong> {popup.likeCount}</p>
                </div>
                <img src={popup.thumbnail} alt={popup.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <Pagination className="mt-4">
            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
            {Array.from({ length: endPage - startPage }, (_, idx) => startPage + idx).map((p) => (
              <Pagination.Item key={p} active={p === page} onClick={() => handlePageChange(p)}>
                {p + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
          </Pagination>
        </>
      )}
    </div>
  );
};

export default LikedPopups;
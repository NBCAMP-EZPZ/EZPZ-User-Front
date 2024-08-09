import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopups } from '../api/popups';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/PopupList.css';
import Pagination from 'react-bootstrap/Pagination'; // Pagination 컴포넌트 추가

function PopupList() {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupStatus, setPopupStatus] = useState('IN_PROGRESS');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const data = await getPopups(popupStatus, page);
        setPopups(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        setError("팝업이 없습니다 :)");
        setLoading(false);
      }
    };

    fetchPopups();
  }, [popupStatus, page]);

  const handleStatusChange = (e) => {
    setPopupStatus(e.target.value);
    setPage(0); // 상태 변경 시 페이지 번호를 초기화
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCardClick = (id) => {
    navigate(`/popup/${id}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const currentPageGroup = Math.floor(page / 10);
  const startPage = currentPageGroup * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return (
    <div className="container">
      <h3 className="mb-4 title-spacing">팝업 목록 조회</h3> {/* 제목 추가 */}
      <div className="row mb-4">
        <div className="col">
          <select className="form-select custom-dropdown" value={popupStatus} onChange={handleStatusChange}>
            <option value="IN_PROGRESS">진행 중</option>
            <option value="SCHEDULED">오픈 전</option>
            <option value="COMPLETED">종료</option>
          </select>
        </div>
      </div>
      <div className="popup-list">
        {popups.map((popup) => (
          <div
            key={popup.popupId}
            className="popup-card card mb-3 shadow-sm"
            onClick={() => handleCardClick(popup.popupId)}
            style={{ cursor: 'pointer' }}
          >
            <img src={popup.thumbnailUrl} className="card-img-top" alt={popup.name} />
            <div className="card-body">
              <h5 className="card-title">{popup.popupName}</h5>
              <p className="card-text">주최: {popup.companyName}</p>
              <p className="card-text">좋아요 ♥︎ {popup.likeCount} 개</p>
            </div>
          </div>
        ))}
      </div>
      <Pagination className="mt-4">
        <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
        {[...Array(endPage - startPage).keys()].map(p => (
          <Pagination.Item key={p + startPage} active={p + startPage === page} onClick={() => handlePageChange(p + startPage)}>
            {p + startPage + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
      </Pagination>
    </div>
  );
}

export default PopupList;
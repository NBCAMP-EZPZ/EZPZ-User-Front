// src/components/ReviewList.jsx

import React, { useState, useEffect } from 'react';
import { getReviews } from '../api/popups';
import { FaStar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/ReviewList.css';

const primaryColor = '#071952';

function ReviewList({ popupId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReviews(popupId, page);
        setReviews(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error.response && error.response.data.errorType === "EMPTY_PAGE_ELEMENTS") {
          setError("리뷰가 없습니다!");
        } else {
          setError("Request failed with status code " + (error.response ? error.response.status : error.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [popupId, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((star, index) => (
      <FaStar key={index} color={index < rating ? primaryColor : "#e4e5e9"} />
    ));
  };

  const currentPageGroup = Math.floor(page / 10);
  const startPage = currentPageGroup * 10;
  const endPage = Math.min(startPage + 10, totalPages);

  return (
    <div className="reviews mt-4">
      <h3>Reviews</h3>
      {loading ? (
        <div>Loading reviews...</div>
      ) : error ? (
        <div>{error}</div>
      ) : reviews.length === 0 ? (
        <p>리뷰가 없습니다!</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="review mb-3 p-3 border rounded">
            <p>{review.content}</p>
            <div className="review-stars">
              {renderStars(review.rating)}
            </div>
            <p className="text-muted">{new Date(review.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
      <div className="pagination mt-4">
        <button
          className="btn pagination-btn"
          onClick={() => handlePageChange(startPage - 1)}
          disabled={startPage === 0}
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          이전
        </button>
        {[...Array(endPage - startPage).keys()].map((pageIndex) => (
          <button
            key={startPage + pageIndex}
            className={`btn pagination-btn ${startPage + pageIndex === page ? 'btn-current' : ''}`}
            onClick={() => handlePageChange(startPage + pageIndex)}
            style={{
              backgroundColor: startPage + pageIndex === page ? primaryColor : 'transparent',
              color: startPage + pageIndex === page ? '#fff' : primaryColor,
            }}
          >
            {startPage + pageIndex + 1}
          </button>
        ))}
        <button
          className="btn pagination-btn"
          onClick={() => handlePageChange(endPage)}
          disabled={endPage >= totalPages}
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default ReviewList;
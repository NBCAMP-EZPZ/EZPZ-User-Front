// src/components/ReviewList.jsx

import React, { useState, useEffect } from 'react';
import { getReviews } from '../api/popups';
import { FaStar } from 'react-icons/fa';
import Pagination from 'react-bootstrap/Pagination';
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
      <h3 className="reviews-title">리뷰</h3>
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

export default ReviewList;
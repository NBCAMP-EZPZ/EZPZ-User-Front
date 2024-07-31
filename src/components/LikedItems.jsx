// src/components/LikedItems.jsx

import React, { useState, useEffect } from 'react';
import { getLikedItems } from '../api/liked';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

const primaryColor = '#071952';

const LikedItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getLikedItems(page);
                setItems(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                setError('좋아요 누른 아이템이 없습니다 :)');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const currentPageGroup = Math.floor(page / 10);
    const startPage = currentPageGroup * 10;
    const endPage = Math.min(startPage + 10, totalPages);


    return (
        <div className="container mt-4">
            <h3>좋아요 누른 아이템 목록</h3>
            {loading ? (
                <div>로딩 중...</div>
            ) : error ? (
                <div>{error}</div>
            ) : items.length === 0 ? (
                <p>좋아요 누른 아이템이 없습니다!</p>
            ) : (
                <>
                    <div className="list-group">
                        {items.map(item => (
                            <div key={item.itemId} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h5>{item.name}</h5>
                                    <p><strong>가격:</strong> {item.price}원</p>
                                    <p><strong>좋아요 수:</strong> {item.likeCount}</p>
                                </div>
                                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
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
                </>
            )}
        </div>
    );
};

export default LikedItems;
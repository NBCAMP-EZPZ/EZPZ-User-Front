import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { FaHeart } from 'react-icons/fa';
import { likeItem } from '../api/items'; // 좋아요 API 호출 함수 추가
import 'bootstrap/dist/css/bootstrap.min.css';

const primaryColor = '#071952';

const ItemDetailModal = ({ show, handleClose, item, handleAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (!show) {
            setLiked(false);
            setQuantity(1);
        }
    }, [show]);

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleAddClick = () => {
        handleAddToCart({ itemId: item.itemId, quantity: parseInt(quantity, 10) });
        handleClose();
    };

    const handleLike = async () => {
        try {
            await likeItem(item.itemId);
            setLiked(true);
        } catch (error) {
            console.error('아이템 좋아요 실패 :(', error);
        }
    };

    if (!item) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>상품 상세 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={item.imageUrl} alt={item.name} className="img-fluid mb-3" />
                <h5>{item.name}</h5>
                <p>{item.description}</p>
                <p><strong>가격:</strong> {item.price}원</p>
                <p><strong>재고:</strong> {item.stock}</p>
                <p><strong>좋아요:</strong> {item.likeCount}</p>
                <p><strong>상태:</strong> {item.itemStatus}</p>
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-outline-gray" onClick={handleLike} disabled={liked}>
                        <FaHeart style={{ color: liked ? 'red' : 'gray' }} /> 좋아요
                    </button>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <label>수량:</label>
                    <input
                        type="number"
                        className="form-control flex-grow-1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={item.stock}
                        style={{ width: '80px', margin: '0 10px' }}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleAddClick}
                        style={{ backgroundColor: primaryColor, color: '#fff' }}
                    >
                        장바구니에 담기
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ItemDetailModal;
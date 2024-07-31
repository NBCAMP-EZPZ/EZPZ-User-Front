// src/components/ItemDetailModal.jsx

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const primaryColor = '#071952';

const ItemDetailModal = ({ show, handleClose, item, handleAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleAddClick = () => {
    handleAddToCart({ itemId: item.id, quantity: parseInt(quantity, 10) });
    handleClose();
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
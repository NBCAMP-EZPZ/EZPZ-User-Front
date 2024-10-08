import React, { useState, useEffect } from 'react';
import { getCartItems, updateCartItem, deleteCartItem } from '../api/cart';
import { createOrder } from '../api/orders';
import Modal from 'react-bootstrap/Modal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/CartPage.css';

const primaryColor = '#071952';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const data = await getCartItems();
                setCartItems(data);
            } catch (error) {
                setError('장바구니가 비어 있습니다 :)');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleQuantityChange = (e) => {
        setQuantity(Number(e.target.value));
    };

    const handleSaveClick = async () => {
        if (quantity <= 0) {
            setError('수량은 1 이상이어야 합니다.');
            return;
        }

        try {
            await updateCartItem(selectedItem.cartId, { quantity });
            setCartItems(cartItems.map(item =>
                item.itemId === selectedItem.itemId ? { ...item, quantity: quantity } : item
            ));
            setShowModal(false);
        } catch (error) {
            setError('수량 변경 실패: ' + error.message);
        }
    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setQuantity(item.quantity);
        setShowModal(true);
    };

    const handleDelete = async (itemId) => {
        try {
            await deleteCartItem(itemId);
            setCartItems(cartItems.filter(item => item.itemId !== itemId));
            window.location.reload(); // 화면 새로고침
        } catch (error) {
            setError('삭제 실패: ' + error.message);
        }
    };

    const handleSelectItem = (cartId) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(cartId)
                ? prevSelectedItems.filter((id) => id !== cartId)
                : [...prevSelectedItems, cartId]
        );
    };

    const handleOrderClick = async () => {
        if (selectedItems.length === 0) {
            alert('최소 1개 이상의 아이템을 선택해주세요.');
            return;
        }
    
        try {
            // cartIdList 키에 배열을 담아 요청
            const orderData = { cartIdList: selectedItems };
            await createOrder(orderData);
            alert('주문이 완료되었습니다.');
            window.location.reload(); // 화면 새로고침
        } catch (error) {
            setError('주문 실패: ' + error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h3>장바구니</h3>
            <div className="list-group">
                {cartItems.map(item => (
                    <div key={item.itemId} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <input
                                type="checkbox"
                                className="custom-checkbox"
                                checked={selectedItems.includes(item.cartId)}
                                onChange={() => handleSelectItem(item.cartId)}
                                style={{ marginRight: '10px' }}
                            />
                            <img src={item.imageUrl} alt={item.itemName} style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }} />
                            <div>
                                <p>상품명 : {item.itemName}</p>
                                <p>가격 : {item.itemPrice}원</p>
                                <p>수량 : {item.quantity}</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <button className="btn btn-outline-primary d-flex align-items-center" onClick={() => handleEditClick(item)}>
                                <FaEdit className="me-1" /> 수정
                            </button>
                            <button className="btn btn-danger ms-2 d-flex align-items-center" onClick={() => handleDelete(item.cartId)}>
                                <FaTrash className="me-1" /> 삭제
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedItem && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>수량 수정</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <label>수량:</label>
                            <input
                                type="number"
                                className="form-control flex-grow-1"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max={selectedItem.stock}
                                style={{ width: '80px', margin: '0 10px' }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleSaveClick}
                                style={{ backgroundColor: primaryColor, color: '#fff' }}
                            >
                                저장
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
            <div className="d-flex justify-content-end mt-3">
                <button
                    className="btn btn-success"
                    onClick={handleOrderClick}
                    style={{ backgroundColor: primaryColor, color: '#fff' }}
                >
                    주문하기
                </button>
            </div>
        </div>
    );
};

export default CartPage;
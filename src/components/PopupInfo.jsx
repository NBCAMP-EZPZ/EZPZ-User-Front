import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPopupDetail, likePopup } from '../api/popups';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/PopupInfo.css';
import { FaHeart } from 'react-icons/fa';

const primaryColor = '#071952';

function PopupInfo() {
    const { id } = useParams();
    const [popup, setPopup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopupDetail = async () => {
            try {
                const data = await getPopupDetail(id);
                setPopup(data);
                setLoading(false);
            } catch (error) {
                setError('팝업 정보를 불러오는 데 실패했습니다 :(');
                setLoading(false);
            }
        };

        fetchPopupDetail();
    }, [id]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleLike = async () => {
        try {
            await likePopup(id);
            setLiked(true);
        } catch (error) {
            console.error('Failed to like the popup:', error);
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <img src={popup.thumbnailUrl} className="card-img-top" alt={popup.name} />
                <div className="card-body">
                    <h3 className="card-title">{popup.name}</h3>
                    <h5 className="card-text">{popup.description}</h5>

                    <hr />

                    <p className="card-text"><strong>주소:</strong> {popup.address}</p>
                    <p className="card-text"><strong>시작 날짜:</strong> {new Date(popup.startDate).toLocaleString()}</p>
                    <p className="card-text"><strong>종료 날짜:</strong> {new Date(popup.endDate).toLocaleString()}</p>
                    <p className="card-text"><strong>좋아요 ♥︎ </strong> {popup.likeCount} 개</p>

                    <div className="popup-images">
                        {popup.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Popup image ${index + 1}`}
                                className="popup-image"
                                onClick={() => handleImageClick(image)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-outline-gray me-2" onClick={handleLike} disabled={liked}>
                            <FaHeart style={{ color: liked ? 'red' : 'gray' }} /> 좋아요
                        </button>
                        <button
                            className="btn btn-primary me-2"
                            style={{ backgroundColor: primaryColor }}
                            onClick={() => navigate(`/popup/${id}/items`)}
                        >
                            굿즈 페이지
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{ backgroundColor: primaryColor }}
                            onClick={() => navigate(`/popup/${id}/slots`)}
                        >
                            예약 페이지
                        </button>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Body>
                    <img src={selectedImage} alt="Selected" className="img-fluid" />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default PopupInfo;
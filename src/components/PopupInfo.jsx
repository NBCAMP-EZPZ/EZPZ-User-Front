// src/components/PopupInfo.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPopupDetail } from '../api/popups';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/PopupInfo.css';

const primaryColor = '#071952';

function PopupInfo() {
  const { id } = useParams();
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchPopupDetail = async () => {
      try {
        const data = await getPopupDetail(id);
        setPopup(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <img src={popup.thumbnailUrl} className="card-img-top" alt={popup.name} />
        <div className="card-body">
          <h5 className="card-title">{popup.name}</h5>
          <p className="card-text">{popup.description}</p>
          <p className="card-text"><strong>Address:</strong> {popup.address}</p>
          <p className="card-text"><strong>Start Date:</strong> {new Date(popup.startDate).toLocaleString()}</p>
          <p className="card-text"><strong>End Date:</strong> {new Date(popup.endDate).toLocaleString()}</p>
          <p className="card-text"><strong>Likes:</strong> {popup.likeCount}</p>
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
            <Link to="/goods" className="btn btn-primary me-2" style={{ backgroundColor: primaryColor }}>굿즈 페이지</Link>
            <Link to="/reservations" className="btn btn-primary" style={{ backgroundColor: primaryColor }}>예약 페이지</Link>
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
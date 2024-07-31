// src/components/PopupDetail.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import PopupInfo from './PopupInfo';
import ReviewList from './ReviewList';
import 'bootstrap/dist/css/bootstrap.min.css';

function PopupDetail() {
  const { id } = useParams();

  return (
    <div>
      <PopupInfo />
      <ReviewList popupId={id} />
    </div>
  );
}

export default PopupDetail;
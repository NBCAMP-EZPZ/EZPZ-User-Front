import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/OrderModal.css';

const OrderModal = ({ show, handleClose, children }) => {
  return (
    <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Details</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
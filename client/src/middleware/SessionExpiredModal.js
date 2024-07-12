// SessionExpiredModal.js
import React from 'react';

const SessionExpiredModal = () => {
  return (
    <div style={modalStyles}>
      <p>Your session has expired. Redirecting to login page...</p>
    </div>
  );
};

const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1000
};

export default SessionExpiredModal;

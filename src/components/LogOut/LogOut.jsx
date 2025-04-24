import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './LogOut.css'; 

// Функция запроса logout на бэкенд
const logoutRequest = async (token) => {
  try {
    const response = await fetch('https://money-guard-backend-xmem.onrender.com/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
};

const LogOut = ({ onClose, onLogout }) => {
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Обработка кнопки Logout
  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No token found');
      return;
    }

    const success = await logoutRequest(token);
    if (success) {
      localStorage.removeItem('accessToken');
      onLogout(); //  может  navigate('/login') или setUser(null)
    } else {
      alert('Logout failed. Please try again.');
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content logout-modal">
        <button className="close-button" onClick={onClose}>
          <span className="inside-button"></span>
        </button>
        <h2>Are you sure you want to log out?</h2>
        <div className="form-buttons">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogOut;

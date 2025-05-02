import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { logoutThunk } from '../../redux/auth/operations';

import './LogOut.css';

const LogOut = ({ onClose, onLogout }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    setIsVisible(true);

    const handleEscape = e => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      onLogout();
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', error);
    }
  };

  return createPortal(
    <div
      className={`logout-overlay ${isVisible ? 'show' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`logout-content logout-modal ${isVisible ? 'show' : ''}`}>
        <svg
          className="logout-logo"
          viewBox="0 0 27 26"
          role="img"
          aria-label="Money Guard Logo"
        >
          <use href="/sprite.svg#mg-logo" />
        </svg>

        <h2 className="logout-title">Money Guard</h2>
        <p className="logout-question">Are you sure you want to log out?</p>

        <div className="form-buttons">
          <button type="submit" onClick={handleLogout}>
            LOGOUT
          </button>
          <button type="button" onClick={handleClose}>
            CANCEL
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogOut;

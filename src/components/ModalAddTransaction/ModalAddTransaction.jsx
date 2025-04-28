

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm';
import './ModalAddTransaction.css';

const ModalAddTransaction = ({ onClose }) => {
  const [transactionType, setTransactionType] = useState('income');
  const [isMounted, setIsMounted] = useState(false); 
  const [isVisible, setIsVisible] = useState(false); 

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    setIsMounted(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isMounted) return null; 

  return createPortal(
    <div className={`modal-add-overlay ${isVisible ? "show" : ""}`} onClick={handleBackdropClick}>
      <div className={`modal-add-content ${transactionType === 'expense' ? 'expense-mode' : ''} ${isVisible ? "show" : ""}`}>
        <button className="modal-add-close-button" onClick={handleClose}>
          <span className="modal-add-inside-button"></span>
        </button>
        <AddTransactionForm
          onClose={handleClose}
          onTypeChange={setTransactionType}
        />
      </div>
    </div>,
    document.body
  );
};

export default ModalAddTransaction;

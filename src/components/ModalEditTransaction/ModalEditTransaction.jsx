

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import EditTransactionForm from '../EditTransactionForm/EditTransactionForm'; 
import './ModalEditTransaction.css'; 

const ModalEditTransaction = ({ onClose, transaction }) => {
  const [transactionType, setTransactionType] = useState(transaction?.type || 'income'); 
  const [isVisible, setIsVisible] = useState(false); 

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); 
  }, [onClose]);

  useEffect(() => {
    setIsVisible(true); 

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

  return createPortal(
    <div className={`edit-transaction-overlay ${isVisible ? "show" : ""}`} onClick={handleBackdropClick}>
      <div className={`edit-transaction-content ${transactionType === 'expense' ? 'expense-mode' : ''} ${isVisible ? "show" : ""}`}>
        <button className="close-button" onClick={handleClose}>
          <span className="inside-button"></span>
        </button>
        <EditTransactionForm 
          onClose={handleClose} 
          transaction={transaction} 
          onTypeChange={setTransactionType} 
        />
      </div>
    </div>,
    document.body
  );
};

export default ModalEditTransaction;

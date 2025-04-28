import { useMedia } from '../../hooks/useMedia';
import Balance from '../../components/Balance/Balance';
import TransactionsList from '../../components/TransactionsList/TransactionsList';
import ButtonAddTransactions from '../../components/ButtonAddTransactions/ButtonAddTransactions';

import s from './HomeTab.module.css';
import { useEffect, useState } from 'react';
import ModalEditTransaction from '../../components/ModalEditTransaction/ModalEditTransaction';
import ModalAddTransaction from '../../components/ModalAddTransaction/ModalAddTransaction';

const HomeTab = () => {
  const { isMobile } = useMedia();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  const mockTransaction = {
    type: 'income',
    sum: '0.00',
    date: '',
    comment: '',
    category: '',
  };

  return (
    <div className={s.homeTab}>
      {isMobile && <Balance />}
      <TransactionsList />
      <ButtonAddTransactions onClick={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <ModalAddTransaction onClose={() => setIsModalOpen(false)} />
      )}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => setShowEdit(true)}>Open Edit Modal</button>
      </div>

      {showEdit && (
        <ModalEditTransaction
          transaction={mockTransaction}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
};

export default HomeTab;

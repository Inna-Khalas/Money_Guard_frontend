import { useMedia } from '../../hooks/useMedia';
import { useEffect, useState } from 'react';

import TransactionsList from '../../components/TransactionsList/TransactionsList';
import ButtonAddTransactions from '../../components/ButtonAddTransactions/ButtonAddTransactions';
import Balance from '../../components/Balance/Balance';
import ModalAddTransaction from '../../components/ModalAddTransaction/ModalAddTransaction';

import s from './HomeTab.module.css';

const HomeTab = () => {
  const { isMobile } = useMedia();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  return (
    <div className={s.homeTab}>
      {isMobile && <Balance />}
      <TransactionsList />
      <ButtonAddTransactions onClick={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <ModalAddTransaction onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default HomeTab;

import { useMedia } from '../../hooks/useMedia';
import { useEffect, useState } from 'react';

import TransactionsList from '../../components/TransactionsList/TransactionsList';
import ButtonAddTransactions from '../../components/ButtonAddTransactions/ButtonAddTransactions';
import Balance from '../../components/Balance/Balance';
import ModalEditTransaction from '../../components/ModalEditTransaction/ModalEditTransaction';
import ModalAddTransaction from '../../components/ModalAddTransaction/ModalAddTransaction';

import s from './HomeTab.module.css';
import { useSelector } from 'react-redux';
import { selectisLoading } from '../../redux/transactions/selectors';
import { Loader } from 'lucide-react';

const HomeTab = () => {
  const { isMobile } = useMedia();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const isLoading = useSelector(selectisLoading);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  const handleEditTransaction = transaction => {
    setEditTransaction(transaction);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className={s.homeTab}>
      {isMobile && <Balance />}
      <TransactionsList onEdit={handleEditTransaction} />
      <ButtonAddTransactions onClick={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <ModalAddTransaction onClose={() => setIsModalOpen(false)} />
      )}
      {editTransaction && (
        <ModalEditTransaction
          transaction={editTransaction}
          onClose={() => setEditTransaction(null)}
        />
      )}
    </div>
  );
};

export default HomeTab;

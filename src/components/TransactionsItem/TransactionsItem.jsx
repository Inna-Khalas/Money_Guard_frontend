import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './TransactionsItem.module.css';
import { deleteTransaction } from '../../redux/transactions/operations';
import ModalEditTransaction from '../ModalEditTransaction/ModalEditTransaction';

export default function TransactionsItem({ transaction }) {
  const { id, date, type, category, comment, sum } = transaction;
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTransaction(id));
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.transactionItem} ${
          type === 'income' ? styles.bgCoral : styles.bgOrange
        }`}
      >
        <div className={styles.transactionInfo}>
          <p>{date}</p>
          <p>{type}</p>
          <p>{category}</p>
          <p>{comment}</p>
          <p>{sum}</p>
        </div>
        <div className={styles.transactionActions}>
          <button
            type="button"
            className={styles.editBtn}
            onClick={handleEditClick}
          >
            <img src="./pencil.svg" alt="Edit" width="11" height="11"></img>;
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ModalEditTransaction
          onClose={handleCloseModal}
          transaction={transaction}
        />
      )}
    </>
  );
}

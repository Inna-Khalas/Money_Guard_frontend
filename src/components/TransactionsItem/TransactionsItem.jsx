import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './TransactionsItem.module.css';
import { deleteTransaction } from '../../redux/transactions/operations';
import ModalEditTransaction from '../ModalEditTransaction/ModalEditTransaction';
import pencil from './edit.svg';

export default function TransactionsItem({ transaction, onEdit }) {
  const { _id, date, type, category, comment, value } = transaction;
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const resultAction = await dispatch(deleteTransaction(_id));

      if (resultAction.type === 'transactions/delete/fulfilled') {
        toast.success('Transaction deleted successfully!');
      } else {
        toast.error('Failed to delete transaction');
        console.error(resultAction.payload);
      }
    } catch (error) {
      toast.error('Delete error');
      console.error('Delete failed:', error);
    }
  };

  const handleEdit = () => {
    onEdit(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getCategoryName = () => {
    if (type === 'income') return '';
    if (typeof category === 'object' && category !== null && category.name) {
      return category.name;
    }
    if (typeof category === 'string') {
      return category;
    }
    return 'Unknown';
  };

  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  return (
    <>
      {/* Version for table (desktop/tablet) */}
      <tr className={styles.transactionItem}>
        <td>{formattedDate}</td>
        <td>{type === 'income' ? '+' : '-'}</td>
        <td>{getCategoryName()}</td>
        <td>{comment}</td>
        <td
          className={
            type === 'income' ? styles.sumPositive : styles.sumNegative
          }
        >
          {value}
        </td>
        <td className={styles.transactionActions}>
          <button type="button" className={styles.editBtn} onClick={handleEdit}>
            <img src={pencil} alt="Edit" width="11" height="11" />
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            Delete
          </button>
        </td>
      </tr>
      {/* Version for mobile devices (card layout) */}
      <div className={styles.transactionCard}>
        <p>
          <strong>Date:</strong> {formattedDate}
        </p>
        <p>
          <strong>Type:</strong> {type === 'income' ? '+' : '-'}
        </p>
        <p>
          <strong>Category:</strong> {getCategoryName()}
        </p>
        <p>
          <strong>Comment:</strong> {comment}
        </p>
        <p
          className={
            type === 'income' ? styles.sumPositive : styles.sumNegative
          }
        >
          <strong>Sum:</strong> {value}
        </p>
        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button type="button" className={styles.editBtn} onClick={handleEdit}>
            <img src={pencil} alt="Edit" width="11" height="11" />
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

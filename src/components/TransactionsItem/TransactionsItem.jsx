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
      await dispatch(deleteTransaction(_id)).unwrap();
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error(error);
    }
  };

  const handleEdit = () => {
    onEdit(transaction);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <tr className={styles.transactionItem}>
        {new Date(date).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })}
        <td>{type}</td>
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

      {isModalOpen && (
        <ModalEditTransaction
          onClose={handleCloseModal}
          transaction={transaction}
        />
      )}
    </>
  );
}

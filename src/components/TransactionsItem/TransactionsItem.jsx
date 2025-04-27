import { useDispatch } from 'react-redux';
import styles from './TransactionsItem.module.css';
import { deleteTransaction } from '../../redux/transactions/operations';

export default function TransactionsItem({ transaction }) {
  const { id, date, type, category, comment, sum } = transaction;
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTransaction(id));
  };

  return (
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
        <button type="button" className={styles.editBtn}>
          ✏️
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
  );
}

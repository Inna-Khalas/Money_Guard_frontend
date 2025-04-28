import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import styles from './TransactionsItem.module.css';
import { deleteTransaction } from '../../redux/transactions/operations';

/*export default function TransactionsItem({ transaction }) {
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
}*/
//--- переписал код потому что это надо чтоб было через таблицу а не через параграф -- тут все работает по логике, также подключена кнопка едит и удаление! 

export default function TransactionsItem({ transaction, onEdit }) {
  const { _id, date, type, category, comment, value } = transaction;
  const dispatch = useDispatch();

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

  return (
    <tr className={styles.transactionRow}>
      <td>{new Date(date).toLocaleDateString()}</td>
      <td>{type}</td>
      <td>{getCategoryName()}</td>
      <td>{comment}</td>
      <td>{type === 'expense' ? `- ${value}` : `+ ${value}`}</td>
      <td className={styles.actionsCell}>
        <button type="button" className={styles.editBtn} onClick={handleEdit}>
          ✏️
        </button>
        <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
          🗑️
        </button>
      </td>
    </tr>
  );
}
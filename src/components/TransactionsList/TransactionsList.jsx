import { useSelector } from 'react-redux';
import TransactionsItem from '../TransactionsItem/TransactionsItem';
import styles from './TransactionsList.module.css';
import { selectAllTransactions } from '../../redux/transactions/selectors';

export default function TransactionsList({ onEdit }) {
  const transactions = useSelector(selectAllTransactions);

  if (!transactions.length) {
    return (
      <div>
        <p className={styles.emptyText}>No transactions yet</p>
      </div>
    );
  }

  return (
    <table className={styles.transactionsTable}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Category</th>
          <th>Comment</th>
          <th>Sum</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <TransactionsItem
            key={transaction._id || transaction.id}
            transaction={transaction}
            onEdit={onEdit}
          />
        ))}
      </tbody>
    </table>
  );
}

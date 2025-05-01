import { useSelector } from 'react-redux';
import TransactionsItem from '../TransactionsItem/TransactionsItem';
import styles from './TransactionsList.module.css';
import { selectAllTransactions } from '../../redux/transactions/selectors';

export default function TransactionsList({ onEdit }) {
  const transactions = useSelector(selectAllTransactions);

  if (!transactions.length) {
    return (
      <div className={styles.emptyWrapper}>
        <p className={styles.emptyText}>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Table layout for tablet/desktop */}
      <div className={styles.scrollableTableWrapper}>
        <table className={styles.transactionsTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th className={styles.commentCell}>Comment</th>
              <th>Sum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <TransactionsItem
                key={transaction._id || transaction.id}
                transaction={transaction}
                onEdit={onEdit}
                isMobile={false}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className={styles.transactionCards}>
        {transactions.map(transaction => (
          <TransactionsItem
            key={(transaction._id || transaction.id) + '-card'}
            transaction={transaction}
            onEdit={onEdit}
            isMobile={true}
          />
        ))}
      </div>
    </div>
  );
}

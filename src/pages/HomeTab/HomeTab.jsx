import Balance from '../../components/Balance/Balance';
import TransactionsList from '../../components/TransactionsList/TransactionsList';

export default function HomeTab({ onEdit }) { //  Принимаем onEdit
  return (
    <div>
      <Balance />
      <TransactionsList onEdit={onEdit} /> {/*  Пробрасываем дальше */}
    </div>
  );
}

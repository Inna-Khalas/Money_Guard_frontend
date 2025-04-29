import { useSelector } from 'react-redux';

import { selectBalance } from '../../redux/transactions/selectors';

import s from './Balance.module.css';


export default function Balance() {
  const balance = useSelector(selectBalance);

  const formatBalance = amount => {
    if (typeof amount !== 'number') return '0.00';
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
  };

  return (
    <div className={s.container}>
      <h2 className={s.title}>Your balance</h2>
      <p className={s.total}>₴ {formatBalance(balance)}</p>
    </div>
  );
}

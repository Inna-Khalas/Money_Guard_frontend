import { useDispatch, useSelector } from 'react-redux';
import {
  selectBalance,
  selectIsLoading,
} from '../../redux/transactions/selectors';
import { getBalance } from '../../redux/transactions/operations';
import { useEffect } from 'react';
import s from './Balance.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors';
export default function Balance() {
  const dispatch = useDispatch();
  const balance = useSelector(selectBalance);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      dispatch(getBalance());
    }
  }, [dispatch, isLoggedIn, isLoading]);

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

import s from './Currency.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonoCurrThunk } from '../../redux/transactions/operations';
import { selectMonoBank } from '../../redux/transactions/selectors';

export default function Currency() {
  const dispatch = useDispatch();
  const data = useSelector(selectMonoBank);

  useEffect(() => {
    dispatch(fetchMonoCurrThunk());
  }, [dispatch])

  function usdFinder(curr) {
    return curr.currencyCodeA === 840;
  }
  const usd = data.monoData?.find(usdFinder);

  function eurFinder(curr) {
    return curr.currencyCodeA === 978;
  }
  const eur = data.monoData?.find(eurFinder);

  return (
    <><div className={s.container}>
        <div className={s.wrapper}>
          <div className={s.title}>
            <p>Currency</p><p>Purchase</p><p>Sale</p>
          </div>
          <div className={s.data}>
            <div className={s.usd}>
              <p className={s.lineUsd}>USD</p>
              <p className={s.lineUsd}>{usd?.rateBuy.toFixed(2)}</p>
              <p className={s.lineUsd}>{usd?.rateSell.toFixed(2)}</p>
            </div>
            <div className={s.eur}>
              <p className={s.lineEur}>EUR</p>
              <p className={s.lineEur}>{eur?.rateBuy.toFixed(2)}</p>
              <p className={s.lineEur}>{eur?.rateSell.toFixed(2)}</p>
            </div>        
          </div>
          <span className={s.diagram}></span>
          <span className={s.line}></span>
          <div className={s.diagramNumberContainer}>
            <div className={s.usdDot}>{usd?.rateSell.toFixed(2)}</div>
            <div className={s.eurDot}>{eur?.rateSell.toFixed(2)}</div>
          </div>        
          <div className={s.rightDot}></div>
          <div className={s.leftDot}></div>
        </div>
      </div>
    </>
  );
}
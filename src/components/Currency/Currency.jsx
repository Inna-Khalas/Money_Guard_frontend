import s from './Currency.module.css';
import axios from 'axios';

// import { fetchMonoThunk } from '../../redux/transactions/operations';
// import { useDispatch } from 'react-redux';

import { useEffect, useState } from 'react';

export default function Currency() {
  const [usd, setUsd] = useState([]);
  const [eur, setEur] = useState([]);

  useEffect(() => {
    async function fetchData () {
      const response = await axios.get('https://api.monobank.ua/bank/currency');
      setUsd(response.data[0]);
      setEur(response.data[1]);
    }
    fetchData();
  }, []);


  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(fetchMonoThunk());
  // }, [dispatch])
  
  return (
    <><div className={s.container}>
        <div className={s.wrapper}>
          <div className={s.title}>
            <p>Currency</p><p>Purchase</p><p>Sale</p>
          </div>
          <div className={s.data}>
            <div className={s.usd}>
              <p className={s.lineUsd}>USD</p>
              <p className={s.lineUsd}>{usd.rateBuy}</p>
              <p className={s.lineUsd}>{usd.rateSell}</p>
            </div>
            <div className={s.eur}>
              <p className={s.lineEur}>EUR</p>
              <p className={s.lineEur}>{eur.rateBuy}</p>
              <p className={s.lineEur}>{eur.rateSell}</p>
            </div>        
          </div>
          <span className={s.diagram}></span>
          <span className={s.line}></span>
          <span className={s.leftDot}></span>
          <span className={s.rightDot}></span>
        </div>
      </div>
    </>
  );
}
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { fetchMonoCurrThunk } from '../../redux/transactions/operations';
import { selectMonoBank } from '../../redux/transactions/selectors';
import { useMedia } from '../../hooks/useMedia';

import s from './Currency.module.css';


export default function Currency() {
  const dispatch = useDispatch();
  const data = useSelector(selectMonoBank);
  const { isMobile } = useMedia();
  const { isTablet } = useMedia();
  const { isDesktop } = useMedia();

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
    <>
      <div className={s.container}>
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
          {isMobile &&
            <svg className={s.diagram} viewBox="0 0 320 88">
              <use href='../../../public/sprite.svg#diagram'></use>
            </svg>}
          {isTablet &&
            <svg className={s.diagramTab} viewBox="0 0 336 88">
              <use href='../../../public/sprite.svg#diagramTab'></use>
            </svg>}
          {isDesktop &&
            <svg className={s.diagramDesktop} viewBox="0 0 480 167">
              <use href='../../../public/sprite.svg#diagramDesktop'></use>
            </svg>}
          <svg className={s.line} viewBox="0 0 320 72">
            <use href='/sprite.svg#line'></use>
          </svg>
          <svg className={s.leftDot} viewBox="0 0 6 6">
            <use href='../../../public/sprite.svg#dot'></use>
          </svg>
          <svg className={s.rightDot} viewBox="0 0 6 6">
            <use href='../../../public/sprite.svg#dot'></use>
          </svg>
          <div className={s.diagramNumberContainer}>
            <div className={s.usdDot}>{usd?.rateSell.toFixed(2)}</div>
            <div className={s.eurDot}>{eur?.rateSell.toFixed(2)}</div>
          </div>        
        </div>
      </div>
    </>
  );
}

// {!isDesktop ? (<svg className={s.diagram}>
//             <use href='/sprite.svg#diagram'></use>
//           </svg>) : (<svg className={s.diagramDesktop} viewBox="0 0 480 167">
//             <use href='../../../public/sprite.svg#diagramDesktop'></use>
//           </svg>)}
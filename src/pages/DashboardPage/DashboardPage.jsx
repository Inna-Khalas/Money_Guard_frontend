import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { useMedia } from '../../hooks/useMedia';
import { fetchTransactions } from '../../redux/transactions/operations';
import Navigation from '../../components/Navigation/Navigation';
import CurrencyTab from '../CurrencyTab/CurrencyTab';
import HomeTab from '../HomeTab/HomeTab';
import s from './DashboardPage.module.css';

import Header from '../../components/Header/Header';
import Balance from '../../components/Balance/Balance';
import StatisticsTab from '../StatisticsTab/StatisticsTab';

export default function DashboardPage() {
  const { isMobile } = useMedia();
  const dispatch = useDispatch();
  const location = useLocation();

  const homeActive = location.pathname === '/dashboard/home';
  const statisticActive = location.pathname === '/dashboard/statistics';
  const currencyActive = location.pathname === '/dashboard/currency';

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <>
      <>
        <Header />
        <div className={s.dashBoardContainer}>
          <div className={s.leftSide}>
            <div className={s.navHomeContainer}>
              <Navigation />
              {!isMobile && <Balance />}
            </div>
            {!isMobile ? <CurrencyTab /> : currencyActive && <CurrencyTab />}
          </div>
          <div className={s.tabContainer}>
            {homeActive && <HomeTab />}
            {statisticActive && <StatisticsTab />}
          </div>
          {/* <div className={s.tabContainer}>
            <Outlet />
          </div> */}
        </div>
      </>
    </>
  );
}

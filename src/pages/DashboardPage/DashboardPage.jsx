import { Outlet, useLocation } from 'react-router-dom';

import { useMedia } from '../../hooks/useMedia';
import Navigation from '../../components/Navigation/Navigation';
import CurrencyTab from '../CurrencyTab/CurrencyTab';
import HomeTab from '../HomeTab/HomeTab';
import s from './DashboardPage.module.css';

import Header from '../../components/Header/Header';
import Balance from '../../components/Balance/Balance';
import StatisticsTab from '../StatisticsTab/StatisticsTab';
import { useEffect } from 'react';
import { fetchTransactions } from '../../redux/transactions/operations';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectisLoading } from '../../redux/transactions/selectors';
import { Loader } from 'lucide-react';

export default function DashboardPage() {
  const { isMobile } = useMedia();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const isLoading = useSelector(selectisLoading);

  const homeActive = location.pathname === '/dashboard/home';
  const statisticActive = location.pathname === '/dashboard/statistics';
  const currencyActive = location.pathname === '/dashboard/currency';

  useEffect(() => {
    if (homeActive || statisticActive) {
      return;
    }
    if (!isMobile && !homeActive) {
      navigate('/dashboard/home');
    }
  }, [statisticActive, homeActive, isMobile, navigate]);

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
            {homeActive && (
              <>
                {isLoading ? (
                  <div className={s.loaderWrapper}>
                    <Loader size={28} />
                  </div>
                ) : (
                  <HomeTab />
                )}
              </>
            )}
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

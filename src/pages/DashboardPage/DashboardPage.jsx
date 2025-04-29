import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { useMedia } from '../../hooks/useMedia';
import { fetchTransactions } from '../../redux/transactions/operations';
import Navigation from '../../components/Navigation/Navigation';
import CurrencyTab from '../CurrencyTab/CurrencyTab';
import HomeTab from '../HomeTab/HomeTab';
import StatisticsTab from '../StatisticsTab/StatisticsTab';
import Header from '../../components/Header/Header';
import Balance from '../../components/Balance/Balance';
import ButtonAddTransactions from '../../components/ButtonAddTransactions/ButtonAddTransactions';
import ModalAddTransaction from '../../components/ModalAddTransaction/ModalAddTransaction';
import ModalEditTransaction from '../../components/ModalEditTransaction/ModalEditTransaction';

import s from './DashboardPage.module.css';

export default function DashboardPage() {
  const { isMobile } = useMedia();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  const homeActive = location.pathname === '/dashboard/home';
  const statisticActive = location.pathname === '/dashboard/statistics';
  const currencyActive = location.pathname === '/dashboard/currency';

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
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
            <HomeTab onEdit={transaction => setEditTransaction(transaction)} />
          )}
          {statisticActive && <StatisticsTab />}
        </div>
      </div>

      <ButtonAddTransactions onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <ModalAddTransaction onClose={() => setIsModalOpen(false)} />
      )}

      {editTransaction && (
        <ModalEditTransaction
          transaction={editTransaction}
          onClose={() => setEditTransaction(null)}
        />
      )}
    </>
  );
}

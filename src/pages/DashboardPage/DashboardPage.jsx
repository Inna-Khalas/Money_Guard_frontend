import Navigation from '../../components/Navigation/Navigation';
// import { useSelector } from 'react-redux';
import { Loader } from '../../components/Loader/Loader';
// import { selectisLoading } from '../../redux/transactions/selectors';
import CurrencyTab from '../CurrencyTab/CurrencyTab';
import HomeTab from '../HomeTab/HomeTab';
import { useMedia } from '../../hooks/useMedia';
import s from './DashboardPage.module.css';

import { useState, useEffect } from 'react';
import ButtonAddTransactions from '../../components/ButtonAddTransactions/ButtonAddTransactions';
import ModalAddTransaction from '../../components/ModalAddTransaction/ModalAddTransaction';
import ModalEditTransaction from '../../components/ModalEditTransaction/ModalEditTransaction';
import Header from '../../components/Header/Header';
import Balance from '../../components/Balance/Balance';
import { Outlet, useLocation } from 'react-router-dom';
import StatisticsTab from '../StatisticsTab/StatisticsTab';

export default function DashboardPage() {
  // const isLoading = useSelector(selectisLoading);
  const { isMobile } = useMedia();

  /*Стейт для управления открытием модалки */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const location = useLocation();

  const homeActive = location.pathname === '/dashboard/home';
  console.log(homeActive);

  const statisticActive = location.pathname === '/dashboard/statistics';

  /* 🎯 Моковая транзакция для редактирования */
  const mockTransaction = {
    type: 'income',
    sum: '0.00',
    date: '',
    comment: '',
    category: '',
  };

  /* Блокировка скролла страницы при открытии модалки */
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  return (
    <>
      {/* {isLoading ? (
        <Loader />
      ) : ( */}
      <>
        <Header />
        <div className={s.dashBoardContainer}>
          <div className={s.leftSide}>
            <div className={s.navHomeContainer}>
              <Navigation />
              {!isMobile && <Balance />}
            </div>
            {!isMobile && <CurrencyTab />}
          </div>
          <div className={s.tabContainer}>
            {homeActive && <HomeTab />}
            {statisticActive && <StatisticsTab />}
          </div>
        </div>
        {/*  модалки добавления транзакции */}
        <ButtonAddTransactions onClick={() => setIsModalOpen(true)} />

        {/* окно модалки добавления */}
        {isModalOpen && (
          <ModalAddTransaction onClose={() => setIsModalOpen(false)} />
        )}

        {/* открытия модалки редактирования */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button onClick={() => setShowEdit(true)}>Open Edit Modal</button>
        </div>

        {/*  окно модалки редактирования */}
        {showEdit && (
          <ModalEditTransaction
            transaction={mockTransaction}
            onClose={() => setShowEdit(false)}
          />
        )}

        {/* <Outlet /> */}
      </>
      {/* )} */}
    </>
  );
}

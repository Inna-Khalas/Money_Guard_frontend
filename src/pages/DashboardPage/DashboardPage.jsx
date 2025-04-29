import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { useMedia } from '../../hooks/useMedia';
import { fetchTransactions } from '../../redux/transactions/operations';
import { Loader } from '../../components/Loader/Loader';
import Navigation from '../../components/Navigation/Navigation';
import CurrencyTab from '../CurrencyTab/CurrencyTab';
import HomeTab from '../HomeTab/HomeTab';
import { useMedia } from '../../hooks/useMedia';  
import s from './DashboardPage.module.css'; 

import Header from '../../components/Header/Header';
import Balance from '../../components/Balance/Balance';
import StatisticsTab from '../StatisticsTab/StatisticsTab';

import s from './DashboardPage.module.css';


export default function DashboardPage() {
  // const isLoading = useSelector(selectisLoading);
  const { isMobile } = useMedia(); 

 /*Стейт для управления открытием модалки */
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editTransaction, setEditTransaction] = useState(null); 
  
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
      {/* {isLoading ? (
        <Loader />
      ) : ( */}
      <>
//     <Navigation />
//         <HomeTab onEdit={(transaction) => setEditTransaction(transaction)} />

//       <CurrencyTab />

//         {/*  модалки добавления транзакции */}
//         <ButtonAddTransactions onClick={() => setIsModalOpen(true)} />

//         {/* окно модалки добавления */}
//         {isModalOpen && (
//           <ModalAddTransaction onClose={() => setIsModalOpen(false)} />
//         )}

        

        {/* Модалка редактирования транзакции */}
          {editTransaction && (
            <ModalEditTransaction
              transaction={editTransaction}
              onClose={() => setEditTransaction(null)}
          />
        )}

        <Header />
        <div className={s.dashBoardContainer}>
          <div className={s.leftSide}>
            <div className={s.navHomeContainer}>
              <Navigation />
              {!isMobile && <Balance />}
            </div>
            {!isMobile ? (
              <CurrencyTab />
            ) : (
              currencyActive && isMobile && <CurrencyTab />
            )}
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
      {/* )} */}
    </>
  );
}

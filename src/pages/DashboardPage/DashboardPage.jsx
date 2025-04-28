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


export default function DashboardPage() {
  // const isLoading = useSelector(selectisLoading);
  const { isMobile } = useMedia();

 /*Стейт для управления открытием модалки */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

/* 🎯 Моковая транзакция для редактирования */
  const mockTransaction = {
    type: 'income',
    sum: "0.00",
    date: '',
    comment: '',
    category: ''
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
    <Navigation />
        <HomeTab />

      <CurrencyTab />

        {/*  модалки добавления транзакции */}
        <ButtonAddTransactions onClick={() => setIsModalOpen(true)} />

        {/* окно модалки добавления */}
        {isModalOpen && (
          <ModalAddTransaction onClose={() => setIsModalOpen(false)} />
        )}

        {/* открытия модалки редактирования */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button onClick={() => setShowEdit(true)}>
            Open Edit Modal
          </button>
        </div>

        {/*  окно модалки редактирования */}
        {showEdit && (
          <ModalEditTransaction
            transaction={mockTransaction}
            onClose={() => setShowEdit(false)}
          />
        )}

      </>
      {/* )} */}
    </>
  );
}
import Navigation from '../../components/Navigation/Navigation';
// import { useSelector } from 'react-redux';
import { Loader } from '../../components/Loader/Loader';
// import { selectisLoading } from '../../redux/transactions/selectors';
import CurrencyTab from '../CurrencyTab/CurrencyTab';
import HomeTab from '../HomeTab/HomeTab';
import { useMedia } from '../../hooks/useMedia';
import s from './DashboardPage.module.css';



export default function DashboardPage() {
  // const isLoading = useSelector(selectisLoading);
  const { isMobile } = useMedia();

  return (
    <>
      {/* {isLoading ? (
        <Loader />
      ) : ( */}
      <>
        <div className={s.dashBoardContainer}>
          <div className={s.navHomeContainer}>
            <Navigation />
              <HomeTab />
          </div>
           {!isMobile && <CurrencyTab />}
        </div>
        
      </>
      {/* )} */}
    </>
  );
}

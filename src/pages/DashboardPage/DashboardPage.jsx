import Navigation from '../../components/Navigation/Navigation';
// import { useSelector } from 'react-redux';
import { Loader } from '../../components/Loader/Loader';
// import { selectisLoading } from '../../redux/transactions/selectors';
import CurrencyTab from '../CurrencyTab/CurrencyTab';
import HomeTab from '../HomeTab/HomeTab';

export default function DashboardPage() {
  // const isLoading = useSelector(selectisLoading);

  return (
    <>
      {/* {isLoading ? (
        <Loader />
      ) : ( */}
      <>
    <Navigation />
        <HomeTab />

        <CurrencyTab />
      </>
      {/* )} */}
    </>
  );
}

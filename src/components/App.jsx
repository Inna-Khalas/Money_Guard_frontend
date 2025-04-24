import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

import RegistrationPage from '../pages/RegistrationPage/RegistrationPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import PrivateRoute from '../PrivateRoute';
import Layout from '../Layout';
import RestrichedRoute from '../RestrichedRoute';
import NotFound from '../pages/NotFound';
import HomeTab from '../pages/HomeTab/HomeTab';
import Balance from './Balance/Balance';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import Loader from './Loader/Loader';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getLoadingData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
      } catch (error) {
        setIsError(true);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getLoadingData();
  });

  return (
    <div>
      <Toaster />
      <Layout>
        <Balance />
        <Routes>
          <Route
            path="/register"
            element={<RestrichedRoute component={<RegistrationPage />} />}
          />
          <Route
            path="/login"
            element={
              <RestrichedRoute redirectTo="/" component={<LoginPage />} />
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute redirectTo="/login" component={<HomeTab />} />
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                redirectTo="/dashboard"
                component={<DashboardPage />}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>

      {isLoading && <Loader />}
      {isError && <h2>Something went wrong! Try again...</h2>}
    </div>
  );
};

export default App;

import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import RestrichedRoute from '../RestrichedRoute';
import PrivateRoute from '../PrivateRoute';

import Layout from '../Layout';
import NotFound from '../pages/NotFound';

import RegistrationPage from '../pages/RegistrationPage/RegistrationPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import HomeTab from '../pages/HomeTab/HomeTab';
import StatisticsTab from '../pages/StatisticsTab/StatisticsTab';
import CurrencyTab from '../pages/CurrencyTab/CurrencyTab';

const App = () => {
  return (
    <>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/register"
            element={<RestrichedRoute element={<RegistrationPage />} />}
          />

          <Route
            path="/login"
            element={
              <RestrichedRoute
                redirectTo="/dashboard"
                element={<LoginPage />}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute redirectTo="/login" element={<DashboardPage />} />
            }
          >
            <Route path="home" element={<HomeTab />} />
            <Route path="statistics" element={<StatisticsTab />}></Route>
            <Route path="currency" element={<CurrencyTab />}></Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
};

export default App;

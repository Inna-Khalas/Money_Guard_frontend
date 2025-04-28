import Header from "./Header/Header";
//import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// import { useEffect } from 'react';

import RegistrationPage from '../pages/RegistrationPage/RegistrationPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import PrivateRoute from '../PrivateRoute';
import Layout from '../Layout';
import RestrichedRoute from '../RestrichedRoute';
import NotFound from '../pages/NotFound';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
//import LogOut from '../components/LogOut/LogOut'; // потом убрать
// import { refreshThunk } from '../redux/auth/operations';
// import { useDispatch } from 'react-redux';

const App = () => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(refreshThunk());
  // }, [dispatch]);







  return (
    <>
      <Header />
      <Toaster />
      <Layout>
        
        <Routes>
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
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
};

export default App;

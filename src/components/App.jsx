import React, { useState } from 'react';
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

import LogOut from '../components/LogOut/LogOut'; // потом убрать

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

const [showLogout, setShowLogout] = useState(false); // убрать потом

  const handleLogout = () => { //
    alert('Logged out!'); //
    setShowLogout(false); //
  }; //


  return (
    <div>
      <Toaster />
      <Layout>

    <button onClick={() => setShowLogout(true)}>Open Logout Modal</button> {/*Убрать потом */}
      {showLogout && <LogOut onClose={() => setShowLogout(false)} onLogout={handleLogout} />} {/* убрать потом*/}

        
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
              <PrivateRoute redirectTo="/login" component={<DashboardPage />} />
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

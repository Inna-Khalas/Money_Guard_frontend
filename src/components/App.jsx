import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import RegistrationPage from '../pages/RegistrationPage/RegistrationPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import PrivateRoute from '../PrivateRoute';
import Layout from '../Layout';
import RestrichedRoute from '../RestrichedRoute';
import NotFound from '../pages/NotFound';
import HomeTab from '../pages/HomeTab/HomeTab';
import Balance from './Balance/Balance';
import DashboardPage from '../pages/DashboardPage/DashboardPage';

import LogOut from '../components/LogOut/LogOut'; // потом убрать

const App = () => {

const [showLogout, setShowLogout] = useState(false); // убрать потом

  const handleLogout = () => { //
    alert('Logged out!'); //
    setShowLogout(false); //
  }; //


  return (
    <>
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
    </>
  );
};

export default App;

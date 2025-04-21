import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import RegistrationPage from "../pages/RegistrationPage/RegistrationPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import PrivateRoute from "../PrivateRoute";
import Layout from "../Layout";
import RestrichedRoute from "../RestrichedRoute";
import NotFound from "../pages/NotFound";
import HomeTab from "../pages/HomeTab/HomeTab";

const App = () => {
  return (
    <>
      <Toaster />
      <Layout>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
};

export default App;

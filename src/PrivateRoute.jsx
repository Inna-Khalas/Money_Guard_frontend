import { Navigate } from "react-router-dom";

function PrivateRoute({ component: Component, redirectTo = "/" }) {
  const isLoggedIn = true; //заглушка

  return isLoggedIn ? Component : <Navigate to={redirectTo} />;
}

export default PrivateRoute;

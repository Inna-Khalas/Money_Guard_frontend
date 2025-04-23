import { Navigate } from "react-router-dom";

function RestrichedRoute({ component: Component, redirectTo = "/" }) {
  const isLoggedIn = false; //заглушка

  return isLoggedIn ? <Navigate to={redirectTo} /> : Component;
}

export default RestrichedRoute;

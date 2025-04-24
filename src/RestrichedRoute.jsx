import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from './redux/auth/selectors';
import { Navigate } from 'react-router-dom';

function RestrichedRoute({ component: Component, redirectTo = '/' }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? <Navigate to={redirectTo} /> : Component;
}

export default RestrichedRoute;

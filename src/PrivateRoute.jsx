import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from './redux/auth/selectors';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element, redirectTo = '/login' }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? element : <Navigate to={redirectTo} />;
}

export default PrivateRoute;

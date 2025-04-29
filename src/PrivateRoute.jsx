import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectIsLoggedIn } from './redux/auth/selectors';


function PrivateRoute({ element, redirectTo = '/login' }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? element : <Navigate to={redirectTo} />;
}

export default PrivateRoute;

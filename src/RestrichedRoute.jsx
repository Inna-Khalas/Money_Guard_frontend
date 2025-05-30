import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from './redux/auth/selectors';
import { Navigate } from 'react-router-dom';


function RestrichedRoute({ element, redirectTo = '/dashboard' }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? <Navigate to={redirectTo} /> : element;
}

export default RestrichedRoute;

import { Suspense } from 'react';
import AppBar from './components/AppBar/AppBar';
import Loader from './components/Loader';

function Layout({ children }) {
  return (
    <div>
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}

export default Layout;

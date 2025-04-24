import { Suspense } from 'react';
import AppBar from './components/AppBar/AppBar';
import Loader from './components/Loader/Loader';

function Layout({ children }) {
  return (
    <div>
      <Loader />
      <AppBar />
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}

export default Layout;

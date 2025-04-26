import { Suspense } from 'react';
import AppBar from './components/AppBar/AppBar';

function Layout({ children }) {
  return (
    <div>
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}

export default Layout;

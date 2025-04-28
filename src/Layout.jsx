import { Suspense } from 'react';
import AppBar from './components/AppBar/AppBar';
i;

function Layout({ children }) {
  return (
    <div>
      <AppBar />
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}

export default Layout;

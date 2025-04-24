import { Suspense } from "react";

function Layout({ children }) {
  return (
    <div>
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}

export default Layout;

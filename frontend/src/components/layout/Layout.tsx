import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  const isMapPage = pathname === '/map';

  return (
    <div className="min-h-screen flex flex-col text-gray-900 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isMapPage && <Footer />}
    </div>
  );
}

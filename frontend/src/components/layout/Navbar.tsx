import { Link, useNavigate } from 'react-router-dom';
import { clearToken, isAuthenticated } from '../../lib/api';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      setLoggedIn(isAuthenticated());
      setRole(localStorage.getItem('user_role'));
    };
    checkAuth();
    // Re-check on storage changes (e.g. login/logout in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    clearToken();
    setLoggedIn(false);
    setRole(null);
    navigate('/');
  };

  const dashboardPath = role === 'SELLER'
    ? '/dashboard/seller'
    : role === 'ADMIN'
      ? '/dashboard/admin'
      : '/dashboard/buyer';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">TERRITORY</Link>
          </div>
          <div className="flex space-x-4 items-center">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Browse</Link>
            {loggedIn ? (
              <>
                <Link to={dashboardPath} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                <Link to="/register/buyer" className="bg-primary text-white hover:bg-emerald-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

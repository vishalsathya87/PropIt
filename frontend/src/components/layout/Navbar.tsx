import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearToken } from '../../lib/api';
import { useState, useEffect, useRef } from 'react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        setRole(localStorage.getItem('user_role'));
        setAvatarUrl(user.photoURL);
        setDisplayName(user.displayName || user.email);
      } else {
        setLoggedIn(false);
        setRole(null);
        setAvatarUrl(null);
        setDisplayName(null);
      }
    });

    // Listen for storage updates
    const checkRole = () => {
      setRole(localStorage.getItem('user_role'));
    };
    window.addEventListener('storage', checkRole);

    // Click outside handler to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', checkRole);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error signing out of Firebase:', e);
    }
    clearToken();
    setLoggedIn(false);
    setRole(null);
    setAvatarUrl(null);
    setDisplayName(null);
    setDropdownOpen(false);
    navigate('/');
  };

  const dashboardPath = role === 'SELLER'
    ? '/dashboard/seller'
    : role === 'ADMIN'
      ? '/dashboard/admin'
      : '/dashboard/buyer';

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isExact = (path: string) => location.pathname === path;

  const navLinkClass = (path: string, exact = false) => {
    const active = exact ? isExact(path) : isActive(path);
    return [
      'text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-150',
      active
        ? 'text-primary bg-primary/8'
        : 'text-slate-500 hover:text-primary hover:bg-primary/5',
    ].join(' ');
  };

  return (
    <nav className="navbar" style={{ position: 'relative', zIndex: 40 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Land/map pin SVG icon */}
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>TERRITORY</span>
          </Link>

          {/* Desktop Nav */}
          <div className="flex items-center gap-1">
            <Link to="/" className={navLinkClass('/', true)}>Browse</Link>
            <Link to="/help" className={navLinkClass('/help')}>Help</Link>
            <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>

            <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 0.5rem' }} />

            {loggedIn ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Pill Trigger Button — Only Avatar & Chevron */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-0.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-full pr-2 select-none cursor-pointer focus:outline-none transition-colors"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName || 'User'}
                      className="w-8 h-8 rounded-full border border-slate-100 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-[99] animate-[fadeIn_0.15s_ease-out]">
                    <div className="px-4 py-2 border-b border-slate-100 select-none">
                      <span className="inline-block text-[9px] font-extrabold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-1 tracking-wider leading-none">
                        {role || 'Buyer'}
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">Logged in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate mt-1" title={displayName || ''}>{displayName}</p>
                    </div>
                    
                    <Link
                      to={dashboardPath}
                      onClick={() => setDropdownOpen(false)}
                      className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors no-underline font-medium"
                    >
                      Go to Dashboard
                    </Link>
                    
                    <div className="border-t border-slate-100" />
                    
                    <button
                      id="navbar-logout"
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer font-semibold"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                id="navbar-login"
                className="text-sm font-semibold text-white px-4 py-2 rounded-lg no-underline transition-all duration-150 hover:-translate-y-px"
                style={{
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

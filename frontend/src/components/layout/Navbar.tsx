import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">PropIt</Link>
          </div>
          <div className="flex space-x-4 items-center">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
            <Link to="/login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
            <Link to="/register/buyer" className="bg-primary text-white hover:bg-emerald-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

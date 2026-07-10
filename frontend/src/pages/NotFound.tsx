import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-black text-gray-200">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="mt-8 bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-emerald-600 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}

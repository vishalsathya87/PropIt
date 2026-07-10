import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function SecureViewer() {
  const { docId } = useParams<{ docId: string }>();
  const [loading, setLoading] = useState(true);
  const userPhone = localStorage.getItem('user_phone') ?? 'PROPIT USER';

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'c'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => setLoading(false), 1200);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col fixed inset-0 z-[100]">
      <div className="bg-gray-900 px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold">Secure Document Viewer</h1>
          <p className="text-sm text-gray-400 font-mono">{docId}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-red-900 text-red-100 text-xs px-3 py-1 rounded-full border border-red-700 font-semibold tracking-wide">
            CONFIDENTIAL • DO NOT COPY
          </span>
          <Link
            to="/dashboard/buyer"
            className="text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition-colors border border-gray-600 text-sm"
          >
            Close
          </Link>
        </div>
      </div>

      <div
        className="flex-grow flex items-center justify-center p-8 overflow-auto bg-gray-800 relative"
        style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}
      >
        <div className="absolute inset-0 z-10 cursor-not-allowed" onContextMenu={(e) => e.preventDefault()} />

        {loading ? (
          <div className="text-center z-20">
            <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-300">Decrypting secure document...</p>
          </div>
        ) : (
          <div className="bg-white p-2 rounded shadow-2xl z-0 max-w-4xl w-full">
            <div className="relative">
              {/* Watermark with logged-in user's phone */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none transform -rotate-45 text-black text-5xl font-black whitespace-nowrap overflow-hidden select-none">
                TERRITORY VERIFIED • {userPhone}
              </div>
              <img
                src="https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80"
                alt="Secure Document"
                className="w-full h-auto pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`@media print { body { display: none !important; } }`}</style>
    </div>
  );
}

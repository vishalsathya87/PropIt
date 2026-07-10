import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function SecureViewer() {
  const { docId } = useParams<{ docId: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts for print/save
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'c')) {
        e.preventDefault();
        alert('Action disabled for security purposes.');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Mock loading document
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

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
          <p className="text-sm text-gray-400">Document ID: {docId} • Property ID: 1</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-red-900 text-red-100 text-xs px-3 py-1 rounded-full border border-red-700 font-semibold tracking-wide">
            CONFIDENTIAL • DO NOT COPY
          </span>
          <Link to="/dashboard/buyer" className="text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition-colors border border-gray-600">
            Close Viewer
          </Link>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-8 overflow-auto bg-gray-800 relative" 
           style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}>
        
        {/* Invisible overlay to block inspection/right click on the document itself */}
        <div className="absolute inset-0 z-10 cursor-not-allowed" onContextMenu={(e) => e.preventDefault()}></div>

        {loading ? (
          <div className="text-center z-20">
            <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Decrypting secure document...</p>
          </div>
        ) : (
          <div className="bg-white p-2 rounded shadow-2xl z-0 max-w-4xl w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none transform -rotate-45 text-black text-6xl font-black whitespace-nowrap overflow-hidden">
                PROPIT VERIFIED • 9876543210
              </div>
              <img src="https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80" alt="Secure Document" className="w-full h-auto pointer-events-none" />
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>
    </div>
  );
}

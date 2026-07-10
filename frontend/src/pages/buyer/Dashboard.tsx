import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function BuyerDashboard() {
  const [unlockedProps, setUnlockedProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnlocked = async () => {
      try {
        const response = await api.get('/payments/unlocked-properties');
        setUnlockedProps(response.data);
      } catch (error) {
        console.error("Failed to fetch unlocked properties", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnlocked();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Unlocked Properties</h1>
      
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading your properties...</div>
      ) : unlockedProps.length === 0 ? (
        <div className="text-center text-gray-500 py-10">You haven't unlocked any properties yet.</div>
      ) : (
        <div className="grid gap-6">
          {unlockedProps.map((prop) => (
            <div key={prop.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-64 bg-gray-200 flex-shrink-0">
                 <div className="h-full w-full bg-cover bg-center min-h-[200px]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80)' }}></div>
              </div>
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{prop.city} Region</h3>
                    <p className="text-sm text-gray-500 mt-1">Status: {prop.status}</p>
                  </div>
                  <Link to={`/property/${prop.id}`} className="text-primary hover:underline text-sm font-medium">
                    View Property Details
                  </Link>
                </div>
                
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Available Documents</h4>
                  <div className="flex flex-wrap gap-4">
                    {['Patta', 'Chitta'].map((doc, idx) => (
                      <Link key={idx} to={`/viewer/doc-${prop.id}-${idx}`} className="flex items-center px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        {doc}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

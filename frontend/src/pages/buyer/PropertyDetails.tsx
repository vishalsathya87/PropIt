import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/utils';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prop, setProp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProp(response.data);
      } catch (err) {
        console.error("Failed to fetch property details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleMockUnlock = async () => {
    setUnlocking(true);
    setError('');
    try {
      await api.post('/payments/mock-unlock', { property_id: id });
      navigate('/dashboard/buyer');
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.detail || 'Payment simulation failed');
      }
    } finally {
      setUnlocking(false);
    }
  };

  // formatPrice imported from utils


  if (loading) return <div className="text-center py-20"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!prop) return <div className="text-center py-20 text-red-500">Property not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="text-primary hover:underline mb-6 inline-block">&larr; Back to Listings</Link>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Hero Banner */}
        <div className="h-64 sm:h-80 bg-gray-200 relative">
          <div className="absolute inset-0 bg-cover bg-center filter blur-md" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80)' }}></div>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-6">
            <svg className="w-16 h-16 text-white mb-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <h2 className="text-2xl font-bold text-white tracking-wide">Precise Location & Documents Hidden</h2>
            <p className="text-gray-200 mt-2">Unlock to view exact coordinates, FMB sketch, and Patta.</p>
          </div>
        </div>
        
        <div className="p-8">
          {/* Title + Price */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b border-gray-100 pb-6">
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-2">{prop.type}</span>
              <h1 className="text-3xl font-bold text-gray-900">{prop.city}{prop.district ? `, ${prop.district}` : ''}</h1>
              <p className="mt-1 text-gray-500">{prop.state}</p>
              <div className="mt-2 text-gray-600 flex items-center text-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                {prop.area} {prop.area_unit}
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <span className="block text-sm text-gray-500 uppercase tracking-wider font-semibold">Asking Price</span>
              <span className="block text-4xl font-extrabold text-primary">{formatPrice(prop.price)}</span>
              <span className="text-xs text-gray-400 mt-1 block">{prop.view_count} views</span>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Overview</h3>
            <p className="text-gray-700 leading-relaxed">{prop.description || "No description provided by the seller."}</p>
          </div>

          {/* Land Features Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Land Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {prop.soil_type && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Soil Type</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{prop.soil_type}</p>
                </div>
              )}
              {prop.water_source && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-500 uppercase font-semibold">Water Source</p>
                  <p className="text-sm font-medium text-blue-900 mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 1.293a1 1 0 011.414 0l7 7A1 1 0 0116 10v7a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V10a1 1 0 01.293-.707l3-3zM6 10.414V15h2v-4.586L6 10.414zm4 0V15h4v-4.586l-4-4V10.414z" clipRule="evenodd" /></svg>
                    {prop.water_source}
                  </p>
                </div>
              )}
              {prop.road_access && (
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                  <p className="text-xs text-yellow-600 uppercase font-semibold">Road Access</p>
                  <p className="text-sm font-medium text-yellow-900 mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2V2h4v2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2v2H8v-2zm0-10v8h4V6H8z"/></svg>
                    {prop.road_access}
                  </p>
                </div>
              )}
              {prop.fencing && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Fencing</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{prop.fencing}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Electricity</p>
                <p className={`text-sm font-medium mt-1 flex items-center gap-1 ${prop.electricity ? 'text-amber-700' : 'text-gray-400'}`}>
                  {prop.electricity ? (
                    <><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>Available</>
                  ) : 'Not Available'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Irrigation</p>
                <p className={`text-sm font-medium mt-1 flex items-center gap-1 ${prop.irrigation ? 'text-green-700' : 'text-gray-400'}`}>
                  {prop.irrigation ? (
                    <><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/></svg>Available</>
                  ) : 'Not Available'}
                </p>
              </div>
              {prop.nearby_town && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Nearest Town</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{prop.nearby_town}{prop.distance_from_town_km ? ` (${prop.distance_from_town_km} km)` : ''}</p>
                </div>
              )}
            </div>
          </div>

          {/* Keywords */}
          {prop.keywords && prop.keywords.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {prop.keywords.map((kw: string, i: number) => (
                  <span key={i} className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Unlock CTA */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Interested in this property?</h3>
            <p className="text-gray-600 mb-6">Pay a refundable verification fee of ₹500 via UPI to unlock all seller details and securely view the property documents.</p>
            
            {error && <div className="text-red-500 mb-4 text-sm font-medium">{error}</div>}
            
            <button onClick={handleMockUnlock} disabled={unlocking} className="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-md shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center mx-auto disabled:opacity-50">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              {unlocking ? 'Simulating UPI Payment...' : 'Pay ₹500 & Unlock Securely (Demo)'}
            </button>
            <p className="text-xs text-gray-500 mt-4">Payments are processed securely via UPI intent. Documents are view-only to prevent unauthorized distribution.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

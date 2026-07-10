import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { Property } from '../../lib/types';
import { formatPrice, shortId } from '../../lib/utils';
import { PROPERTY_IMAGES } from '../../lib/types';

export default function BuyerDashboard() {
  const [unlockedProps, setUnlockedProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Property[]>('/payments/unlocked-properties')
      .then(res => setUnlockedProps(res.data))
      .catch(() => setError('Failed to load your unlocked properties.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Unlocked Properties</h1>

      {error && <div className="text-red-500 bg-red-50 p-4 rounded-lg mb-6">{error}</div>}

      {!error && unlockedProps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-gray-500 font-medium">No unlocked properties yet.</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline text-sm">Browse properties</Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {unlockedProps.map((prop) => (
            <div key={prop.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
              <div className="md:w-64 flex-shrink-0">
                <div
                  className="h-full w-full bg-cover bg-center min-h-[200px]"
                  style={{ backgroundImage: `url(${PROPERTY_IMAGES[prop.type] ?? PROPERTY_IMAGES.default})` }}
                />
              </div>
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{prop.type}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{prop.city}{prop.district ? `, ${prop.district}` : ''}</h3>
                    <p className="text-sm text-gray-500">{prop.area} {prop.area_unit} &bull; {formatPrice(prop.price)}</p>
                  </div>
                  <Link to={`/property/${prop.id}`} className="text-sm text-primary hover:underline font-medium">View Details</Link>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">📄 Unlocked Documents</h4>
                  <div className="flex flex-wrap gap-3">
                    {/* In a full implementation, prop.documents would be fetched from backend */}
                    {['Patta', 'Chitta', 'FMB Sketch'].map((doc, idx) => (
                      <Link
                        key={idx}
                        to={`/viewer/doc-${prop.id}-${idx}`}
                        className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-emerald-50 hover:border-primary hover:text-primary transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
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

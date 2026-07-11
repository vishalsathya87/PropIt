import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

interface Property {
  id: string;
  city: string;
  district?: string;
  status: string;
  view_count: number;
}

interface SellerStats {
  unlock_counts: Record<string, number>;
  total_unlocks: number;
  total_revenue: number;
}

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [propsRes, statsRes] = await Promise.all([
          api.get<Property[]>('/properties/seller/me'),
          api.get<SellerStats>('/properties/seller/me/stats'),
        ]);
        setProperties(propsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch seller data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalViews = properties.reduce((sum, p) => sum + p.view_count, 0);
  const totalUnlocks = stats?.total_unlocks ?? 0;
  const totalRevenue = stats?.total_revenue ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <Link to="/dashboard/seller/upload" className="bg-primary text-white hover:bg-emerald-600 px-4 py-2 rounded-md font-medium shadow-sm transition-colors flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          List New Property
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Listings</h3>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">{properties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Views</h3>
          <p className="mt-2 text-4xl font-extrabold text-primary">{totalViews}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Unlocks (Earnings)</h3>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">
            {totalUnlocks}
            <span className="text-sm font-normal text-gray-500 ml-1">(\u20B9{totalRevenue.toLocaleString('en-IN')})</span>
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Properties</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Views / Unlocks</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <p className="text-gray-500 font-medium">No properties listed yet.</p>
                    <Link to="/dashboard/seller/upload" className="mt-2 inline-block text-primary hover:underline text-sm font-medium">
                      List your first property &rarr;
                    </Link>
                  </td>
                </tr>
              ) : properties.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{listing.city}{listing.district ? `, ${listing.district}` : ''}</div>
                    <div className="text-xs text-gray-400 font-mono">#{listing.id.slice(-8).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      listing.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      listing.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                    <span className="text-gray-900">{listing.view_count}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-primary">{stats?.unlock_counts?.[listing.id] ?? 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/dashboard/seller/edit/${listing.id}`} className="text-primary hover:text-emerald-700">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

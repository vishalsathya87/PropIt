import { Link } from 'react-router-dom';

export default function Dashboard() {
  const mockListings = [
    { id: '1', city: 'Coimbatore', status: 'Active', views: 120, unlocks: 4, date: '2026-07-01' },
    { id: '2', city: 'Madurai', status: 'Pending Verification', views: 0, unlocks: 0, date: '2026-07-09' },
  ];

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
          <p className="mt-2 text-4xl font-extrabold text-gray-900">{mockListings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Views</h3>
          <p className="mt-2 text-4xl font-extrabold text-primary">120</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Unlocks (Earnings)</h3>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">4 <span className="text-sm font-normal text-gray-500">(₹2000)</span></p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed On</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Views / Unlocks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{listing.city}</div>
                    <div className="text-sm text-gray-500">ID: #{listing.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${listing.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {listing.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                    <span className="text-gray-900">{listing.views}</span> <span className="text-gray-400">/</span> <span className="text-primary">{listing.unlocks}</span>
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

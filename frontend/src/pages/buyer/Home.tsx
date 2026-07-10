import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data
const mockProperties = [
  { id: '1', city: 'Coimbatore', area: 5, areaUnit: 'acres', price: 15000000, type: 'Agricultural', views: 120 },
  { id: '2', city: 'Chennai', area: 2400, areaUnit: 'sq_ft', price: 8500000, type: 'Flat Plot', views: 45 },
  { id: '3', city: 'Madurai', area: 2, areaUnit: 'acres', price: 6000000, type: 'Agricultural', views: 89 },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Discover Premium Land Securely
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Search verified agricultural and flat plots. Unlock official documents securely when you are ready to proceed.
        </p>
        <div className="mt-8 max-w-xl mx-auto">
          <div className="flex rounded-md shadow-sm">
            <input type="text" className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-l-md focus:ring-primary focus:border-primary border-gray-300 sm:text-lg border" placeholder="Search by city (e.g. Coimbatore, Chennai)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Latest Listings</h2>
        <div className="flex space-x-2">
          <select className="border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary border py-2 px-3">
            <option>All Types</option>
            <option>Agricultural</option>
            <option>Flat Plot</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockProperties.map(prop => (
          <div key={prop.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
            <div className="h-48 bg-gray-200 relative">
              {/* Blurred Map Placeholder to indicate hidden location */}
              <div className="absolute inset-0 bg-cover bg-center filter blur-sm" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80)' }}></div>
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow">Location Hidden</span>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-primary text-sm font-semibold uppercase tracking-wider">{prop.type}</span>
                  <h3 className="mt-1 text-xl font-bold text-gray-900">{prop.city}</h3>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-extrabold text-gray-900">{formatPrice(prop.price)}</span>
                </div>
              </div>
              <div className="mt-2 text-gray-600 flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                {prop.area} {prop.areaUnit}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex-grow flex items-end">
                <Link to={`/property/${prop.id}`} className="w-full text-center bg-gray-50 text-primary hover:bg-emerald-50 hover:text-emerald-700 font-semibold py-2 px-4 border border-gray-200 rounded transition-colors">
                  View Details & Unlock
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

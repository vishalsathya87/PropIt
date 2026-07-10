import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

interface Property {
  id: string;
  city: string;
  district: string;
  state: string;
  area: number;
  area_unit: string;
  price: number;
  type: string;
  view_count: number;
  soil_type?: string;
  water_source?: string;
  road_access?: string;
  electricity: boolean;
  irrigation: boolean;
  keywords: string[];
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterMinArea, setFilterMinArea] = useState('');
  const [filterMaxArea, setFilterMaxArea] = useState('');
  const [filterWaterSource, setFilterWaterSource] = useState('');
  const [filterRoadAccess, setFilterRoadAccess] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (filterType) params.type = filterType;
      if (filterDistrict) params.district = filterDistrict;
      if (filterMinPrice) params.min_price = filterMinPrice;
      if (filterMaxPrice) params.max_price = filterMaxPrice;
      if (filterMinArea) params.min_area = filterMinArea;
      if (filterMaxArea) params.max_area = filterMaxArea;
      if (filterWaterSource) params.water_source = filterWaterSource;
      if (filterRoadAccess) params.road_access = filterRoadAccess;

      const response = await api.get('/properties/', { params });
      setProperties(response.data);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterType, filterDistrict, filterMinPrice, filterMaxPrice, filterMinArea, filterMaxArea, filterWaterSource, filterRoadAccess]);

  // Debounced fetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchProperties]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterDistrict('');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterMinArea('');
    setFilterMaxArea('');
    setFilterWaterSource('');
    setFilterRoadAccess('');
  };

  const hasActiveFilters = filterType || filterDistrict || filterMinPrice || filterMaxPrice || filterMinArea || filterMaxArea || filterWaterSource || filterRoadAccess;

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const selectClass = "block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm";
  const inputClass = "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Find the perfect land for your future.
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Secure, verified agricultural and flat plots across Tamil Nadu. Direct from verified sellers.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input
            type="text"
            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-12 sm:text-lg border-gray-300 rounded-full py-4 border shadow-sm"
            placeholder="Search by city, district, keyword…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-primary transition-colors"
            title="Toggle filters"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="max-w-4xl mx-auto mb-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Filters</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">Clear All</button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Land Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className={selectClass}>
                <option value="">All Types</option>
                <option>Agricultural Land</option>
                <option>Farm Land</option>
                <option>Flat Plot</option>
                <option>Residential Plot</option>
                <option>Commercial Plot</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">District</label>
              <input type="text" value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className={inputClass} placeholder="e.g. Coimbatore" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Min Price (₹)</label>
              <input type="number" value={filterMinPrice} onChange={e => setFilterMinPrice(e.target.value)} className={inputClass} placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Max Price (₹)</label>
              <input type="number" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} className={inputClass} placeholder="Any" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Min Area</label>
              <input type="number" step="0.1" value={filterMinArea} onChange={e => setFilterMinArea(e.target.value)} className={inputClass} placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Max Area</label>
              <input type="number" step="0.1" value={filterMaxArea} onChange={e => setFilterMaxArea(e.target.value)} className={inputClass} placeholder="Any" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Water Source</label>
              <select value={filterWaterSource} onChange={e => setFilterWaterSource(e.target.value)} className={selectClass}>
                <option value="">Any</option>
                <option>Borewell</option>
                <option>Open Well</option>
                <option>Canal</option>
                <option>River</option>
                <option>Rainfed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Road Access</label>
              <select value={filterRoadAccess} onChange={e => setFilterRoadAccess(e.target.value)} className={selectClass}>
                <option value="">Any</option>
                <option>National Highway</option>
                <option>State Highway</option>
                <option>District Road</option>
                <option>Village Road</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Quick Type Chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {['', 'Agricultural Land', 'Farm Land', 'Flat Plot', 'Residential Plot', 'Commercial Plot'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filterType === t ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'}`}
          >
            {t || 'All Types'}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{loading ? 'Searching...' : `${properties.length} properties found`}</p>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-500">Loading properties...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {properties.length > 0 ? properties.map((property) => (
            <div key={property.id} className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              <div className="w-full min-h-64 bg-gray-200 aspect-w-1 aspect-h-1 rounded-t-2xl overflow-hidden group-hover:opacity-75 lg:h-64 lg:aspect-none relative">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Land plot"
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                  {property.type}
                </div>
                {property.district && (
                  <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                    {property.district}
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      <Link to={`/property/${property.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {property.city}{property.district ? `, ${property.district}` : ''} 
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Exact location hidden until unlocked</p>
                  </div>
                </div>
                
                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {property.water_source && (
                    <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">💧 {property.water_source}</span>
                  )}
                  {property.road_access && (
                    <span className="inline-flex items-center text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">🛣️ {property.road_access}</span>
                  )}
                  {property.electricity && (
                    <span className="inline-flex items-center text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">⚡ Electricity</span>
                  )}
                  {property.irrigation && (
                    <span className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">🌾 Irrigation</span>
                  )}
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    <span className="font-medium">{property.area} {property.area_unit}</span>
                  </div>
                  <p className="text-xl font-extrabold text-primary">{formatPrice(property.price)}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="mt-4 text-gray-500 text-lg">No properties found matching your criteria.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-2 text-primary hover:underline text-sm font-medium">Clear all filters</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

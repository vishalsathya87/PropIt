import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, getToken } from '../../lib/api';
import { getPropertyImageUrl, type Property } from '../../lib/types';
import { formatPrice } from '../../lib/utils';

const TYPES = ['', 'Agricultural Land', 'Farm Land', 'Flat Plot', 'Residential Plot', 'Commercial Plot'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Viewed', value: 'views' },
];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const isLoggedIn = !!getToken();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filterType, setFilterType] = useState(searchParams.get('type') || '');
  const [filterDistrict, setFilterDistrict] = useState(searchParams.get('district') || '');
  const [filterMinPrice, setFilterMinPrice] = useState(searchParams.get('min_price') || '');
  const [filterMaxPrice, setFilterMaxPrice] = useState(searchParams.get('max_price') || '');
  const [filterMinArea, setFilterMinArea] = useState(searchParams.get('min_area') || '');
  const [filterMaxArea, setFilterMaxArea] = useState(searchParams.get('max_area') || '');
  const [filterWaterSource, setFilterWaterSource] = useState(searchParams.get('water_source') || '');
  const [filterRoadAccess, setFilterRoadAccess] = useState(searchParams.get('road_access') || '');

  useEffect(() => {
    if (!isLoggedIn) return;
    api.get('/auth/wishlist').then(r => setWishlist(r.data.wishlist)).catch(() => {});
  }, [isLoggedIn]);

  // Focus search input on mount
  useEffect(() => {
    setTimeout(() => searchInputRef.current?.focus(), 200);
  }, []);

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
      const res = await api.get('/properties/', { params });
      let data: Property[] = res.data;

      // Client-side sort
      if (sortBy === 'price_asc') data = [...data].sort((a, b) => a.price - b.price);
      else if (sortBy === 'price_desc') data = [...data].sort((a, b) => b.price - a.price);
      else if (sortBy === 'views') data = [...data].sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0));

      setProperties(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [searchTerm, filterType, filterDistrict, filterMinPrice, filterMaxPrice, filterMinArea, filterMaxArea, filterWaterSource, filterRoadAccess, sortBy]);

  useEffect(() => {
    const t = setTimeout(fetchProperties, 300);
    return () => clearTimeout(t);
  }, [fetchProperties]);

  // Sync URL params when filters change
  useEffect(() => {
    const p: Record<string, string> = {};
    if (searchTerm) p.q = searchTerm;
    if (filterType) p.type = filterType;
    if (filterDistrict) p.district = filterDistrict;
    if (filterMinPrice) p.min_price = filterMinPrice;
    if (filterMaxPrice) p.max_price = filterMaxPrice;
    if (filterMinArea) p.min_area = filterMinArea;
    if (filterMaxArea) p.max_area = filterMaxArea;
    if (filterWaterSource) p.water_source = filterWaterSource;
    if (filterRoadAccess) p.road_access = filterRoadAccess;
    setSearchParams(p, { replace: true });
  }, [searchTerm, filterType, filterDistrict, filterMinPrice, filterMaxPrice, filterMinArea, filterMaxArea, filterWaterSource, filterRoadAccess, setSearchParams]);

  const clearFilters = () => {
    setSearchTerm(''); setFilterType(''); setFilterDistrict('');
    setFilterMinPrice(''); setFilterMaxPrice('');
    setFilterMinArea(''); setFilterMaxArea('');
    setFilterWaterSource(''); setFilterRoadAccess('');
  };

  const hasActive = !!(filterType || filterDistrict || filterMinPrice || filterMaxPrice
    || filterMinArea || filterMaxArea || filterWaterSource || filterRoadAccess);

  const toggleWishlist = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!isLoggedIn) return;
    setTogglingId(id);
    try {
      const r = await api.post(`/auth/wishlist/${id}`);
      setWishlist(r.data.wishlist);
    } catch { /* silent */ }
    finally { setTogglingId(null); }
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f4f4', minHeight: '100vh' }}>

      {/* ── STICKY SEARCH HEADER ── */}
      <div style={{
        position: 'sticky', top: '0', zIndex: 50,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 1.5rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Search Row */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: '#f4f4f4', border: '1.5px solid #e5e7eb', borderRadius: '10px',
              padding: '0.5rem 0.85rem', transition: 'border-color 0.2s ease'
            }}
              onFocusCapture={e => (e.currentTarget.style.borderColor = '#101010')}
              onBlurCapture={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#898989" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search city, district, village..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1, border: 'none', background: 'transparent', outline: 'none',
                  fontSize: '0.9375rem', color: '#242424', fontFamily: 'inherit'
                }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#898989', lineHeight: 1, padding: '0.1rem', flexShrink: 0 }}>✕</button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit',
                border: hasActive ? '1.5px solid #101010' : '1.5px solid #e5e7eb',
                background: hasActive ? '#101010' : '#ffffff',
                color: hasActive ? '#ffffff' : '#242424',
                fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s ease', whiteSpace: 'nowrap'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
              Filters{hasActive ? ` (${[filterType, filterDistrict, filterMinPrice, filterMaxPrice, filterMinArea, filterMaxArea, filterWaterSource, filterRoadAccess].filter(Boolean).length})` : ''}
            </button>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem', borderRadius: '10px', border: '1.5px solid #e5e7eb',
                background: '#ffffff', color: '#242424', fontSize: '0.875rem',
                fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', outline: 'none'
              }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Type pills */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilterType(filterType === t ? '' : t)} style={{
                padding: '0.3rem 0.9rem', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                background: filterType === t ? '#101010' : '#f4f4f4',
                color: filterType === t ? '#ffffff' : '#6b7280',
                fontSize: '0.8125rem', fontWeight: filterType === t ? 500 : 400,
                transition: 'all 0.15s ease', fontFamily: 'inherit', whiteSpace: 'nowrap'
              }}>
                {t || 'All Types'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXPANDABLE FILTERS PANEL ── */}
      {showFilters && (
        <div className="fade-in" style={{
          background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '1.5rem',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#898989', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Filter Specifications
              </span>
              {hasActive && (
                <button onClick={clearFilters} style={{ fontSize: '0.875rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
                  Reset all
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'District', value: filterDistrict, setter: setFilterDistrict, placeholder: 'Coimbatore', type: 'text' },
                { label: 'Min Price (₹)', value: filterMinPrice, setter: setFilterMinPrice, placeholder: '0', type: 'number' },
                { label: 'Max Price (₹)', value: filterMaxPrice, setter: setFilterMaxPrice, placeholder: 'Any', type: 'number' },
                { label: 'Min Area', value: filterMinArea, setter: setFilterMinArea, placeholder: '0', type: 'number' },
                { label: 'Max Area', value: filterMaxArea, setter: setFilterMaxArea, placeholder: 'Any', type: 'number' },
              ].map(({ label, value, setter, placeholder, type }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#242424', marginBottom: '0.4rem' }}>{label}</label>
                  <input type={type} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} className="form-input" style={{ fontSize: '0.875rem' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#242424', marginBottom: '0.4rem' }}>Water Source</label>
                <select value={filterWaterSource} onChange={e => setFilterWaterSource(e.target.value)} className="form-input" style={{ fontSize: '0.875rem' }}>
                  {['', 'Borewell', 'Open Well', 'Canal', 'River', 'Rainfed'].map(o => <option key={o} value={o}>{o || 'Any'}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#242424', marginBottom: '0.4rem' }}>Road Access</label>
                <select value={filterRoadAccess} onChange={e => setFilterRoadAccess(e.target.value)} className="form-input" style={{ fontSize: '0.875rem' }}>
                  {['', 'National Highway', 'State Highway', 'District Road', 'Village Road'].map(o => <option key={o} value={o}>{o || 'Any'}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>

        {/* Results count */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.9375rem', color: '#6b7280', fontWeight: 500 }}>
            {loading ? 'Searching...' : `${properties.length} listing${properties.length !== 1 ? 's' : ''} found`}
          </p>
          {hasActive && (
            <button onClick={clearFilters} style={{
              fontSize: '0.8125rem', color: '#4b5563', background: '#ffffff',
              border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.3rem 0.75rem',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500
            }}>
              Clear all filters
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="property-card" style={{ height: '360px' }}>
                <div className="skeleton" style={{ height: '210px', borderRadius: '12px 12px 0 0' }} />
                <div style={{ padding: '1.25rem', flex: 1 }}>
                  <div className="skeleton" style={{ height: '20px', width: '55%', marginBottom: '0.6rem' }} />
                  <div className="skeleton" style={{ height: '14px', width: '38%', marginBottom: '1.25rem' }} />
                  <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: '99px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '6rem 2rem', background: '#ffffff',
            borderRadius: '12px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '1rem',
            boxShadow: 'rgba(36, 36, 36, 0.05) 0px 4px 8px 0px'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#f4f4f4', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#898989" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '1.15rem', color: '#101010' }}>No listings found</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.4rem' }}>Try adjusting your filters or search a different location.</p>
            </div>
            {hasActive && <button onClick={clearFilters} className="btn-primary" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Clear filters</button>}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {properties.map(p => (
              <div key={p.id} className="property-card">
                <Link to={`/property/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>

                  <div className="card-img" style={{ position: 'relative', height: '210px', overflow: 'hidden', background: '#f4f4f4', flexShrink: 0 }}>
                    <img src={getPropertyImageUrl(p)} alt={p.type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)' }} />
                    <div style={{ position: 'absolute', bottom: '0.85rem', left: '0.85rem', background: 'rgba(255,255,255,0.96)', borderRadius: '6px', padding: '0.35rem 0.8rem', border: '1px solid #e5e7eb' }}>
                      <p style={{ fontSize: '1rem', fontWeight: 600, color: '#101010', lineHeight: 1, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{formatPrice(p.price)}</p>
                    </div>
                    <span className="badge-active" style={{ position: 'absolute', bottom: '0.85rem', right: '0.85rem', fontSize: '0.75rem' }}>{p.type}</span>
                    {isLoggedIn && (
                      <button
                        onClick={e => toggleWishlist(e, p.id)}
                        disabled={togglingId === p.id}
                        style={{ position: 'absolute', top: '0.85rem', right: '0.85rem', zIndex: 10, width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlist.includes(p.id) ? '#101010' : 'none'} stroke={wishlist.includes(p.id) ? '#101010' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#101010', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Poppins', sans-serif" }}>
                        {p.city}{p.district ? `, ${p.district}` : ''}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.2rem' }}>
                        {p.area} {p.area_unit} · Deed Verified
                      </p>
                    </div>
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge-verified" style={{ fontSize: '0.75rem' }}>Active</span>
                      {p.water_source && <span style={{ fontSize: '0.8125rem', color: '#898989' }}>{p.water_source}</span>}
                    </div>
                  </div>

                  <div className="card-action-bar">
                    <span className="btn-secondary" style={{ width: '100%', fontSize: '0.875rem', padding: '0.55rem 1rem', display: 'flex', justifyContent: 'center' }}>
                      View details &rarr;
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

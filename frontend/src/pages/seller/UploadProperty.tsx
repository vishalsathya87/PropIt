import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function UploadProperty() {
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('acres');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Agricultural Land');

  const [soilType, setSoilType] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [roadAccess, setRoadAccess] = useState('');
  const [fencing, setFencing] = useState('');
  const [nearbyTown, setNearbyTown] = useState('');
  const [distFromTown, setDistFromTown] = useState('');
  const [electricity, setElectricity] = useState(false);
  const [irrigation, setIrrigation] = useState(false);
  const [keywords, setKeywords] = useState('');

  const [docs, setDocs] = useState<{ type: string; file: File | null }[]>([
    { type: 'Patta', file: null }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addDocument = () => {
    setDocs([...docs, { type: 'Patta', file: null }]);
  };

  const handleDocTypeChange = (index: number, val: string) => {
    const newDocs = [...docs];
    newDocs[index].type = val;
    setDocs(newDocs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('city', city);
    formData.append('district', district);
    formData.append('state', state);
    formData.append('price', price);
    formData.append('area', area);
    formData.append('area_unit', areaUnit);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('soil_type', soilType);
    formData.append('water_source', waterSource);
    formData.append('road_access', roadAccess);
    formData.append('fencing', fencing);
    formData.append('nearby_town', nearbyTown);
    if (distFromTown) formData.append('distance_from_town_km', distFromTown);
    formData.append('electricity', electricity.toString());
    formData.append('irrigation', irrigation.toString());
    formData.append('keywords', keywords);

    docs.forEach((doc) => {
      if (doc.file) {
        formData.append('files', doc.file);
        formData.append('doc_types', doc.type);
      }
    });

    try {
      await api.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard/seller');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to list property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#faf9f6', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/dashboard/seller" style={{
            color: '#0f2042', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
          }}>
            ← Back to Dashboard
          </Link>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.015)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem' }}>
            List New Property
          </h2>

          {error && <div className="error-box" style={{ marginBottom: '1.5rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. Location Details */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid rgba(15, 23, 42, 0.06)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                Location Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>City / Village</label>
                  <input type="text" required value={city} onChange={e => setCity(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} placeholder="e.g. Pollachi" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>District</label>
                  <input type="text" required value={district} onChange={e => setDistrict(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} placeholder="e.g. Coimbatore" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>State</label>
                  <input type="text" value={state} onChange={e => setState(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} />
                </div>
              </div>
            </div>

            {/* 2. Property Info */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid rgba(15, 23, 42, 0.06)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                Property Specifications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem', marginBottom: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Property Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}>
                    <option>Agricultural Land</option>
                    <option>Farm Land</option>
                    <option>Flat Plot</option>
                    <option>Residential Plot</option>
                    <option>Commercial Plot</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Asking Price (₹)</label>
                  <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} placeholder="e.g. 1500000" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem', marginBottom: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Total Area</label>
                  <input type="number" step="0.01" required value={area} onChange={e => setArea(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} placeholder="e.g. 2.5" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Area Unit</label>
                  <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}>
                    <option value="acres">Acres</option>
                    <option value="sq_ft">Sq. Ft.</option>
                    <option value="cents">Cents</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Description / Overview</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a', resize: 'vertical' }} placeholder="Describe key attributes — landmarks, access paths, survey records..." />
              </div>
            </div>

            {/* 3. Features & Attributes */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid rgba(15, 23, 42, 0.06)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                Land Features
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem', marginBottom: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Soil Type</label>
                  <select value={soilType} onChange={e => setSoilType(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}>
                    <option value="">-- Select --</option>
                    <option>Red Soil</option>
                    <option>Black Soil</option>
                    <option>Alluvial Soil</option>
                    <option>Laterite Soil</option>
                    <option>Sandy Soil</option>
                    <option>Clay Soil</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Water Source</label>
                  <select value={waterSource} onChange={e => setWaterSource(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}>
                    <option value="">-- Select --</option>
                    <option>Borewell</option>
                    <option>Open Well</option>
                    <option>Canal</option>
                    <option>River</option>
                    <option>Rainfed</option>
                    <option>None</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem', marginBottom: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Road Access</label>
                  <select value={roadAccess} onChange={e => setRoadAccess(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}>
                    <option value="">-- Select --</option>
                    <option>National Highway</option>
                    <option>State Highway</option>
                    <option>District Road</option>
                    <option>Village Road</option>
                    <option>Mud Road</option>
                    <option>No Road</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Fencing</label>
                  <select value={fencing} onChange={e => setFencing(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}>
                    <option value="">-- Select --</option>
                    <option>Compound Wall</option>
                    <option>Wire Fence</option>
                    <option>Partial</option>
                    <option>None</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem', marginBottom: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Nearest Town</label>
                  <input type="text" value={nearbyTown} onChange={e => setNearbyTown(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} placeholder="e.g. Pollachi" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Distance from Town (km)</label>
                  <input type="number" step="0.1" value={distFromTown} onChange={e => setDistFromTown(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} placeholder="e.g. 5" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  <input type="checkbox" checked={electricity} onChange={e => setElectricity(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#0f2042' }} />
                  Electricity Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  <input type="checkbox" checked={irrigation} onChange={e => setIrrigation(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#0f2042' }} />
                  Irrigation Facility
                </label>
              </div>
            </div>

            {/* 4. Search Keywords */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Keywords (Comma separated)</label>
              <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} placeholder="e.g. lake view, clear title, highway access" />
            </div>

            {/* 5. Upload Documents */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid rgba(15, 23, 42, 0.06)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                Upload Documents
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(15, 23, 42, 0.55)', marginBottom: '1.25rem' }}>
                Please upload official government records. All files are encrypted and verified privately.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {docs.map((doc, index) => (
                  <div key={index} style={{
                    display: 'flex', gap: '0.75rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.02)',
                    border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '6px', alignItems: 'center'
                  }}>
                    <select
                      className="form-input"
                      style={{ width: '180px', background: '#ffffff', color: '#0f172a' }}
                      value={doc.type} onChange={(e) => handleDocTypeChange(index, e.target.value)}
                    >
                      <option>Patta</option>
                      <option>Chitta</option>
                      <option>FMB Sketch</option>
                      <option>A-Register</option>
                      <option>Encumbrance Certificate (EC)</option>
                      <option>Parent Document</option>
                      <option>Other</option>
                    </select>

                    <input type="file" required onChange={(e) => {
                      const newDocs = [...docs];
                      newDocs[index].file = e.target.files ? e.target.files[0] : null;
                      setDocs(newDocs);
                    }} style={{ flex: 1, fontSize: '0.8rem', color: 'rgba(15, 23, 42, 0.7)' }} />

                    {docs.length > 1 && (
                      <button type="button" onClick={() => setDocs(docs.filter((_, i) => i !== index))} style={{
                        background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', padding: '0.25rem'
                      }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" onClick={addDocument} style={{
                background: 'none', border: 'none', color: '#b8963e', fontWeight: 800,
                fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
                marginTop: '1rem'
              }}>
                + Add Another Document
              </button>
            </div>

            {/* Submit Block */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                {loading ? 'Publishing Registry...' : 'SUBMIT PROPERTY FOR VERIFICATION'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

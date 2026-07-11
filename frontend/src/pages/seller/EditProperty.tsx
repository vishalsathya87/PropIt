import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';

interface SavedDoc {
  type: string;
  url: string;
}

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const [soilType, setSoilType] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [roadAccess, setRoadAccess] = useState('');
  const [fencing, setFencing] = useState('');
  const [nearbyTown, setNearbyTown] = useState('');
  const [distFromTown, setDistFromTown] = useState('');
  const [electricity, setElectricity] = useState(false);
  const [irrigation, setIrrigation] = useState(false);

  const [retainedDocs, setRetainedDocs] = useState<SavedDoc[]>([]);
  const [newDocs, setNewDocs] = useState<{ type: string; file: File | null }[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then((res) => {
        const p = res.data;
        setCity(p.city);
        setDistrict(p.district || '');
        setState(p.state);
        setPrice(p.price.toString());
        setDescription(p.description || '');
        setSoilType(p.soil_type || '');
        setWaterSource(p.water_source || '');
        setRoadAccess(p.road_access || '');
        setFencing(p.fencing || '');
        setNearbyTown(p.nearby_town || '');
        setDistFromTown(p.distance_from_town_km ? p.distance_from_town_km.toString() : '');
        setElectricity(!!p.electricity);
        setIrrigation(!!p.irrigation);
        setRetainedDocs(p.documents || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch property details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const addNewDocument = () => {
    setNewDocs([...newDocs, { type: 'Patta', file: null }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData();
    formData.append('city', city);
    formData.append('district', district);
    formData.append('state', state);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('soil_type', soilType);
    formData.append('water_source', waterSource);
    formData.append('road_access', roadAccess);
    formData.append('fencing', fencing);
    formData.append('nearby_town', nearbyTown);
    if (distFromTown) formData.append('distance_from_town_km', distFromTown);
    formData.append('electricity', electricity.toString());
    formData.append('irrigation', irrigation.toString());

    // Retained docs list
    formData.append('retained_documents_json', JSON.stringify(retainedDocs));

    // New uploaded files
    newDocs.forEach((doc) => {
      if (doc.file) {
        formData.append('files', doc.file);
        formData.append('doc_types', doc.type);
      }
    });

    try {
      await api.put(`/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard/seller');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update property details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <p style={{ color: 'rgba(15,23,42,0.6)', fontSize: '0.9rem', fontWeight: 600 }}>Acquiring records...</p>
    </div>
  );

  return (
    <div style={{ background: '#faf9f6', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/dashboard/seller" style={{
            color: '#1a4d32', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
          }}>
            ← Back to Dashboard
          </Link>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.015)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem' }}>
            Edit Property
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
                  <input type="text" required value={city} onChange={e => setCity(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>District</label>
                  <input type="text" value={district} onChange={e => setDistrict(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} />
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
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Asking Price (₹)</label>
                  <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Description / Overview</label>
                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a', resize: 'vertical' }} />
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
                    <option>Red Soil</option><option>Black Soil</option><option>Alluvial Soil</option><option>Laterite Soil</option><option>Sandy Soil</option><option>Clay Soil</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Water Source</label>
                  <select value={waterSource} onChange={e => setWaterSource(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}>
                    <option value="">-- Select --</option>
                    <option>Borewell</option><option>Open Well</option><option>Canal</option><option>River</option><option>Rainfed</option><option>None</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem', marginBottom: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Road Access</label>
                  <select value={roadAccess} onChange={e => setRoadAccess(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}>
                    <option value="">-- Select --</option>
                    <option>National Highway</option><option>State Highway</option><option>District Road</option><option>Village Road</option><option>Mud Road</option><option>No Road</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Fencing</label>
                  <select value={fencing} onChange={e => setFencing(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}>
                    <option value="">-- Select --</option>
                    <option>Compound Wall</option><option>Wire Fence</option><option>Partial</option><option>None</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem', marginBottom: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Nearest Town</label>
                  <input type="text" value={nearbyTown} onChange={e => setNearbyTown(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(15, 23, 42, 0.55)', marginBottom: '0.4rem' }}>Distance from Town (km)</label>
                  <input type="number" step="0.1" value={distFromTown} onChange={e => setDistFromTown(e.target.value)} className="form-input" style={{ width: '100%', background: '#ffffff', color: '#0f172a' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  <input type="checkbox" checked={electricity} onChange={e => setElectricity(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#1a4d32' }} />
                  Electricity Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  <input type="checkbox" checked={irrigation} onChange={e => setIrrigation(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#1a4d32' }} />
                  Irrigation Facility
                </label>
              </div>
            </div>

            {/* 4. Documents */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid rgba(15, 23, 42, 0.06)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                Retained & New Documents
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(15, 23, 42, 0.55)', marginBottom: '1.25rem' }}>Manage uploaded files here.</p>

              {/* Retained Docs List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {retainedDocs.map((doc, index) => (
                  <div key={`ret-${index}`} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem',
                    background: 'rgba(15, 23, 42, 0.02)', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>{doc.type}</span>
                      <a href={`http://localhost:8000${doc.url}`} target="_blank" rel="noreferrer" style={{ color: '#b8963e', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>[View File]</a>
                    </div>
                    <button type="button" onClick={() => setRetainedDocs(retainedDocs.filter((_, i) => i !== index))} style={{
                      background: 'none', border: 'none', color: '#ff3b30', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                    }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* New Docs List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {newDocs.map((doc, index) => (
                  <div key={`new-${index}`} style={{
                    display: 'flex', gap: '0.75rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.02)',
                    border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '6px', alignItems: 'center'
                  }}>
                    <select
                      className="form-input"
                      style={{ width: '180px', background: '#ffffff', color: '#0f172a' }}
                      value={doc.type} onChange={(e) => {
                        const nd = [...newDocs];
                        nd[index].type = e.target.value;
                        setNewDocs(nd);
                      }}
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
                      const nd = [...newDocs];
                      nd[index].file = e.target.files ? e.target.files[0] : null;
                      setNewDocs(nd);
                    }} style={{ flex: 1, fontSize: '0.8rem', color: 'rgba(15, 23, 42, 0.7)' }} />

                    <button type="button" onClick={() => setNewDocs(newDocs.filter((_, i) => i !== index))} style={{
                      background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', padding: '0.25rem'
                    }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addNewDocument} style={{
                background: 'none', border: 'none', color: '#b8963e', fontWeight: 800,
                fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
                marginTop: '1rem'
              }}>
                + Add Another Document
              </button>
            </div>

            {/* Submit Block */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                {saving ? 'Saving changes...' : 'UPDATE PROPERTY LISTING'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function UploadProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Core fields
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [type, setType] = useState('Agricultural Land');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('acres');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  // Extra details for search
  const [soilType, setSoilType] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [roadAccess, setRoadAccess] = useState('');
  const [fencing, setFencing] = useState('');
  const [electricity, setElectricity] = useState(false);
  const [irrigation, setIrrigation] = useState(false);
  const [nearbyTown, setNearbyTown] = useState('');
  const [distFromTown, setDistFromTown] = useState('');

  // Documents
  const [docs, setDocs] = useState([{ type: 'Patta', file: null as File | null }]);

  const addDocument = () => {
    setDocs([...docs, { type: 'Chitta', file: null }]);
  };

  const handleDocTypeChange = (index: number, newType: string) => {
    const newDocs = [...docs];
    newDocs[index].type = newType;
    setDocs(newDocs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);

      await api.post('/properties/', {
        city,
        district,
        state,
        type,
        area: parseFloat(area),
        area_unit: areaUnit,
        price: parseFloat(price),
        description: description || undefined,
        keywords: keywordList,
        soil_type: soilType || undefined,
        water_source: waterSource || undefined,
        road_access: roadAccess || undefined,
        fencing: fencing || undefined,
        electricity,
        irrigation,
        nearby_town: nearbyTown || undefined,
        distance_from_town_km: distFromTown ? parseFloat(distFromTown) : undefined,
      });

      navigate('/dashboard/seller');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to list property');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const selectClass = "mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/dashboard/seller" className="text-primary hover:underline">&larr; Back to Dashboard</Link>
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">List New Property</h2>

        {error && <div className="mb-4 text-red-500 text-sm font-medium bg-red-50 p-3 rounded">{error}</div>}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* --- LOCATION --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">📍 Location Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City / Village</label>
                <input type="text" required value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="e.g. Pollachi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input type="text" required value={district} onChange={e => setDistrict(e.target.value)} className={inputClass} placeholder="e.g. Coimbatore" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input type="text" value={state} onChange={e => setState(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* --- PROPERTY INFO --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">🏞️ Property Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className={selectClass}>
                  <option>Agricultural Land</option>
                  <option>Farm Land</option>
                  <option>Flat Plot</option>
                  <option>Residential Plot</option>
                  <option>Commercial Plot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Asking Price (₹)</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className={inputClass} placeholder="e.g. 1500000" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Area</label>
                <input type="number" step="0.01" required value={area} onChange={e => setArea(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Area Unit</label>
                <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} className={selectClass}>
                  <option value="acres">Acres</option>
                  <option value="sq_ft">Sq. Ft.</option>
                  <option value="cents">Cents</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description / Overview</label>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className={inputClass} placeholder="Describe the land — nearby landmarks, history, potential uses, etc." />
            </div>
          </div>

          {/* --- LAND FEATURES --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">🌿 Land Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Soil Type</label>
                <select value={soilType} onChange={e => setSoilType(e.target.value)} className={selectClass}>
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
                <label className="block text-sm font-medium text-gray-700">Water Source</label>
                <select value={waterSource} onChange={e => setWaterSource(e.target.value)} className={selectClass}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Road Access</label>
                <select value={roadAccess} onChange={e => setRoadAccess(e.target.value)} className={selectClass}>
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
                <label className="block text-sm font-medium text-gray-700">Fencing</label>
                <select value={fencing} onChange={e => setFencing(e.target.value)} className={selectClass}>
                  <option value="">-- Select --</option>
                  <option>Compound Wall</option>
                  <option>Wire Fence</option>
                  <option>Partial</option>
                  <option>None</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nearest Town</label>
                <input type="text" value={nearbyTown} onChange={e => setNearbyTown(e.target.value)} className={inputClass} placeholder="e.g. Pollachi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Distance from Town (km)</label>
                <input type="number" step="0.1" value={distFromTown} onChange={e => setDistFromTown(e.target.value)} className={inputClass} placeholder="e.g. 5" />
              </div>
            </div>
            <div className="flex items-center gap-8 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={electricity} onChange={e => setElectricity(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Electricity Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={irrigation} onChange={e => setIrrigation(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Irrigation Facility</span>
              </label>
            </div>
          </div>

          {/* --- KEYWORDS --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Keywords (Comma separated)</label>
            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} className={inputClass} placeholder="e.g. coconut farm, mango orchard, lake view" />
          </div>

          {/* --- DOCUMENTS --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">📄 Upload Documents</h3>
            <p className="text-sm text-gray-500 mb-4">Buyers will only see these after paying the ₹500 unlock fee.</p>

            <div className="space-y-4">
              {docs.map((doc, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 border border-gray-200 rounded-md bg-gray-50">
                  <select
                    className="block w-full sm:w-48 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                  <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-emerald-600 cursor-pointer" />
                </div>
              ))}
            </div>

            <button type="button" onClick={addDocument} className="mt-4 text-sm text-primary hover:text-emerald-700 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Add another document
            </button>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-dark hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark disabled:opacity-75">
              {loading ? 'Submitting...' : 'Submit Property for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

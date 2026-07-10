import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [soilType, setSoilType] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [roadAccess, setRoadAccess] = useState('');
  const [fencing, setFencing] = useState('');
  const [electricity, setElectricity] = useState(false);
  const [irrigation, setIrrigation] = useState(false);
  const [nearbyTown, setNearbyTown] = useState('');
  const [distFromTown, setDistFromTown] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get('/properties/seller/me');
        const prop = response.data.find((p: any) => p.id === id);
        if (prop) {
          setCity(prop.city);
          setDistrict(prop.district || '');
          setPrice(prop.price);
          setDescription(prop.description || '');
          setSoilType(prop.soil_type || '');
          setWaterSource(prop.water_source || '');
          setRoadAccess(prop.road_access || '');
          setFencing(prop.fencing || '');
          setElectricity(prop.electricity || false);
          setIrrigation(prop.irrigation || false);
          setNearbyTown(prop.nearby_town || '');
          setDistFromTown(prop.distance_from_town_km || '');
        } else {
          setError('Property not found.');
        }
      } catch (err) {
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.put(`/properties/${id}`, {
        city,
        district,
        price: parseFloat(price),
        description,
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
       setError(err.response?.data?.detail || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-primary focus:border-primary text-sm";
  const selectClass = "mt-1 block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:ring-primary focus:border-primary text-sm";

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/dashboard/seller" className="text-primary hover:underline">&larr; Back to Dashboard</Link>
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Property</h2>
        
        {error && <div className="mb-4 text-red-500 text-sm font-medium bg-red-50 p-3 rounded">{error}</div>}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City / Village</label>
              <input type="text" required value={city} onChange={e => setCity(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">District</label>
              <input type="text" value={district} onChange={e => setDistrict(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asking Price (₹)</label>
            <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description / Overview</label>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className={inputClass}></textarea>
          </div>

          <hr className="border-gray-200" />
          <h3 className="text-lg font-semibold text-gray-800">Land Features</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Soil Type</label>
              <select value={soilType} onChange={e => setSoilType(e.target.value)} className={selectClass}>
                <option value="">-- Select --</option>
                <option>Red Soil</option><option>Black Soil</option><option>Alluvial Soil</option><option>Laterite Soil</option><option>Sandy Soil</option><option>Clay Soil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Water Source</label>
              <select value={waterSource} onChange={e => setWaterSource(e.target.value)} className={selectClass}>
                <option value="">-- Select --</option>
                <option>Borewell</option><option>Open Well</option><option>Canal</option><option>River</option><option>Rainfed</option><option>None</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Road Access</label>
              <select value={roadAccess} onChange={e => setRoadAccess(e.target.value)} className={selectClass}>
                <option value="">-- Select --</option>
                <option>National Highway</option><option>State Highway</option><option>District Road</option><option>Village Road</option><option>Mud Road</option><option>No Road</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fencing</label>
              <select value={fencing} onChange={e => setFencing(e.target.value)} className={selectClass}>
                <option value="">-- Select --</option>
                <option>Compound Wall</option><option>Wire Fence</option><option>Partial</option><option>None</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nearest Town</label>
              <input type="text" value={nearbyTown} onChange={e => setNearbyTown(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Distance from Town (km)</label>
              <input type="number" step="0.1" value={distFromTown} onChange={e => setDistFromTown(e.target.value)} className={inputClass} />
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={electricity} onChange={e => setElectricity(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Electricity Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={irrigation} onChange={e => setIrrigation(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Irrigation Facility</span>
            </label>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={saving} className="w-full py-3 px-4 rounded-md text-white bg-dark hover:bg-gray-800 focus:outline-none disabled:opacity-75">
              {saving ? 'Saving...' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

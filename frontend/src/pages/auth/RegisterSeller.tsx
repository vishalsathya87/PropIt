import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function RegisterSeller() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    aadhaar: '',
    pan: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        phone_number: formData.phone,
        password: formData.password,
        role: 'SELLER',
        full_name: formData.fullName,
        kyc_details: {
          aadhaar_number: formData.aadhaar,
          pan_number: formData.pan,
          status: 'PENDING'
        }
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Create Seller Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            List your land directly to verified buyers
          </p>
        </div>
        
        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <input id="fullName" name="fullName" type="text" required onChange={handleChange} className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Full Name (as per Aadhaar)" />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input id="phone" name="phone" type="tel" required onChange={handleChange} className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Phone Number (+91...)" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" required onChange={handleChange} className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
            
            <div className="pt-4 pb-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">KYC Verification (Mandatory)</p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="aadhaar" className="sr-only">Aadhaar Number</label>
                  <input id="aadhaar" name="aadhaar" type="text" required onChange={handleChange} className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Aadhaar Number" />
                </div>
                <div>
                  <label htmlFor="pan" className="sr-only">PAN Card Number</label>
                  <input id="pan" name="pan" type="text" required onChange={handleChange} className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="PAN Card Number" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-dark hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark disabled:opacity-75">
              {loading ? 'Registering...' : 'Register as Seller'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

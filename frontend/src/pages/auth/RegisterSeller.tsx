import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterSeller() {
  const [formData, setFormData] = useState({ fullName: '', phone: '', password: '', aadhaar: '', pan: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register Seller', formData);
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Become a Seller</h2>
          <p className="mt-2 text-sm text-gray-600">List your land securely. Mandatory KYC required.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm px-3 py-2 border" 
                     value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm px-3 py-2 border" 
                     value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm px-3 py-2 border" 
                   value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <hr className="my-6 border-gray-200" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">KYC Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input type="text" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm px-3 py-2 border" 
                     placeholder="1234 5678 9012" value={formData.aadhaar} onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">PAN Number</label>
              <input type="text" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm px-3 py-2 border uppercase" 
                     placeholder="ABCDE1234F" value={formData.pan} onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})} />
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark mt-8 transition-colors">
            Submit for Verification
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link></p>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UploadProperty() {
  const [docs, setDocs] = useState([{ type: 'Patta', file: null }]);
  
  const addDocument = () => {
    setDocs([...docs, { type: 'Chitta', file: null }]);
  };

  const handleDocTypeChange = (index: number, newType: string) => {
    const newDocs = [...docs];
    newDocs[index].type = newType;
    setDocs(newDocs);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/dashboard/seller" className="text-primary hover:underline">&larr; Back to Dashboard</Link>
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">List New Property</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">City/Region</label>
              <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="e.g. Coimbatore" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Type</label>
              <select className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <option>Agricultural Land</option>
                <option>Flat Plot</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Total Area</label>
              <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Area Unit</label>
              <select className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <option>acres</option>
                <option>sq_ft</option>
                <option>cents</option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Asking Price (₹)</label>
              <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Keywords (Comma separated)</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="e.g. water facility, road access, fencing" />
          </div>

          <hr className="border-gray-200" />
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
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
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-dark hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark">
              Submit Property for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

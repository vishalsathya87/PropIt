import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

import Login from './pages/auth/Login';
import RegisterBuyer from './pages/auth/RegisterBuyer';
import RegisterSeller from './pages/auth/RegisterSeller';
import Home from './pages/buyer/Home';
import PropertyDetails from './pages/buyer/PropertyDetails';
import SellerDashboard from './pages/seller/Dashboard';
import UploadProperty from './pages/seller/UploadProperty';
import SecureViewer from './pages/buyer/SecureViewer';
import BuyerDashboard from './pages/buyer/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register/buyer" element={<RegisterBuyer />} />
          <Route path="register/seller" element={<RegisterSeller />} />
          <Route path="property/:id" element={<PropertyDetails />} />
          
          {/* Protected Buyer Routes (Placeholder) */}
          <Route path="dashboard/buyer" element={<BuyerDashboard />} />
          <Route path="viewer/:docId" element={<SecureViewer />} />

          {/* Protected Seller Routes (Placeholder) */}
          <Route path="dashboard/seller" element={<SellerDashboard />} />
          <Route path="dashboard/seller/upload" element={<UploadProperty />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

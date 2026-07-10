import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import RegisterBuyer from './pages/auth/RegisterBuyer';
import RegisterSeller from './pages/auth/RegisterSeller';
import Home from './pages/buyer/Home';
import PropertyDetails from './pages/buyer/PropertyDetails';
import SellerDashboard from './pages/seller/Dashboard';
import UploadProperty from './pages/seller/UploadProperty';
import EditProperty from './pages/seller/EditProperty';
import SecureViewer from './pages/buyer/SecureViewer';
import BuyerDashboard from './pages/buyer/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="property/:id" element={<PropertyDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register/buyer" element={<RegisterBuyer />} />
          <Route path="register/seller" element={<RegisterSeller />} />
          
          <Route path="dashboard/buyer" element={<BuyerDashboard />} />
          <Route path="dashboard/seller" element={<SellerDashboard />} />
          <Route path="dashboard/seller/upload" element={<UploadProperty />} />
          <Route path="dashboard/seller/edit/:id" element={<EditProperty />} />
          <Route path="dashboard/admin" element={<AdminDashboard />} />
        </Route>
        
        {/* Fullscreen secure viewer route outside main layout */}
        <Route path="/viewer/:docId" element={<SecureViewer />} />
      </Routes>
    </Router>
  );
}

export default App;

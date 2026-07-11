import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Intro Component
import SplashAnimation from "./components/SplashAnimation";

// Application Shell Routes
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Contact from "./pages/Contact";
import Help from "./pages/Help";

// Buyer Routes
import Home from "./pages/buyer/Home";
import PropertyDetails from "./pages/buyer/PropertyDetails";
import SecureViewer from "./pages/buyer/SecureViewer";
import BuyerDashboard from "./pages/buyer/Dashboard";

// Seller Routes
import SellerDashboard from "./pages/seller/Dashboard";
import UploadProperty from "./pages/seller/UploadProperty";
import EditProperty from "./pages/seller/EditProperty";

// Admin & Fallback Routes
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        /* 1. Play Premium Silver Cinematic Sequence first */
        <SplashAnimation key="splash" onComplete={() => setShowSplash(false)} />
      ) : (
        /* 2. Soft-fade directly into your real application layout and routes */
        <motion.div
          key="app-router-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen bg-[#e6e6ea]"
        >
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="property/:id" element={<PropertyDetails />} />
                <Route path="login" element={<Login />} />
                <Route path="contact" element={<Contact />} />
                <Route path="help" element={<Help />} />

                {/* Protected: Buyer */}
                <Route
                  path="dashboard/buyer"
                  element={
                    <ProtectedRoute requiredRole="BUYER">
                      <BuyerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected: Seller */}
                <Route
                  path="dashboard/seller"
                  element={
                    <ProtectedRoute requiredRole="SELLER">
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/seller/upload"
                  element={
                    <ProtectedRoute requiredRole="SELLER">
                      <UploadProperty />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/seller/edit/:id"
                  element={
                    <ProtectedRoute requiredRole="SELLER">
                      <EditProperty />
                    </ProtectedRoute>
                  }
                />

                {/* Protected: Admin */}
                <Route
                  path="dashboard/admin"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Layout Fallback */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Fullscreen Secure Viewer (Outside main layout shell) */}
              <Route
                path="/viewer/:docId"
                element={
                  <ProtectedRoute>
                    <SecureViewer />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
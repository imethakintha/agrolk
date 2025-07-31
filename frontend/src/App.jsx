import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Tourist/Home';
import SearchResults from '@/pages/Tourist/SearchResults';
import FarmDetail from '@/pages/Tourist/FarmDetail';
import Checkout from '@/pages/Tourist/Checkout';
import ProtectedRoute from '@/components/ProtectedRoute';
import FarmerDashboard from '@/pages/Provider/Farmer/Dashboard';
import GuideDashboard from '@/pages/Provider/Guide/Dashboard';
import DriverDashboard from '@/pages/Provider/Driver/Dashboard';
import ProviderLayout from '@/pages/Provider/Layout';
import Login from '@/pages/Login';
import Register from './pages/Register';
import NavBar from '@/components/NavBar';

import AdminLayout from '@/pages/Admin/Layout';
import AdminDashboard from '@/pages/Admin/Dashboard';

function App() {
  
  return (
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/farm/:slug" element={<FarmDetail />} />
          <Route path="/checkout/:bookingId" element={<Checkout />} />
           <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/provider/*"
            element={
              <ProtectedRoute allowedRoles={['Farmer', 'Guide', 'Driver']}>
                <ProviderLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<RoleBasedDashboard />} />
          </Route>

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
  );
}
function RoleBasedDashboard() {
    const role = localStorage.getItem('role');
    if (role === 'Farmer') return <FarmerDashboard />;
    if (role === 'Guide') return <GuideDashboard />;
    if (role === 'Driver') return <DriverDashboard />;
    return <Navigate to="/" />;
  }

export default App;
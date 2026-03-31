import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/Login/ForgotPassword';
import AuthCallback from './pages/Auth/AuthCallback';
import DashboardLayout from './layout/MainLayout';
import DashboardHome from './pages/Dashboard/Home';
import TransactionReport from './pages/Dashboard/TransactionReport';
import QRDetails from './pages/Dashboard/QRDetails';
import Language from './pages/Dashboard/Language';
import HelpSupport from './pages/Dashboard/HelpSupport';
import TicketDetails from './pages/Dashboard/Ticket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/redirected" element={<AuthCallback />} />

        {/* Dashboard Layout with nested routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="transactions" element={<TransactionReport />} />
          <Route path="qr-details" element={<QRDetails />} />
          <Route path="language" element={<Language />} />
          <Route path="support" element={<HelpSupport />} />
          <Route path="support/:transactionId" element={<TicketDetails />} />
          {/* <Route path="profile" element={<Profile />} /> */}
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';
// Client Pages
import { LoginPage } from './pages/client/LoginPage';
import { RegisterPage } from './pages/client/RegisterPage';
import { ClientDashboard } from './pages/client/ClientDashboard';
import { UploadDocument } from './pages/client/UploadDocument';
import { DocumentDetail } from './pages/client/DocumentDetail';
// Staff Pages
import { StaffLogin } from './pages/staff/StaffLogin';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { DocumentReview } from './pages/staff/DocumentReview';
function ProtectedRoute({
  children,
  requiredRole
}: {
  children: React.ReactNode;
  requiredRole: 'client' | 'staff';
}) {
  const {
    user
  } = useAuth();
  if (!user) {
    return <Navigate to={requiredRole === 'staff' ? '/staff/login' : '/login'} replace />;
  }
  if (user.role !== requiredRole) {
    return <Navigate to={user.role === 'staff' ? '/staff/dashboard' : '/client/dashboard'} replace />;
  }
  return <>{children}</>;
}
function AppRoutes() {
  return <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/staff/login" element={<StaffLogin />} />

      {/* Client Routes */}
      <Route path="/client/dashboard" element={<ProtectedRoute requiredRole="client">
            <ClientDashboard />
          </ProtectedRoute>} />
      <Route path="/client/upload" element={<ProtectedRoute requiredRole="client">
            <UploadDocument />
          </ProtectedRoute>} />
      <Route path="/client/document/:id" element={<ProtectedRoute requiredRole="client">
            <DocumentDetail />
          </ProtectedRoute>} />

      {/* Staff Routes */}
      <Route path="/staff/dashboard" element={<ProtectedRoute requiredRole="staff">
            <StaffDashboard />
          </ProtectedRoute>} />
      <Route path="/staff/document/:id" element={<ProtectedRoute requiredRole="staff">
            <DocumentReview />
          </ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>;
}
export function App() {
  return <BrowserRouter>
      <AuthProvider>
        <DocumentProvider>
          <AppRoutes />
        </DocumentProvider>
      </AuthProvider>
    </BrowserRouter>;
}
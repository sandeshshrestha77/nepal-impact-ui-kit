import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, loading } = useAdmin();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
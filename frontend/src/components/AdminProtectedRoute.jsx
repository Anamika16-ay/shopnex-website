import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminProtectedRoute({ children }) {
  const { admin } = useAdminAuth();
  if (!admin || !localStorage.getItem('adminToken')) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

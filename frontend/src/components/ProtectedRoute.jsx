import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './Spinner.jsx';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner fullScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

// Redirects signed-in users away from the login/register pages
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner fullScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>; // on attend de savoir si une session existe
  if (!user) return <Navigate to="/login" replace />; // pas connecte -> login
  return <Outlet />; // connecte -> la page demandee
}

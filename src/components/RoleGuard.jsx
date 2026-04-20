import { Navigate } from 'react-router-dom';

export default function RoleGuard({ profile, requiredRole, children }) {
  if (!profile) return <Navigate to="/" replace />;
  if (profile.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

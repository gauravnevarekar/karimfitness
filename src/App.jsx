import { Navigate, Route, Routes } from 'react-router-dom';
import { useSession } from './hooks/useSession';
import LoginPage from './pages/LoginPage';
import MemberHomePage from './pages/MemberHomePage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import RoleGuard from './components/RoleGuard';

export default function App() {
  const { loading, profile } = useSession();

  if (loading) {
    return <main className="p-6">Loading...</main>;
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/member"
        element={
          <RoleGuard profile={profile} requiredRole="member">
            <MemberHomePage profile={profile} />
          </RoleGuard>
        }
      />
      <Route
        path="/owner"
        element={
          <RoleGuard profile={profile} requiredRole="owner">
            <OwnerDashboardPage />
          </RoleGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

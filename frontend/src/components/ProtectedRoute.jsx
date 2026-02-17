import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {'admin' | 'employee'} [props.role] - admin: User/Manager only, redirects employee to /employee. employee: Employee only, redirects admin/manager to /admin
 */
const ProtectedRoute = ({ children, role = 'admin' }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userType = user?.type || 'user';

  if (role === 'admin' && userType === 'employee') {
    return <Navigate to="/employee" replace />;
  }

  if (role === 'employee' && (userType === 'user' || userType === 'manager')) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;

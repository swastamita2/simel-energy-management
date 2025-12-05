import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, PermissionString } from '@/types';
import { hasSimplePermission } from '@/config/auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: PermissionString[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
}) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Akses Ditolak</AlertTitle>
            <AlertDescription>
              Anda tidak memiliki izin untuk mengakses halaman ini. Role Anda: <strong>{user.role}</strong>
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2 justify-center">
            <Button onClick={() => window.history.back()} variant="outline">
              Kembali
            </Button>
            <Button onClick={() => logout()} variant="default">
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) => 
      hasSimplePermission(user.role, permission)
    );

    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Akses Ditolak</AlertTitle>
              <AlertDescription>
                Anda tidak memiliki permission yang diperlukan untuk mengakses fitur ini.
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-2 justify-center">
              <Button onClick={() => window.history.back()} variant="outline">
                Kembali
              </Button>
              <Button onClick={() => logout()} variant="default">
                Logout
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  // User is authorized, render children
  return <>{children}</>;
};

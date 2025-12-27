import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to check user permissions and roles
 */
export const usePermissions = () => {
  const { user } = useAuth();

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      return false;
    }
    return permissions.some(permission => user.permissions?.includes(permission));
  };

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      return false;
    }
    return permissions.every(permission => user.permissions?.includes(permission));
  };

  /**
   * Check if user has a specific role (case-insensitive)
   */
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) {
      return false;
    }
    const normalizedRole = role.toLowerCase();
    return user.roles.some(userRole => userRole.toLowerCase() === normalizedRole);
  };

  /**
   * Check if user has any of the specified roles (case-insensitive)
   */
  const hasAnyRole = (roles: string[]): boolean => {
    if (!user || !user.roles) {
      return false;
    }
    const normalizedRoles = roles.map(r => r.toLowerCase());
    return user.roles.some(userRole => normalizedRoles.includes(userRole.toLowerCase()));
  };

  /**
   * Check if user is admin (case-insensitive)
   * Admin users have access to all menu items and features
   */
  const isAdmin = (): boolean => {
    if (!user || !user.roles) {
      return false;
    }
    // Check for admin role (case-insensitive)
    return user.roles.some(role => role.toLowerCase() === 'admin');
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin,
    user,
  };
};


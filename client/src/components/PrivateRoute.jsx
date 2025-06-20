import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * PrivateRoute component that handles authenticated routes and optional course access control
 * @param {Object} props - Component props
 * @param {ReactNode} [props.children] - Child components to render (for explicit route wrapping)
 * @param {string|boolean} [props.requireCourseAccess] - Course ID or flag to check course access
 * @param {boolean} [props.adminOnly] - Restrict route to admin users only
 * @returns {ReactNode} - Rendered component or redirect
 */
export default function PrivateRoute({ children, requireCourseAccess, adminOnly }) {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // User not authenticated - redirect to sign-in with return location
  if (!currentUser) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Admin-only route check
  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Course access check (if required)
  if (requireCourseAccess) {
    const hasAccess = checkCourseAccess(currentUser, requireCourseAccess);
    if (!hasAccess) {
      return <Navigate to="/courses" state={{ from: location }} replace />;
    }
  }

  // Render children if provided (explicit route wrapping) or Outlet for nested routes
  return children ? children : <Outlet />;
}

/**
 * Helper function to check course access
 * @param {Object} user - Current user object
 * @param {string|boolean} courseAccess - Course ID or access requirement
 * @returns {boolean} - Whether user has access
 */
function checkCourseAccess(user, courseAccess) {
  // Implement your actual course access logic here
  // Example:
  // return user.enrolledCourses?.includes(courseAccess) || user.isAdmin;
  return true; // Temporarily returning true until implementation
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
  requireCourseAccess: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  adminOnly: PropTypes.bool
};

PrivateRoute.defaultProps = {
  children: null,
  requireCourseAccess: false,
  adminOnly: false
};
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to='/sign-in' state={{ from: location }} replace />;
  }

  if (!currentUser.isAdmin) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <Outlet />;
}

import { useLocation, Outlet, Navigate } from "react-router-dom";
import useUserStore from "../../store/user-store";

const RequireAuth = () => {
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  return user.isLogged ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;

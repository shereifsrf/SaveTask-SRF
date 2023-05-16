import { useTaskStore } from "../../store/store";
import { useLocation, Outlet, Navigate } from "react-router-dom";

const RequireAuth = () => {
  const user = useTaskStore((state) => state.user);
  const location = useLocation();

  return user.isLogged ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;

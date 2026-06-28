import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export { PrivateRoute };

function PrivateRoute({ user, children }) {
  const LoggedIn = localStorage.getItem("accessToken");
  // const userRole = jwt_decode(LoggedIn).role;
  const userLoggedIn = LoggedIn ? jwt_decode(LoggedIn) : null;

  const exp = LoggedIn ? userLoggedIn.exp : null;
  const currentDate = Date.now() / 1000;

  if (!LoggedIn || exp < currentDate) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" />;
  } else if (
    user !== jwt_decode(LoggedIn).role &&
    jwt_decode(LoggedIn).role == 1
  ) {
    return <Navigate to="/dashboard-instructor" />;
  } else if (
    user !== jwt_decode(LoggedIn).role &&
    jwt_decode(LoggedIn).role == 2
  ) {
    return <Navigate to="/dashboard-student" />;
  }

  return children;
}

import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export { PrivateRoute };

function PrivateRoute({ children }) {
  const LoggedIn = localStorage.getItem("accessToken");
  const exp = LoggedIn && jwt_decode(LoggedIn);
  const currentDate = Date.now() / 1000;
  if (!LoggedIn || exp < currentDate) {
    return <Navigate to="/login" />;
  } else return children;
}

import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const loggedIn = localStorage.getItem("accessToken");

  if (loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export { PublicRoute };

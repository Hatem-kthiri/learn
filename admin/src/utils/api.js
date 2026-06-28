import axios from "axios";
import { url } from "./index";

/**
 * Shared axios instance for all admin-panel API calls.
 *
 * Every request automatically gets the stored JWT attached as an
 * `authorization` header (if one exists in localStorage), so individual
 * components never need to build that header by hand. This is what lets
 * the backend's `isAuth` middleware (gated behind ENABLE_ADMIN_AUTH) work
 * without breaking existing calls.
 */
const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

// If the backend ever rejects the token (expired/invalid), clear it and
// send the user back to login instead of leaving them stuck on a page
// where every request silently 401s.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 400) {
      const isAuthError =
        error.response.data?.message === "Invalid token" ||
        error.response.data?.message === "Access denied. No token provided.";
      if (isAuthError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

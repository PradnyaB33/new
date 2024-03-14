import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import UserProfile from "../hooks/UserData/useUser";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { getCurrentUser, useGetCurrentRole } = UserProfile();

  const [user, setUser] = useState(null); // Initialize user as null initially
  const [isLoading, setIsLoading] = useState(false); // Initialize user as null initially

  const role = useGetCurrentRole(); // Call useGetCurrentRole directly here

  useEffect(() => {
    setIsLoading(true);
    setUser(getCurrentUser());
    setIsLoading(false);
    // eslint-disable-next-line
  }, []); // Ensure the effect runs when getCurrentUser changes

  return (
    <AuthContext.Provider value={{ user, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children, permission }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const isPermission = permission?.includes(role);
  const isAuthPage =
    window.location.pathname.includes("sign-in") ||
    window.location.pathname.includes("sign-up");

  if (!isAuthPage && user) {
    if (user && isPermission) return children;
    if (!isPermission) return navigate(-1);
    if (!user) return <Navigate to={"/sign-in"} />;
  }
  return children;
}

export default RequireAuth;

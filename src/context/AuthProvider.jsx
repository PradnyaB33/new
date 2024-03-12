import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import UserProfile from "../hooks/UserData/useUser";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { getCurrentUser, useGetCurrentRole } = UserProfile();

  const [user, setUser] = useState(null); // Initialize user as null initially
  const role = useGetCurrentRole(); // Call useGetCurrentRole directly here

  useEffect(() => {
    // Update user when component mounts
    setUser(getCurrentUser());
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
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();

  if (!isLoading) {
    const isPermission = permission?.includes(role);
    const isAuthPage =
      window.location.pathname.includes("sign-in") ||
      window.location.pathname.includes("sign-up");

    if (!isAuthPage) {
      if (user && isPermission) return children;
      if (!user) return <Navigate to={"/sign-in"} />;
      if (!isPermission) return navigate(-1);
    }
  }
  return children;
}

export default RequireAuth;

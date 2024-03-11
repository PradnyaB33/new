import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UserProfile from "../hooks/UserData/useUser";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { getCurrentUser, useGetCurrentRole } = UserProfile();

  const [user, setUser] = useState(null); // Initialize user as null initially
  const role = useGetCurrentRole(); // Call useGetCurrentRole directly here

  useEffect(() => {
    // Update user when component mounts
    setUser(getCurrentUser());
    console.log("run");
    // eslint-disable-next-line
  }, []); // Ensure the effect runs when getCurrentUser changes

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children, permission }) {
  const { user, role } = useAuth();

  const isPermission = permission?.includes(role);
  const isAuthPage =
    window.location.pathname.includes("sign-in") ||
    window.location.pathname.includes("sign-up");

  if (!isAuthPage) {
    if (!user) return <Navigate to={"/sign-in"} />;
    if (user && isPermission) return children;
    if (!isPermission) return <Navigate to={"/"} />;
  }

  return children;
}

export default RequireAuth;

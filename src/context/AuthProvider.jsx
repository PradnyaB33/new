import { CircularProgress } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SwipeableTemporaryDrawer from "../components/app-layout/swipable-drawer";
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
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const isAuthPage =
    window.location.pathname.includes("sign-in") ||
    window.location.pathname.includes("sign-up");

  const isPermission = permission?.includes(role);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isPageLoaded || !isOnline) {
      return;
    }

    let timer;
    if ((!user || !isPermission) && !isAuthPage && isOnline) {
      timer = setTimeout(() => {
        setIsPageLoaded(true);
        return navigate("/sign-in");
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };

    // eslint-disable-next-line
  }, [isPageLoaded, isPermission]);

  useEffect(() => {
    // Simulate page loading completion after 1 second
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // if (!user && !isAuthPage) return <Navigate to={"/sign-in"} />;

  if (!isPageLoaded || !isOnline) {
    return (
      <div className="flex items-center justify-center   w-full h-[80vh]">
        <div className="grid place-items-center gap-2">
          <CircularProgress />
          <h1 className="text-center text-xl w-full">Loading</h1>
        </div>
      </div>
    );
  }

  if (user && isPermission && isOnline) {
    return (
      <>
        <SwipeableTemporaryDrawer />
        {children}
      </>
    );
  }
}

export default RequireAuth;

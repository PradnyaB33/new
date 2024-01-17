import React from "react";
import { Route } from "react-router-dom";

const ProtectedRoute = ({ element, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/login" />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to a forbidden page if the user doesn't have the required role
    return <Navigate to="/forbidden" />;
  }

  // Render the protected route if the user is authenticated and has the required role
  return <Route element={element} />;
};

export default ProtectedRoute;

import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";

const UserProfile = () => {
  const { cookies } = useContext(UseContext);
  const token = cookies["aeigs"];
  const roletoken = cookies["role"];

  const getCurrentUser = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken?.user) {
        return decodedToken?.user;
      } else {
        return "guest";
      }
    }
  };

  const getCurrentRole = () => {
    if (roletoken) {
      const decodedToken = jwtDecode(roletoken);
      if (decodedToken) {
        return decodedToken?.role;
      } else {
        return "guest";
      }
    }
  };

  return { getCurrentUser, getCurrentRole };
};

export default UserProfile;

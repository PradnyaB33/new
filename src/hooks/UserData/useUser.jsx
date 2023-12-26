import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";

const UserProfile = () => {
  const { cookies } = useContext(UseContext);
  const token = cookies["aeigs"];

  const getCurrentUser = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.user) {
        return decodedToken.user;
      } else {
        return "guest";
      }
    }
  };
  return { getCurrentUser };
};

export default UserProfile;

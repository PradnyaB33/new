import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";

const UserProfile = () => {
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
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

  const useGetCurrentRole = () => {
    const { data } = useQuery({
      queryKey: ["role"],
      queryFn: () => {
        if (roletoken) {
          const decodedToken = jwtDecode(roletoken);
          if (decodedToken) {
            console.log(decodedToken?.role);
            return decodedToken?.role;
          } else {
            return null;
          }
        }
      },
    });

    return data;
  };

  return { getCurrentUser, useGetCurrentRole };
};

export default UserProfile;

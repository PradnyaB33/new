// useGetUser.js
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";

const useGetUser = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  let decodedToken = null;
  if (authToken) {
    decodedToken = jwtDecode(authToken);
  }
  return { authToken, decodedToken };
};

export default useGetUser;

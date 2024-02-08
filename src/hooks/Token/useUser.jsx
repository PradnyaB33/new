// useGetUser.js
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";

const useGetUser = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const decodedToken = jwtDecode(authToken);
  return { authToken, decodedToken };
};

export default useGetUser;

import axios from "axios";
import { useQuery } from "react-query";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../UserData/useUser";

const useHook = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];  
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;

  const getUserInformation = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.employee;
  };

  const {
    data: UserInformation,
    isLoading,
    isFetching,
  } = useQuery("additionalField", getUserInformation);

  return {
    UserInformation,
    isLoading,
    isFetching,
  };
};

export default useHook;

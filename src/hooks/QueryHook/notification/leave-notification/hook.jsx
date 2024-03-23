import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";

const useLeaveNotificationHook = () => {
  const { authToken } = useGetUser();
  const getUserNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/get`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };
  const { data, isLoading, isFetching } = useQuery(
    "employee-leave",
    getUserNotification
  );
  return {
    data,
    isLoading,
    isFetching,
  };
};

export default useLeaveNotificationHook;

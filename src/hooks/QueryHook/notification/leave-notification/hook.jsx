import axios from "axios";
import { useQuery } from "react-query";
import useNotificationCount from "../../../../components/app-layout/notification-zustand";
import useGetUser from "../../../Token/useUser";

const useLeaveNotificationHook = () => {
  const { authToken } = useGetUser();
  const { setNotificationCount } = useNotificationCount();
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
    getUserNotification,
    {
      onSuccess: async (data) => {
        setNotificationCount(data.leaveRequests?.length ?? 0);
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  return {
    data,
    isLoading,
    isFetching,
  };
};

export default useLeaveNotificationHook;

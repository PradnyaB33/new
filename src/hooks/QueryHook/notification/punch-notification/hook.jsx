import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";

const usePunchNotification = () => {
  const { authToken } = useGetUser();
  const getUserPunchNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/punch-notification/notification-user`,
      {
        headers: { Authorization: authToken },
      }
    );
    console.log(`🚀 ~ file: hook.jsx:14 ~ response:`, response);
    return response.data;
  };

  const { data, isLoading, isFetching } = useQuery(
    "punch-request",
    getUserPunchNotification
  );
  return {
    data,
    isLoading,
    isFetching,
  };
};

export default usePunchNotification;

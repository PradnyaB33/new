import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";

const useDepartmentNotification = () => {
  const { authToken } = useGetUser();
  const getDepartmentNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/punch-notification/notification-user`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.punchNotification;
  };

  const { data, isLoading, isFetching } = useQuery(
    "punch-request",
    getDepartmentNotification
  );
  return {
    data,
    isLoading,
    isFetching,
  };
};

export default useDepartmentNotification;

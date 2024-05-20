import axios from "axios";
import { useQuery } from "react-query";
import useIncomeTax from "../../../IncomeTax/useIncomeTax";
import useGetUser from "../../../Token/useUser";
import UserProfile from "../../../UserData/useUser";

const useTDSNotificationHook = () => {
  const { authToken } = useGetUser();
  const { useGetCurrentRole } = UserProfile();
  const { financialYear } = useIncomeTax();
  const role = useGetCurrentRole();
  const getUserNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/tds/getCountNotifications/${financialYear}/${role}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };
  const { data, isLoading, isFetching } = useQuery(
    "tds-notification",
    getUserNotification
  );
  return {
    data,
    isLoading,
    isFetching,
  };
};

export default useTDSNotificationHook;

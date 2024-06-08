import axios from "axios";
import { useQuery } from "react-query";
import useNotificationCount from "../../../../components/app-layout/notification-zustand";
import useGetUser from "../../../Token/useUser";
import UserProfile from "../../../UserData/useUser";

const useShiftNotification = () => {
  const { authToken } = useGetUser();
  const { getCurrentUser } = UserProfile();
  const { setNotificationCount } = useNotificationCount();
  let isAcc = false;
  const user = getCurrentUser();
  const profileArr = user.profile;
  profileArr.forEach((element) => {
    if (element === "Accountant") {
      isAcc = true;
    }
  });
  const getShiftNotification = async () => {
    let url;
    if (isAcc) {
      url = `${process.env.REACT_APP_API}/route/shiftApply/getForAccountant`;
      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });
      return response.data.requests;
    } else {
      url = `${process.env.REACT_APP_API}/route/shiftApply/getForManager`;
      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });
      const data = response.data.requests.filter(
        (item) => item.status === "Pending"
      );
      return data;
    }
  };
  const getCount = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/shiftApply/getCount`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.newReq;
  };

  const { data, isLoading, isFetching } = useQuery(
    "shift-request",
    getShiftNotification,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: async (data) => {
        console.log(`🚀 ~ file: hook.jsx:33 ~ data:`, data);
        setNotificationCount(data?.length);
      },
    }
  );
  const { data: count } = useQuery("shift-count", getCount);
  console.log("count", count);
  return {
    data,
    count,
    isLoading,
    isFetching,
  };
};

export default useShiftNotification;

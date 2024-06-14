import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";
import UserProfile from "../../../UserData/useUser";

const useShiftNotification = () => {
  const { authToken } = useGetUser();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const [notificationCount, setNotificationCount] = useState(0);

  const getShiftNotification = async () => {
    let url;
    if (role === "Accountant") {
      url = `${process.env.REACT_APP_API}/route/shiftApply/getForAccountant`;
      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });
      console.log(
        `🚀 ~ file: hook.jsx:35 ~ response?.data?.newReq?.length:`,
        response?.data?.newReq?.length
      );
      console.log(`🚀 ~ file: hook.jsx:21 ~ response:`, response);
      setNotificationCount(response?.data?.newReq?.length, role);
      return response.data.requests;
    } else {
      url = `${process.env.REACT_APP_API}/route/shiftApply/getForManager`;
      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });
      console.log(`🚀 ~ file: hook.jsx:31 ~ response:`, response);
      const data = response.data.requests.filter(
        (item) => item.status === "Pending"
      );
      setNotificationCount(data.length, role);
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
    ["shift-request", role],
    getShiftNotification,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: async (data) => {
        console.log(`🚀 ~ file: hook.jsx:33 ~ data:`, data);
      },
    }
  );

  const { data: count } = useQuery("shift-count", getCount);

  return {
    data,
    count,
    isLoading,
    isFetching,
    notificationCount,
  };
};

export default useShiftNotification;

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
    ["shift-request", role],
    getShiftNotification,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: async (data) => {
        setNotificationCount(data?.length ?? 0);
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

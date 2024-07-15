import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useNotificationCount from "../../../../components/app-layout/notification-zustand";
import useGetUser from "../../../Token/useUser";

const useLeaveNotificationHook = () => {
  const { authToken, decodedToken } = useGetUser();
  console.log(`🚀 ~ file: hook.jsx:8 ~ decodedToken:`, decodedToken);
  const { setNotificationCount } = useNotificationCount();
  const [organizationId, setOrganizationId] = useState(
    decodedToken?.user?.organizationId
  );
  const updateOrganizationId = (orgId) => {
    setOrganizationId((prev) => orgId);
  };
  const getUserNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/get?organizationId=${organizationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };
  const { data, isLoading, isFetching } = useQuery(
    ["employee-leave", organizationId],
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
    updateOrganizationId,
    organizationId,
  };
};

export default useLeaveNotificationHook;

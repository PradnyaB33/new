import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useNotificationCount from "../../../../components/app-layout/notification-zustand";
import useGetUser from "../../../Token/useUser";
import useOrgList from "../../Orglist/hook";

const useLeaveNotificationHook = () => {
  const { authToken, decodedToken } = useGetUser();
  console.log(`🚀 ~ file: hook.jsx:8 ~ decodedToken:`, decodedToken);
  const { setNotificationCount } = useNotificationCount();

  const { data: orgData } = useOrgList();
  const [organizationId, setOrganizationId] = useState({
    value: decodedToken?.user?.organizationId,
    label: orgData?.organizations?.find(
      (org) => org?._id === decodedToken?.user?.organizationId
    )?.orgName,
  });

  useEffect(() => {
    setOrganizationId({
      value: decodedToken?.user?.organizationId,
      label: orgData?.organizations?.find(
        (org) => org?._id === decodedToken?.user?.organizationId
      )?.orgName,
    });
  }, [decodedToken?.user?.organizationId, orgData?.organizations]);

  console.log(`🚀 ~ file: hook.jsx:26 ~ organizationId:`, organizationId);

  const updateOrganizationId = (orgId) => {
    setOrganizationId((prev) => orgId);
  };
  const getUserNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/get?organizationId=${organizationId?.value}`,
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

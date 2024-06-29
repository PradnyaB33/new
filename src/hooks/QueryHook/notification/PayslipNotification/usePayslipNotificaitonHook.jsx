import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import useNotificationCount from "../../../../components/app-layout/notification-zustand";
import UserProfile from "../../../UserData/useUser";

const usePayslipNotificationHook = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const { setNotificationCount } = useNotificationCount();
  const user = getCurrentUser();
  const organisationId = user?.organizationId;
  const userId = user?._id;

  const getPaySlipNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${userId}/${organisationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.salaryDetails;
  };

  const {
    data: PayslipNotification,
    isLoading,
    isFetching,
  } = useQuery("payslip-notification", getPaySlipNotification, {
    onSuccess: async (data) => {
      console.log(`🚀 ~ file: hook.jsx:56 ~ data:`, data?.length);
      setNotificationCount(data?.length ?? 0);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    PayslipNotification,
    isLoading,
    isFetching,
  };
};

export default usePayslipNotificationHook;

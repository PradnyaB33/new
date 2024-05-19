import axios from "axios";
import { useQuery } from "react-query";
import UserProfile from "../../../UserData/useUser";
import { UseContext } from "../../../../State/UseState/UseContext";
import { useContext } from "react";

const usePayslipNotificationHook = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user.organizationId;
  const userId = user._id;

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
  } = useQuery("payslip-notification", getPaySlipNotification);

  return {
    PayslipNotification,
    isLoading,
    isFetching,
  };
};

export default usePayslipNotificationHook;

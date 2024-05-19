import axios from "axios";
import { useQuery } from "react-query";
import UserProfile from "../../../UserData/useUser";
import { UseContext } from "../../../../State/UseState/UseContext";
import { useContext } from "react";

const useMissedPunchNotificationCount = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user.organizationId;

  const getMissedPunchNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-unavaialble-record`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.data;
  };

  const { data: missPunchData, isLoading, isFetching } = useQuery(
    "employee-missed-punch",
    getMissedPunchNotification
  );
  
  return {
    missPunchData,
    isLoading,
    isFetching,
  };
};

export default useMissedPunchNotificationCount;
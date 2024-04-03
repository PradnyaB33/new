import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../../Token/useUser";
import UserProfile from "../../../UserData/useUser";

const useShiftNotification = () => {
  const { authToken } = useGetUser();
  const { getCurrentUser } = UserProfile();
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

  const { data, isLoading, isFetching } = useQuery(
    "shift-request",
    getShiftNotification
  );
  return {
    data,
    isLoading,
    isFetching,
  };
};

export default useShiftNotification;

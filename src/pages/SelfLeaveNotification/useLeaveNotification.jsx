import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";

const useLeaveNotification = () => {
  const [status, setStatus] = useState("");
  const [leaveTypeDetailsId, setLeaveTypeDetailsId] = useState("");
  const [month, setMonth] = useState("");

  const { authToken, decodedToken } = useGetUser();
  const getLeaveNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/get-leave-notification/${decodedToken?.user?._id}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };

  const { data, refetch } = useQuery({
    queryKey: "leave-notification",
    queryFn: getLeaveNotification,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    refetch,
    status,
    setStatus,
    leaveTypeDetailsId,
    setLeaveTypeDetailsId,
    month,
    setMonth,
  };
};

export default useLeaveNotification;

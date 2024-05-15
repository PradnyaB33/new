import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";

const useLeaveNotification = () => {
  const [status, setStatus] = useState("");
  const [leaveTypeDetailsId, setLeaveTypeDetailsId] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [skip, setSkip] = useState(0);

  const { authToken, decodedToken } = useGetUser();
  const getLeaveNotification = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/get-leave-notification/${decodedToken?.user?._id}?status=${status}&leaveTypeDetailsId=${leaveTypeDetailsId}&minDate=${minDate}&maxDate=${maxDate}&skip=${skip}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };

  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: [
      "leave-notification",
      status,
      minDate,
      maxDate,
      leaveTypeDetailsId,
      skip,
    ],
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
    minDate,
    setMinDate,
    maxDate,
    setMaxDate,
    skip,
    setSkip,
    isLoading,
    isFetching,
  };
};

export default useLeaveNotification;

import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../Token/useAuth";

const useLeaveRequesationHook = () => {
  const authToken = useAuthToken();
  const { data, isLoading, isError, error } = useQuery(
    "employee-leave-table",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getEmployeeLeaveTable`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    }
  );
  const invalidateLeaveTable = async () => {};
  return { data, isLoading, isError, error, invalidateLeaveTable };
};

export default useLeaveRequesationHook;

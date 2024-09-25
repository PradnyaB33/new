import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../Token/useAuth";

const useLeaveRequesationHook = (organisationId) => {
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
    },
    {
      onSuccess: async (data) => {},
    }
  );

  const { data: compOff } = useQuery("comp-off", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get/comp-off`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.compOff.compOff;
  });

  const { data: publicHoliday } = useQuery("comp-off", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/holiday/get/${organisationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data.compOff.compOff;
  });

  return { data, isLoading, isError, error, compOff, publicHoliday };
};

export default useLeaveRequesationHook;

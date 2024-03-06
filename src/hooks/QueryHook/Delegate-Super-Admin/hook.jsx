import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../Token/useUser";

const useGetDelegateSuperAdmin = () => {
  const { authToken, decodedToken } = useGetUser();
  console.log(`🚀 ~ file: hook.jsx:7 ~ decodedToken:`, decodedToken);
  const { data, isLoading } = useQuery(
    `delegate-super-admin-${decodedToken?.user?._id}`,
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/delegate`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Rethrow the error to be caught by React Query
      }
    }
  );
  return { data, isLoading };
};

export default useGetDelegateSuperAdmin;
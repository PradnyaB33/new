import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../Token/useUser";

const useOrgList = () => {
  const { authToken } = useGetUser();
  const { data, isLoading } = useQuery("orglist", async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get`,
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
  });
  return { data, isLoading };
};

export default useOrgList;
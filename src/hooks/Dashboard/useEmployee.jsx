import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useEmployee = (organisationId) => {
  const authToken = useAuthToken();
  const getEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: employee, isLoading: employeeLoading } = useQuery(
    ["employee-data", organisationId],
    getEmployees
  );
  return { employee, employeeLoading };
};

export default useEmployee;

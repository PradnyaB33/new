import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import { useContext } from "react";

const useLoanNotification = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
 
    // get the employee whose raised a request for loan applicaiton
   const { data: getEmployeeRequestLoanApplication  , isFetching , isLoading} = useQuery(
    ["empLoanApplyRequest"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/pendingLoans`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  

  return {
    getEmployeeRequestLoanApplication,
    isLoading,
    isFetching,
  };
};

export default useLoanNotification;
import { useContext, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import useLaonState from "./useLaonState";
const useLoanQuery = (organisationId) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const { loanType, setRateOfInterest } = useLaonState();

  //for  Get Query to get loan type
  const { data: getEmployeeLoanType } = useQuery(
    ["loanType", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-loan-type`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  useEffect(() => {
    if (getEmployeeLoanType?.length > 0 && loanType) {
      const selectedLoanType = getEmployeeLoanType.find(
        (item) => item._id === loanType
      );
      if (selectedLoanType && selectedLoanType.rateOfInterest) {
        setRateOfInterest(selectedLoanType.rateOfInterest);
      }
    }
  }, [getEmployeeLoanType, loanType, setRateOfInterest]);

  //for  Get Query to total salary
  const { data: getTotalSalaryEmployee } = useQuery(
    ["totalSalary", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/${organisationId}/total-salary`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const totalSalary = response.data.totalSalary;
      return totalSalary;
    }
  );

  // get the employee whose raised a request for loan applicaiton
  const { data: getEmployeeRequestLoanApltn } = useQuery(
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
    getEmployeeLoanType,
    getTotalSalaryEmployee,
    getEmployeeRequestLoanApltn,
  };
};

export default useLoanQuery;

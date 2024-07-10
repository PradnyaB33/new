import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

const useGetEmployeeSalaryByFinaicalYear = () => {
  function getFinancialCurrentYear() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed, so +1 to match natural numbering
    const currentYear = currentDate.getFullYear();

    let financialYearStart, financialYearEnd;

    if (currentMonth >= 4) {
      // If current month is April or later, financial year starts this year
      financialYearStart = `4-${currentYear}`;
      financialYearEnd = `3-${currentYear + 1}`;
    } else {
      // If current month is March or earlier, financial year started last year
      financialYearStart = `4-${currentYear - 1}`;
      financialYearEnd = `3-${currentYear}`;
    }

    return { start: financialYearStart, end: financialYearEnd };
  }

  const authToken = useAuthToken();

  const { data: usersalary } = useQuery({
    queryKey: ["finacialYearData"],
    queryFn: async () => {
      try {
        const { start, end } = getFinancialCurrentYear();

        const salaryData = await axios.get(
          `${process.env.REACT_APP_API}/route/employeeSalary/getEmployeeSalaryPerFinancialYear?fromDate=${start}&toDate=${end}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return salaryData.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return { usersalary, getFinancialCurrentYear };
};

export default useGetEmployeeSalaryByFinaicalYear;

import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { useContext, useEffect,  useState } from "react";
import { TestContext } from "../../State/Function/Main";
import dayjs from "dayjs";
import { useQuery } from "react-query";

const useCalculateSalaryQuery = ({
  userId,
  organisationId,
  remotePunchingCount,
}) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [publicHolidays, setPublicHoliDays] = useState([]);
  console.log(setSelectedDate);

  // get the alreday salary data created
  const [salaryInfo, setSalaryInfo] = useState([]);
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${userId}/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setSalaryInfo(response.data.salaryDetails);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchEmployeeData();
    // eslint-disable-next-line
  }, []);

  //  to get the employee
  const [availableEmployee, setAvailableEmployee] = useState();
  const fetchAvailableEmployee = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAvailableEmployee(response.data.employee);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch User Profile Data");
    }
  };
  useEffect(() => {
    fetchAvailableEmployee();
    // eslint-disable-next-line
  }, []);

  //  to get holiday
  const fetchHoliday = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/holiday/get/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPublicHoliDays(response.data.holidays);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Holiday");
    }
  };
  useEffect(() => {
    fetchHoliday();
    // eslint-disable-next-line
  }, []);
  const countPublicHolidaysInCurrentMonth = () => {
    const selectedMonth = selectedDate.format("M");
    const selectedYear = selectedDate.format("YYYY");

    const holidaysInCurrentMonth = publicHolidays.filter((holiday) => {
      const holidayDate = dayjs(holiday.date);
      return (
        holidayDate.month() + 1 === parseInt(selectedMonth) &&
        holidayDate.year() === parseInt(selectedYear)
      );
    });

    return holidaysInCurrentMonth.length;
  };
  let publicHolidaysCount = countPublicHolidaysInCurrentMonth();

  // pull the total deduction of loan of employee if he/she apply the loan
  const { data: empLoanAplicationInfo } = useQuery(
    ["empLoanAplication", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${userId}/get-ongoing-loan-data`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );

  

  // to get remote punching amount
  const { data: getremotePuncingAmount } = useQuery(
    ["remote-punching"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/remote-punch/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.remotePunchingObject.allowanceQuantity;
    }
  );

  const isValidAmount =
    !isNaN(getremotePuncingAmount) &&
    getremotePuncingAmount !== null &&
    getremotePuncingAmount !== undefined;

  const isValidCount =
    !isNaN(remotePunchingCount) &&
    remotePunchingCount !== null &&
    remotePunchingCount !== undefined;

  const remotePunchAllowance =
    isValidAmount && isValidCount
      ? remotePunchingCount * getremotePuncingAmount
      : 0;

  const formattedDate = selectedDate.format("MMM-YY");

  return {
    salaryInfo,
    availableEmployee,
    publicHolidaysCount,
    formattedDate,
    empLoanAplicationInfo,
    remotePunchAllowance,
  };
};

export default useCalculateSalaryQuery;

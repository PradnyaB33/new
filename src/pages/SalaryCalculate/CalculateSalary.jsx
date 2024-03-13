import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Box from "@mui/material/Box";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import axios from "axios";
import dayjs from "dayjs";
function CalculateSalary() {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { userId, organisationId } = useParams();
  const [selectedDate, setSelectedDate] = useState(dayjs("2022-04-17"));
  const [numDaysInMonth, setNumDaysInMonth] = useState(0);
  const [availableEmployee, setAvailableEmployee] = useState();
  const [publicHolidays, setPublicHoliDays] = useState([]);
  const [weekend, setWeekend] = useState([]);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [paidLeaveDays, setPaidLeaveDays] = useState(0);
  const [unPaidLeaveDays, setUnPaidLeaveDays] = useState(0);

  // get the data which is use selected by calender
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const daysInMonth = date.daysInMonth();
    setNumDaysInMonth(daysInMonth);
    setPaidLeaveDays(0);
    setUnPaidLeaveDays(0);
  };

  // formate the data in this format eg(Dec-23)
  const formattedDate = dayjs(selectedDate).format("MMM-YY");

  // pull employee data based on emp id
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

  // pull holiday's count based on organization id
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

  // pull weekend based on organization id
  const fetchWeekend = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/weekend/get/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setWeekend(response.data.days);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Weekend");
    }
  };

  useEffect(() => {
    fetchWeekend();
    // eslint-disable-next-line
  }, []);

  const getWeekendbyOrganization = weekend
    .map((item) => item.days.map((dayItem) => dayItem.day))
    .flat();

  // get the weekend count in that organization
  const countWeekendDaysInMonth = () => {
    const selectedMonth = dayjs(selectedDate);
    const daysInMonth = selectedMonth.daysInMonth();
    let weekendCount = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = selectedMonth.date(i);
      const dayOfWeek = currentDate.format("ddd");
      if (getWeekendbyOrganization.includes(dayOfWeek)) {
        // If the day falls on a weekend day defined by the organization
        weekendCount++;
      }
    }
    return weekendCount;
  };

  // Call the function to count weekend days in the selected month
  const weekendCount = countWeekendDaysInMonth();

  // pull the data such as paidLeaveDays , unpaidLeave days
  const fetchDataAndFilter = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getYearLeaves/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setEmployeeSummary(response.data);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Employee Leave Summary");
    }
  };

  useEffect(() => {
    fetchDataAndFilter();
    // eslint-disable-next-line
  }, []);

  // Extract month and year from selectedDate
  const selectedMonth = selectedDate.format("M");
  const selectedYear = selectedDate.format("YYYY");

  const filterDataByMonthYear = (data, selectedMonth, selectedYear) => {
    const numericMonth = parseInt(selectedMonth, 10); // Convert selectedMonth to a number
    const numericYear = parseInt(selectedYear, 10); // Convert selectedYear to a number

    return data.filter((item) => {
      // Convert item.month to a number if it's a string in your data
      const itemMonth = parseInt(item.month, 10);

      // Check equality after converting types
      return (
        itemMonth === numericMonth && parseInt(item.year, 10) === numericYear
      );
    });
  };

  useEffect(() => {
    const filteredData = filterDataByMonthYear(
      employeeSummary,
      selectedMonth,
      selectedYear
    );
    if (filteredData.length > 0) {
      const { paidleaveDays, unpaidleaveDays } = filteredData[0];
      setPaidLeaveDays(paidleaveDays);
      setUnPaidLeaveDays(unpaidleaveDays);
    }
  }, [employeeSummary, selectedMonth, selectedYear]);

  // calculate the no of days employee present in selected Month
  const calculateDaysEmployeePresent = () => {
    const daysPresent =
      numDaysInMonth -
      (paidLeaveDays + unPaidLeaveDays + weekendCount + publicHolidaysCount);

    return daysPresent;
  };

  let noOfDaysEmployeePresent = calculateDaysEmployeePresent();

  // calculate the basic , hra , da monthly
  const calculateSalaryComponent = (componentValue) => {
    const daysInMonth = numDaysInMonth;
    if (!isNaN(parseFloat(componentValue)) && daysInMonth > 0) {
      return (
        (parseFloat(componentValue) / daysInMonth) *
        noOfDaysEmployeePresent
      ).toFixed(2);
    } else {
      return 0;
    }
  };

  let basicSalary = calculateSalaryComponent(
    availableEmployee?.salaryComponent?.Basic || ""
  );
  let hraSalary = calculateSalaryComponent(
    availableEmployee?.salaryComponent?.HRA || ""
  );
  let daSalary = calculateSalaryComponent(
    availableEmployee?.salaryComponent?.DA || ""
  );
  let foodAllowance = calculateSalaryComponent(
    availableEmployee?.salaryComponent?.["Food allowance"] || ""
  );
  let salesAllowance = calculateSalaryComponent(
    availableEmployee?.salaryComponent?.["Sales allowance"] || ""
  );
  let specialAllowance = calculateSalaryComponent(
    availableEmployee?.salaryComponent?.["Special allowance"] || ""
  );
  let travelAllowance = calculateSalaryComponent(
    availableEmployee?.salaryComponent?.["Travel allowance"] || ""
  );
  let variableAllowance = calculateSalaryComponent(
    availableEmployee?.salaryComponent?.["Variable allowance"] || ""
  );

  // calculate the total gross salary
  let totalSalary =
    parseFloat(basicSalary) +
    parseFloat(hraSalary) +
    parseFloat(daSalary) +
    parseFloat(foodAllowance) +
    parseFloat(salesAllowance) +
    parseFloat(specialAllowance) +
    parseFloat(travelAllowance) +
    parseFloat(variableAllowance);

  let totalGrossSalary = totalSalary.toFixed(2);

  // calculate the total deduction
  let deduction = availableEmployee?.deduction || "";
  let employee_pf = availableEmployee?.employee_pf || "";
  let esic = availableEmployee?.esic || "";
  // Convert each individual deduction to have two decimal places
  deduction = parseFloat(deduction).toFixed(2);
  employee_pf = parseFloat(employee_pf).toFixed(2);
  esic = parseFloat(esic).toFixed(2);

  // Calculate total deduction by adding all deductions
  let totalDeductions =
    parseFloat(deduction) + parseFloat(employee_pf) + parseFloat(esic);
  let totalDeduction = totalDeductions.toFixed(2);

  // calculate the totalNetSalary
  let totalNetSalary = (totalGrossSalary - totalDeduction).toFixed(2);

  const saveSallaryDetail = async () => {
    try {
      // Check if the selected year is in the future
      const currentYear = dayjs().format("YYYY");
      const selectedYear = selectedDate.format("YYYY");
      const employeeJoiningYear = dayjs(availableEmployee?.joining_date).format(
        "YYYY"
      );

      if (parseInt(selectedYear) > parseInt(currentYear)) {
        handleAlert(true, "error", "Cannot calculate salary for future years");
        return;
      }

      if (parseInt(selectedYear) < parseInt(employeeJoiningYear)) {
        handleAlert(
          true,
          "error",
          "Cannot calculate salary for years before employee's joining date"
        );
        return;
      }

      const data = {
        employeeId: userId,
        basicSalary,
        hraSalary,
        daSalary,
        foodAllowance,
        salesAllowance,
        specialAllowance,
        travelAllowance,
        variableAllowance,
        totalGrossSalary,
        totalDeduction,
        totalNetSalary,
        numDaysInMonth,
        formattedDate,
        publicHolidaysCount,
        paidLeaveDays,
        unPaidLeaveDays,
        noOfDaysEmployeePresent,
        month: selectedDate.format("M"),
        year: selectedDate.format("YYYY"),
        organizationId: organisationId,
      };
      console.log(data);

      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employeeSalary/add-salary/${userId}/${organisationId}`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        handleAlert(
          true,
          "success",
          "Monthly Salary Detail added Successfully"
        );
        basicSalary = 0;
        hraSalary = 0;
        daSalary = 0;
        foodAllowance = 0;
        salesAllowance = 0;
        specialAllowance = 0;
        travelAllowance = 0;
        variableAllowance = 0;
        totalGrossSalary = 0;
        totalDeduction = 0;
        totalNetSalary = 0;
        noOfDaysEmployeePresent = 0;
        publicHolidaysCount = 0;
        setNumDaysInMonth(0);
        setUnPaidLeaveDays(0);
        setPaidLeaveDays(0);

        // Resetting alerts after a certain time
        setTimeout(() => {
          handleAlert(false, "", "");
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // If salary for the given month and year already exists
        handleAlert(
          true,
          "error",
          "Salary for this month and year already exists"
        );
      } else {
        // For other errors
        console.error("Error adding salary details:", error);
        handleAlert(true, "error", "Failed to add salary details");
      }
    }
  };
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center">
        <Box className="text-center">
          <h3 className="text-lg font-bold text-gray-700">
            Select Month and Year
          </h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              views={["month", "year"]}
              openTo="month"
            />
          </LocalizationProvider>
        </Box>
      </div>

      <div className="flex items-center justify-between mb-6">
        <img
          src={availableEmployee?.organizationId?.logo_url || ""}
          alt="Company Logo"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <p className="text-lg font-semibold">
            Organisation Name:
            <span>{availableEmployee?.organizationId?.orgName || ""}</span>
          </p>

          <p className="text-lg">
            Location:
            <span>{availableEmployee?.organizationId?.location || ""}</span>
          </p>
          <p className="text-lg">
            Contact No:
            <span>
              {availableEmployee?.organizationId?.contact_number || ""}
            </span>
          </p>
          <p className="text-lg">
            Organisation Email:
            <span>{availableEmployee?.organizationId?.email || ""}</span>
          </p>
        </div>
      </div>
      <hr className="mb-6" />
      {/* 1st table */}
      <div>
        <table class="w-full border border-collapse">
          <thead>
            <tr class="bg-blue-200">
              <th class="px-4 py-2 border">Salary Slip</th>
              <th class="border"></th>
              <th class="px-4 py-2 border">Month</th>
              <th class="px-4 py-2 border">{formattedDate}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-4 py-2 border">Employee Name:</td>
              <td class="px-4 py-2 border">
                {`${availableEmployee?.first_name} ${availableEmployee?.last_name}`}
              </td>
              <td class="px-4 py-2 border">Date Of Joining:</td>
              <td class="px-4 py-2 border">
                {availableEmployee?.joining_date
                  ? new Date(availableEmployee.joining_date).toLocaleDateString(
                      "en-GB"
                    )
                  : ""}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Designation:</td>
              <td class="px-4 py-2 border">
                {" "}
                {(availableEmployee?.designation &&
                  availableEmployee?.designation.length > 0 &&
                  availableEmployee?.designation[0]?.designationName) ||
                  ""}
              </td>
              <td class="px-4 py-2 border">Unpaid Leaves:</td>
              <td class="px-4 py-2 border">{unPaidLeaveDays}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Department Name:</td>
              <td class="px-4 py-2 border">
                {" "}
                {(availableEmployee?.deptname &&
                  availableEmployee?.deptname.length > 0 &&
                  availableEmployee?.deptname[0]?.departmentName) ||
                  ""}
              </td>
              <td class="px-4 py-2 border">No of Working Days Attended:</td>
              <td class="px-4 py-2 border">{noOfDaysEmployeePresent}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">PAN No:</td>
              <td class="px-4 py-2 border">
                {availableEmployee?.pan_card_number}
              </td>
              <td class="px-4 py-2 border">Paid Leaves:</td>
              <td class="px-4 py-2 border">{paidLeaveDays}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Bank Account No:</td>
              <td class="px-4 py-2 border">
                {availableEmployee?.bank_account_no || ""}
              </td>
              <td class="px-4 py-2 border">Public Holidays:</td>
              <td class="px-4 py-2 border">{publicHolidaysCount}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border"> No of Days in Month:</td>
              <td class="px-4 py-2 border">{numDaysInMonth}</td>
              <td class="px-4 py-2 border"></td>
              <td class="px-4 py-2 border"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2nd table */}
      <div>
        <table class="w-full border border-collapse">
          <thead>
            <tr class="bg-blue-200">
              <th class="px-4 py-2 border">Income</th>
              <th class="border"></th>
              <th class="px-4 py-2 border">Deduction</th>
              <th class="px-4 py-2 border"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-4 py-2 border">Particulars</td>
              <td class="py-2 border">Amount</td>
              <td class="py-2 border">Particulars</td>
              <td class="py-2 border">Amount</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Basic :</td>
              <td class="px-4 py-2 border">{basicSalary}</td>
              <td class="py-2 border">Professional Tax:</td>
              <td class="py-2 border">{deduction}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">DA :</td>
              <td class="px-4 py-2 border">{daSalary}</td>
              <td class="py-2 border">Employee PF:</td>
              <td class="py-2 border">{employee_pf}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">HRA:</td>
              <td class="px-4 py-2 border">{hraSalary}</td>
              <td class="py-2 border">ESIC :</td>
              <td class="py-2 border">{esic}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Food Allowance:</td>
              <td class="px-4 py-2 border">{foodAllowance}</td>
              <td class="px-4 py-2 border"></td>
              <td class="px-4 py-2 border"></td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Sales Allowance:</td>
              <td class="px-4 py-2 border">{salesAllowance}</td>
              <td class="px-4 py-2 border"></td>
              <td class="px-4 py-2 border"></td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Special Allowance:</td>
              <td class="px-4 py-2 border">{specialAllowance}</td>
              <td class="px-4 py-2 border"></td>
              <td class="px-4 py-2 border"></td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Travel Allowance:</td>
              <td class="px-4 py-2 border">{travelAllowance}</td>
              <td class="px-4 py-2 border"></td>
              <td class="px-4 py-2 border"></td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Variable Pay Allowance:</td>
              <td class="px-4 py-2 border">{variableAllowance}</td>
              <td class="px-4 py-2 border"></td>
              <td class="px-4 py-2 border"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* total gross salary and deduction */}
      <div>
        <table class="w-full border border-collapse">
          <thead class="border">
            <tr class="bg-blue-200 border">
              <th class="px-4 py-2 border">Total Gross Salary :</th>
              <th class="pl-24 py-2 border"> {totalGrossSalary}</th>
              <th class="px-4 py-2 border">Total Deduction :</th>
              <th class="px-4 py-2 border"> {totalDeduction}</th>
            </tr>
          </thead>
          <tbody class="border"></tbody>
        </table>
      </div>

      {/* total net salaey */}
      <div>
        <table class="w-full mt-10 border ">
          <thead>
            <tr class="bg-blue-200">
              <th class="px-4 py-2 ">Total Net Salary</th>
              <th></th>
              <th class="px-4 py-2"> {totalNetSalary}</th>
              <th class="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>

      {/* submit the salary */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px",
          }}
        >
          <button
            onClick={saveSallaryDetail}
            class="px-4 py-2 rounded bg-blue-500 text-white border-none text-base cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalculateSalary;

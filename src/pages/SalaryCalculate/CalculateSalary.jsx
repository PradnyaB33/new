import Box from "@mui/material/Box";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";

function CalculateSalary() {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { userId, organisationId } = useParams();
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [numDaysInMonth, setNumDaysInMonth] = useState(0);
  const [availableEmployee, setAvailableEmployee] = useState();
  const [publicHolidays, setPublicHoliDays] = useState([]);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [paidLeaveDays, setPaidLeaveDays] = useState(0);
  const [unPaidLeaveDays, setUnPaidLeaveDays] = useState(0);
  const [remotePunchingCount, setRemotePunchingCount] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  console.log(setIsSubmitDisabled);

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
  // for date change function
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const monthFromSelectedDate = date.format("M");
    const yearFromSelectedDate = date.format("YYYY");
    const salaryExists = salaryInfo.some(
      (salary) =>
        String(salary.month) === monthFromSelectedDate &&
        String(salary.year) === yearFromSelectedDate
    );

    console.log(salaryExists);
    const daysInMonth = date.daysInMonth();
    setNumDaysInMonth(daysInMonth);
    setPaidLeaveDays(0);
    setUnPaidLeaveDays(0);
  };
  const formattedDate = dayjs(selectedDate).format("MMM-YY");
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

  // to get the leave like unpaid  , paid  remote punching count etc
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
      handleAlert(true, "error", "Failed to fetch Employee Attendance Summary");
    }
  };
  useEffect(() => {
    fetchDataAndFilter();
    // eslint-disable-next-line
  }, []);

  const selectedMonth = selectedDate.format("M");
  const selectedYear = selectedDate.format("YYYY");
  const filterDataByMonthYear = (data, selectedMonth, selectedYear) => {
    const numericMonth = parseInt(selectedMonth, 10);
    const numericYear = parseInt(selectedYear, 10);
    return data.filter((item) => {
      const itemMonth = parseInt(item.month, 10);
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
      const { paidleaveDays, unpaidleaveDays, remotePunching } =
        filteredData[0];
      setPaidLeaveDays(paidleaveDays);
      setUnPaidLeaveDays(unpaidleaveDays);
      setRemotePunchingCount(remotePunching)
    }
  }, [employeeSummary, selectedMonth, selectedYear]);

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

  // calculate the no fo days employee present
  const calculateDaysEmployeePresent = () => {
    const daysPresent = numDaysInMonth - unPaidLeaveDays;
    return daysPresent;
  };
  let noOfDaysEmployeePresent = calculateDaysEmployeePresent();

  // calculate the salary component
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
  // to get shifts of employee
  const { data: getShifts } = useQuery(
    ["shiftAllowance", userId, selectedMonth, selectedYear],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/shifts/${userId}`,
        {
          headers: {
            Authorization: token,
          },
          params: {
            month: parseInt(selectedMonth),
            year: parseInt(selectedYear),
          },
        }
      );
      return response.data.shiftRequests;
    }
  );

  // to get shift count of employee
  const countShifts = (shifts) => {
    const shiftCount = {};
    shifts.forEach((shift) => {
      const title = shift.title;
      if (shiftCount[title]) {
        shiftCount[title]++;
      } else {
        shiftCount[title] = 1;
      }
    });
    return shiftCount;
  };
  const shiftCounts = useMemo(
    () => (getShifts ? countShifts(getShifts) : {}),
    [getShifts]
  );

  // get the amount of shift
  const { data: shiftAllowanceAmount } = useQuery(
    ["shift-allowance-amount"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shifts/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.shifts;
    }
  );

  const shiftAllowances = useMemo(() => {
    if (shiftAllowanceAmount) {
      return shiftAllowanceAmount.reduce((acc, shift) => {
        acc[shift.shiftName.toLowerCase()] = shift.allowance;
        return acc;
      }, {});
    }
    return {};
  }, [shiftAllowanceAmount]);

  const [shiftTotalAllowance, setShiftTotalAllowance] = useState(0);
  useEffect(() => {
    let total = 0;
    for (const [shiftTitle, count] of Object.entries(shiftCounts)) {
      const shiftAllowance = shiftAllowances[shiftTitle.toLowerCase()];
      if (shiftAllowance) {
        total += count * shiftAllowance;
      }
    }
    setShiftTotalAllowance(total);
  }, [shiftCounts, shiftAllowances]);

  
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
  // calculate the total gross salary
  let totalSalary =
    parseFloat(basicSalary || 0) +
    parseFloat(hraSalary || 0) +
    parseFloat(daSalary || 0) +
    parseFloat(foodAllowance || 0) +
    parseFloat(salesAllowance || 0) +
    parseFloat(specialAllowance || 0) +
    parseFloat(travelAllowance || 0) +
    parseFloat(variableAllowance || 0) +
    parseFloat(shiftTotalAllowance || 0) +
    parseFloat(remotePunchAllowance || 0);
  let totalGrossSalary = totalSalary.toFixed(2);

  // Calculate the total deduction
  let deduction = parseFloat(availableEmployee?.deduction ?? 0);
  let employee_pf = parseFloat(availableEmployee?.employee_pf ?? 0);
  let esic = parseFloat(availableEmployee?.esic ?? 0);
  let loanDeduction = 0;

  if (Array.isArray(empLoanAplicationInfo)) {
    const currentDate = new Date();
    // Filter loan applications that are currently active
    const loanDeductionApplications = empLoanAplicationInfo.filter(
      (application) => {
        const loanDisbursementDate = new Date(application.loanDisbursementDate);
        const loanCompletionDate = new Date(application.loanCompletedDate);
        console.log("current date", currentDate);
        console.log("starting date", loanDisbursementDate);
        console.log("completed date", loanCompletionDate);
        return (
          loanDisbursementDate <= currentDate &&
          currentDate <= loanCompletionDate
        );
      }
    );

    // Calculate the total loan deduction for active loans
    loanDeduction = loanDeductionApplications.reduce((total, application) => {
      // Check if the current application is within the loan disbursement and completion dates
      const loanDisbursementDate = new Date(application.loanDisbursementDate);
      const loanCompletionDate = new Date(application.loanCompletedDate);
      if (
        loanDisbursementDate <= currentDate &&
        currentDate <= loanCompletionDate
      ) {
        return total + parseFloat(application.totalDeduction || 0);
      }
      return total;
    }, 0);
  }

  deduction = isNaN(deduction) ? 0 : deduction.toFixed(2);
  employee_pf = isNaN(employee_pf) ? 0 : employee_pf.toFixed(2);
  esic = isNaN(esic) ? 0 : esic.toFixed(2);
  loanDeduction = isNaN(loanDeduction) ? 0 : loanDeduction.toFixed(2);
  let totalDeductions =
    parseFloat(deduction) +
    parseFloat(employee_pf) +
    parseFloat(esic) +
    parseFloat(loanDeduction);
  let totalDeduction = totalDeductions.toFixed(2);

  // calculate Total Net Salary
  let totalNetSalary = (totalGrossSalary - totalDeduction).toFixed(2);

  // submit the data
  const saveSalaryDetail = async () => {
    try {
      const currentYear = dayjs().format("YYYY");
      const currentMonth = dayjs().format("MM");
      const selectedYear = selectedDate.format("YYYY");
      const selectedMonth = selectedDate.format("MM");
      const employeeJoiningYear = dayjs(availableEmployee?.joining_date).format(
        "YYYY"
      );
      const employeeJoiningMonth = dayjs(
        availableEmployee?.joining_date
      ).format("MM");
      const nextMonth =
        parseInt(currentMonth) === 12 ? 1 : parseInt(currentMonth);

      if (
        parseInt(selectedYear) > parseInt(currentYear) ||
        (parseInt(selectedYear) === parseInt(currentYear) &&
          parseInt(selectedMonth) > parseInt(nextMonth))
      ) {
        handleAlert(
          true,
          "error",
          "Cannot calculate salary for future months or years"
        );
        return;
      }
      if (
        parseInt(selectedYear) < parseInt(employeeJoiningYear) ||
        (parseInt(selectedYear) === parseInt(employeeJoiningYear) &&
          parseInt(selectedMonth) < parseInt(employeeJoiningMonth))
      ) {
        handleAlert(
          true,
          "error",
          "Cannot calculate salary for months before employee's joining date"
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
        shiftTotalAllowance,
        remotePunchAllowance,
        totalGrossSalary,
        totalDeduction,
        totalNetSalary,
        numDaysInMonth,
        formattedDate,
        publicHolidaysCount,
        paidLeaveDays,
        unPaidLeaveDays,
        noOfDaysEmployeePresent,
        loanDeduction,
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
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        handleAlert(
          true,
          "error",
          "Salary for this month and year already exists"
        );
      } else {
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
        <div className="ml-4">
          <p className="text-lg font-semibold flex items-center">
            <span className=" mr-1">Organisation Name :</span>
            <span style={{ whiteSpace: "pre-wrap" }}>
              {availableEmployee?.organizationId?.orgName || ""}
            </span>
          </p>
          <p className="text-lg flex items-center">
            <span className=" mr-1">Location :</span>
            <span>
              {" "}
              {availableEmployee?.organizationId?.location?.address || ""}
            </span>
          </p>
          <p className="text-lg flex items-center">
            <span className="mr-1">Contact No :</span>
            <span>
              {availableEmployee?.organizationId?.contact_number || ""}
            </span>
          </p>
          <p className="text-lg flex items-center">
            <span className="mr-1">Email :</span>
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
                  ? new Date(
                      availableEmployee?.joining_date
                    ).toLocaleDateString("en-GB")
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
              <td class="px-4 py-2 border">No Of Working Days Attended:</td>
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
              <td class="px-4 py-2 border">Employee Id:</td>
              <td class="px-4 py-2 border">{availableEmployee?.empId}</td>
              <td class="px-4 py-2 border">Public Holidays:</td>
              <td class="px-4 py-2 border">{publicHolidaysCount}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Bank Account No:</td>
              <td class="px-4 py-2 border">
                {availableEmployee?.bank_account_no || ""}
              </td>

              <td class="px-4 py-2 border">No Of Days in Month:</td>
              <td class="px-4 py-2 border">{numDaysInMonth}</td>
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
              <td class="py-2 border">Loan Deduction</td>
              <td class="py-2 border">{loanDeduction ?? 0}</td>
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
            {shiftTotalAllowance > 0 && (
              <tr>
                <td class="px-4 py-2 border">Shift Allowance:</td>
                <td class="px-4 py-2 border">{shiftTotalAllowance}</td>
                <td class="px-4 py-2 border"></td>
                <td class="px-4 py-2 border"></td>
              </tr>
            )}
            {remotePunchAllowance > 0 && (
              <tr>
                <td class="px-4 py-2 border">Remote Punching Allowance:</td>
                <td class="px-4 py-2 border">{remotePunchAllowance ?? 0}</td>
                <td class="px-4 py-2 border"></td>
                <td class="px-4 py-2 border"></td>
              </tr>
            )}
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
          {isSubmitDisabled ? null : (
            <button
              onClick={saveSalaryDetail}
              className="px-4 py-2 rounded bg-blue-500 text-white border-none text-base cursor-pointer"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalculateSalary;

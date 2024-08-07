import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useCalculateSalaryQuery from "../../hooks/CalculateSalaryHook/useCalculateSalaryQuery";
import { useQuery } from "react-query";
import useAdvanceSalaryQuery from "../../hooks/AdvanceSalaryHook/useAdvanceSalaryQuery";

function CalculateSalary() {
  // state
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { userId, organisationId } = useParams();
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [numDaysInMonth, setNumDaysInMonth] = useState(0);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [paidLeaveDays, setPaidLeaveDays] = useState(0);
  const [unPaidLeaveDays, setUnPaidLeaveDays] = useState(0);
  const [remotePunchingCount, setRemotePunchingCount] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [publicHolidays, setPublicHoliDays] = useState([]);
  console.log(setIsSubmitDisabled);

  const {
    salaryInfo,
    availableEmployee,
    formattedDate,
    empLoanAplicationInfo,
    remotePunchAllowance,
  } = useCalculateSalaryQuery({ userId, organisationId, remotePunchingCount });

  const handleDateChange = (event) => {
    setSelectedDate(dayjs(event.target.value));
  };

  // fetch leave of employee
  useEffect(() => {
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
        handleAlert(
          true,
          "error",
          "Failed to fetch Employee Attendance Summary"
        );
      }
    };
    fetchDataAndFilter();
    // eslint-disable-next-line
  }, []);

  console.log("employee summary" , employeeSummary);

  useEffect(() => {
    const monthFromSelectedDate = selectedDate.format("M");
    const yearFromSelectedDate = selectedDate.format("YYYY");
    const salaryExists = salaryInfo.some(
      (salary) =>
        String(salary.month) === monthFromSelectedDate &&
        String(salary.year) === yearFromSelectedDate
    );
    console.log("Salary Exists:", salaryExists);
    setNumDaysInMonth(selectedDate.daysInMonth());
  }, [selectedDate, salaryInfo]);

  useEffect(() => {
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

    const filteredData = filterDataByMonthYear(
      employeeSummary,
      selectedMonth,
      selectedYear
    );

    if (filteredData.length > 0) {
      const { paidleaveDays, unpaidleaveDays } = filteredData[0];
      setPaidLeaveDays(paidleaveDays);
      setUnPaidLeaveDays(unpaidleaveDays);
    } else {
      setPaidLeaveDays(0);
      setUnPaidLeaveDays(0);
    }
  }, [employeeSummary, selectedDate]);

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

  // to get shifts of employee
  const selectedMonths = selectedDate.format("M");
  const selectedYears = selectedDate.format("YYYY");
  const { data: getShifts } = useQuery(
    ["shiftAllowance", userId, selectedMonths, selectedYears],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/shifts/${userId}`,
        {
          headers: {
            Authorization: token,
          },
          params: {
            month: parseInt(selectedMonths),
            year: parseInt(selectedYears),
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

  const fetchRemotePunchingCount = async (userId, startDate, endDate) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/remote-punch-count/${userId}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setRemotePunchingCount(response.data.remotePunchingCount || 0);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch remote punching count");
    }
  };

  const startDate = selectedDate.startOf("month").format("YYYY-MM-DD");
  const endDate = selectedDate.endOf("month").format("YYYY-MM-DD");

  useEffect(() => {
    fetchRemotePunchingCount(userId, startDate, endDate);
    // eslint-disable-next-line
  }, [selectedDate, userId, startDate, endDate]);

  // to get the income tax
  // pull the total deduction of loan of employee if he/she apply the loan
  const { getTotalSalaryEmployee } = useAdvanceSalaryQuery(organisationId);
  const calculateFinancialYear = (date) => {
    const month = date?.month();
    const currentYear = date?.year();
    if (month < 3) {
      // January, February, March
      return `${currentYear - 1}-${currentYear}`;
    } else {
      return `${currentYear}-${currentYear + 1}`;
    }
  };

  const financialYear = calculateFinancialYear(dayjs(selectedDate));

  const { data: annualIncomeTax } = useQuery(
    ["getIncomeTax", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/tds/getMyDeclaration/${financialYear}/${getTotalSalaryEmployee}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.getTotalTaxableIncome;
    }
  );

  const monthlyIncomeTax =
    typeof annualIncomeTax === "number" && annualIncomeTax > 0
      ? (annualIncomeTax / 12).toFixed(2)
      : "0.00";

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

  //to get advance salary data of employee
  const [totalNetSalaries, setTotalNetSalaries] = useState(0);
  const { data: adSalAmt } = useQuery(
    ["advanceSalaries", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${userId}/get-advancesalary-data`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );

  console.log("adSalAmt", adSalAmt);

  useEffect(() => {
    if (adSalAmt && adSalAmt.length > 0) {
      const calculateNetSalary = (adSalAmt, totalNetSalary) => {
        const advanceSalaryData = adSalAmt[0];
        const { advancedSalaryAmounts, noOfMonth } = advanceSalaryData;
        console.log("advance salary amt", advancedSalaryAmounts);
        console.log("noOfMonth", noOfMonth);
        console.log("total net salary", totalNetSalary);

        const monthlyDeduction = advancedSalaryAmounts / noOfMonth;
        console.log("monthly deduction", monthlyDeduction);

        const netSalary = Array.from({ length: noOfMonth }).map((_, index) => {
          return totalNetSalary - monthlyDeduction;
        });
        console.log("netSalary", netSalary);
        const totalNetSalaryies = netSalary.reduce(
          (acc, curr) => acc + curr,
          0
        );
        console.log("totalNetSalaryies", totalNetSalaryies);
        return totalNetSalaryies;
      };

      const totalNetSalarys = calculateNetSalary(adSalAmt, totalNetSalary);
      setTotalNetSalaries(totalNetSalarys);
    }
  }, [adSalAmt, totalNetSalary]);

  console.log("total net salaies", totalNetSalaries);

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
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-700">
            Please select the month for calculate the salary.
          </h3>
          <input
            type="month"
            value={selectedDate.format("YYYY-MM")}
            onChange={handleDateChange}
            style={{ width: "500px" }}
            className="border border-gray-300 rounded-md p-2 mt-2"
          />
        </div>
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
              <td class="py-2 border">Income Tax :</td>
              <td class="py-2 border">{monthlyIncomeTax ?? 0}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 border">Sales Allowance:</td>
              <td class="px-4 py-2 border">{salesAllowance}</td>
              {empLoanAplicationInfo?.length > 0 && (
                <>
                  <td className="py-2 border">Loan Deduction :</td>
                  <td className="py-2 border">{loanDeduction ?? 0}</td>
                </>
              )}
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

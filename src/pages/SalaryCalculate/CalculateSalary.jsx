import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useCalculateSalaryQuery from "../../hooks/CalculateSalaryHook/useCalculateSalaryQuery";
import { useQuery } from "react-query";
import useAdvanceSalaryQuery from "../../hooks/AdvanceSalaryHook/useAdvanceSalaryQuery";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Button from "@mui/material/Button";
import useGetPfEsicSetup from "../../hooks/Salary/useGetPfEsicSetup";
import { CircularProgress } from "@mui/material";

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
  const [publicHolidays, setPublicHoliDays] = useState([]);
  const [activeButton, setActiveButton] = useState("submit");
  const {
    salaryInfo,
    availableEmployee,
    empLoanAplicationInfo,
    remotePunchAllowance,
  } = useCalculateSalaryQuery({ userId, organisationId, remotePunchingCount });
  const formattedDate = selectedDate.format("MMM-YY");
  const handleDateChange = (event) => {
    setSelectedDate(dayjs(event.target.value));
  };
  // Fetch leave of employee when selectedDate changes specific month
  const month = selectedDate.$M + 1;
  const year = selectedDate.$y;
  useEffect(() => {
    const fetchDataAndFilter = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/leaves/${year}/${month}/${userId}`,
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
  }, [month, year]);
  useEffect(() => {
    setPaidLeaveDays(employeeSummary?.paidLeaveDays || 0);
    setUnPaidLeaveDays(employeeSummary?.unpaidLeaveDays || 0);
  }, [employeeSummary, month, year]);
  console.log({ month, year, employeeSummary });

  useEffect(() => {
    const monthFromSelectedDate = selectedDate.format("M");
    const yearFromSelectedDate = selectedDate.format("YYYY");
    const salaryExists = salaryInfo?.some(
      (salary) =>
        String(salary.month) === monthFromSelectedDate &&
        String(salary.year) === yearFromSelectedDate
    );
    console.log("Salary Exists:", salaryExists);
    setNumDaysInMonth(selectedDate.daysInMonth());
  }, [selectedDate, salaryInfo]);

  // to get holiday in the organization
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
  // count the public holidays count
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

  // to get shifts of employee based on month
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
      const title = shift?.title;
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
  // get the amount of shift in the organization
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
      return shiftAllowanceAmount?.reduce((acc, shift) => {
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

  // to fetch the remote punching count of employee in a specific month
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
  // to get the total salary of employee
  const { getTotalSalaryEmployee } = useAdvanceSalaryQuery(organisationId);
  // calculate the financial year
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
  // to get the annual income tax
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
  // calculate monthly income tax based on annual income tax
  const monthlyIncomeTax =
    typeof annualIncomeTax === "number" && annualIncomeTax > 0
      ? annualIncomeTax / 12
      : "0";
  // calculate the no fo days employee present
  // Extract the dynamic joining date from the employee data
  const joiningDate = new Date(availableEmployee?.joining_date);
  const calculateDaysEmployeePresent = (joiningDate) => {
    const selectedMonth = new Date(selectedDate).getMonth();
    const selectedYear = new Date(selectedDate).getFullYear();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    // Check if the joining date is within the selected month
    const isJoinedThisMonth =
      joiningDate >= firstDayOfMonth && joiningDate <= lastDayOfMonth;

    // If joined this month, calculate the number of days present from the joining date
    let daysPresent;
    if (isJoinedThisMonth) {
      daysPresent = lastDayOfMonth.getDate() - joiningDate.getDate() + 1;
    } else {
      // If not joined this month, assume full presence for calculation
      daysPresent = numDaysInMonth - unPaidLeaveDays;
    }

    return daysPresent;
  };
  // Use the dynamically extracted joining date
  let noOfDaysEmployeePresent = calculateDaysEmployeePresent(joiningDate);

  // get the loan deduction amount from loan application data of employee
  let loanDeduction = 0;
  if (Array.isArray(empLoanAplicationInfo)) {
    const currentDate = new Date();
    // Filter loan applications that are currently active
    const loanDeductionApplications = empLoanAplicationInfo?.filter(
      (application) => {
        const loanDisbursementDate = new Date(
          application?.loanDisbursementDate
        );
        const loanCompletionDate = new Date(application?.loanCompletedDate);
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
  loanDeduction = isNaN(loanDeduction) ? 0 : Math.round(loanDeduction);
  // to get employee salary component data of employee
  const { data: salaryComponent } = useQuery(
    ["salary-component", userId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-salary-component/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log("salary component", salaryComponent);

  // calculate the salary component for income
  const [incomeValues, setIncomeValues] = useState([]);
  useEffect(() => {
    const daysInMonth = numDaysInMonth;

    salaryComponent?.income?.forEach((item) => {
      const updatedValue =
        (item?.value / daysInMonth) * noOfDaysEmployeePresent;

      setIncomeValues((pre) => {
        const existingIndex = pre?.findIndex((ele) => ele.name === item.name);
        if (existingIndex !== -1) {
          const updatedState = [...pre];
          updatedState[existingIndex] = {
            name: item?.name,
            value: Math.round(updatedValue),
          };
          return updatedState;
        } else {
          return [
            ...pre,
            { name: item?.name, value: Math.round(updatedValue) },
          ];
        }
      });
    });

    // eslint-disable-next-line
  }, [selectedDate, salaryComponent, noOfDaysEmployeePresent]);
  const extendedIncomeValues = [...incomeValues];
  // Check if shiftTotalAllowance should be added
  if (shiftTotalAllowance > 0) {
    extendedIncomeValues.push({
      name: "shiftTotalAllowance",
      value: shiftTotalAllowance,
    });
  }
  // Check if remotePunchAllowance should be added
  if (remotePunchAllowance > 0) {
    extendedIncomeValues.push({
      name: "remotePunchAllowance",
      value: remotePunchAllowance,
    });
  }
  // Now pass extendedIncomeValues to income
  const incomeData = extendedIncomeValues;

  // get the PFsetup from organizaiton
  const { PfSetup, isLoading } = useGetPfEsicSetup({
    organisationId,
  });
  console.log("PFsetup", PfSetup);

  // calculate total deduction of employee
  const [deductionValues, setDeductionValues] = useState([]);
  useEffect(() => {
    if (salaryComponent?.deductions) {
      setDeductionValues(salaryComponent.deductions);
    }
  }, [salaryComponent?.deductions]);
  // calculate the pf , esic and update the deduction value
  useEffect(() => {
    // Step 1: Initialize variables to store Basic and DA values
    let basic = 0;
    let da = 0;

    // Step 2: Loop through the income array to find Basic and DA components
    salaryComponent?.income?.forEach((item) => {
      if (item.name === "Basic") {
        basic = item.value;
      }
      if (item.name === "DA") {
        da = item.value;
      }
    });

    // Step 3: Calculate the combined Basic and DA, capped at 15000
    const basicDA = basic + da < 15000 ? basic + da : 15000;

    // Step 4: Calculate employee PF using EPF value from PfSetup
    const employeePF = (basicDA * PfSetup?.EPF) / 100;

    // Step 5: Calculate the total gross salary
    const totalGrossSalary = salaryComponent?.income?.reduce((acc, curr) => {
      return acc + curr.value;
    }, 0);

    // Step 6: Calculate empCtr (Employee Contribution) using ECP from PfSetup
    const empCtr = (totalGrossSalary * PfSetup?.ECP) / 100;

    // Step 7: Calculate emlCtr (Employer Contribution) using ECS from PfSetup
    const emlCtr = (totalGrossSalary * PfSetup?.ECS) / 100;
    console.log("emlCtr", emlCtr);

    // Step 8: Use forEach to update PF and ESIC values in deductionValues array
    deductionValues.forEach((deduction) => {
      if (deduction.name === "Pf") {
        setDeductionValues((prev) =>
          prev.map((item) =>
            item.name === "Pf" ? { ...item, value: employeePF } : item
          )
        );
      }
      if (deduction.name === "ESIC") {
        setDeductionValues((prev) =>
          prev.map((item) =>
            item.name === "ESIC" ? { ...item, value: empCtr } : item
          )
        );
      }
    });

    // eslint-disable-next-line
  }, [salaryComponent, PfSetup]);
  console.log("deduction vale", deductionValues);

  const extendedDeductionValue = [...deductionValues];
  // Pushing monthlyIncomeTax into extendedDeductionValue
  if (monthlyIncomeTax > 0) {
    extendedDeductionValue.push({
      name: "Income Tax",
      value: monthlyIncomeTax,
    });
  }
  // pushing loan deduction to extendedDeductionValue
  useEffect(() => {
    const currentDate = new Date();
    const loanDisbursement = new Date(
      empLoanAplicationInfo?.loanDisbursementDate
    );
    const loanCompleted = new Date(empLoanAplicationInfo?.loanCompletedDate);

    if (
      loanDeduction > 0 &&
      currentDate >= loanDisbursement &&
      currentDate <= loanCompleted
    ) {
      setDeductionValues((prevDeductions) => [
        ...prevDeductions,
        {
          name: "loanDeduction",
          value: loanDeduction,
        },
      ]);
    }
  }, [loanDeduction, empLoanAplicationInfo]);

  // calculate total deduction ,total  income,  total net salary
  const [salary, setSalary] = useState({
    totalIncome: 0,
    totalDeduction: 0,
    totalNetSalary: 0,
  });
  const calSalary = () => {
    const deductions = extendedDeductionValue.reduce((a, c) => {
      return a + c.value;
    }, 0);

    const income = incomeData?.reduce((a, c) => {
      return a + c.value;
    }, 0);

    const total = income - deductions;
    setSalary({
      totalDeduction: Math.round(deductions),
      totalIncome: Math.round(income),
      totalNetSalary: Math.round(total),
    });
  };
  useEffect(() => {
    calSalary();
    //eslint-disable-next-line
  }, [selectedDate, salaryComponent, incomeValues]);

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
        income: incomeData,
        deductions: extendedDeductionValue,
        totalGrossSalary: salary?.totalIncome,
        totalDeduction: salary?.totalDeduction,
        totalNetSalary: salary?.totalNetSalary,
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
      console.log("data", data);
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
  // download the pdf
  const exportPDF = async () => {
    const input = document.getElementById("App");
    html2canvas(input, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then(async (canvas) => {
      let img = new Image();
      console.log(img);
      img.src = canvas.toDataURL("image/png");
      img.onload = function () {
        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addImage(
          img,
          0,
          0,
          pdf.internal.pageSize.width,
          pdf.internal.pageSize.height
        );
        pdf.save("payslip.pdf");
      };
    });
  };
  const handleSubmitClick = () => {
    setActiveButton("submit");
    saveSalaryDetail();
  };
  const handleDownloadClick = () => {
    setActiveButton("download");
    exportPDF();
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

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <div id="App">
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
                    <td class="px-4 py-2 border">
                      No Of Working Days Attended:
                    </td>
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
                  {Array.from({
                    length: Math.max(
                      extendedIncomeValues?.length || 0,
                      extendedDeductionValue?.length || 0
                    ),
                  }).map((_, index) => {
                    return (
                      <tr key={index}>
                        {/* Income column */}
                        <td className="px-4 py-2 border">
                          {extendedIncomeValues?.[index]?.name || ""}
                        </td>
                        <td className="px-4 py-2 border">
                          {extendedIncomeValues?.[index]?.value || ""}
                        </td>
                        {/* Deduction column */}
                        <td className="px-4 py-2 border">
                          {extendedDeductionValue?.[index]?.name || ""}
                        </td>
                        <td className="px-4 py-2 border">
                          {extendedDeductionValue?.[index]?.value || ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* total gross salary and deduction */}
            <div>
              <table class="w-full border border-collapse">
                <thead class="border">
                  <tr class="bg-blue-200 border">
                    <th class="px-4 py-2 border">Total Gross Salary :</th>
                    <th class="pl-24 py-2 border">
                      {" "}
                      {salary?.totalIncome || ""}
                    </th>
                    <th class="px-4 py-2 border">Total Deduction :</th>
                    <th class="px-4 py-2 border">
                      {" "}
                      {salary?.totalDeduction || ""}
                    </th>
                  </tr>
                </thead>
                <tbody class="border"></tbody>
              </table>
            </div>

            {/* total net salary */}
            <div>
              <table class="w-full mt-10 border ">
                <thead>
                  <tr class="bg-blue-200">
                    <th class="px-4 py-2 ">Total Net Salary</th>
                    <th></th>
                    <th class="px-4 py-2">{salary?.totalNetSalary || ""}</th>
                    <th class="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>

          {/* submit the salary */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
              }}
            >
              <Button
                variant={activeButton === "submit" ? "contained" : "outlined"}
                onClick={handleSubmitClick}
                color="primary"
              >
                Submit
              </Button>
              <Button
                variant={activeButton === "download" ? "contained" : "outlined"}
                onClick={handleDownloadClick}
                color="primary"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CalculateSalary;

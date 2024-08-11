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
    empLoanAplicationInfo,
    remotePunchAllowance,
  } = useCalculateSalaryQuery({ userId, organisationId, remotePunchingCount });

  const formattedDate = selectedDate.format("MMM-YY");

  const handleDateChange = (event) => {
    setSelectedDate(dayjs(event.target.value));
  };

  // fetch leave of employee
  const month = selectedDate.$M + 1;
  const year = selectedDate.$y;

  // Fetch leave of employee when selectedDate changes
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
    console.log("employee summary", employeeSummary);
    setPaidLeaveDays(employeeSummary?.paidLeaveDays || 0);
    setUnPaidLeaveDays(employeeSummary?.unpaidLeaveDays || 0);
  }, [employeeSummary, month, year]);

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

  // to get employee salary component data
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

  console.log("Salary component", salaryComponent);

  // calculate the salary component
  const [incomeValues, setIncomeValues] = useState([]);
  const [deductionsValues, setDeductionValues] = useState([]);

  useEffect(() => {
    const daysInMonth = numDaysInMonth;
    console.log("temp", salaryComponent?.income);
    salaryComponent?.income?.map((item) => {
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
          return [...pre, { name: item?.name, value: Math.round(updatedValue) }];
        }
      });
    });
  }, [selectedDate , salaryComponent]);


  // calculate deduction
  const [salary, setSalary] = useState({
    totalIncome: 0,
    totalDeduction: 0,
    totalNetSalary: 0,
  });
  const calSalary = () => {
    const deductions = salaryComponent?.deductions.reduce((a, c) => {
      return a + c.value;
    }, 0);

    const income = incomeValues?.reduce((a, c) => {
      return a + c.value;
    }, 0);

    const total = income - deductions;
    setSalary({
      totalDeduction: Math.round(deductions) ,
      totalIncome: Math.round(income),
      totalNetSalary: Math.round(total),
    });
  };

  useEffect(() => {
    calSalary();
    //eslint-disable-next-line
  }, [selectedDate , salaryComponent , incomeValues]);

  console.log("fgt", salary);

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
        income : incomeValues,
        deductions : salaryComponent?.deductions,
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

            {Array.from({
              length: Math.max(
                incomeValues?.length || 0,
                salaryComponent?.deductions?.length || 0
              ),
            }).map((_, index) => (
              <tr key={index}>
                {/* Income column */}
                <td className="px-4 py-2 border">
                  {incomeValues?.[index]?.name || ""}
                </td>
                <td className="px-4 py-2 border">
                  {incomeValues?.[index]?.value || ""}
                </td>

                {/* Deduction column */}
                <td className="px-4 py-2 border">
                  {salaryComponent?.deductions?.[index]?.name || ""}
                </td>
                <td className="px-4 py-2 border">
                  {salaryComponent?.deductions?.[index]?.value || ""}
                </td>
              </tr>
            ))}

            {/* {incomeValues &&
              incomeValues?.length > 0 &&
              incomeValues?.map((item, id) => (
                <tr key={id}>
                  <td className="px-4 py-2 border">{item?.name}</td>
                  <td className="px-4 py-2 border">{item?.value}</td>
                </tr>
              ))}
            {salaryComponent?.deductions &&
              salaryComponent?.deductions?.length > 0 &&
              salaryComponent?.deductions?.map((item, id) => (
                <tr key={id}>
                  <td className="px-4 py-2 border">{item?.name}</td>
                  <td className="px-4 py-2 border">{item?.value}</td>
                </tr>
              ))} */}
          </tbody>
          {/* <tbody>
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
          </tbody> */}
        </table>
      </div>

      {/* total gross salary and deduction */}
      <div>
        <table class="w-full border border-collapse">
          <thead class="border">
            <tr class="bg-blue-200 border">
              <th class="px-4 py-2 border">Total Gross Salary :</th>
              <th class="pl-24 py-2 border"> {salary?.totalIncome}</th>
              <th class="px-4 py-2 border">Total Deduction :</th>
              <th class="px-4 py-2 border"> {salary?.totalDeduction}</th>
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
              <th class="px-4 py-2">{salary?.totalNetSalary}</th>
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
            <button className="px-4 py-2 rounded bg-blue-500 text-white border-none text-base cursor-pointer">
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalculateSalary;

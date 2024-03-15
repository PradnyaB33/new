import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import axios from "axios";
import Alert from "@mui/material/Alert";
const ViewPayslip = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user._id;
  const organisationId = user.organizationId;
  console.log({ employeeId, organisationId });
  const [employeeInfo, setEmployeeInfo] = useState("");
  const [organisationInfo, setOrganisationInfo] = useState("");
  const [salaryInfo, setSalaryInfo] = useState([]);
  const [empSalarySelectDay, setEmpSalSelectDay] = useState("");

  //   get employee information based on organization id and employee id
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${employeeId}/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      setEmployeeInfo(response.data.employeeInfo);
      setOrganisationInfo(response.data.organizationInfo);
      setSalaryInfo(response.data.salaryDetails);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchEmployeeData();
    // eslint-disable-next-line
  }, []);
  console.log(employeeInfo);
  console.log(salaryInfo);
  console.log(organisationInfo);
  // get employee salary calculation day based on organization id
  const fetchEmpSalCalculationDay = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee-salary-cal-day/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setEmpSalSelectDay(response.data.empSalaryCalDayData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchEmpSalCalculationDay();
    // eslint-disable-next-line
  }, []);

  //   get the employee salary calculation date in organization
  let empSalCalDay = empSalarySelectDay[0]?.selectedDay || "";
  const getActualDate = (keyword) => {
    const today = new Date();
    let targetDate;

    // Increase the month by 1 to get the next month
    const nextMonth = (today.getMonth() + 1) % 12;
    const year = today.getFullYear() + Math.floor((today.getMonth() + 1) / 12);

    switch (keyword) {
      case "first_day_of_next_month":
        targetDate = new Date(year, nextMonth, 1);
        break;
      case "second_day_of_next_month":
        targetDate = new Date(year, nextMonth, 2);
        break;
      case "third_day_of_next_month":
        targetDate = new Date(year, nextMonth, 3);
        break;
      case "fourth_day_of_next_month":
        targetDate = new Date(year, nextMonth, 4);
        break;
      case "fifth_day_of_next_month":
        targetDate = new Date(year, nextMonth, 5);
        break;
      case "sixth_day_of_next_month":
        targetDate = new Date(year, nextMonth, 6);
        break;
      case "seventh_day_of_next_month":
        targetDate = new Date(year, nextMonth, 7);
        break;
      case "eighth_day_of_next_month":
        targetDate = new Date(year, nextMonth, 8);
        break;
      case "ninth_day_of_next_month":
        targetDate = new Date(year, nextMonth, 9);
        break;
      case "tenth_day_of_next_month":
        targetDate = new Date(year, nextMonth, 10);
        break;
      case "last_day_of_current_month":
        targetDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      default:
        targetDate = null;
        break;
    }

    return targetDate
      ? `${targetDate.getDate()}/${
          targetDate.getMonth() + 1
        }/${targetDate.getFullYear()}`
      : "Invalid keyword";
  };

  //   Example usage:
  let emp_sal_cal_date = getActualDate(empSalCalDay);
  console.log(emp_sal_cal_date);
  // Get the current system date
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  // Get the previous month from the current date
  const previousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  // Check if the current day is greater than the salary calculation day for the previous month or the last day of the previous month
  const shouldDisplayPreviousMonth =
    currentDay >= parseInt(emp_sal_cal_date.split("_")[0], 10) ||
    empSalCalDay === "last_day_of_current_month";
  console.log("payslip");
  // Filter salary details for the relevant previous month
  const previousMonthSalary = shouldDisplayPreviousMonth
    ? salaryInfo.find(
        (salary) =>
          salary.month === previousMonth.getMonth() + 1 ||
          salary.year === previousMonth.getFullYear()
      )
    : null;

  console.log(previousMonthSalary);
  // get the unpaid , paid , and publicHoliday from previous month
  const unpaidLeave = previousMonthSalary?.unPaidLeaveDays;
  const paidLeave = previousMonthSalary?.paidLeaveDays;
  const publicHoliday = previousMonthSalary?.publicHolidaysCount;

  // download the pdf
  const exportPDF = () => {
    const input = document.getElementById("App");
    html2canvas(input, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then((canvas) => {
      const imgWidth = 200;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("img/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("payslip.pdf");
    });
  };
  return (
    <>
      <div style={{ marginTop: "5%" }}>
        {salaryInfo &&
        employeeInfo &&
        organisationInfo &&
        previousMonthSalary ? (
          <>
            <div id="App">
              <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <img
                    src={organisationInfo?.logo_url}
                    alt={organisationInfo?.logo_url}
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="ml-4">
                    <p className="text-lg font-semibold flex items-center">
                      <span className=" mr-1">Organisation Name :</span>
                      <span style={{ whiteSpace: "pre-wrap" }}>
                        {organisationInfo?.orgName || ""}
                      </span>
                    </p>
                    <p className="text-lg flex items-center">
                      <span className=" mr-1">Location :</span>
                      <span> {organisationInfo?.location || ""}</span>
                    </p>
                    <p className="text-lg flex items-center">
                      <span className="mr-1">Contact No :</span>
                      <span>{organisationInfo?.contact_number || ""}</span>
                    </p>
                    <p className="text-lg flex items-center">
                      <span className="mr-1">Email :</span>
                      <span>{organisationInfo?.email || ""}</span>
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
                        <th class="px-4 py-2 border">
                          {previousMonthSalary?.formattedDate || ""}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="px-4 py-2 border">Employee Name:</td>
                        <td class="px-4 py-2 border">
                          {`${employeeInfo?.first_name} ${employeeInfo?.last_name}`}
                        </td>
                        <td class="px-4 py-2 border">Date Of Joining:</td>
                        <td class="px-4 py-2 border">
                          {employeeInfo?.joining_date
                            ? new Date(
                                employeeInfo.joining_date
                              ).toLocaleDateString("en-GB")
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">Designation:</td>
                        <td class="px-4 py-2 border">
                          {employeeInfo?.designation &&
                          employeeInfo?.designation !== null &&
                          employeeInfo?.designation !== undefined &&
                          employeeInfo.designation.length > 0
                            ? employeeInfo.designation[0].designationName
                            : ""}
                        </td>
                        <td class="px-4 py-2 border">Unpaid Leaves:</td>
                        <td class="px-4 py-2 border"> {unpaidLeave}</td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">Department Name:</td>
                        <td class="px-4 py-2 border">
                          {(employeeInfo?.deptname &&
                            employeeInfo?.deptname !== null &&
                            employeeInfo?.deptname !== undefined &&
                            employeeInfo?.deptname.length > 0 &&
                            employeeInfo?.deptname[0]?.departmentName) ||
                            ""}
                        </td>
                        <td class="px-4 py-2 border">
                          No of Working Days Attended:
                        </td>
                        <td class="px-4 py-2 border">
                          {" "}
                          {previousMonthSalary?.noOfDaysEmployeePresent || ""}
                        </td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">PAN No:</td>
                        <td class="px-4 py-2 border">
                          {employeeInfo?.pan_card_number}
                        </td>
                        <td class="px-4 py-2 border">Paid Leaves:</td>
                        <td class="px-4 py-2 border">{paidLeave}</td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">Bank Account No:</td>
                        <td class="px-4 py-2 border">
                          {employeeInfo?.bank_account_no || ""}
                        </td>
                        <td class="px-4 py-2 border">Public Holidays:</td>
                        <td class="px-4 py-2 border"> {publicHoliday}</td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border"> No of Days in Month:</td>
                        <td class="px-4 py-2 border">
                          {previousMonthSalary?.numDaysInMonth || ""}
                        </td>
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
                        <td class="px-4 py-2 border">
                          {previousMonthSalary?.basicSalary || ""}
                        </td>
                        <td class="py-2 border">Professional Tax:</td>
                        <td class="py-2 border">
                          {employeeInfo?.deduction || ""}
                        </td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">DA :</td>
                        <td class="px-4 py-2 border">
                          {previousMonthSalary?.daSalary || ""}
                        </td>
                        <td class="py-2 border">Employee PF:</td>
                        <td class="py-2 border">
                          {employeeInfo?.employee_pf || ""}
                        </td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">HRA:</td>
                        <td class="px-4 py-2 border">
                          {previousMonthSalary?.hraSalary || ""}
                        </td>
                        <td class="py-2 border">ESIC :</td>
                        <td class="py-2 border">{employeeInfo?.esic || ""}</td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">Food Allowance:</td>
                        <td class="px-4 py-2 border">
                          {previousMonthSalary?.foodAllowance || ""}
                        </td>
                        <td class="px-4 py-2 border"></td>
                        <td class="px-4 py-2 border"></td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">Sales Allowance:</td>
                        <td class="px-4 py-2 border">
                          {previousMonthSalary?.salesAllowance || ""}
                        </td>
                        <td class="px-4 py-2 border"></td>
                        <td class="px-4 py-2 border"></td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">Special Allowance:</td>
                        <td class="px-4 py-2 border">
                          {" "}
                          {previousMonthSalary?.specialAllowance || ""}
                        </td>
                        <td class="px-4 py-2 border"></td>
                        <td class="px-4 py-2 border"></td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">Travel Allowance:</td>
                        <td class="px-4 py-2 border">
                          {" "}
                          {previousMonthSalary?.travelAllowance || ""}
                        </td>
                        <td class="px-4 py-2 border"></td>
                        <td class="px-4 py-2 border"></td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 border">
                          Variable Pay Allowance:
                        </td>
                        <td class="px-4 py-2 border">
                          {" "}
                          {previousMonthSalary?.variableAllowance || ""}
                        </td>
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
                        <th class="pl-24 py-2 border">
                          {" "}
                          {previousMonthSalary?.totalGrossSalary || ""}
                        </th>
                        <th class="px-4 py-2 border">Total Deduction :</th>
                        <th class="px-4 py-2 border">
                          {" "}
                          {previousMonthSalary?.totalDeduction || ""}
                        </th>
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
                        <th class="px-4 py-2">
                          {previousMonthSalary?.totalNetSalary || ""}
                        </th>
                        <th class="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
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
                  onClick={() => exportPDF()}
                  class="px-4 py-2 rounded bg-blue-500 text-white border-none text-base cursor-pointer"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-1">
            <div>
              <img
                src="/payslip.svg"
                style={{ height: "600px", marginLeft: "10%" }}
                alt="none"
              />
            </div>
            <div>
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  maxWidth: "650px",
                  marginLeft: "10%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                "Your payment cycle is not completed for this month. Since
                you've recently joined. Kindly reach out to the HR department
                for further assistance. Thank you for your understanding."
              </Alert>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewPayslip;

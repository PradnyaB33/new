import React, { useContext, useEffect, useState } from "react";
import UserProfile from "../../hooks/UserData/useUser";
import { UseContext } from "../../State/UseState/UseContext";
import { Divider, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "axios";
const ViewPayslip1 = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
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
  console.log(organisationInfo);
  console.log(salaryInfo);
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
  console.log(empSalarySelectDay);
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
  console.log(previousMonth);
  // Check if the current day is greater than the salary calculation day for the previous month
  const shouldDisplayPreviousMonth =
    currentDay >= parseInt(emp_sal_cal_date.split("_")[0], 10);

  // Filter salary details for the relevant previous month
  const previousMonthSalary = shouldDisplayPreviousMonth
    ? salaryInfo.find(
        (salary) =>
          salary.month === previousMonth.getMonth() + 1 && // Months are 1-indexed
          salary.year === previousMonth.getFullYear()
      )
    : null;
  console.log(previousMonthSalary);
  const unpaidLeave = previousMonthSalary?.unPaidLeaveDays;
  const paidLeave = previousMonthSalary?.paidLeaveDays;
  const publicHoliday = previousMonthSalary?.publicHolidaysCount;
  console.log(paidLeave);
  return (
    <div
      style={{
        marginTop: "10%",
        marginLeft: "20%",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: "1000px!important",
          height: "100%",
          maxHeight: "90vh!important",
        }}
        className="w-full"
      >
        <Paper className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
          <Box sx={{ flexGrow: 1, marginBottom: "30px" }}>
            <Grid container spacing={4}>
              <Grid item xs={6} md={4}>
                <h1
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={organisationInfo?.logo_url || ""}
                    alt="Organziation"
                    style={{
                      borderRadius: "50%",
                      width: "120px",
                      height: "120px",
                      display: "block",
                      margin: "auto",
                    }}
                  />
                </h1>
              </Grid>
              <Grid item xs={6} md={8}>
                <h1 style={{ color: "Black", fontSize: "2em" }}>
                  {organisationInfo?.orgName || ""}
                </h1>
                <p style={{ fontSize: "1em", color: "#333" }}>
                  Address :
                  <span style={{ fontSize: "1em", color: "#666" }}>
                    {organisationInfo?.location || ""}
                  </span>
                </p>
                <p style={{ fontSize: "1em", color: "#333" }}>
                  Phone no :
                  <span style={{ fontSize: "1em", color: "#666" }}>
                    {organisationInfo?.contact_number || ""}
                  </span>
                </p>
                <p style={{ fontSize: "1em", color: "#333" }}>
                  Email :
                  <span style={{ fontSize: "1em", color: "#666" }}>
                    {organisationInfo?.email || ""}
                  </span>
                </p>
              </Grid>
            </Grid>
          </Box>

          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <Box sx={{ flexGrow: 1, marginLeft: "30%" }}>
            <Grid container spacing={8}>
              <Grid item xs={6} md={4}>
                <h1
                  style={{
                    fontSize: "1.1em",
                    fontWeight: "bold",
                  }}
                >
                  Salary Slip
                </h1>
              </Grid>
              <Grid item xs={6} md={8}>
                <h1
                  style={{
                    fontSize: "1.1em",
                    fontWeight: "bold",
                  }}
                >
                  Month -
                  <span style={{ marginLeft: "10px" }}>
                    {previousMonthSalary?.formattedDate || ""}
                  </span>
                </h1>
              </Grid>
            </Grid>
          </Box>

          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <div
            style={{
              marginTop: "2%",
              marginLeft: "2%",
              display: "flex",
            }}
          >
            {/* First Table */}
            <div>
              <Paper className="w-full">
                <Box sx={{ flexGrow: 1 }}>
                  <table style={{ width: "500px", height: "25vh" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Employee Name :
                        </td>
                        <td>
                          {`${employeeInfo?.first_name} ${employeeInfo?.last_name}`}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Designation :
                        </td>
                        <td>
                          {employeeInfo?.designation &&
                          employeeInfo?.designation !== null &&
                          employeeInfo?.designation !== undefined &&
                          employeeInfo.designation.length > 0
                            ? employeeInfo.designation[0].designationName
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Department Name :
                        </td>
                        <td>
                          {(employeeInfo?.deptname &&
                            employeeInfo?.deptname !== null &&
                            employeeInfo?.deptname !== undefined &&
                            employeeInfo?.deptname.length > 0 &&
                            employeeInfo?.deptname[0]?.departmentName) ||
                            ""}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          PAN No :
                        </td>
                        <td>{employeeInfo?.pan_card_number}</td>
                      </tr>

                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Bank Account Number :
                        </td>
                        <td>{employeeInfo?.bank_account_no || ""}</td>
                      </tr>

                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          No of Days in Month :
                        </td>
                        {/* <td>{numDaysInMonth}</td> */}
                        {previousMonthSalary?.numDaysInMonth || ""}
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </div>

            {/* Second Table */}
            <div>
              <Paper className="w-full">
                <Box sx={{ flexGrow: 1 }}>
                  <table style={{ width: "420px", height: "25vh" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Date of Joining :
                        </td>
                        <td>
                          {employeeInfo?.joining_date
                            ? new Date(
                                employeeInfo.joining_date
                              ).toLocaleDateString("en-GB")
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Unpaid Leaves :
                        </td>
                        {unpaidLeave}
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          No of Working Days Attened :
                        </td>
                        {previousMonthSalary?.noOfDaysEmployeePresent || ""}
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Paid Leaves :
                        </td>
                        <td>{paidLeave}</td>
                      </tr>

                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Public Holidays :
                        </td>

                        {publicHoliday}
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </div>
          </div>

          <div className="w-full">
            <Divider
              variant="fullWidth"
              orientation="horizontal"
              style={{ marginTop: "20px" }}
            />
          </div>

          <Box sx={{ flexGrow: 1, marginLeft: "30%" }}>
            <Grid container spacing={8}>
              <Grid item xs={6} md={4}>
                <h1
                  style={{
                    fontSize: "1.1em",
                    fontWeight: "bold",
                  }}
                >
                  Income
                </h1>
              </Grid>
              <Grid item xs={6} md={8}>
                <h1
                  style={{
                    fontSize: "1.1em",
                    fontWeight: "bold",
                  }}
                >
                  Deductions
                </h1>
              </Grid>
            </Grid>
          </Box>

          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <div
            style={{
              marginTop: "2%",
              marginLeft: "2%",
              display: "flex",
            }}
          >
            {/* First Table */}
            <div>
              <Paper className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
                <Box sx={{ flexGrow: 1 }}>
                  <table style={{ width: "500px" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Particulars :
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Amount
                        </td>
                      </tr>
                      <div></div>
                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          Basic :
                        </td>

                        {previousMonthSalary?.basicSalary || ""}
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          DA :
                        </td>
                        {previousMonthSalary?.daSalary || ""}
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          HRA :
                        </td>

                        {previousMonthSalary?.hraSalary || ""}
                      </tr>

                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          Food allowance :
                        </td>
                        {previousMonthSalary?.foodAllowance || ""}
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          Sales allowance :
                        </td>

                        {previousMonthSalary?.salesAllowance || ""}
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          Special allowance :
                        </td>
                        {previousMonthSalary?.specialAllowance || ""}
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          Travel allowance :
                        </td>
                        {previousMonthSalary?.travelAllowance || ""}
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          Variable Pay allowance :
                        </td>
                        <td>{previousMonthSalary?.variableAllowance || ""}</td>
                      </tr>
                      <div>
                        <Divider variant="fullWidth" orientation="horizontal" />
                      </div>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Total Gross Salary:
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {previousMonthSalary?.totalGrossSalary || ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </div>

            {/* Second Table */}
            <div>
              <Paper className="w-full">
                <Box sx={{ flexGrow: 1 }}>
                  <table style={{ width: "420px", height: "33vh" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Particulars :
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Amount
                        </td>
                      </tr>

                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          Professional Tax :
                        </td>
                        <td>{employeeInfo?.deduction || ""}</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          Employee PF :
                        </td>
                        <td>{employeeInfo?.employee_pf || ""}</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            paddingRight: "8px",
                          }}
                        >
                          ESIC :
                        </td>
                        <td>{employeeInfo?.esic || ""}</td>
                      </tr>
                      <div>
                        <Divider variant="fullWidth" orientation="horizontal" />
                      </div>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingRight: "8px",
                          }}
                        >
                          Total Deduction :
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {previousMonthSalary?.totalDeduction || ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </div>
          </div>

          <div className="w-full" style={{ marginTop: "2%" }}>
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <Box sx={{ flexGrow: 1, marginLeft: "30%" }}>
            <Grid container spacing={8}>
              <Grid item xs={6} md={4}>
                <h1
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2em",
                  }}
                >
                  Net Salary
                </h1>
              </Grid>
              <Grid item xs={6} md={8}>
                <h1 style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                  {previousMonthSalary?.totalNetSalary || ""}
                </h1>
              </Grid>
            </Grid>
          </Box>

          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>
        </Paper>
      </Paper>
    </div>
  );
};

export default ViewPayslip1;

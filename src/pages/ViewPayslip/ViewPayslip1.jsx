import { Divider, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
const ViewPayslip1 = () => {
  const pdfRef = useRef();
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
  const img = organisationInfo?.logo_url;
  console.log(img);
  // generating and downlaoding the pdg
  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: true,
      letterRendering: 1,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("salaryslip.pdf");
    });
  };
  return (
    <>
      <div style={{ marginTop: "5%", marginLeft: "20%" }}>
        {salaryInfo &&
        employeeInfo &&
        organisationInfo &&
        previousMonthSalary ? (
          <Paper
            sx={{
              width: "100%",
              maxWidth: "1000px!important",
              height: "100%",
              maxHeight: "90vh!important",
            }}
            className="w-full"
          >
            <Paper
              className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md"
              ref={pdfRef}
            >
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
                        src={organisationInfo?.logo_url}
                        alt={organisationInfo?.logo_url}
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
              <div className="flex justify-between bg-blue-500">
                <div className="ml-60 text-lg p-1 font-semibold">
                  <h1>Month</h1>
                </div>
                <div className="mr-60 text-lg p-1 font-semibold">
                  <h1>{previousMonthSalary?.formattedDate || ""}</h1>
                </div>
              </div>

              <div
                style={{
                  marginTop: "2%",
                  marginLeft: "2%",
                  display: "flex",
                  marginBottom: "2%",
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
                            <td>{previousMonthSalary?.numDaysInMonth || ""}</td>
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

              <div className="flex justify-between bg-blue-500">
                <div className="ml-60 text-lg p-1 font-semibold">
                  <h1>Income</h1>
                </div>
                <div className="mr-60 text-lg p-1 font-semibold">
                  <h1>Deductions</h1>
                </div>
              </div>

              <div
                style={{
                  marginTop: "2%",
                  marginLeft: "2%",
                  display: "flex",
                  marginBottom: "2%",
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
                            <td style={{ paddingRight: "8px" }}>Basic :</td>
                            <td>{previousMonthSalary?.basicSalary || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: "8px" }}>DA :</td>
                            <td>{previousMonthSalary?.daSalary || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: "8px" }}>HRA :</td>
                            <td>{previousMonthSalary?.hraSalary || ""}</td>
                          </tr>

                          <tr>
                            <td style={{ paddingRight: "8px" }}>
                              Food allowance :
                            </td>
                            <td>{previousMonthSalary?.foodAllowance || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: "8px" }}>
                              Sales allowance :
                            </td>
                            <td>{previousMonthSalary?.salesAllowance || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: "8px" }}>
                              Special allowance :
                            </td>
                            <td>
                              {previousMonthSalary?.specialAllowance || ""}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: "8px" }}>
                              Travel allowance :
                            </td>
                            <td>
                              {previousMonthSalary?.travelAllowance || ""}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: "8px" }}>
                              Variable Pay allowance :
                            </td>
                            <td>
                              {previousMonthSalary?.variableAllowance || ""}
                            </td>
                          </tr>
                          <div>
                            <Divider
                              variant="fullWidth"
                              orientation="horizontal"
                            />
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
                            <td style={{ fontWeight: "bold" }}>
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
                            <td style={{ paddingRight: "8px" }}>
                              Professional Tax :
                            </td>
                            <td>{employeeInfo?.deduction || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: "8px" }}>
                              Employee PF :
                            </td>
                            <td>{employeeInfo?.employee_pf || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ paddingRight: "8px" }}>ESIC :</td>
                            <td>{employeeInfo?.esic || ""}</td>
                          </tr>
                          <div>
                            <Divider
                              variant="fullWidth"
                              orientation="horizontal"
                            />
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
                            <td style={{ fontWeight: "bold" }}>
                              {previousMonthSalary?.totalDeduction || ""}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </Paper>
                </div>
              </div>

              <div className="flex justify-between bg-blue-500">
                <div className="ml-60 text-lg p-1 font-semibold">
                  <h1>Net Salary</h1>
                </div>
                <div className="mr-60 text-lg p-1 font-semibold">
                  <h1>{previousMonthSalary?.totalNetSalary || ""}</h1>
                </div>
              </div>
            </Paper>

            <div className="mt-10 ml-96 mb-6">
              <button
                onClick={downloadPDF}
                className="flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Download PDF
              </button>
            </div>
          </Paper>
        ) : (
          <div className="mt-1">
            <div>
              <img
                src="/payslip.svg"
                style={{ height: "550px", marginRight: "40%" }}
                alt="none"
              />
            </div>
            <div>
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  maxWidth: "500px",
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

export default ViewPayslip1;

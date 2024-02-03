import { Divider, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
const SalaryCalculate = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aeigs"];
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
        holidayDate.month() + 1 === parseInt(selectedMonth) && // Month is zero-based in dayjs
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
    const selectedMonth = dayjs(selectedDate); // selectedDate is the chosen date
    const daysInMonth = selectedMonth.daysInMonth();
    let weekendCount = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = selectedMonth.date(i);
      const dayOfWeek = currentDate.format("ddd"); // Get day of the week (e.g., "Sat", "Sun")
      if (getWeekendbyOrganization.includes(dayOfWeek)) {
        // If the day falls on a weekend day defined by the organization
        weekendCount++;
      }
    }
    return weekendCount;
  };

  // // Call the function to count weekend days in the selected month
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
    availableEmployee?.salaryComponent?.["Varialble allowance"] || ""
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

  // Calculate total deduction by adding all deductions
  let totalDeductions =
    parseFloat(deduction) + parseFloat(employee_pf) + parseFloat(esic);
  let totalDeduction = totalDeductions.toFixed(2);

  // calculate the totalNetSalary
  let totalNetSalary = (totalGrossSalary - totalDeduction).toFixed(2);

  const saveSallaryDetail = async () => {
    try {
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
          " Monthly Salary Detail added Successfully"
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
      console.error("Error adding Monthly salary data:", error);
      handleAlert(true, "error", "Something went wrong");
    }
  };

  // const [employeeData, setEmployeeData] = useState(null); // Employee data state

  // const handleGeneratePDF = () => {
  //   setEmployeeData(availableEmployee);
  // };

  return (
    <>
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
            <Box>
              <h3
                style={{
                  fontSize: "1em",
                  color: "#333",
                  fontWeight: "bold",
                  marginLeft: "40%",
                }}
              >
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
                      src={availableEmployee?.organizationId?.logo_url || ""}
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
                  <h1 style={{ color: "red", fontSize: "1.2em" }}>
                    {availableEmployee?.organizationId?.name || ""}
                  </h1>
                  <p style={{ fontSize: "1em", color: "#333" }}>
                    Address :
                    <span style={{ fontSize: "0.9em", color: "#666" }}>
                      {availableEmployee?.organizationId?.location || ""}
                    </span>
                  </p>
                  <p style={{ fontSize: "1em", color: "#333" }}>
                    Phone no :
                    <span style={{ fontSize: "0.9em", color: "#666" }}>
                      {availableEmployee?.organizationId?.contact_number || ""}
                    </span>
                  </p>
                  <p style={{ fontSize: "1em", color: "#333" }}>
                    Email :
                    <span style={{ fontSize: "0.9em", color: "#666" }}>
                      {availableEmployee?.organizationId?.email || ""}
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
                  <h1 style={{ fontSize: "1.1em", fontWeight: "bold" }}>
                    Month <span>{formattedDate}</span>
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
              <div style={{ marginRight: "40px" }}>
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
                            {`${availableEmployee?.first_name} ${availableEmployee?.last_name}`}
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
                            {availableEmployee?.designation[0]
                              ?.designationName || ""}
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
                            {(availableEmployee?.deptname &&
                              availableEmployee?.deptname.length > 0 &&
                              availableEmployee?.deptname[0]?.departmentName) ||
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
                          <td>{availableEmployee?.pan_card_number}</td>
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
                          <td>{availableEmployee?.bank_account_no || ""}</td>
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
                          <td>{numDaysInMonth}</td>
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
                            {availableEmployee?.joining_date
                              ? new Date(
                                  availableEmployee.joining_date
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
                          <td>{unPaidLeaveDays}</td>
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
                          <td>{noOfDaysEmployeePresent}</td>
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
                          <td>{paidLeaveDays}</td>
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
                          <td>{publicHolidaysCount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                </Paper>
              </div>
            </div>

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
              <div style={{ marginRight: "30px" }}>
                <Paper className="w-full">
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
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              Basic :
                            </td>
                            <td>{basicSalary}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              DA :
                            </td>
                            <td>{daSalary}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              HRA :
                            </td>
                            <td>{hraSalary}</td>
                          </tr>

                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              Food allowance :
                            </td>
                            <td>{foodAllowance}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              Sales allowance :
                            </td>
                            <td>{salesAllowance}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              Special allowance :
                            </td>
                            <td>{specialAllowance}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              Travel allowance :
                            </td>
                            <td>{travelAllowance}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              Variable Pay allowance :
                            </td>
                            <td>{variableAllowance}</td>
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
                            <td
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              {totalGrossSalary}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </Paper>
                </Paper>
              </div>

              {/* Second Table */}
              <div>
                <Paper className="w-full">
                  <Paper className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
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
                            <td>{availableEmployee?.deduction || ""}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              Employee PF :
                            </td>
                            <td>{availableEmployee?.employee_pf || ""}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              ESIC :
                            </td>
                            <td>{availableEmployee?.esic || ""}</td>
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
                            <td
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              {totalDeduction}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </Paper>
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
                    {totalNetSalary}
                  </h1>
                </Grid>
              </Grid>
            </Box>

            <div className="w-full">
              <Divider variant="fullWidth" orientation="horizontal" />
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
                {/* <button
                  onClick={handleGeneratePDF}
                  style={{
                    padding: "8px 38px",
                    borderRadius: "5px",
                    backgroundColor: "green",
                    color: "#fff",
                    cursor: "pointer",
                    marginRight: "10px", // Add margin-right for spacing
                  }}
                >
                  Generate PDF
                </button> */}

                <button
                  onClick={saveSallaryDetail}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "5px",
                    backgroundColor: "#008CBA",
                    color: "#fff",
                    border: "none",
                    fontSize: "1em",
                    cursor: "pointer",
                  }}
                >
                  Submit Salary Details
                </button>
              </div>

              <div style={{ margin: "20px" }}>
                {/* {employeeData && (
                  <PDFDownloadLink
                    document={
                      <PDFDocument
                        employeeData={employeeData}
                        totalDeduction={totalDeduction}
                        totalGrossSalary={totalGrossSalary}
                        totalNetSalary={totalNetSalary}
                        basicSalary={basicSalary}
                        hraSalary={hraSalary}
                        daSalary={daSalary}
                        foodAllowance={foodAllowance}
                        salesAllowance={salesAllowance}
                        specialAllowance={specialAllowance}
                        travelAllowance={travelAllowance}
                        variableAllowance={variableAllowance}
                        publicHolidaysCount={publicHolidaysCount}
                        formattedDate={formattedDate}
                        noOfDaysInMonth={numDaysInMonth}
                        paidLeaveDays={paidLeaveDays}
                        unPaidLeaveDays={unPaidLeaveDays}
                        noOfDaysEmployeePresent={noOfDaysEmployeePresent}
                      />
                    }
                    fileName="SalarySlip.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? "Generating PDF..." : "Download PDF"
                    }
                  </PDFDownloadLink>
                )} */}
              </div>
            </div>
          </Paper>
        </Paper>
      </div>
    </>
  );
};

export default SalaryCalculate;

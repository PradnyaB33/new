import React, { useContext, useState, useEffect } from "react";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Divider } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import PDFDocument from "./SalaryPdfDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";
const SalaryCalculate = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aeigs"];
  const { userId } = useParams();
  const [selectedDate, setSelectedDate] = useState(dayjs("2022-04-17"));
  const [numDaysInMonth, setNumDaysInMonth] = useState(0);

  // function to handle get detail of employee
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
  console.log(availableEmployee);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const daysInMonth = date.daysInMonth();
    setNumDaysInMonth(daysInMonth);
  };

  console.log(selectedDate);

  // calculate the basic , hra , da monthly
  const calculateSalaryComponent = (componentValue) => {
    const daysInMonth = numDaysInMonth;
    const numberOfAvailableDays = 25;
    if (!isNaN(parseFloat(componentValue)) && daysInMonth > 0) {
      return (
        (parseFloat(componentValue) / daysInMonth) *
        numberOfAvailableDays
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

  const formattedDate = dayjs(selectedDate).format("MMM-YY");

  const [employeeData, setEmployeeData] = useState(null); // Employee data state
  const handleGeneratePDF = () => {
    setEmployeeData(availableEmployee);
  };

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
                  fontSize: "1em", // Adjust font size
                  color: "#333", // Change text color
                  fontWeight: "bold", // Make text bold
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
                            PAN No :
                          </td>
                          <td>
                            {availableEmployee?.additionalInfo?.[
                              "Pan Card Number"
                            ] || ""}
                          </td>
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
                          <td>{}</td>
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
                          <td>{}</td>
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
                          <td>{}</td>
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
                          <td>{}</td>
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
                          <td>{}</td>
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
                justifyContent: "center",
                margin: "40px",
              }}
            >
              {/* Generate PDF button with PDFDownloadLink */}
              {employeeData && (
                <PDFDownloadLink
                  document={
                    <PDFDocument
                      employeeData={employeeData}
                      formattedDate={formattedDate}
                      noOfDaysInMonth={numDaysInMonth}
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
                    />
                  }
                  fileName="SalarySlip.pdf"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? "Generating PDF..." : "Download PDF"
                  }
                </PDFDownloadLink>
              )}
              <button
                onClick={handleGeneratePDF}
                style={{
                  padding: "8px 15px",
                  borderRadius: "5px",
                  backgroundColor: "green",
                  color: "#fff",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                Generate PDF
              </button>
            </div>
          </Paper>
        </Paper>
      </div>
    </>
  );
};

export default SalaryCalculate;

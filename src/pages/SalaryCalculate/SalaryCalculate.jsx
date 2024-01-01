import React from "react";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Divider } from "@mui/material";
const SalaryCalculate = () => {
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
            <Box sx={{ flexGrow: 1 }}>
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
                      src=""
                      alt="Organziation"
                      style={{
                        borderRadius: "50%",
                        width: "180px",
                        height: "180px",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                  </h1>
                </Grid>
                <Grid item xs={6} md={8}>
                  <h1 style={{ color: "red", fontSize: "1.2em" }}>
                    ARGAN TECHNOLOGY PVT LID
                  </h1>
                  <p style={{ fontSize: "1em", color: "#333" }}>
                    Address :
                    <span style={{ fontSize: "0.9em", color: "#666" }}>
                      Office No. 603 , Haware Grand Heritage Opposite to
                      Ambience hotel , Kaspate Wasti , Wakad , Pune,
                      Maharshtra-411057
                    </span>
                  </p>
                  <p style={{ fontSize: "1em", color: "#333" }}>
                    Phone no :
                    <span style={{ fontSize: "0.9em", color: "#666" }}>
                      +911234567890
                    </span>
                  </p>
                  <p style={{ fontSize: "1em", color: "#333" }}>
                    Email :
                    <span style={{ fontSize: "0.9em", color: "#666" }}>
                      hr_argan@argantechnology.com
                    </span>
                  </p>
                  <p style={{ fontSize: "1em", color: "#333" }}>
                    GSTIN :
                    <span style={{ fontSize: "0.9em", color: "#666" }}>
                      27AAVCA3805825
                    </span>
                  </p>
                  <p style={{ fontSize: "1em", color: "#333" }}>
                    ISO9001 -2015 & ISO27001-2013 certified company
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
                    Month <span>Dec-23</span>
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
                    <table style={{ width: "500px" }}>
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
                          <td>Megha Dumbre</td>
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
                          <td>Software Developer</td>
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
                          <td>FWASDF0345</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "bold",
                              paddingRight: "8px",
                            }}
                          >
                            Personal Leaves :
                          </td>
                          <td>5</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "bold",
                              paddingRight: "8px",
                            }}
                          >
                            Available Personal Leaves PA:
                          </td>
                          <td>3</td>
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
                          <td>12345678901234</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "bold",
                              paddingRight: "8px",
                            }}
                          >
                            Weekend :
                          </td>
                          <td>1</td>
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
                    <table style={{ width: "420px" }}>
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
                          <td>25/08/2023</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "bold",
                              paddingRight: "8px",
                            }}
                          >
                            Total Payable Days :
                          </td>
                          <td>31</td>
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
                          <td>27</td>
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
                          <td>5</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "bold",
                              paddingRight: "8px",
                            }}
                          >
                            Sick Leave:
                          </td>
                          <td>3</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontWeight: "bold",
                              paddingRight: "8px",
                            }}
                          >
                            Available Sick Leaves PA :
                          </td>
                          <td>1</td>
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
                          <td>1</td>
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
                            <td>9000</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              DA :
                            </td>
                            <td>335</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              HRA :
                            </td>
                            <td>760</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              Variable Pay allowance :
                            </td>
                            <td>379</td>
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
                              10472
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
                      <table style={{ width: "420px", height: "20vh" }}>
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
                            <td>200</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              Employee PF :
                            </td>
                            <td>1800</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingRight: "8px",
                              }}
                            >
                              ESIC :
                            </td>
                            <td>123</td>
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
                              2123
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
                    8349
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
    </>
  );
};

export default SalaryCalculate;

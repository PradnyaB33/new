import Alert from "@mui/material/Alert";
import axios from "axios";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
const ViewPayslip = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user._id;
  const organisationId = user.organizationId;
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleDateChange = (event) => {
    // Convert the selected date string to a Day.js object
    setSelectedDate(dayjs(event.target.value));
  };

  console.log(selectedDate);
  const monthFromSelectedDate = selectedDate.format("M");
  const yearFromSelectedDate = selectedDate.format("YYYY");

  //   get employee information based on organization id and employee id
  const [employeeInfo, setEmployeeInfo] = useState("");
  const [organisationInfo, setOrganisationInfo] = useState("");
  const [salaryInfo, setSalaryInfo] = useState([]);
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

  console.log("salaryinfo", salaryInfo);

  // Find the salary info based on user-selected month and year
  const filteredSalaryInfo = salaryInfo.find((info) => {
    return (
      info.month === parseInt(monthFromSelectedDate) &&
      info.year === parseInt(yearFromSelectedDate)
    );
  });

  console.log("filtersalaryinfo", filteredSalaryInfo);

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

  return (
    <>
      <div className="container mx-auto p-6 ">
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-700">
              Please select the month for which you need the Payslip Statement
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
      </div>

      <div>
        {employeeInfo && organisationInfo ? (
          <>
            <div id="App">
              <div className="flex items-center justify-between mb-6">
                <img
                  src={organisationInfo?.logo_url}
                  alt={organisationInfo?.logo_url}
                  className="w-20 h-20 rounded-full"
                />

                <div className="ml-4">
                  <p className="text-lg font-semibold">
                    Organisation Name:
                    <span className="ml-1">
                      {organisationInfo?.orgName || ""}
                    </span>
                  </p>
                  <p className="text-lg">
                    Location:
                    <span className="ml-1">
                      {organisationInfo?.location?.address || ""}
                    </span>
                  </p>
                  <p className="text-lg">
                    Contact No:
                    <span className="ml-1">
                      {organisationInfo?.contact_number || ""}
                    </span>
                  </p>
                  <p className="text-lg">
                    Email:
                    <span className="ml-1">
                      {organisationInfo?.email || ""}
                    </span>
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
                        {filteredSalaryInfo?.formattedDate || ""}
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
                      <td class="px-4 py-2 border">
                        {" "}
                        {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
                      </td>
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
                        {filteredSalaryInfo?.noOfDaysEmployeePresent || ""}
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border">PAN No:</td>
                      <td class="px-4 py-2 border">
                        {employeeInfo?.pan_card_number}
                      </td>
                      <td class="px-4 py-2 border">Paid Leaves:</td>
                      <td class="px-4 py-2 border">
                        {filteredSalaryInfo?.paidLeaveDays ?? "0"}
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border">Bank Account No:</td>
                      <td class="px-4 py-2 border">
                        {employeeInfo?.bank_account_no || ""}
                      </td>
                      <td class="px-4 py-2 border">Public Holidays:</td>
                      <td class="px-4 py-2 border">
                        {filteredSalaryInfo?.publicHolidaysCount ?? "0"}
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border"> Employee Id</td>
                      <td class="px-4 py-2 border">
                        {employeeInfo?.empId || ""}
                      </td>
                      <td class="px-4 py-2 border"> No of Days in Month:</td>
                      <td class="px-4 py-2 border">
                        {" "}
                        {filteredSalaryInfo?.numDaysInMonth ?? "0"}
                      </td>
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
                        {filteredSalaryInfo?.basicSalary || ""}
                      </td>
                      <td class="py-2 border">Professional Tax:</td>
                      <td class="py-2 border">
                        {employeeInfo?.deduction || "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border">DA :</td>
                      <td class="px-4 py-2 border">
                        {filteredSalaryInfo?.daSalary || ""}
                      </td>
                      <td class="py-2 border">Employee PF:</td>
                      <td class="py-2 border">
                        {employeeInfo?.employee_pf || "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border">HRA:</td>
                      <td class="px-4 py-2 border">
                        {filteredSalaryInfo?.hraSalary || ""}
                      </td>
                      <td class="py-2 border">ESIC :</td>
                      <td class="py-2 border">
                        {employeeInfo?.esic || "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border">Food Allowance:</td>
                      <td class="px-4 py-2 border">
                        {filteredSalaryInfo?.foodAllowance || ""}
                      </td>
                      {filteredSalaryInfo &&
                        filteredSalaryInfo.loanDeduction !== 0 && (
                          <>
                            <td class="py-2 border">Loan Deduction :</td>
                            <td class="py-2 border">
                              {filteredSalaryInfo?.loanDeduction || "0"}
                            </td>
                          </>
                        )}
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border">Sales Allowance:</td>
                      <td class="px-4 py-2 border">
                        {filteredSalaryInfo?.salesAllowance || ""}
                      </td>
                      <td class="px-4 py-2 border"></td>
                      <td class="px-4 py-2 border"></td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border">Special Allowance:</td>
                      <td class="px-4 py-2 border">
                        {" "}
                        {filteredSalaryInfo?.specialAllowance || ""}
                      </td>
                      <td class="px-4 py-2 border"></td>
                      <td class="px-4 py-2 border"></td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border">Travel Allowance:</td>
                      <td class="px-4 py-2 border">
                        {" "}
                        {filteredSalaryInfo?.travelAllowance || ""}
                      </td>
                      <td class="px-4 py-2 border"></td>
                      <td class="px-4 py-2 border"></td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 border">Variable Pay Allowance:</td>
                      <td class="px-4 py-2 border">
                        {" "}
                        {filteredSalaryInfo?.variableAllowance || ""}
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
                        {filteredSalaryInfo?.totalGrossSalary || ""}
                      </th>
                      <th class="px-4 py-2 border">Total Deduction :</th>
                      <th class="px-4 py-2 border">
                        {" "}
                        {filteredSalaryInfo?.totalDeduction || ""}
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
                        {filteredSalaryInfo?.totalNetSalary || ""}
                      </th>
                      <th class="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
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
                style={{ height: "600px", marginLeft: "25%" }}
                alt="none"
              />
            </div>
            <div>
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  marginLeft: "35%",
                  display: "flex",
                  justifyContent: "center",
                  
                }}
              >
                "Please select the month for which you need the payslip
                statement."
              </Alert>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewPayslip;

import React, { useContext } from "react";
import UserProfile from "../../hooks/UserData/useUser";
import { useState, useEffect } from "react";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PaySlipPdf from "./PaySlipPdf";
const ViewPayslip = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user._id;
  const organisationId = user.organizationId;
  const [employeeInfo, setEmployeeInfo] = useState("");
  const [organisationInfo, setOrganisationInfo] = useState("");
  const [salaryInfo, setSalaryInfo] = useState([]);
  const [generatePdf, setGeneratePdf] = useState(false);
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
      handleAlert(true, "error", "Failed to fetch Employee Data");
    }
  };
  useEffect(() => {
    fetchEmployeeData();
    // eslint-disable-next-line
  }, []);

  //   get employee salary calculation day based on organization id
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
      handleAlert(
        true,
        "error",
        "Failed to fetch Employee Salary Calculation Day"
      );
    }
  };
  useEffect(() => {
    fetchEmpSalCalculationDay();
    // eslint-disable-next-line
  }, []);

  //   get the employee salary calculation date
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

  // Example usage:
  let emp_sal_cal_date = getActualDate(empSalCalDay);

  // Get the current system date
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  // Get the previous month from the current date
  const previousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

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

  //   function to generate the pdf
  const handleGeneratePDF = () => {
    setGeneratePdf(true);
  };

  return (
    <>
      <section className="min-h-screen flex w-full">
        <div className="!w-[30%]  lg:flex hidden text-white flex-col items-center justify-center h-screen relative"></div>

        <div style={{ marginTop: "20%", marginLeft: "20%" }}>
          <button
            onClick={handleGeneratePDF}
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
            Generate PDF
          </button>
          {/* Conditionally render the PDFDownloadLink */}
          {generatePdf && employeeInfo && (
            <PDFDownloadLink
              document={
                <PaySlipPdf
                  employeeInfo={employeeInfo}
                  organisationInfo={organisationInfo}
                  salaryInfo={previousMonthSalary}
                />
              }
              fileName="payslip.pdf"
            >
              {({ loading }) =>
                loading ? "Generating PDF..." : "Download PDF"
              }
            </PDFDownloadLink>
          )}
        </div>
      </section>
    </>
  );
};

export default ViewPayslip;

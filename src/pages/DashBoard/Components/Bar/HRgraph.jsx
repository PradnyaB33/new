import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useMutation, useQuery } from "react-query";
import Select from "react-select";
import * as XLSX from "xlsx";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";
import UserProfile from "../../../../hooks/UserData/useUser";
Chart.register(CategoryScale);

const HRgraph = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const [employeeData, setEmployeeData] = useState([]);
  const [employee, setEmployee] = useState([]);

  const [selectedyear, setSelectedYear] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear(),
  });

  const customStyles = {
    control: (base) => ({
      ...base,
      background: "#f9fafb",
      boxShadow: "none",
      border: ".5px solid #f1f1f1",
      hover: {
        cursor: "pointer !important",
      },
    }),
    menu: (base) => ({
      ...base,
      width: "max-content",
      minWidth: "100%",
      right: 0,
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#000",
      };
    },
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  const yearOptions = years.map((year) => {
    return {
      value: year.toString(),
      label: year,
    };
  });

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getYearLeaves/${user?._id}/${selectedyear.value}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    setEmployeeData(data?.getEmployeeLeaves?.summary?.map((item) => item));
    setEmployee(data?.getEmployeeLeaves[0]?.employeeId);
    const currentYear = new Date().getFullYear();
    const filterData = data?.sortedData?.filter(
      (item) => item.year === currentYear
    );
    return filterData;
  };

  useEffect(() => {
    console.log(employeeData, "EmployeeData");
  }, [employeeData]);

  const { data: LeaveYearData } = useQuery(
    ["leaveData", selectedyear],
    getYearLeaves
  );
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const allMonths = monthNames;

  console.log(`🚀 ~ LeaveYearData:`, LeaveYearData);
  const organizeDataByMonth = (data) => {
    const organizedData = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return {
        month,
        year: null,
        PresentPercent: 0,
        absentPercent: 0,
      };
    });

    data?.forEach((monthData) => {
      const monthIndex = monthData.month - 1;
      organizedData[monthIndex] = {
        month: monthData.month,
        year: monthData.year,
        availableDays: monthData.availableDays,
        unpaidleaveDays: monthData.unpaidleaveDays,
        paidleaveDays: monthData.paidleaveDays,
      };
    });
    console.log(`🚀 ~ organizedData:`, organizedData);

    return organizedData;
  };

  const EmployeeleaveData = organizeDataByMonth(LeaveYearData);
  const MonthArray = allMonths.map((month) => month);
  const { handleAlert } = useContext(TestContext);

  const data = {
    labels: MonthArray,
    datasets: [
      {
        label: "Available Days",
        data: EmployeeleaveData.map((monthData) => monthData.availableDays),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Unpaid Leave Days",
        data: EmployeeleaveData.map((monthData) => monthData.unpaidleaveDays),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
      {
        label: "Paid Leave Days",
        data: EmployeeleaveData.map((monthData) => monthData.paidleaveDays),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  };

  const generateReport = () => {
    try {
      const withMonth = LeaveYearData?.map(({ _id, ...item }) => {
        const date = moment({ year: item.year, month: item.month - 1 }); // Create a moment object for the current year and month
        const daysInMonth = date.daysInMonth(); // Get the total number of days in the current month
        return {
          // ...item,
          // month: monthNames[item.month - 1],
          // daysInMonth,
          Month: monthNames[item.month - 1],
          Year: item.year,
          "Days In Month": daysInMonth,
          "Avaliable Days": item.availableDays,
          "Paid Days": item.paidleaveDays,
          "Unpaid Days": item.unpaidleaveDays,
        };
      });
      // Employee information
      const employeeInfo = [
        ["", "Employee Id", `${employee?.empId}`],
        ["", "Name", `${employee?.first_name} ${employee?.last_name}`],
        ["", "Email", employee?.email],
        ["", "Pan Card", employee?.pan_card_number],
        ["", "Bank Account No", `${employee?.bank_account_no}`],
        // Add more employee information here
      ];

      const wb = XLSX.utils.book_new();
      const wsData = withMonth.map(Object.values);
      wsData.unshift(Object.keys(withMonth[0]));

      // Add padding (empty rows and columns)
      const padding = [
        ["", "", "", ""],
        ["", "", "", ""],
      ];
      const finalData = padding.concat(employeeInfo, padding, wsData);
      const ws = XLSX.utils.aoa_to_sheet(finalData);
      XLSX.utils.book_append_sheet(wb, ws, "Salary Data");
      XLSX.writeFile(wb, "AttendenceData.xlsx");
    } catch (error) {
      handleAlert(
        true,
        "error",
        "There is a issue in server please try again later"
      );
    }
  };

  const mutation = useMutation(generateReport, {
    onSuccess: () => {
      handleAlert(true, "success", "Attendence Report Generated Successfully");
    },
    onError: (error) => {
      // Handle error
      handleAlert(
        true,
        "error",
        "There is a issue in server please try again later"
      );
    },
  });

  return (
    <>
      <article className=" bg-white  rounded-md ">
        <div
          className="w-full 
      px-4 pb-4  flex flex-col border rounded-md bg-white  justify-center"
        >
          <div className="flex  my-4 justify-between items-start md:items-center">
            <h1 className="text-lg  font-bold text-[#67748E]">
              Employee Attendance
            </h1>
            <div className="flex md:flex-row flex-col-reverse gap-2 items-center">
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isLoading}
                className={` flex group justify-center w-max gap-2 items-center rounded-md h-[30px] px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500
                  ${
                    mutation.isLoading &&
                    "cursor-not-allowed bg-gray-400 text-gray-700"
                  }
                  `}
              >
                Generate Report
              </button>
              <Select
                placeholder={"Select year"}
                onChange={(year) => {
                  setSelectedYear(year);
                }}
                components={{
                  IndicatorSeparator: () => null,
                }}
                styles={customStyles}
                value={selectedyear} // Add this line
                options={yearOptions}
              />
            </div>
          </div>

          <div className="md:w-[90%] w-[100%] h-[250px] md:h-[300px] px-0 md:px-4 flex items-center">
            <Bar
              data={data}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: true,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </article>
    </>
  );
};

export default HRgraph;

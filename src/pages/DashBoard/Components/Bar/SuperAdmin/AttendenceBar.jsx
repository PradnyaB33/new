import { Skeleton } from "@mui/material";
import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { useMutation } from "react-query";
import Select from "react-select";
import * as XLSX from "xlsx";
import { TestContext } from "../../../../../State/Function/Main";
import useDashGlobal from "../../../../../hooks/Dashboard/useDashGlobal";
import useDashboardFilter from "../../../../../hooks/Dashboard/useDashboardFilter";
import UserProfile from "../../../../../hooks/UserData/useUser";

const AttendenceBar = ({ attendenceData, isLoading }) => {
  const { setSelectedYear, selectedYear } = useDashGlobal();
  const user = UserProfile().getCurrentUser();
  const { customStyles } = useDashboardFilter(user.organizationId);
  const { handleAlert } = useContext(TestContext);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  const yearOptions = years.map((year) => {
    return {
      value: year.toString(),
      label: year,
    };
  });
  // console.log(attendenceData);
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
        PresentPercent: monthData.PresentPercent,
        absentPercent: monthData.absentPercent,
      };
    });

    return organizedData;
  };

  const organizationData = organizeDataByMonth(attendenceData);
  const MonthArray = allMonths.map((month) => month);

  const data = {
    labels: MonthArray,
    datasets: [
      {
        label: "Present",
        data: organizationData.map((monthData) => monthData.PresentPercent),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Absent",
        data: organizationData.map((monthData) => monthData.absentPercent),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
    ],
  };

  const options = {
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
    maintainAspectRatio: false,
  };

  const generateReport = () => {
    try {
      const employeeLeaveData = attendenceData?.map(({ _id, ...item }) => ({
        month: monthNames[item.month - 1],
        year: item.year,
        "present percentage": `${Math.round(item.PresentPercent)} %`,
        "Absent percentage": `${Math.round(item.absentPercent)} %`,
      }));
      let employeeInfo = [["Employee leave ratio data"]];

      const wb = XLSX.utils.book_new();
      const wsData = employeeLeaveData.map(Object.values);
      wsData.unshift(Object.keys(employeeLeaveData[0]));
      const padding = [[""]];
      const finalData = padding.concat(employeeInfo, padding, wsData);
      const ws = XLSX.utils.aoa_to_sheet(finalData);

      XLSX.utils.book_append_sheet(wb, ws, "Salary Data");
      XLSX.writeFile(wb, "LeaveData.xlsx");
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
      handleAlert(true, "success", "Report Generated Successfully");
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
      {isLoading ? (
        <div className="w-full px-4 pb-4  flex flex-col border rounded-sm bg-white  justify-center">
          <div className="my-4 ">
            <h1 className="text-lg my-2 font-bold text-[#67748E]">
              <Skeleton variant="text" width={150} height={20} />
            </h1>
          </div>
          <div className="h-[250px] md:h-[340px] w-full ">
            <Skeleton variant="rect" width="100%" height="100%" />
          </div>
        </div>
      ) : (
        <div className="w-full px-4 pb-4  flex flex-col border rounded-sm bg-white  justify-center">
          <div className="flex my-4 justify-between items-center">
            <h1 className="text-lg font-bold text-[#67748E]">
              Attendance Overview
            </h1>
            <div className="flex gap-2 items-center">
              {/* {window.location.pathname.includes("/employee-dashboard") && ( */}
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isLoading}
                className={` flex group justify-center w-max gap-2 items-center rounded-sm h-[30px] px-4 py-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500
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
                value={selectedYear} // Add this line
                options={yearOptions}
              />
            </div>
          </div>
          <div className="h-[250px] md:h-[340px] w-full ">
            <Bar options={options} data={data} />
          </div>
        </div>
      )}
    </>
  );
};

export default AttendenceBar;

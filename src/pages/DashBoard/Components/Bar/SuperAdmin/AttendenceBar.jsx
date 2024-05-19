import { Skeleton } from "@mui/material";
import React from "react";
import { Bar } from "react-chartjs-2";
import useDashGlobal from "../../../../../hooks/Dashboard/useDashGlobal";
import useDashboardFilter from "../../../../../hooks/Dashboard/useDashboardFilter";
import UserProfile from "../../../../../hooks/UserData/useUser";

const AttendenceBar = ({ attendenceData, isLoading }) => {
  const { setSelectedYear, selectedYear } = useDashGlobal();
  const user = UserProfile().getCurrentUser();
  const { customStyles } = useDashboardFilter(user.organizationId);

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

  return (
    <>
      {isLoading ? (
        <div className=" px-4 pb-4 flex flex-col shadow-md rounded-md bg-white  justify-center">
          <h1 className="text-lg my-4 font-bold text-[#67748E]">
            <Skeleton variant="text" width={150} height={20} />
          </h1>
          <div className="h-[250px] md:h-[340px] w-full ">
            <Skeleton variant="rect" width="100%" height="100%" />
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 bg-white shadow-md rounded-md flex flex-col justify-center">
          <h1 className="text-lg my-4 font-bold text-[#67748E]">Attendance</h1>
          <div className="h-[250px] md:h-[340px] w-full ">
            <Bar options={options} data={data} />
          </div>
        </div>
      )}
    </>
  );
};

export default AttendenceBar;

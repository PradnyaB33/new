import { Skeleton } from "@mui/material";
import React from "react";
import { Line } from "react-chartjs-2";
import Select from "react-select";

const LineGraph = ({
  salarydata,
  isLoading = false,
  setSelectedYear,
  selectedyear,
}) => {
  const option = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
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
    responsive: true,
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      border: ".5px solid #f1f1f1",
      background: "#f9fafb",
      boxShadow: "none",
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

  // Function to create a gradient background
  const createGradient = () => {
    const gradient = document.createElement("canvas").getContext("2d");
    const gradientColor = gradient.createLinearGradient(0, 0, 0, 400);
    gradientColor.addColorStop(0, "#00e676"); // Start with green at the top
    gradientColor.addColorStop(0.7, "#c8e6c9"); // Transition to #c8e6c9 at 80% down
    gradientColor.addColorStop(1, "#e8f5e9"); // Remain white below 80%
    return gradientColor;
  };

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
        totalNetSalary: 0,
      };
    });

    data?.forEach((monthData) => {
      const monthIndex = monthData.month - 1;
      organizedData[monthIndex] = {
        month: monthData.month,
        year: monthData.year,
        totalNetSalary: parseInt(monthData.totalNetSalary),
      };
    });

    return organizedData;
  };

  const EmployeeleaveData = organizeDataByMonth(salarydata);
  const MonthArray = allMonths.map((month) => month);

  const data = {
    labels: MonthArray,
    datasets: [
      {
        // fill: true,
        label: "Salary Overview",
        data: EmployeeleaveData.map((item) => {
          return item.totalNetSalary;
        }),
        fill: true,
        backgroundColor: createGradient(), // Fading background color
        borderColor: "rgb(124,252,0)",
        borderWidth: 1,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };
  return (
    <>
      {isLoading ? (
        <div className=" px-4 pb-4 flex flex-col shadow-md rounded-md bg-white  justify-center">
          <h1 className="text-lg my-4 font-bold text-[#67748E]">
            <Skeleton variant="text" width={150} height={20} />
          </h1>
          <div className="h-[370px] 2xl:h-[400px] w-full ">
            <Skeleton variant="rect" width="100%" height="100%" />
          </div>
        </div>
      ) : (
        <div
          className="w-full 
      px-4 pb-4  flex flex-col shadow-md rounded-md bg-white  justify-center"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-lg my-4 font-bold text-[#67748E]">
              Salary Overview
            </h1>
            {window.location.pathname.includes("/employee-dashboard") && (
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
            )}
          </div>
          <div className="h-[250px] md:h-[340px] w-full ">
            <Line data={data} options={option} />
          </div>
        </div>
      )}
    </>
  );
};

export default LineGraph;

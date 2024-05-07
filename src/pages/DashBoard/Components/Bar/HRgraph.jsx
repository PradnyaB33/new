import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import React, { useContext, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import Select from "react-select";
import { UseContext } from "../../../../State/UseState/UseContext";
import UserProfile from "../../../../hooks/UserData/useUser";
Chart.register(CategoryScale);

const HRgraph = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

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

    const currentYear = new Date().getFullYear();
    const filterData = data.filter((item) => item.year === currentYear);
    return filterData;
  };

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

    return organizedData;
  };

  const EmployeeleaveData = organizeDataByMonth(LeaveYearData);
  const MonthArray = allMonths.map((month) => month);

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

  return (
    <>
      <article className=" bg-white  rounded-md shadow-xl">
        <div
          className="w-full 
      px-4 pb-4  flex flex-col shadow-md rounded-md bg-white  justify-center"
        >
          <div className="flex  my-4 justify-between items-center">
            <h1 className="text-lg  font-bold text-[#67748E]">
              Employee Attendance
            </h1>
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

          <div className="px-4 h-[250px] md:h-[300px]  flex items-center">
            <Bar
              data={data}
              options={{
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
                    suggestedMax: 31,
                    weight: 31,
                    ticks: {
                      beginAtZero: true,
                      stepSize: 5,
                      min: 0,
                    },
                    grid: {
                      display: true,
                    },
                  },
                },
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          </div>
        </div>
      </article>
    </>
  );
};

export default HRgraph;

import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";

import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import UserProfile from "../../../../hooks/auth/useUser";
Chart.register(CategoryScale);

const HRgraph = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getYearLeaves/${user?._id}`,
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

  const { data: LeaveYearData } = useQuery("leaveData", getYearLeaves);
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
        <div className="px-4 pb-2  flex justify-between items-center">
          <h1 className="text-lg  mt-4 font-bold text-[#67748E]">
            Employee Attendence
          </h1>
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
            style={{
              padding: "15px",
            }}
          />
        </div>
      </article>
    </>
  );
};

export default HRgraph;

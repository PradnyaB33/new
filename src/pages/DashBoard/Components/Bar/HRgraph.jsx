import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";

import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
Chart.register(CategoryScale);

const HRgraph = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getYearLeaves`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
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

  function getFilteredAndReversedMonths(data) {
    const filteredMonths = data
      ?.filter((element) => monthNames[element.month - 1])
      ?.map((element) => monthNames[element.month - 1]);
    const reversedMonths = filteredMonths?.reverse();
    return reversedMonths;
  }

  const reversedMonthsArray = getFilteredAndReversedMonths(LeaveYearData);

  const organizeDataByMonth = (data) => {
    const organizedData = [];

    for (let i = 0; i < data?.length; i++) {
      const monthData = data[i];
      const monthIndex = monthData.month - 1; // Month numbers are 1-based

      if (!organizedData[monthIndex]) {
        organizedData[monthIndex] = {
          month: monthData.month,
          year: monthData.year,
          availableDays: 0,
          unpaidleaveDays: 0,
          paidleaveDays: 0,
        };
      }
      organizedData[monthIndex].availableDays += monthData.availableDays;
      organizedData[monthIndex].unpaidleaveDays += monthData.unpaidleaveDays;
      organizedData[monthIndex].paidleaveDays += monthData.paidleaveDays;
    }

    // Filter out undefined elements and reverse the array
    const reversedData = organizedData.filter((monthData) => monthData);
    return reversedData;
  };

  const reversedOrganizedData = organizeDataByMonth(LeaveYearData);

  const data = {
    labels: reversedMonthsArray,
    datasets: [
      {
        label: "Available Days",
        data: reversedOrganizedData.map((monthData) => monthData.availableDays),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Unpaid Leave Days",
        data: reversedOrganizedData.map(
          (monthData) => monthData.unpaidleaveDays
        ),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
      {
        label: "Paid Leave Days",
        data: reversedOrganizedData.map((monthData) => monthData.paidleaveDays),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <article className="my-4 bg-white rounded-md shadow-xl">
        <div className="p-4 py-4 flex justify-between items-center">
          <h1 className="text-xl">Overall Attendence</h1>
        </div>

        <Bar
          data={data}
          style={{
            padding: "15px",
          }}
        />
      </article>
    </>
  );
};

export default HRgraph;

import React from "react";
import { Bar } from "react-chartjs-2";

import { CategoryScale, Chart } from "chart.js";
Chart.register(CategoryScale);

const HRgraph = () => {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Septmber",
    "Octomber",
    "November",
    "December",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Present",
        data: [1, 2, 3, 4, 5, 6, 7, 9, 0, 3, 6, 4].map((ele) => {
          return ele;
        }),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Absent",
        data: [5, 7, 6, 7, 2, 4, 3, 1, 10, 0, 4, 6].map((ele) => {
          return ele;
        }),
        backgroundColor: "#f50057",

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

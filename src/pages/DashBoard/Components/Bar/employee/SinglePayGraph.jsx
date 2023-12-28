import React from "react";
import { Bar } from "react-chartjs-2";

import { CategoryScale, Chart } from "chart.js";
Chart.register(CategoryScale);

const SinglePayGraph = () => {
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
        label: "Salary Overview",
        data: [
          15000, 14500, 15000, 12000, 11111, 10000, 10000, 7500, 6000, 15000,
          15000, 15000,
        ].map((ele) => {
          return ele;
        }),
        backgroundColor: "#32de84",
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <article className="my-4 bg-white rounded-md shadow-xl">
        <div className="p-4 py-4 flex justify-between items-center">
          <h1 className="text-xl">Salary Overview</h1>
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
export default SinglePayGraph;

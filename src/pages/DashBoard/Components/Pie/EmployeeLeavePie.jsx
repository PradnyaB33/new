import React from "react";
import { Doughnut } from "react-chartjs-2";

const EmployeeLeavePie = () => {
  const data = {
    labels: ["Sick Leave", "Unpaid Leave", "Temp leave"],
    datasets: [
      {
        label: "Total Leaves",
        data: [12, 19, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };
  return (
    <article className="my-4 w-[49%]  bg-white rounded-md shadow-md">
      <div className="px-4 pt-4">
        <h1 className="text-xl">Total Leave's Left</h1>
      </div>
      <div className="p-2  w-full">
        <Doughnut data={data} options={options} />
      </div>
    </article>
  );
};

export default EmployeeLeavePie;

import { Skeleton } from "@mui/material";
import React from "react";
import { Line } from "react-chartjs-2";

const LineGraph = ({ isLoading }) => {
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

  const option = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            color: "red",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            color: "blue",
          },
        },
      ],
    },
  };

  // Function to create a gradient background
  const createGradient = () => {
    const gradient = document.createElement("canvas").getContext("2d");
    const gradientColor = gradient.createLinearGradient(0, 0, 0, 400);
    gradientColor.addColorStop(0, "#00e676"); // Start with green at the top
    gradientColor.addColorStop(0.7, "#c8e6c9"); // Transition to #c8e6c9 at 80% down
    gradientColor.addColorStop(1, "#e8f5e9"); // Remain white below 80%
    return gradientColor;
  };

  const data = {
    labels: labels,
    datasets: [
      {
        // fill: true,
        label: "Salary Overview",
        data: [
          15000, 14500, 15000, 12000, 11111, 10000, 10000, 7500, 6000, 4000,
          13000, 10000,
        ].map((ele) => {
          return ele;
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
        <div className="w-[50%] px-4 pb-4 flex flex-col shadow-md rounded-md bg-white  justify-center">
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
      px-4 pb-4 flex flex-col shadow-md rounded-md bg-white  justify-center"
        >
          <h1 className="text-lg my-4 font-bold text-[#67748E]">
            Salary Overview
          </h1>
          <div className="h-[370px] 2xl:h-[400px] w-full ">
            <Line data={data} options={option} />
          </div>
        </div>
      )}
    </>
  );
};

export default LineGraph;

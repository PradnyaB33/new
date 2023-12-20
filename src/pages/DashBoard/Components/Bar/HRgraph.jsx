import React from "react";
import { Bar } from "react-chartjs-2";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
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
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Absent",
        data: [5, 7, 6, 7, 2, 4, 3, 1, 10, 0, 4, 6].map((ele) => {
          return ele;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",

        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <article className="my-4 bg-white rounded-md shadow-md">
        <div className="p-4 py-4 flex justify-between items-center">
          <h1 className="text-xl">Overall Attendence</h1>

          <div className="w-[130px]">
            <FormControl fullWidth size="small">
              <InputLabel id="year">year</InputLabel>
              <Select size="small" labelid="year" label="year">
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem value={2020}>2020</MenuItem>
              </Select>
            </FormControl>
          </div>
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

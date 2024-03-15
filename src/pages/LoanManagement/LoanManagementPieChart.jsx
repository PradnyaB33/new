import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const LoanManagementPieChart = ({ totalPaidAmount, totalPendingAmount }) => {
  const data = {
    labels: ["Amount Paid", "Amount Pending"],
    datasets: [
      {
        data: [totalPaidAmount, totalPendingAmount],
        backgroundColor: ["orangered", "purple"],
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
    <div className="px-20 py-16">
      <Pie data={data} options={options} className="w-96" />
    </div>
  );
};

export default LoanManagementPieChart;

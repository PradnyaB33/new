import { Skeleton } from "@mui/material";
import React from "react";
import { Pie } from "react-chartjs-2";
import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";

const EmployeeLeavePie = () => {
  const RemainingLeaves = useLeaveTable();

  const { data: remainingLeaves, isLoading } = RemainingLeaves;

  const data = {
    labels: remainingLeaves?.leaveTypes?.map((item) => item.leaveName) ?? [],
    datasets: [
      {
        label: "Total Leaves",
        data: remainingLeaves?.leaveTypes?.map((item) => item.count) ?? [],
        backgroundColor:
          remainingLeaves?.leaveTypes?.map((item) => item.color) ?? [],
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
    <article className="mb-2 w-full h-max bg-white rounded-md shadow-md">
      {isLoading ? (
        <div className="p-4 !pb-2 space-y-2">
          <h1 className="text-xl">Total Leave's Left</h1>
          <Skeleton variant="rounded" height={150} animation="wave" />
        </div>
      ) : (
        <>
          <div className="px-4 pt-4">
            <h1 className="text-xl">Total Leave's Left</h1>
          </div>
          <div className="p-2 flex items-center  w-full">
            <Pie data={data} options={options} />
          </div>
        </>
      )}
    </article>
  );
};

export default EmployeeLeavePie;

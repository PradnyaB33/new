import Chart from "chart.js/auto";
import React from "react";

import { CategoryScale } from "chart.js";
import HRgraph from "../Components/Bar/HRgraph";
import LineGraph from "../Components/Bar/LineGraph";
import LeaveDisplayList from "../Components/List/LeaveDisplayList";
import PublicHolidayDisplayList from "../Components/List/PublicHolidayDisplayList";
import EmployeeLeavePie from "../Components/Pie/EmployeeLeavePie";
Chart.register(CategoryScale);

const Dashboard = () => {
  return (
    <>
      <section className=" bg-gray-50  min-h-screen w-full ">
        <header className="text-xl w-full px-8 pt-6 bg-white shadow-md   p-4">
          Employee Overview
        </header>
        <div className="py-3 px-8 w-full">
          {/* <div className="flex items-center gap-3">
            <Avatar
              className="!bg-blue-500  h-[100px] text-4xl p-1 shadow-sm"
              variant="rounded"
              sx={{ width: "46", height: "46" }}
            >
              <DashboardOutlined />
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">Overview</h1>
              <p>Manage your organization and view the insights</p>
            </div>
          </div> */}

          <div className="flex  w-full justify-between gap-2">
            <div className="my-2 flex gap-2 flex-col !w-[60%] pb-2">
              <HRgraph />
              <LineGraph />
              {/* <SinglePayGraph /> */}
            </div>

            <div className="w-[40%] my-4 px-2 space-y-4">
              <EmployeeLeavePie />
              <PublicHolidayDisplayList />
              <LeaveDisplayList />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;

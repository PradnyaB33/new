import { DashboardOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Chart from "chart.js/auto";
import React from "react";

import { CategoryScale } from "chart.js";
import HRgraph from "./Components/Bar/HRgraph";
import LeaveDisplayList from "./Components/List/LeaveDisplayList";
import PublicHolidayDisplayList from "./Components/List/PublicHolidayDisplayList";
import EmployeeLeavePie from "./Components/Pie/EmployeeLeavePie";
Chart.register(CategoryScale);

const Dashboard = () => {
  return (
    <>
      <section className="flex bg-gray-50  min-h-screen w-full ">
        <div className="py-10 px-8 w-full">
          <div className="flex items-center gap-3">
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
          </div>

          <div className="flex w-full justify-between gap-2">
            <div className=" flex flex-col !w-[60%] pb-2">
              <article className=" pt-6 flex gap-2 justify-between w-full items-center">
                {/* <div className="hover:scale-105 w cursor-pointer transition-all w-[49%] min-h-[10rem] bg-white rounded-md shadow-md p-3">
                  <div className="space-y-2">
                    <Avatar
                      className="bg-gradient-to-tl from-pink-500 to-yellow-300   h-[100px] text-4xl p-1 shadow-sm"
                      variant="rounded"
                      sx={{ width: "46", height: "46" }}
                    >
                      <PeopleOutline />
                    </Avatar>
                    <h1 className="text-xl ">Employee available</h1>
                  </div>
                  <div className="bg-gradient-to-tl from-pink-500 to-yellow-300 h-[5px] my-2 rounded-md w-full"></div>
                  <p>0 of 14 employee available</p>
                </div> */}

                <EmployeeLeavePie />
                <EmployeeLeavePie />
              </article>
              <HRgraph />
            </div>

            <div className="w-[40%] pt-8 px-2 space-y-4">
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

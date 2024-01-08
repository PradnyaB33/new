import { DashboardOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React from "react";
import SinglePayGraph from "../Components/Bar/employee/SinglePayGraph";

const DashBoardHR = () => {
  return (
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
            <h1 className="text-2xl font-semibold">HR Dashboard</h1>
            <p>Manage your employees and view the insights</p>
          </div>
        </div>

        <div className="flex mt-4">
          <div className="w-[70%] flex">
            <div className="w-[60%]">
              <SinglePayGraph />
            </div>
          </div>
          <div className="w-[30%]"></div>
        </div>
      </div>
    </section>
  );
};

export default DashBoardHR;

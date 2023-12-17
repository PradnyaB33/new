import {
  AttachMoneyOutlined,
  DashboardOutlined,
  PeopleOutline,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Chart from "chart.js/auto";
import React from "react";
import styled from "styled-components";

import { CategoryScale } from "chart.js";
import HRgraph from "./Components/Bar/HRgraph";
import LeaveDisplayList from "./Components/List/LeaveDisplayList";
Chart.register(CategoryScale);

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 5,
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme?.palette?.mode === "light" ? "#1a90ff" : "#ec4899 ",
  },
}));

const BorderLinearProgress2 = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 5,
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme?.palette?.mode === "light" ? "#fff000" : "#38a169",
  },
}));

const Dashboard = () => {
  return (
    <>
      <section className="flex bg-gray-50  min-h-screen w-full ">
        <div className="py-10 px-8">
          <div className=" flex justify-between pb-4 items-center">
            <div className="flex items-center gap-3">
              <Avatar
                className="!bg-blue-500  h-[100px] text-4xl p-1 shadow-sm"
                variant="rounded"
                sx={{ width: "46", height: "46" }}
              >
                <DashboardOutlined />
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold">
                  Oragnization DashBoard
                </h1>
                <p>Manage your organization and view the insights</p>
              </div>
            </div>
          </div>

          <article className="pt-6 flex gap-4 items-center">
            <div className="hover:scale-105 cursor-pointer transition-all w-[20rem] min-h-[10rem] bg-white rounded-md shadow-md p-3">
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
              <BorderLinearProgress
                className="mt-2 mb-1"
                variant="determinate"
                value={50}
              />
              <p>0 of 14 employee available</p>
            </div>

            <div className="hover:scale-105 transition-all cursor-pointer w-[20rem] min-h-[10rem] bg-white rounded-md shadow-md p-3">
              <div className="space-y-2">
                <Avatar
                  className="bg-gradient-to-tl  from-green-500 to-lime-300  h-[100px] text-4xl p-1 shadow-sm"
                  variant="rounded"
                  sx={{ width: "46", height: "46" }}
                >
                  <AttachMoneyOutlined />
                </Avatar>
                <h1 className="text-xl ">Total Amount</h1>
              </div>
              <BorderLinearProgress2
                className="mt-2 mb-1"
                variant="determinate"
                value={50}
              />

              <p className="text-right">₹ 22,222</p>
            </div>
          </article>

          <HRgraph />
        </div>

        <div>
          <LeaveDisplayList />
        </div>
      </section>
    </>
  );
};

export default Dashboard;

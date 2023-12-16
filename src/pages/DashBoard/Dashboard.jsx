import { DashboardOutlined, PeopleOutline } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import React from "react";
import styled from "styled-components";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 5,
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      theme?.palette?.mode === "light"
        ? "#1a90ff"
        : "linear-gradient(rgb(0, 159, 253), rgb(42, 42, 114))",
  },
}));

const Dashboard = () => {
  return (
    <>
      <section className="flex bg-gray-50  min-h-screen w-full ">
        <div className="py-10 px-8">
          <div className="flex justify-between pb-4 items-center">
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

          <article className="pt-6">
            <div className="w-[20rem] min-h-[10rem] bg-white rounded-md shadow-md p-3">
              <div className="space-y-2">
                <Avatar
                  className="bg-gradient-to-r from-blue-500 to-indigo-700  h-[100px] text-4xl p-1 shadow-sm"
                  variant="rounded"
                  sx={{ width: "46", height: "46" }}
                >
                  <PeopleOutline />
                </Avatar>
                <h1 className="text-xl font-semibold">Total Employee</h1>
              </div>
              <BorderLinearProgress variant="determinate" value={50} />
            </div>
          </article>
        </div>
      </section>
    </>
  );
};

export default Dashboard;

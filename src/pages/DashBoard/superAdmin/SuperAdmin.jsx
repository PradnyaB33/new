import { Business, Group } from "@mui/icons-material";
import React from "react";
import SuperAdminCard from "../Components/Card/superadmin/SuperAdminCard";

const SuperAdmin = () => {
  return (
    <section className="flex bg-gray-50  min-h-screen w-full ">
      <div className="py-10 px-8 w-full">
        {/* <div className="flex items-center gap-3">
          <Avatar
            className="!bg-blue-500  h-[100px] text-4xl p-1 shadow-sm"
            variant="rounded"
            sx={{ width: "46", height: "46" }}
          >
            <DashboardOutlined />
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">Organization Overview</h1>
            <p>Manage your organization and view the insights</p>
          </div>
        </div> */}

        <h1 className="text-2xl font-semibold">Organization Overview</h1>

        <div className="flex mt-6 w-full justify-between gap-5">
          <SuperAdminCard
            icon={Business}
            color={"!bg-red-500"}
            data={4}
            title={"Departments"}
          />
          <SuperAdminCard
            icon={Group}
            data={2000}
            color={"!bg-green-500"}
            title={"Overall Employees"}
          />
          <SuperAdminCard
            color={"!bg-blue-500"}
            icon={Business}
            data={10}
            title={"Test"}
          />
          <SuperAdminCard
            color={"!bg-orange-500"}
            icon={Business}
            data={5}
            title={"Test"}
          />
          {/* <DataCard
            icon={AssignmentTurnedIn}
            title={"Overall Available"}
            desc={256}
            color={"!bg-blue-500"}
          />
          <DataCard
            icon={AssignmentTurnedIn}
            title={"Employees Available"}
            desc={256}
            color={"!bg-green-500"}
          />
          <DataCard
            icon={AssignmentTurnedIn}
            title={"Employees Available"}
            desc={256}
            color={"!bg-orange-500"}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default SuperAdmin;

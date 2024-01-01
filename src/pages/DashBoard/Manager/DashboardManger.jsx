import {
  AssignmentTurnedIn,
  DashboardOutlined,
  ErrorOutline,
  Groups,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import DataCard from "../Components/Card/MangerCard/DataCard";
import ManagerEmployeeChart from "../Components/Custom/ManagerEmployeeChart";
import EmployeeLeaveRequest from "../Components/List/EmployeLeaveReqest";

const Dashboard_Manger = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  const getAllEmployeeForManger = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/countofEmployees`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  const { data: EmployeeDataOfManager } = useQuery(
    "employeeData",
    getAllEmployeeForManger
  );
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
            <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
            <p>Manage your employees and view the insights</p>
          </div>
        </div>

        <div className="flex mt-8">
          <div className="w-full flex gap-5">
            <div className="flex flex-col h-max w-[70%] 2xl:w-[70%] gap-3">
              <div className="flex h-max w-full justify-between gap-3">
                <DataCard
                  icon={Groups}
                  title={"Total Employees"}
                  desc={EmployeeDataOfManager?.data[0]?.reporteeIds?.length}
                  color={"!bg-sky-500"}
                />
                <DataCard
                  icon={AssignmentTurnedIn}
                  title={"Employees Available"}
                  desc={256}
                  color={"!bg-green-500"}
                />
                <DataCard
                  icon={ErrorOutline}
                  title={"Employee On Levae"}
                  color={"!bg-red-500"}
                />
              </div>

              <div className="block  2xl:space-y-0 space-y-3">
                <ManagerEmployeeChart
                  EmployeeDataOfManager={EmployeeDataOfManager}
                />
              </div>
            </div>
            <div className="w-[30%] 2xl:w-[30%]  space-y-3">
              <EmployeeLeaveRequest />
              {/* <EmployeeLeaveRequest /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard_Manger;

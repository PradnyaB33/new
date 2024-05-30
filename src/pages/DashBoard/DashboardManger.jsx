import {
  EventAvailable,
  EventBusy,
  Groups,
  AccessTime,
} from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import ManagerEmployeeChart from "./Components/Custom/ManagerEmployeeChart";
import EmployeeLeaveRequest from "./Components/List/EmployeLeaveReqest";

const DashboardManger = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams("");
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  const [selectedyear, setSelectedYear] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear(),
  });

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

  const getManagerAttendenceChart = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getManagerEmployeeAttendence/${user._id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  useQuery(["manager-attendece"], getManagerAttendenceChart);

  const { data: managerShift, isLoading: managerShiftLoading } = useQuery({
    queryKey: ["deptEmployeeOnShift"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getManagerShifts/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
  });

  const { data: managerAttendence, isLoading: managerAttendenceLoading } =
    useQuery({
      queryKey: ["deptEmployeeAbsent"],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/getTodaysAbsentUnderManager/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return data;
      },
    });

  return (
    <section className=" bg-gray-50  min-h-screen w-full ">
      <header className="text-xl font-bold w-full px-8 pt-6 bg-white !text-[#67748E] shadow-md  p-4">
        Manager Dashboard
      </header>

      <div className=" lg:px-8 sm:px-4 px-2 w-full">
        <div className="flex mt-6">
          <div className="w-full lg:flex-row flex-col flex gap-5">
            <div className="flex flex-col h-max w-full lg:w-[70%] gap-3">
              <div className="flex flex-1  flex-wrap w-full justify-between gap-2 md:gap-5 ">
                <SuperAdminCard
                  icon={Groups}
                  className={"!min-w-[150px]"}
                  title={"Total Employees"}
                  data={
                    EmployeeDataOfManager?.data[0]?.reporteeIds?.length ?? 0
                  }
                  color={"!bg-sky-500"}
                />
                <SuperAdminCard
                  className={"!min-w-[150px]"}
                  icon={AccessTime}
                  title={"Shift Allowance"}
                  isLoading={managerShiftLoading}
                  data={managerShift ?? 0}
                  color={"!bg-orange-500"}
                />
                <SuperAdminCard
                  icon={EventAvailable}
                  className={"!min-w-[150px]"}
                  data={
                    EmployeeDataOfManager?.data[0]?.reporteeIds?.length -
                      managerAttendence ?? 0
                  }
                  isLoading={managerAttendenceLoading}
                  title={"Present Today"}
                  color={"!bg-green-500"}
                />
                <SuperAdminCard
                  icon={EventBusy}
                  className={"!min-w-[150px]"}
                  data={managerAttendence ?? 0}
                  isLoading={managerAttendenceLoading}
                  title={"Today's Leave"}
                  color={"!bg-red-500"}
                />
              </div>

              <div className="block  2xl:space-y-0 space-y-3">
                <ManagerEmployeeChart
                  EmployeeDataOfManager={EmployeeDataOfManager}
                  selectedyear={selectedyear}
                  setSelectedYear={setSelectedYear}
                />
              </div>
            </div>

            <div className="w-full lg:w-[30%]  space-y-3">
              <EmployeeLeaveRequest />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardManger;

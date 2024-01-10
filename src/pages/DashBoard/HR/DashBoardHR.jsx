import {
  AccessTimeSharp,
  Dashboard,
  ErrorOutline,
  FilterAltOff,
  Groups,
  LocationOn,
} from "@mui/icons-material";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import LineGraph from "../Components/Bar/LineGraph";
import SuperAdminCard from "../Components/Card/superadmin/SuperAdminCard";

const DashBoardHR = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const OrganizationSalaryOverview = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/organizationSalaryOverview/${user.organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return data;
    } catch (error) {
      console.log("errr", error);
    }
  };

  const { data: OrganizationSalaryAttendence } = useQuery(
    "Org-Salary-overview",
    OrganizationSalaryOverview
  );

  return (
    <section className=" bg-gray-50  min-h-screen w-full ">
      <header className="text-xl w-full px-8 pt-6 bg-white shadow-md   p-4">
        HR Dashboard
      </header>
      <div className=" px-8 w-full">
        <div className="flex mt-6 w-full justify-between gap-5">
          <SuperAdminCard
            icon={Groups}
            color={"!bg-blue-500"}
            data={20}
            isLoading={false}
            title={"Overall Employees"}
          />
          <SuperAdminCard
            color={"!bg-green-500"}
            icon={AccessTimeSharp}
            data={13}
            isLoading={false}
            title={"People's Manager"}
          />
          <SuperAdminCard
            title={"Employees on leave"}
            icon={ErrorOutline}
            color={"!bg-red-500"}
            data={15}
            isLoading={false}
          />
          <SuperAdminCard
            color={"!bg-orange-500"}
            isLoading={false}
            icon={LocationOn}
            data={14}
            title={"Special Shift"}
          />
        </div>

        <div className="mt-4 w-full  bg-white shadow-md rounded-md  ">
          <div className="border-b-[.5px] items-center justify-between flex gap-2 py-2 px-4 border-gray-300">
            <div className="flex items-center gap-2">
              <Dashboard className="!text-[#67748E]" />
              <h1 className="text-md font-bold text-[#67748E]">Dashboard</h1>
            </div>
            <div className="flex w-[80%] gap-6 items-center justify-end">
              <button className="!w-max flex justify-center h-[25px]  gap-2 items-center rounded-md px-1 text-sm font-semibold text-[#152745]  hover:bg-gray-50 focus-visible:outline-gray-100">
                <FilterAltOff className="!text-[1.4em] text-[#152745] " />
                Remove Filter
              </button>
            </div>
          </div>
        </div>

        <div className="w-full gap-4 mt-4 flex items-center">
          <div className="w-[50%]">
            <LineGraph salarydata={OrganizationSalaryAttendence} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoardHR;

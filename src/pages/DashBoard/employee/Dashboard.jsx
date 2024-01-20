import Chart from "chart.js/auto";
import React from "react";

import axios from "axios";
import { CategoryScale } from "chart.js";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import HRgraph from "../Components/Bar/HRgraph";
import LineGraph from "../Components/Bar/LineGraph";
import LeaveDisplayList from "../Components/List/LeaveDisplayList";
import PublicHolidayDisplayList from "../Components/List/PublicHolidayDisplayList";
import EmployeeLeavePie from "../Components/Pie/EmployeeLeavePie";
Chart.register(CategoryScale);

const Dashboard = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const getSalaryTemplate = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${user._id}/${user.organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res.data.salaryDetails;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: EmployeSalaryData } = useQuery(
    "salary-template-employee",
    getSalaryTemplate
  );

  return (
    <>
      <section className=" bg-gray-50  min-h-screen w-full ">
        <header className="text-xl w-full px-2 md:px-8 pt-6 bg-white shadow-md   p-4">
          Employee Overview
        </header>
        <div className="py-3 px-2 md:px-8 w-full">
          <div className="flex md:flex-row flex-col w-full justify-between gap-2">
            <div className="md:my-4 mb-1 flex md:gap-2 gap-1 flex-col md:!w-[60%] w-[100%] md:pb-2">
              <HRgraph />
              <LineGraph salarydata={EmployeSalaryData} />
              {/* <SinglePayGraph /> */}
            </div>

            <div className="md:w-[40%] md:my-4 my-1 md:px-2 space-y-1 md:space-y-4">
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

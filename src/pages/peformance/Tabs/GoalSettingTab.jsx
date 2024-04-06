import axios from "axios";
import { format } from "date-fns";
import React from "react";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import GoalsTable from "../components/GoalsTable";

const GoalSettingTab = () => {
  const authToken = useAuthToken();
  const { data: performance } = useQuery("performancePeriod", async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/performance/getSetup`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  });
  return (
    <div>
      <div className="flex items-center justify-between ">
        <div className="w-full p-4  ">
          <h1 className="text-2xl ">Goal Settings</h1>
          <p>Manage and organize goals setting</p>
        </div>
      </div>

      <div className="flex py-0 px-4  gap-8">
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="text-xl ">Performance Period</h1>
              <p className="text-sm text-slate-800 ">
                {performance?.startdate &&
                  format(new Date(performance?.startdate), "PP")}{" "}
                -{" "}
                {performance?.enddate &&
                  format(new Date(performance?.enddate), "PP")}
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="text-xl text-slate-800">Performance Stage</h1>
              <p className="text-sm text-slate-800 ">{performance?.stages}</p>
            </div>
          </div>
        </div>

        {/* <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="text-xl text-slate-800">No. of goals set</h1>
              <p className="text-sm text-slate-800 ">20</p>
            </div>
          </div>
        </div> */}
      </div>

      <GoalsTable />
    </div>
  );
};

export default GoalSettingTab;

import React from "react";
import GoalsTable from "../components/GoalsTable";

const GoalSettingTab = () => {
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
              <p className="text-sm text-slate-800 ">20</p>
            </div>
          </div>
        </div>
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="text-xl text-slate-800">Performance Stage</h1>
              <p className="text-sm text-slate-800 ">20</p>
            </div>
          </div>
        </div>

        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="text-xl text-slate-800">No. of goals set</h1>
              <p className="text-sm text-slate-800 ">20</p>
            </div>
          </div>
        </div>
      </div>

      <GoalsTable />
    </div>
  );
};

export default GoalSettingTab;

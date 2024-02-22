import React from "react";
import TDSTable4 from "./Table/TDSTable4";

const Tab4 = () => {
  return (
    <div className="overflow-auto !p-0 ">
      <div className="flex items-center justify-between ">
        <div className="w-full p-4  ">
          <h1 className="text-2xl ">Less : Deduction under chapter VI A</h1>
          <p>
            Below are the declarations done so far by you for any modifications
            click on action
          </p>
        </div>
      </div>
      <div className="grid bg-white border-[.5px] border-gray-200 grid-cols-6 gap-4 p-4">
        <div>
          <h1 className="text-gray-600">Amount Declared</h1>
          <p className="text-xl">INR 0</p>
        </div>
        <div>
          <h1 className="text-gray-600">Amount Declared</h1>
          <p className="text-xl">INR 0</p>
        </div>
        <div>
          <h1 className="text-gray-600">Pending Approval Amount</h1>
          <p className="text-xl">INR 0</p>
        </div>
        <div>
          <h1 className="text-gray-600">Amount Accepted</h1>
          <p className="text-xl">INR 0</p>
        </div>
        <div>
          <h1 className="text-gray-600">Amount Rejected</h1>
          <p className="text-xl">INR 0</p>
        </div>
      </div>
      <TDSTable4 />
    </div>
  );
};

export default Tab4;

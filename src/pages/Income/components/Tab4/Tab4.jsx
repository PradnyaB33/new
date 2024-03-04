import React from "react";
import TDSTab5 from "./TDSTab5";

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

      <TDSTab5 />
      {/* <TDSTable4 /> */}
    </div>
  );
};

export default Tab4;
